"""Compatibility entrypoint for the dependency-free Node verification suite."""
from pathlib import Path
import subprocess
import sys

subprocess.run(["node", str(Path(__file__).with_suffix(".mjs")), *sys.argv[1:]], check=True)
