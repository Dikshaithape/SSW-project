import subprocess, os

cwd = r"C:\Users\tanjo\.gemini\antigravity\scratch\ssw-early-warning-platform"

def run(cmd):
    print(f"Executing: {' '.join(cmd)}")
    p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if p.stdout:
        print("STDOUT:", p.stdout.strip())
    if p.stderr:
        print("STDERR:", p.stderr.strip())
    return p.returncode

run(["git", "init"])
run(["git", "branch", "-M", "main"])

# Check if origin already exists
p = subprocess.run(["git", "remote"], cwd=cwd, capture_output=True, text=True)
if "origin" not in p.stdout:
    run(["git", "remote", "add", "origin", "https://github.com/tanjo0407-creator/SSW-Project.git"])
else:
    run(["git", "remote", "set-url", "origin", "https://github.com/tanjo0407-creator/SSW-Project.git"])

run(["git", "add", "."])
run(["git", "commit", "-m", "Initial commit: SSW scientific research and analytical prediction platform"])
code = run(["git", "push", "-u", "origin", "main"])
print("Push exit code:", code)
