# Obsidian community submission checklist

Use **release `1.2.0` or later** (GitHub Actions + artifact attestations).

## Before submitting a new version

1. Bump `version` in `manifest.json` (must match the git tag).
2. Ensure `description` does **not** include the word **Obsidian**.
3. Commit and push to `main`.
4. Create and push tag: `git tag 1.2.0 && git push origin 1.2.0`
5. Wait for [Release workflow](https://github.com/crossbeat461-a11y/table-csv/actions) to finish.
6. After the Release exists, the **agent** pastes Short / Longer description from `LISTING.md` into community.obsidian.md → TableCSV → **Edit listing** → Save. Short must be **200 characters or fewer**. Longer must be **1000 characters or fewer**. Do not leave this for the human. Version itself is picked up from GitHub.
7. The **human** only finishes Obsidian **pending** for the new version (not the listing copy).

If Edit listing cannot be completed (no browser session, login missing), stop and report that one blocked step. Do not ask the human to hunt Cursor settings.

## Expected scan results

| Check | Expected |
|-------|----------|
| MANIFEST | Pass — no "Obsidian" in description |
| RELEASES | Pass — release title includes version; attestations present |
| NETWORK | Pass — no remote requests in plugin code |

## Release assets (auto-uploaded)

- `main.js`
- `manifest.json`
- `styles.css`
