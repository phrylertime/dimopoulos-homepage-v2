## Deploy in one click

1. **Unzip** this folder.
2. **Double-click `deploy.command`** (Mac).
   - macOS may say "unidentified developer" — right-click → Open → Open.
3. A Terminal window opens. It will:
   - install anything missing (Homebrew, git, GitHub CLI),
   - open your browser to log in to GitHub,
   - create the repo, push, turn on Pages,
   - and open the live URL when the build finishes.

That's it. No copy-pasting commands.

---

### Linux / advanced users

```bash
cd pages
bash deploy.sh
```

### Already deployed and want to push a new version?

Re-run the same script. It re-uses the existing repo and pushes a fresh commit.
