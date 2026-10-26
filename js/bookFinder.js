/* BookFinder - plain JS, no dependencies. Usage: BookFinder.mount('#book-finder');
   Options: { data: {...} } to pass your own catalogue object (same shape as bookFinderData.js), { hideEmpty:false } to show empty categories. */
(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var norm = function (s) { return String(s || '').toLowerCase().trim(); };
  var isbnNorm = function (s) { return norm(s).replace(/[-\s]/g, ''); };
  var fmt = function (d) { return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); };

  function mount(target, opts) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    opts = opts || {};
    var D = opts.data || window.BOOK_FINDER_DATA;
    if (!el) return;
    if (!D) { el.textContent = 'Book catalogue data not loaded.'; return; }

    var cats = D.categories.slice();
    var other = cats.filter(function (c) { return c.id === 'other'; })[0];
    if (!other) { other = { id: 'other', name: 'Other / uncategorized', subs: [] }; cats.push(other); }
    var catIds = {}; cats.forEach(function (c) { catIds[c.id] = c; });
    var books = D.books.map(function (b) { var o = {}; for (var k in b) o[k] = b[k]; o.cat = catIds[b.category] ? b.category : 'other'; return o; });
    var count = {}; books.forEach(function (b) { count[b.cat] = (count[b.cat] || 0) + 1; });
    var shownCats = cats.filter(function (c) { return opts.hideEmpty === false || count[c.id]; });
    var uniq = function (a) { return a.filter(function (v, i) { return v && a.indexOf(v) === i; }).sort(); };
    var langs = uniq(books.map(function (b) { return b.lang; }));
    var locs = uniq((D.locations || []).concat([].concat.apply([], books.map(function (b) { return b.copies.map(function (c) { return c.loc; }); }))));
    var st = { q: '', by: 'all', cat: '', sub: '', lang: '', loc: '', avail: false };
    var opt = function (a, label) { return '<option value="">' + label + '</option>' + a.map(function (v) { return '<option>' + esc(v) + '</option>'; }).join(''); };

    el.innerHTML =
      '<section class="bf"><h1>Library Book Finder</h1><p class="bf-sub">Search library materials and check copy availability.</p>' +
      '<div class="bf-demo" role="note"><b>Demo data.</b> ' + esc((D.meta && D.meta.notice) || '') + '</div>' +
      '<form class="bf-search" id="bf-form"><input id="bf-q" type="search" placeholder="Search by title, author, ISBN or keyword..." aria-label="Search books"><select id="bf-by" aria-label="Search in"><option value="all">All fields</option><option value="title">Title</option><option value="author">Author</option><option value="isbn">ISBN</option><option value="keyword">Keyword</option></select><button class="btn">Search</button></form>' +
      '<div class="bf-chips" id="bf-chips"></div>' +
      '<div class="bf-filters"><select id="bf-sub" aria-label="Subcategory"></select><select id="bf-lang" aria-label="Language">' + opt(langs, 'All languages') + '</select><select id="bf-loc" aria-label="Library location">' + opt(locs, 'All locations') + '</select><label class="bf-ck"><input type="checkbox" id="bf-av"> Available now</label><a href="#" id="bf-clear">Clear filters</a></div>' +
      '<p class="bf-count" id="bf-count" aria-live="polite"></p><div id="bf-res"></div></section>';

    var $ = function (s) { return el.querySelector(s); };

    function chips() {
      $('#bf-chips').innerHTML = [{ id: '', name: 'All categories' }].concat(shownCats).map(function (c) {
        var n = c.id ? (count[c.id] || 0) : books.length;
        return '<button type="button" class="bf-chip' + (st.cat === c.id ? ' on' : '') + '" data-c="' + esc(c.id) + '">' + esc(c.name) + ' <small>' + n + '</small></button>';
      }).join('');
    }
    function subs() {
      var c = catIds[st.cat], s = $('#bf-sub');
      s.innerHTML = opt(c ? c.subs : [], c ? 'All subcategories' : 'Choose a category first'); s.disabled = !c || !c.subs.length; s.value = st.sub;
    }
    function match(b) {
      if (st.cat && b.cat !== st.cat) return false;
      if (st.sub && b.sub !== st.sub) return false;
      if (st.lang && b.lang !== st.lang) return false;
      if (st.loc && !b.copies.some(function (c) { return c.loc === st.loc; })) return false;
      if (st.avail && !b.copies.some(function (c) { return c.status === 'available' && (!st.loc || c.loc === st.loc); })) return false;
      var q = norm(st.q); if (!q) return true;
      var f = { title: norm(b.title).indexOf(q) > -1, author: norm(b.author).indexOf(q) > -1, isbn: isbnNorm(b.isbn).indexOf(isbnNorm(q)) > -1 && isbnNorm(q) !== '',
        keyword: norm((b.keywords || []).join(' ') + ' ' + b.sub).indexOf(q) > -1 };
      return st.by === 'all' ? (f.title || f.author || f.isbn || f.keyword) : f[st.by];
    }
    function render() {
      var r = books.filter(match);
      $('#bf-count').textContent = r.length + (r.length === 1 ? ' title found' : ' titles found');
      $('#bf-res').innerHTML = r.map(function (b) {
        var av = b.copies.filter(function (c) { return c.status === 'available'; }).length, tot = b.copies.length;
        return '<article class="bf-card"><div class="bf-ic" aria-hidden="true">&#128214;</div><div class="bf-main"><h3>' + esc(b.title) + ' <span class="bf-tag">DEMO</span></h3>' +
          '<p class="bf-meta">' + esc(b.author) + ' &bull; ' + esc(b.year) + ' &bull; ' + esc(b.lang) + '</p>' +
          '<p class="bf-meta">' + esc(catIds[b.cat].name) + (b.sub ? ' &rsaquo; ' + esc(b.sub) : '') + ' &bull; ISBN ' + esc(b.isbn) + '</p>' +
          '<details><summary>View copies (' + tot + ')</summary><table class="bf-t"><thead><tr><th>Copy</th><th>Location</th><th>Status</th><th>Due date</th></tr></thead><tbody>' +
          b.copies.map(function (c) { return '<tr><td>' + esc(c.id) + '</td><td>' + esc(c.loc) + '</td><td><span class="bf-st ' + c.status + '">' + (c.status === 'available' ? 'Available' : 'Borrowed') + '</span></td><td>' + (c.status === 'available' ? '-' : c.due ? fmt(c.due) : 'Not known') + '</td></tr>'; }).join('') +
          '</tbody></table></details></div><span class="bf-av ' + (av ? 'yes' : 'no') + '">' + (av ? av + ' of ' + tot + ' available' : 'All borrowed') + '</span></article>';
      }).join('') || '<p class="bf-empty">No titles match. Try a different word or clear a filter.</p>';
    }
    function all() { chips(); subs(); render(); }

    $('#bf-form').onsubmit = function (e) { e.preventDefault(); st.q = $('#bf-q').value; st.by = $('#bf-by').value; render(); };
    $('#bf-q').oninput = function () { st.q = this.value; render(); };
    $('#bf-by').onchange = function () { st.by = this.value; render(); };
    $('#bf-chips').onclick = function (e) { var b = e.target.closest('.bf-chip'); if (!b) return; st.cat = b.getAttribute('data-c'); st.sub = ''; all(); };
    $('#bf-sub').onchange = function () { st.sub = this.value; render(); };
    $('#bf-lang').onchange = function () { st.lang = this.value; render(); };
    $('#bf-loc').onchange = function () { st.loc = this.value; render(); };
    $('#bf-av').onchange = function () { st.avail = this.checked; render(); };
    $('#bf-clear').onclick = function (e) { e.preventDefault(); st = { q: '', by: 'all', cat: '', sub: '', lang: '', loc: '', avail: false };
      $('#bf-q').value = ''; $('#bf-by').value = 'all'; $('#bf-lang').value = ''; $('#bf-loc').value = ''; $('#bf-av').checked = false; all(); };
    all();
  }
  window.BookFinder = { mount: mount };
})();
