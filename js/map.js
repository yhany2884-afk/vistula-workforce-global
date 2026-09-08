
(function(){
  const SKIP = new Set(['010','260']);
  const byNum = Object.fromEntries(COUNTRIES.filter(c=>c.isoNumeric && c.isoNumeric!=='000').map(c=>[c.isoNumeric,c]));
  const byEn = Object.fromEntries(COUNTRIES.map(c=>[c.nameEn,c]));
  function fromFeat(f){
    const id = String(f.id ?? '').padStart(3,'0');
    if (id && byNum[id]) return byNum[id];
    const name = f.properties && f.properties.name;
    return name ? byEn[name] : undefined;
  }
  const root = document.documentElement;
  const css = getComputedStyle(root);
  const fill = css.getPropertyValue('--map-fill').trim() || '#1a6b73';
  const hover = css.getPropertyValue('--map-hover').trim() || '#9fd0cc';
  const fg = css.getPropertyValue('--fg').trim() || '#f4efe6';
  const mapEl = document.getElementById('map');
  if (!mapEl || !window.L) return;
  mapEl.style.direction = 'ltr';
  const map = L.map(mapEl, {worldCopyJump:true, minZoom:1, maxZoom:8}).setView([18,20], 2);
  const countryBase = mapEl.getAttribute('data-country-base') || 'country/';
  const geo = window.WORLD_GEO;
  if (!geo) return;
  {
    L.geoJSON(geo, {
      filter: f => !SKIP.has(String(f.id??'').padStart(3,'0')),
      style: f => {
        const c = fromFeat(f);
        return {color:fg, weight:.6, opacity:.35, fillColor: c && c.featured ? hover : fill, fillOpacity: c && c.featured ? .92 : .72};
      },
      onEachFeature: (f, lyr) => {
        const c = fromFeat(f);
        const label = (c && c.name) || (f.properties && f.properties.name) || '';
        if (label) lyr.bindTooltip(label, {sticky:true, opacity:1, direction:'top'});
        if (!c) return;
        lyr.on('mouseover', () => { lyr.setStyle({fillColor:hover, fillOpacity:1, weight:1.4, opacity:.85}); lyr.bringToFront(); });
        lyr.on('mouseout', () => { lyr.setStyle({fillColor:c.featured?hover:fill, fillOpacity:c.featured ? .92:.72, weight:.6, opacity:.35}); });
        lyr.on('click', (e) => { L.DomEvent.stop(e); location.href = countryBase + c.slug + '.html'; });
      }
    }).addTo(map);
    setTimeout(()=>map.invalidateSize(), 200);
  }
})();
