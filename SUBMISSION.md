# Obsidian community submission checklist

Use **release `1.2.0` or later** (GitHub Actions + artifact attestations).

## Before submitting a new version

1. Bump `version` in `manifest.json` (must match the git tag).
2. Ensure `description` does **not** include the word **Obsidian**.
3. Commit and push to `main`.
4. Create and push tag: `git tag 1.2.0 && git push origin 1.2.0`
5. Wait for [Release workflow](https://github.com/crossbeat461-a11y/table-csv/actions) to finish.
6. Update the public listing text by hand (version itself is picked up from GitHub):
   1. Open [community.obsidian.md](https://community.obsidian.md) and sign in with your **Obsidian** account (not only GitHub).
   2. Connect GitHub if prompted, so you can see TableCSV under **Plugins → Your entries**.
   3. Open **TableCSV**.
   4. If 1.2.0 is not listed yet: **⋯ → Check for new releases**.
   5. Select **Edit listing**.
   6. Paste Short / Longer description from `LISTING.md`, then **Save**.

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
