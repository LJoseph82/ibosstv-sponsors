/* iBossTV Sponsorship Display v1.0 — standalone, no dependencies. */
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
    try { const u = new URL(value, BASE); return ['https:', 'http:'].includes(u.protocol) ? u.href : null; }
    catch { return null; }
  };
  // Calendar-date comparisons use UTC dates to avoid viewer time-zone shifts.
  const todayUTC = () => new Date().toISOString().slice(0, 10);
  const isDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
  const eligible = (s, placement, slug, today) => s && s.active === true &&
    s.placement === placement &&
    (placement === 'network' || (slug && Array.isArray(s.channels) && s.channels.includes(slug))) &&
    (!s.startDate || (isDate(s.startDate) && s.startDate <= today)) &&
    (!s.endDate || (isDate(s.endDate) && s.endDate >= today)) &&
    validHttp(s.image) && validHttp(s.url);
  function style() {
    if (document.getElementById(STYLE_ID)) return;
    const tag = document.createElement('style'); tag.id = STYLE_ID;
    tag.textContent = `
      .ibs-section{color:#f7fafb;font-family:Arial,Helvetica,sans-serif;margin:28px 0;padding:24px;background:#111c22;border:1px solid #2b3d43;border-radius:16px;box-sizing:border-box}
      .ibs-heading{font-size:clamp(20px,2.5vw,27px);line-height:1.25;font-weight:750;margin:0 0 7px;color:#fff}
      .ibs-description{font-size:14px;color:#b9c8cd;margin:0 0 19px}
      .ibs-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
      .ibs-card{display:flex;flex-direction:column;text-decoration:none!important;color:#fff!important;background:#1b2a31;border:1px solid #34464d;border-radius:12px;overflow:hidden;transition:transform .2s,border-color .2s}
      .ibs-card:hover,.ibs-card:focus-visible{transform:translateY(-2px);border-color:#00c2cb;outline:2px solid transparent}
      .ibs-media{width:100%;display:flex;align-items:center;justify-content:center;background:#0b1419;overflow:hidden}
      .ibs-channel .ibs-media{height:230px}.ibs-network .ibs-media{height:155px}
      .ibs-media img{display:block;width:100%;height:100%;object-fit:contain}
      .ibs-card-label{padding:11px 13px;font-size:14px;font-weight:700;line-height:1.35}
      .ibs-cta{display:inline-block;margin-top:19px;color:#00c2cb!important;font-weight:700;text-decoration:none!important;font-size:14px}
      .ibs-cta:hover{text-decoration:underline!important}
      @media(max-width:700px){.ibs-section{padding:17px;margin:18px 0}.ibs-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.ibs-channel .ibs-media{height:190px}.ibs-network .ibs-media{height:130px}}
      @media(max-width:420px){.ibs-grid{grid-template-columns:1fr}.ibs-channel .ibs-media{height:230px}.ibs-network .ibs-media{height:170px}}
    `;
    document.head.appendChild(tag);
  }
  function render(root, data, slug) {
    const placement = root.getAttribute('data-ibosstv-sponsors');
    if (!['channel','network'].includes(placement)) return;
    const sponsors = Array.isArray(data.sponsors) ? data.sponsors : [];
    const today = todayUTC();
    const limit = placement === 'channel' ? data.settings?.maxChannelCards : data.settings?.maxNetworkCards;
    const visible = sponsors.filter(s => eligible(s, placement, slug, today))
      .sort((a,b) => (Number(a.order)||0)-(Number(b.order)||0) || String(a.id).localeCompare(String(b.id)))
      .slice(0, Number.isInteger(limit) && limit > 0 ? limit : 12);
    root.replaceChildren();
    root.hidden = visible.length === 0;
    if (!visible.length) return;
    const section = document.createElement('section'); section.className = 'ibs-section ibs-'+placement;
    const title = document.createElement('h2'); title.className = 'ibs-heading';
    title.textContent = placement === 'network' ? (data.settings?.networkTitle || 'iBossTV Network Partners') :
      `${data.channels?.[slug] || 'iBossTV'} Sponsors`;
    section.appendChild(title);
    if (placement === 'network' && data.settings?.networkDescription) {
      const desc = document.createElement('p'); desc.className='ibs-description'; desc.textContent=data.settings.networkDescription;section.appendChild(desc);
    }
    const grid = document.createElement('div'); grid.className='ibs-grid';
    visible.forEach(s => {
      const card=document.createElement('a'); card.className='ibs-card'; card.href=validHttp(s.url);card.target='_blank';card.rel='noopener noreferrer';
      card.setAttribute('aria-label',`Visit ${s.name || 'sponsor'} (opens in a new tab)`);
      const media=document.createElement('div');media.className='ibs-media';
      const img=document.createElement('img');img.src=validHttp(s.image);img.alt=`${s.name || 'Sponsor'} advertisement`;img.loading='lazy';img.decoding='async';
      media.appendChild(img);card.appendChild(media);
      const label=document.createElement('div');label.className='ibs-card-label';label.textContent=s.name || 'Sponsor';card.appendChild(label);
      grid.appendChild(card);
    });
    section.appendChild(grid);
    const cta=validHttp(data.settings?.sponsorUrl);
    if (cta) { const a=document.createElement('a');a.className='ibs-cta';a.href=cta;a.textContent='Become a Sponsor →';section.appendChild(a); }
    root.appendChild(section);
  }
  async function init() {
    const roots=Array.from(document.querySelectorAll(SELECTOR));if (!roots.length) return;
    try {
      const response=await fetch(FEED.href,{cache:'no-cache'});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data=await response.json();style();const slug=slugFromPath();roots.forEach(root=>render(root,data,slug));
    } catch (error) { roots.forEach(root=>{root.hidden=true;root.replaceChildren();});console.error('[iBossTV Sponsors] Feed unavailable:',error); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
