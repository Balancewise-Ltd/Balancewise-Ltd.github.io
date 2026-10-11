# Robotics — a free learning game

Play: https://balancewises.io/robotics/

112 sections, 455 small teaching steps and 337 questions, following the supplied KV6022 lecture/demonstration sequence. Includes wheel-speed, LiDAR and path-planning teaching diagrams.

Read every small step, then answer every section question correctly to unlock the next section. A wrong answer explains the mistake and requires restarting that section. Previously passed sections stay recorded. Blue labels explain, red labels flag mistakes/dangers, yellow labels identify extra research. Progress uses browser localStorage; export/import a JSON backup through My progress.

## Run or host

Open index.html, or serve this folder with:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open http://127.0.0.1:8000. Upload this folder's contents to any static host. Internal links are relative. No Node, npm, build, backend, account or API key is needed.

## Contribute

Edit research/course.json, then regenerate assets/course.js:

```bash
python3 - <<'PYTHON'
import json
from pathlib import Path
course = json.loads(Path('research/course.json').read_text())
Path('assets/course.js').write_text('const COURSE = ' + json.dumps(course, ensure_ascii=False, separators=(',', ':')) + ';\n')
PYTHON
```

Keep unique section IDs and valid answer indices. Changing the course order requires updating CourseEngine.VERSION in assets/engine.js to avoid incompatible saved progress.

The game code, original explanations and quizzes are MIT licensed. Read NOTICE.md for attribution and third-party scope. Lecturer files, screenshots, private setup records and robot source archives are not distributed. You can play all lessons without them, but practical robot exercises need the external course packages. This project is the public learning game; the wider Balancewise robotics sector will be published separately when ready.

See research/VERIFICATION.md for validation evidence and current limits. This is a learning tool, not tamper-proof examination software.

## Improvements from your added game

Optional read-aloud with stop controls; a 517-page title index with each section; the first idea highlighted; two verified lecturer workshop references; corrected Week 1 citations for the review slots. Course order, 112 sections and 337 questions remain the same.

See research/ADDED-GAME-REVIEW.md for the comparison and research record. Audio voice availability depends on your browser; some browser voices use online services. No new robot commands were executed.
