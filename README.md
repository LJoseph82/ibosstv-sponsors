# iBossTV Sponsorships — deployment v1.1

This repository displays sponsor cards on participating iBossTV LIVE channel pages.

## New behavior
- All 13 channel identifiers are registered, including `lolounge` for `/pages/livetv-lolounge`.
- Channel-specific active, non-demo advertisers appear when assigned to that channel.
- If none are assigned, sample channel advertisements appear automatically using the shared demo cards (`channels: ["*"]`).
- Network sponsors display on every participating page using the network embed.
- Channel cards: maximum 8. Network cards: maximum 4.
- The SAMPLE ADVERTISEMENT badge identifies demos; these are not sold inventory.
- The same embed is used for every channel.

## Universal embed for every LIVE channel page
```html
<div data-ibosstv-sponsors="channel"></div>
<div data-ibosstv-sponsors="network"></div>
<script src="https://ljoseph82.github.io/ibosstv-sponsors/sponsors.js" defer></script>
```

## Adding a future channel
Add a new `slug: display name` pair to the `channels` object in `sponsors.json`.
The page URL must be `/pages/livetv-SLUG` and contain the universal embed.
Add its corresponding navigation entry and logo to the separate Channel Guide repository.
No change to `sponsors.js` is needed for a new registered channel.

## Deploy
Back up the current GitHub repository ZIP first. Upload the CONTENTS of this repository
to the ROOT of the existing `ibosstv-sponsors` GitHub repository, replacing matching files.
Do not upload this folder as a nested folder. Commit, allow GitHub Pages to publish, then
verify Latino and LOLounge and the other channel pages.
