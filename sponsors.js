
/* iBossTV Sponsorship Display v1.2 — channel-aware shared demo artwork; no dependencies. */
(() => {
  'use strict';
  const SCRIPT = document.currentScript;
  const BASE = SCRIPT ? new URL('.', SCRIPT.src) : new URL('./', location.href);
  const FEED = new URL('sponsors.json', BASE);
  const STYLE_ID = 'ibosstv-sponsors-style';
  const SELECTOR = '[data-ibosstv-sponsors]';

  const slugFromPath = () => {
    const match = location.pathname.match(/\/pages\/livetv-([^/?#]+)/i);
    return match ? decodeURIComponent(match[1]).toLowerCase() : null;
  };

  const validHttp = value => {
    try {
      const u = new URL(value, BASE);
      return ['https:', 'http:'].includes(u.protocol) ? u.href : null;
    } catch {
      return null;
    }
  };

  // Calendar-date comparisons use UTC dates to avoid viewer time-zone shifts.
  const todayUTC = () => new Date().toISOString().slice(0, 10);
  const isDate = value => typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value));

  // Generate channel-aware artwork only for shared sample advertisements.
  // Paid sponsor images, channel-specific demos, and network artwork remain unchanged.
  const xmlEscape = value => String(value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  })[ch]);

  function sharedDemoArtwork(channelName, index) {
    const name = String(channelName || 'iBossTV').trim();
    const words = name.split(/\s+/);
    const lines = [];
    let line = '';

    words.forEach(word => {
      if (line && (line + ' ' + word).length > 19) {
        lines.push(line);
        line = word;
      } else {
        line = line ? line + ' ' + word : word;
      }
    });

    if (line) lines.push(line);

    const titleLines = lines.slice(0, 4);
    const titleStart = 280 - (titleLines.length - 1) * 29;

    const title = titleLines.map((value, i) =>
      `<text x="300" y="${titleStart + i * 58}" text-anchor="middle" font-size="46" font-weight="800" fill="#ffffff">${xmlEscape(value)}</text>`
    ).join('');

    const variants = [
      ['YOUR BRAND', 'COULD BE HERE', 'Connect your business with viewers'],
      ['BE SEEN', 'ON IBOSSTV', 'Support independent programming'],
      ['SPONSOR', 'THIS CHANNEL', 'Discover sponsorship opportunities']
    ];

    const [headline, subhead, tagline] = variants[index % variants.length];

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" role="img" aria-label="${xmlEscape(name)} sample sponsorship artwork">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#102b33"/>
          <stop offset="1" stop-color="#071318"/>
        </linearGradient>
      </defs>
      <rect width="600" height="800" fill="url(#bg)"/>
      <rect x="28" y="28" width="544" height="744" rx="22" fill="none" stroke="#00c2cb" stroke-width="3" opacity=".7"/>
      <rect x="86" y="92" width="428" height="4" rx="2" fill="#d4af37"/>
      <text x="300" y="154" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="20" font-weight="700" letter-spacing="4" fill="#00c2cb">IBOSSTV CHANNEL</text>
      <g font-family="Arial,Helvetica,sans-serif">
        ${title}
        <line x1="148" y1="416" x2="452" y2="416" stroke="#d4af37" stroke-width="3"/>
        <text x="300" y="501" text-anchor="middle" font-size="49" font-weight="800" fill="#ffffff">${headline}</text>
        <text x="300" y="557" text-anchor="middle" font-size="42" font-weight="700" fill="#00c2cb">${subhead}</text>
        <text x="300" y="636" text-anchor="middle" font-size="22" fill="#c9d9dd">${tagline}</text>
        <text x="300" y="710" text-anchor="middle" font-size="18" letter-spacing="2" fill="#d4af37">SPONSORSHIP OPPORTUNITY</text>
      </g>
    </svg>`;

    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  function style() {
    if (document.getElementById(STYLE_ID)) return;

    const tag = document.createElement('style');
    tag.id = STYLE_ID;

    tag.textContent = `
      [data-ibosstv-sponsors]{min-width:0}
      .ibs-section{box-sizing:border-box;color:#f7fafb;font-family:Arial,Helvetica,sans-serif;margin:clamp(18px,3vw,32px) 0;padding:clamp(16px,2.8vw,30px);background:linear-gradient(145deg,#101e24,#0b151a);border:1px solid #294047;border-radius:18px}
      .ibs-heading{font-size:clamp(22px,3vw,34px);line-height:1.18;font-weight:800;margin:0 0 9px;color:#fff;letter-spacing:-.025em}
      .ibs-description{font-size:clamp(13px,1.4vw,16px);line-height:1.5;color:#b9c8cd;margin:0 0 20px}
      .ibs-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,1.7vw,22px)}
      .ibs-network .ibs-grid{grid-template-columns:1fr}
      .ibs-card{min-width:0;display:flex;flex-direction:column;text-decoration:none!important;color:#fff!important;background:#14252d;border:1px solid #34515a;border-radius:14px;overflow:hidden;transition:transform .2s,border-color .2s,box-shadow .2s}
      .ibs-card:hover,.ibs-card:focus-visible{transform:translateY(-3px);border-color:#00c2cb;box-shadow:0 10px 30px #0005;outline:2px solid transparent}
      .ibs-media{position:relative;width:100%;display:flex;align-items:center;justify-content:center;background:#081419;overflow:hidden}
      .ibs-channel .ibs-media{aspect-ratio:3/4}
      .ibs-network .ibs-media{aspect-ratio:16/6}
      .ibs-media img{display:block;width:100%;height:100%;object-fit:contain}
      .ibs-card-label{padding:12px 15px;font-size:clamp(14px,1.5vw,17px);font-weight:700;line-height:1.4}
      .ibs-demo{position:absolute;top:10px;right:10px;padding:6px 9px;border:1px solid #00c2cb;border-radius:6px;background:#07191eea;color:#62e8ed;font-size:10px;letter-spacing:.08em;font-weight:800;pointer-events:none}
      .ibs-cta{display:inline-block;margin-top:20px;color:#00c2cb!important;font-weight:700;text-decoration:none!important;font-size:15px}
      .ibs-cta:hover{text-decoration:underline!important}
      @media(max-width:760px){.ibs-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ibs-network .ibs-media{aspect-ratio:16/8}}
      @media(max-width:520px){.ibs-grid{grid-template-columns:1fr}.ibs-channel .ibs-card{max-width:430px;width:100%;margin-inline:auto}.ibs-network .ibs-media{aspect-ratio:16/10}.ibs-section{border-radius:12px}}
      @media(prefers-reduced-motion:reduce){.ibs-card{transition:none}.ibs-card:hover{transform:none}}
    `;

    document.head.appendChild(tag);
  }

  function render(root, data, slug) {
    const placement = root.getAttribute('data-ibosstv-sponsors');
    if (!['channel', 'network'].includes(placement)) return;

    const sponsors = Array.isArray(data.sponsors) ? data.sponsors : [];
    const today = todayUTC();
    const limit = placement === 'channel'
      ? data.settings?.maxChannelCards
      : data.settings?.maxNetworkCards;

    const registered = Boolean(
      slug && Object.prototype.hasOwnProperty.call(data.channels || {}, slug)
    );

    const valid = s => s && s.active === true &&
      (!s.startDate || (isDate(s.startDate) && s.startDate <= today)) &&
      (!s.endDate || (isDate(s.endDate) && s.endDate >= today)) &&
      validHttp(s.image) && validHttp(s.url);

    const sortSponsors = list => list.sort((a, b) =>
      (Number(a.order) || 0) - (Number(b.order) || 0) ||
      String(a.id).localeCompare(String(b.id))
    );

    let visible;
    let usingSharedDemos = false;

    if (placement === 'channel') {
      if (!registered) {
        root.replaceChildren();
        root.hidden = true;
        return;
      }

      const assigned = sortSponsors(sponsors.filter(s =>
        valid(s) &&
        s.placement === 'channel' &&
        s.demo !== true &&
        Array.isArray(s.channels) &&
        s.channels.includes(slug)
      ));

      const specificDemos = sortSponsors(sponsors.filter(s =>
        valid(s) &&
        s.placement === 'channel' &&
        s.demo === true &&
        Array.isArray(s.channels) &&
        s.channels.includes(slug)
      ));

      const sharedDemos = sortSponsors(sponsors.filter(s =>
        valid(s) &&
        s.placement === 'channel' &&
        s.demo === true &&
        Array.isArray(s.channels) &&
        s.channels.includes('*')
      ));

      // Never present sample inventory alongside actual paid placements.
      usingSharedDemos = !assigned.length && !specificDemos.length;

      visible = assigned.length
        ? assigned
        : (specificDemos.length ? specificDemos : sharedDemos);

    } else {
      visible = sortSponsors(sponsors.filter(s =>
        valid(s) && s.placement === 'network'
      ));
    }

    visible = visible.slice(
      0,
      Number.isInteger(limit) && limit > 0 ? limit : 12
    );

    root.replaceChildren();
    root.hidden = visible.length === 0;
    if (!visible.length) return;

    const section = document.createElement('section');
    section.className = 'ibs-section ibs-' + placement;

    const title = document.createElement('h2');
    title.className = 'ibs-heading';
    title.textContent = placement === 'network'
      ? (data.settings?.networkTitle || 'iBossTV Network Partners')
      : `${data.channels?.[slug] || 'iBossTV'} Sponsors`;

    section.appendChild(title);

    if (placement === 'network' && data.settings?.networkDescription) {
      const desc = document.createElement('p');
      desc.className = 'ibs-description';
      desc.textContent = data.settings.networkDescription;
      section.appendChild(desc);
    }

    const grid = document.createElement('div');
    grid.className = 'ibs-grid';

    visible.forEach((s, index) => {
      const card = document.createElement('a');
      card.className = 'ibs-card';
      card.href = validHttp(s.url);
      card.target = '_blank';
      card.rel = 'noopener noreferrer';

      card.setAttribute(
        'aria-label',
        s.demo === true
          ? 'Explore sponsorship opportunities (opens in a new tab)'
          : `Visit ${s.name || 'sponsor'} (opens in a new tab)`
      );

      const media = document.createElement('div');
      media.className = 'ibs-media';

      const img = document.createElement('img');

      img.src = (
        placement === 'channel' &&
        usingSharedDemos &&
        s.demo === true
      )
        ? sharedDemoArtwork(data.channels[slug], index)
        : validHttp(s.image);

      img.alt = `${s.name || 'Sponsor'} advertisement`;
      img.loading = 'lazy';
      img.decoding = 'async';

      media.appendChild(img);

      if (s.demo === true) {
        const demo = document.createElement('span');
        demo.className = 'ibs-demo';
        demo.textContent = 'SAMPLE ADVERTISEMENT';
        media.appendChild(demo);
      }

      card.appendChild(media);

      const label = document.createElement('div');
      label.className = 'ibs-card-label';
      label.textContent = s.name || 'Sponsor';

      card.appendChild(label);
      grid.appendChild(card);
    });

    section.appendChild(grid);

    const cta = validHttp(data.settings?.sponsorUrl);
    if (cta) {
      const a = document.createElement('a');
      a.className = 'ibs-cta';
      a.href = cta;
      a.textContent = 'Become a Sponsor →';
      section.appendChild(a);
    }

    root.appendChild(section);
  }

  async function init() {
    const roots = Array.from(document.querySelectorAll(SELECTOR));
    if (!roots.length) return;

    try {
      const response = await fetch(FEED.href, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      style();

      const slug = slugFromPath();
      roots.forEach(root => render(root, data, slug));

    } catch (error) {
      roots.forEach(root => {
        root.hidden = true;
        root.replaceChildren();
      });

      console.error('[iBossTV Sponsors] Feed unavailable:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

