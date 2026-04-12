---
name: react-native-dual-git
description: Strict guidelines for managing the split GitHub (code) and local Synology Gitea (LFS) architecture for the React Native TODO app.
---

# Dual-Remote Git & LFS Workflow

## Infrastructure Overview
- **Primary Remote (`origin`)**: Hosted on GitHub. Used strictly for text, code, lightweight SVGs, and configuration files.
- **Secondary Remote (`local-gitea`)**: Hosted locally on a Synology NAS. Used as a full backup and the EXCLUSIVE host for all Git LFS binary files.
- **Git LFS**: Configured via `.lfsconfig` to route all LFS traffic to `local-gitea`. Heavy files MUST NEVER be pushed to `origin`.

## Git Workflow Directives
1. **Pushing Code**: When pushing a branch (e.g., `main`), push to both remotes sequentially to keep them synced. (Ensure network connectivity to the NAS before executing):
   `git push origin <branch>`
   `git push local-gitea <branch>`
2. **Binary Assets & LFS**: Any raw design files (.psd, .ai), custom fonts (.ttf, .otf), or high-res raster images must be tracked by LFS. Do not alter `.gitattributes` to remove LFS tracking for these files. (Note: standard lightweight SVG icons do not need LFS).
3. **React Native/Expo Ignore Rules**: Never stage or commit auto-generated build files or dependencies. Rely on `.gitignore` to block `node_modules/`, `.expo/`, `ios/Pods/`, `ios/build/`, and `android/app/build/`.
4. **No Force Pushing LFS to GitHub**: Never attempt to bypass `.lfsconfig` to push LFS objects to `origin`.