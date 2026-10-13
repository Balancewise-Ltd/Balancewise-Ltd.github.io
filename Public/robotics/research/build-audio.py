#!/usr/bin/env python3
"""Build static MP3 narration. Requires piper-tts==1.8.0 and ffmpeg.

Only the course's own card titles and explanation text are narrated. The voice
model and WAV cache stay outside the website. See AUDIO.md for reproduction.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import wave

import onnxruntime
from piper import PiperVoice, SynthesisConfig
from piper.config import PiperConfig

ROOT = Path(__file__).resolve().parents[1]
VOICE = "en_US-ljspeech-high"
RECIPE = "piper-1.8.0-ljspeech-length-1.08-mp3-48k-v1"


def digest(data):
    return hashlib.sha256(data).hexdigest()


def spoken_text(card):
    text = ". ".join([card["title"], *card["text"]])
    # Read mathematical notation instead of silently dropping unsupported glyphs.
    for symbol, words in {
        "×": " times ", "÷": " divided by ", "→": " leads to ",
        "≈": " approximately ", "≤": " less than or equal to ",
        "≥": " greater than or equal to ", "≠": " not equal to ",
        "θ": " theta ", "ω": " omega ", "π": " pi ",
        "Δ": " delta ", "α": " alpha ", "β": " beta ",
        "²": " squared ", "³": " cubed ", "°": " degrees ",
        "−": " minus ", "√": " square root ", "∑": " sum ",
        "∈": " in ", "∞": " infinity ", "±": " plus or minus ",
    }.items():
        text = text.replace(symbol, words)
    text = re.sub(r"\bROS\s*2\b", "R O S two", text)
    return re.sub(r"\s+", " ", text).strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", type=Path, required=True)
    parser.add_argument("--cache-dir", type=Path, required=True)
    parser.add_argument("--section", help="Generate one section for a voice preview; no manifest is written")
    parser.add_argument("--workers", type=int, choices=range(1, 9), default=1)
    parser.add_argument("--shard-count", type=int, default=1, help=argparse.SUPPRESS)
    parser.add_argument("--shard-index", type=int, default=0, help=argparse.SUPPRESS)
    args = parser.parse_args()
    args.cache_dir.mkdir(parents=True, exist_ok=True)
    if args.workers > 1:
        if args.section:
            parser.error("Use one worker for a section preview")
        processes = []
        try:
            for index in range(args.workers):
                processes.append(subprocess.Popen([
                    sys.executable, str(Path(__file__).resolve()), "--model", str(args.model),
                    "--cache-dir", str(args.cache_dir), "--shard-count", str(args.workers),
                    "--shard-index", str(index),
                ]))
            for process in processes:
                if process.wait():
                    raise RuntimeError("An audio worker failed")
        finally:
            for process in processes:
                if process.poll() is None:
                    process.terminate()
                    process.wait()
        parts = [json.loads((args.cache_dir / f"manifest-{i}.json").read_text()) for i in range(args.workers)]
        manifest = parts[0]
        for part in parts[1:]:
            assert part["courseSha256"] == manifest["courseSha256"]
            manifest["sections"].update(part["sections"])
        course = json.loads((ROOT / "research/course.json").read_text())
        manifest["sections"] = {s["id"]: manifest["sections"][s["id"]] for w in course["weeks"] for s in w["sections"]}
        write_manifest(manifest)
        return
    model_hash = digest(args.model.read_bytes())
    onnxruntime.disable_telemetry_events()
    options = onnxruntime.SessionOptions()
    options.intra_op_num_threads = 1
    options.inter_op_num_threads = 1
    voice = PiperVoice(
        config=PiperConfig.from_dict(json.loads(Path(str(args.model) + ".json").read_text())),
        session=onnxruntime.InferenceSession(str(args.model), sess_options=options, providers=["CPUExecutionProvider"]),
    )
    config = SynthesisConfig(length_scale=1.08)
    course_bytes = (ROOT / "research/course.json").read_bytes()
    course = json.loads(course_bytes)
    manifest = {"version": 1, "voice": VOICE, "recipe": RECIPE,
                "modelSha256": model_hash, "courseSha256": digest(course_bytes), "sections": {}}

    def synthesize(text):
        key = digest((RECIPE + model_hash + text).encode())
        wav_path = args.cache_dir / (key + ".wav")
        if not wav_path.exists():
            temporary = wav_path.with_suffix(f".{os.getpid()}.part.wav")
            with wave.open(str(temporary), "wb") as wav_file:
                voice.synthesize_wav(text, wav_file, syn_config=config)
            temporary.replace(wav_path)
        return key, wav_path

    def encode(wav_path, folder, name, source_hash, title):
        output = folder / f"{name}-{source_hash[:12]}.mp3"
        if not output.exists():
            temporary = output.with_suffix(".part.mp3")
            subprocess.run([
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                "-i", str(wav_path), "-ac", "1", "-ar", "22050",
                "-codec:a", "libmp3lame", "-b:a", "48k",
                "-metadata", "title=" + title, "-metadata", "artist=Balancewise",
                str(temporary),
            ], check=True)
            temporary.replace(output)
        with wave.open(str(wav_path), "rb") as wav_file:
            duration = wav_file.getnframes() / wav_file.getframerate()
        payload = output.read_bytes()
        return {"src": output.relative_to(ROOT).as_posix(), "duration": round(duration, 3),
                "bytes": len(payload), "sha256": digest(payload), "sourceSha256": source_hash}

    outro_key, outro_path = synthesize(
        "End of this section. Return to the game when you are ready for its questions.")
    count = 0
    ordinal = 0
    for week in course["weeks"]:
        for section in week["sections"]:
            shard = ordinal % args.shard_count
            ordinal += 1
            if shard != args.shard_index:
                continue
            if args.section and section["id"] != args.section:
                continue
            if not re.fullmatch(r"[a-z0-9-]+", section["id"]):
                raise ValueError("Unsafe section ID")
            folder = ROOT / "audio" / section["id"]
            folder.mkdir(parents=True, exist_ok=True)
            tracks, wavs = [], []
            for index, card in enumerate(section["cards"]):
                key, wav_path = synthesize(spoken_text(card))
                tracks.append(encode(wav_path, folder, f"step-{index + 1:02d}", key, card["title"]))
                wavs.append(wav_path)
            section_key = digest((RECIPE + "".join(t["sourceSha256"] for t in tracks) + outro_key).encode())
            full_path = args.cache_dir / (section_key + ".wav")
            if not full_path.exists():
                temporary = full_path.with_suffix(f".{os.getpid()}.part.wav")
                with wave.open(str(temporary), "wb") as full:
                    audio_format = None
                    for wav_path in [*wavs, outro_path]:
                        with wave.open(str(wav_path), "rb") as part:
                            current_format = (part.getnchannels(), part.getsampwidth(), part.getframerate())
                            if audio_format is None:
                                audio_format = current_format
                                full.setnchannels(audio_format[0])
                                full.setsampwidth(audio_format[1])
                                full.setframerate(audio_format[2])
                            elif current_format != audio_format:
                                raise ValueError("Narration sample formats do not match")
                            full.writeframes(part.readframes(part.getnframes()))
                            full.writeframes(b"\0" * int(part.getframerate() * 0.5) * part.getsampwidth())
                temporary.replace(full_path)
            full_track = encode(full_path, folder, "section", section_key, section["title"])
            manifest["sections"][section["id"]] = {"steps": tracks, "section": full_track}
            count += 1
            print(f"Worker {args.shard_index + 1}, {count}: {section['id']} — {len(tracks)} steps, {full_track['duration']:.0f}s", flush=True)
    if args.section:
        if not count:
            raise ValueError("Unknown section ID")
        return
    if args.shard_count > 1:
        (args.cache_dir / f"manifest-{args.shard_index}.json").write_text(json.dumps(manifest))
    else:
        write_manifest(manifest)


def write_manifest(manifest):
    script = "// Generated by research/build-audio.py; do not edit by hand.\n"
    script += "globalThis.COURSE_AUDIO = " + json.dumps(manifest, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (ROOT / "assets/audio-manifest.js").write_text(script)
    print(f"Generated {len(manifest['sections'])} sections and their individual steps.", flush=True)


if __name__ == "__main__":
    main()
