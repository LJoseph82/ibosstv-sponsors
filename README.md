# iBossTV Sponsor Manager v1.0 — Latino MVP

Standalone static sponsor display. **Not deployed yet.** No changes to Strimm player or existing Channel Guide.

## Publish
1. Create public GitHub repository named `ibosstv-sponsors` under `LJoseph82` (or adjust URLs if you use another repo).
2. Upload the **contents** of this folder to the repository root.
3. In repository Settings → Pages, publish from the main branch/root; wait for Pages to become active.
4. Visit `https://ljoseph82.github.io/ibosstv-sponsors/pages/livetv-latino/` and confirm both demo sections appear.
5. On the actual Uscreen Latino page, add these two divs at the desired placements and load the JS once:

```html
<div data-ibosstv-sponsors="channel"></div>
<div data-ibosstv-sponsors="network"></div>
<script src="https://ljoseph82.github.io/ibosstv-sponsors/sponsors.js" defer></script>
```

If the sections should be separated by other Uscreen content, put the divs in separate custom HTML blocks; load the script **only once** on the page.

## Before public launch
- Replace both `demo: true` records with approved, paid sponsors, or set `active:false` to hide them.
- Replace example image SVGs with sponsor artwork; use paths like `assets/latino/name.png`.
- Set `settings.sponsorUrl` to the real iBoss AdVance sponsorship URL. Until then, the CTA is hidden to avoid broken links.
- Ensure startDate/endDate are valid `YYYY-MM-DD` and `active:true`; end date is inclusive.
- The JSON must contain **only public information**. Never include email addresses, payment details, private CRM records or API keys.
- Use a separate inventory register to avoid overselling slots. Max cards are display caps, **not** sales inventory enforcement.

## Rules
- `placement:"channel"` + `channels:["latino"]` appears only on `/pages/livetv-latino`.
- `placement:"network"` appears on all channel pages with a network container.
- `order` sorts ascending. No auto-rotation in MVP.
- Both portrait and landscape assets use `object-fit:contain`, preserving the complete image.
- Empty sections are hidden. Links open a new tab with `noopener noreferrer`.
- Date filtering is browser-side UTC and therefore not authoritative. For paid campaigns, check expirations independently until scheduled/server-side enforcement is implemented.
- No impressions or click analytics in v1.0; do not guarantee performance.

## Smoke tests
1. Latino page shows sample Latino and network sponsor.
2. Non-Latino channel page shows only network sponsor.
3. `active:false`, future startDate, and past endDate each hide the corresponding card.
4. Broken feed hides both sections without disrupting other content.
5. Check desktop, tablet, mobile; images fit without cropping.
6. Verify outgoing sponsor links and no duplicate script insertion.
