/* PeakRushChart - dependency-free, works with plain <script> (no build step).
   Usage: PeakRushChart.mount('#peak-rush', { spaceId: 'central' });
   Options: spaceId, data (array of 12 numbers, overrides sample data), peak (default 75), quiet (default 40). */
(function () {
  var START = 8, SLOTS = 12;
  var hr = function (h) { return (h % 12 || 12) + (h < 12 ? ' AM' : ' PM'); };
  var range = function (i) { return hr(START + i) + ' - ' + hr(START + i + 1); };

  function mount(target, opts) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    opts = opts || {};
    var all = window.PEAK_RUSH_SAMPLE_DATA || {};
    var v = opts.data || all[opts.spaceId] || all.default || [];
    if (v.length !== SLOTS) { el.textContent = 'Peak rush data unavailable.'; return; }
    var PEAK = opts.peak || 75, QUIET = opts.quiet || 40;
    var kind = function (x) { return x >= PEAK ? 'peak' : x <= QUIET ? 'quiet' : 'busy'; };
    var label = { peak: 'Peak rush', quiet: 'Quiet', busy: 'Moderately busy' };

    var W = 560, H = 250, L = 38, R = 8, T = 22, B = 34, cw = W - L - R, ch = H - T - B, slot = cw / SLOTS, bw = slot * 0.62;
    var y = function (p) { return T + ch - (p / 100) * ch; };
    var max = v.indexOf(Math.max.apply(null, v)), min = v.indexOf(Math.min.apply(null, v));
    var s = '<svg class="pr-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Estimated occupancy by hour, 8 AM to 8 PM (sample data)">';

    [0, 25, 50, 75, 100].forEach(function (g) {
      s += '<line class="pr-grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(g) + '" y2="' + y(g) + '"/><text class="pr-ax" x="' + (L - 6) + '" y="' + (y(g) + 4) + '" text-anchor="end">' + g + '%</text>';
    });
    // shaded bands for consecutive peak / quiet hours
    var i = 0;
    while (i < SLOTS) {
      var k = kind(v[i]);
      if (k === 'busy') { i++; continue; }
      var j = i; while (j + 1 < SLOTS && kind(v[j + 1]) === k) j++;
      var x0 = L + i * slot, w = (j - i + 1) * slot;
      s += '<rect class="pr-band ' + k + '" x="' + x0 + '" y="' + T + '" width="' + w + '" height="' + ch + '" rx="6"/>';
      s += '<text class="pr-bl ' + k + '" x="' + (x0 + w / 2) + '" y="' + (T - 7) + '" text-anchor="middle">' + (k === 'peak' ? 'Peak' : 'Quiet') + '</text>';
      i = j + 1;
    }
    v.forEach(function (p, n) {
      var k = kind(p), x = L + n * slot + (slot - bw) / 2;
      s += '<rect class="pr-bar ' + k + '" data-i="' + n + '" tabindex="0" x="' + x + '" y="' + y(p) + '" width="' + bw + '" height="' + (T + ch - y(p)) + '" rx="4" aria-label="' + range(n) + ': ' + p + '% full, ' + label[k] + '"/>';
    });
    for (var t = 0; t <= SLOTS; t += 2) {
      s += '<text class="pr-ax" x="' + (L + t * slot) + '" y="' + (H - 12) + '" text-anchor="' + (t === SLOTS ? 'end' : t === 0 ? 'start' : 'middle') + '">' + hr(START + t).replace(' ', '') + '</text>';
    }
    s += '</svg>';

    el.innerHTML =
      '<section class="pr-card"><div class="pr-head"><h3>Peak Rush Time</h3><span class="pr-badge">Sample data</span></div>' +
      '<p class="pr-sub">Estimated occupancy, 8 AM - 8 PM (illustrative, not live)</p>' +
      '<div class="pr-sum"><span class="pr-chip peak">Busiest: ' + range(max) + ' (' + v[max] + '%)</span><span class="pr-chip quiet">Quietest: ' + range(min) + ' (' + v[min] + '%)</span></div>' +
      s + '<p class="pr-read" aria-live="polite">Hover or tap a bar to see details.</p>' +
      '<div class="pr-leg"><span class="peak">Peak (' + PEAK + '%+)</span><span class="busy">Busy</span><span class="quiet">Quiet (' + QUIET + '% or less)</span></div></section>';

    var read = el.querySelector('.pr-read');
    var show = function (e) {
      var n = +e.target.getAttribute('data-i'); if (isNaN(n)) return;
      read.textContent = range(n) + ': about ' + v[n] + '% full - ' + label[kind(v[n])];
    };
    el.querySelectorAll('.pr-bar').forEach(function (b) {
      ['mouseover', 'focus', 'click'].forEach(function (ev) { b.addEventListener(ev, show); });
    });
  }
  window.PeakRushChart = { mount: mount };
})();
