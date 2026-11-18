(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const floors = {
    ground: {
      name:'Ground Floor', subtitle:'Group discussion area',
      description:'Collaborative study floor with shared tables and round discussion seating.',
      sections:[
        {id:'g-a',name:'Central Group Row A',type:'Long shared discussion table',total:24,available:18,layout:'long'},
        {id:'g-b',name:'Central Group Row B',type:'Long shared discussion table',total:20,available:13,layout:'long'},
        {id:'g-c',name:'Central Group Row C',type:'Long shared discussion table',total:20,available:15,layout:'long'},
        {id:'g-d',name:'Round Discussion Tables',type:'Round group tables',total:16,available:9,layout:'round'},
        {id:'g-e',name:'Side Collaboration Area',type:'Small group tables',total:12,available:7,layout:'small'},
        {id:'g-f',name:'Corner Discussion Area',type:'Shared seating area',total:8,available:5,layout:'small'}
      ]
    },
    middle: {
      name:'Middle Floor', subtitle:'Individual laptop study · classroom-style layout',
      description:'A computer-lab-style study floor with individual desks for students using their own laptops.',
      sections:[
        {id:'m-a',name:'Laptop Row A',type:'Individual laptop desks',total:18,available:12,layout:'class'},
        {id:'m-b',name:'Laptop Row B',type:'Individual laptop desks',total:18,available:10,layout:'class'},
        {id:'m-c',name:'Laptop Row C',type:'Individual laptop desks',total:18,available:14,layout:'class'},
        {id:'m-d',name:'Laptop Row D',type:'Individual laptop desks',total:18,available:8,layout:'class'},
        {id:'m-e',name:'Partitioned Desks',type:'Individual separated study desks',total:12,available:7,layout:'partition'},
        {id:'m-f',name:'Side Individual Desks',type:'Individual laptop desks',total:10,available:6,layout:'partition'}
      ]
    },
    top: {
      name:'Top Floor', subtitle:'Library books · quiet reading area',
      description:'A quiet library floor with book shelves, reading tables and individual reading spaces.',
      sections:[
        {id:'t-a',name:'Reading Table Row A',type:'Individual reading seats',total:16,available:11,layout:'reading'},
        {id:'t-b',name:'Reading Table Row B',type:'Individual reading seats',total:16,available:12,layout:'reading'},
        {id:'t-c',name:'Reading Table Row C',type:'Individual reading seats',total:12,available:8,layout:'reading'},
        {id:'t-d',name:'Quiet Reading Carrels',type:'Individual quiet study spaces',total:12,available:9,layout:'carrel'},
        {id:'t-e',name:'Window Reading Area',type:'Individual reading seats',total:8,available:5,layout:'small'},
        {id:'t-f',name:'Bookshelf Area',type:'Library book shelves',total:0,available:0,layout:'shelf'}
      ]
    }
  };
  let floor='ground';
  const app=document.createElement('main'); app.className='sv-main';
  app.innerHTML=`
    <div class="sv-head"><div><span class="tag">LIBRARY FEATURE</span><h1 class="sv-title">Library – Seat Viewer</h1><p class="s">Explore each floor's study layout and check seat availability before you visit.</p></div><a class="btn out" href="details.html?id=central">← Back to Library</a></div>
    <div class="sv-floors" role="tablist" aria-label="Choose floor">
      <button class="sv-floor active" data-floor="ground">Ground Floor</button><button class="sv-floor" data-floor="middle">Middle Floor</button><button class="sv-floor" data-floor="top">Top Floor</button>
    </div>
    <div class="sv-legend"><span><i class="sv-dot available"></i>Available</span><span><i class="sv-dot occupied"></i>Occupied</span><span><i class="sv-dot unavailable"></i>Unavailable</span><span class="sv-demo">Illustrative demo availability</span></div>
    <div class="sv-layout">
      <section class="sv-map-card"><div class="sv-map-top"><div><h2 id="map-title">Ground Floor</h2><small id="map-subtitle">Group discussion area</small></div><div class="sv-zoom"><button id="zoom-out" aria-label="Zoom out">−</button><span id="zoom-label">100%</span><button id="zoom-in" aria-label="Zoom in">+</button></div></div><div class="sv-map" id="map"><div class="sv-map-inner" id="map-inner"></div></div></section>
      <aside class="sv-info"><span class="tag">SELECTED AREA</span><h2 id="info-name">Choose a seating area</h2><p id="info-type">Select a table or section on the floor map to see its details.</p><div class="sv-stat"><div><b id="available">—</b><small>Available</small></div><div><b id="total">—</b><small>Total seats</small></div></div><div class="sv-status" id="info-status">Select a section to inspect availability.</div><p id="info-note">Seat availability is sample data for this prototype, not live library occupancy.</p><a class="btn w" id="book-link" href="booking.html?id=central">Continue to booking</a><div class="sv-tip">Choose a floor and select any table or study area to view its details.</div></aside>
    </div>
    <div class="sv-footer-tip"><b>Tip:</b> Choose a floor and click a seating area to check its availability before arriving.</div>`;
  document.body.appendChild(app);
  const map=$('#map'), inner=$('#map-inner');
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function seatDots(sec,count=8){
    if(!sec.total)return '<span class="sv-shelf-label">BOOK COLLECTION</span>';
    const occ=sec.total-sec.available;
    return Array.from({length:count},(_,i)=>`<i class="sv-seat-dot ${i<Math.round(sec.available/sec.total*count)?'available':i<Math.round(sec.available/sec.total*count)+Math.ceil(occ/sec.total*count*.65)?'occupied':'unavailable'}"></i>`).join('');
  }
  function card(sec, extra=''){
    return `<button class="sv-section ${extra}" data-id="${sec.id}"><span class="sv-sec-name">${esc(sec.name)}</span><span class="sv-sec-type">${esc(sec.type)}</span><span class="sv-mini-seats">${seatDots(sec)}</span></button>`;
  }
  function renderMap(){
    const d=floors[floor]; $('#map-title').textContent=d.name; $('#map-subtitle').textContent=d.subtitle;
    $$('.sv-floor').forEach(b=>b.classList.toggle('active',b.dataset.floor===floor));
    let html='';
    if(floor==='ground'){
      html=`<div class="sv-architect"><div class="sv-room-label">ENTRANCE / MAIN WALKWAY</div>
        <div class="sv-ground-layout">
          <div class="sv-side-stack"><div class="sv-map-zone"><b>GROUP AREA A</b>${card(d.sections[4])}${card(d.sections[5])}</div><div class="sv-round-zone"><b>ROUND TABLES</b>${card(d.sections[3],'round-card')}</div></div>
          <div class="sv-centre-stack"><div class="sv-map-zone central"><b>SHARED DISCUSSION TABLES</b>${d.sections.slice(0,3).map((s,i)=>card(s,'long-card row-'+i)).join('')}</div><div class="sv-walkway">CENTRAL WALKWAY</div></div>
          <div class="sv-side-stack right"><div class="sv-map-zone"><b>GROUP AREA B</b>${card(d.sections[5])}${card(d.sections[4])}</div><div class="sv-round-zone"><b>COLLABORATION</b>${card(d.sections[3],'round-card')}</div></div>
        </div><div class="sv-room-label">OPEN DISCUSSION & COLLABORATIVE STUDY</div></div>`;
    } else if(floor==='middle'){
      html=`<div class="sv-architect"><div class="sv-room-label">ENTRANCE</div><div class="sv-class-layout">
        <div class="sv-front">FRONT / DISPLAY AREA</div>
        <div class="sv-classroom"><div class="sv-aisle-label">MAIN AISLE</div><div class="sv-class-rows">${d.sections.slice(0,4).map((s,i)=>`<div class="sv-desk-row"><span class="sv-row-label">ROW ${String.fromCharCode(65+i)}</span>${card(s,'class-card')}</div>`).join('')}</div></div>
        <div class="sv-partition-zone"><b>INDIVIDUAL PARTITIONED STUDY</b>${card(d.sections[4],'partition-card')}${card(d.sections[5],'partition-card')}</div>
      </div><div class="sv-room-label">CLASSROOM-STYLE LAPTOP STUDY · INDIVIDUAL DESKS</div></div>`;
    } else {
      html=`<div class="sv-architect"><div class="sv-room-label">ENTRANCE / QUIET LIBRARY</div><div class="sv-library-layout">
        <aside class="sv-shelves"><b>BOOKSHELVES</b>${[1,2,3,4,5].map(n=>`<div class="sv-book-shelf">BOOKS ${n}</div>`).join('')}${card(d.sections[5],'shelf-card')}</aside>
        <div class="sv-reading-main"><div class="sv-reading-label">QUIET READING TABLES</div>${d.sections.slice(0,3).map((s,i)=>`<div class="sv-reading-row"><span>READING ROW ${String.fromCharCode(65+i)}</span>${card(s,'reading-card')}</div>`).join('')}<div class="sv-carrels"><b>INDIVIDUAL QUIET READING</b>${card(d.sections[3],'carrel-card')}${card(d.sections[4],'carrel-card')}</div></div>
        <aside class="sv-shelves right-shelf"><b>REFERENCE BOOKS</b>${[6,7,8,9].map(n=>`<div class="sv-book-shelf">SHELF ${n}</div>`).join('')}</aside>
      </div><div class="sv-room-label">QUIET READING & BOOK COLLECTION AREA</div></div>`;
    }
    inner.innerHTML=html;
    $$('.sv-section',inner).forEach(b=>b.addEventListener('click',()=>select(b.dataset.id)));
    $('#info-name').textContent='Choose a seating area'; $('#info-type').textContent='Select a table or section on the floor map to see its details.';
    $('#available').textContent='—'; $('#total').textContent='—'; $('#info-status').textContent='Select a section to inspect availability.';
    $('#info-note').textContent=d.description+' Availability shown is illustrative demo data.'; $('#book-link').style.display='none';
  }
  function select(id){
    const sec=floors[floor].sections.find(s=>s.id===id); if(!sec)return;
    $$('.sv-section',inner).forEach(b=>b.classList.toggle('active',b.dataset.id===id));
    $('#info-name').textContent=sec.name; $('#info-type').textContent=sec.type;
    $('#available').textContent=sec.available; $('#total').textContent=sec.total||'—';
    $('#info-status').textContent=sec.total?`${sec.available} of ${sec.total} seats shown available in this demo.`:'Book collection area · seating availability not applicable.';
    $('#info-note').textContent='This is sample availability for the prototype, not a live connection to library occupancy.';
    $('#book-link').style.display=sec.total?'block':'none';
  }
  $$('.sv-floor').forEach(b=>b.addEventListener('click',()=>{floor=b.dataset.floor;renderMap()}));
  let scale=1;
  function setZoom(){inner.style.transform=`scale(${scale})`;$('#zoom-label').textContent=Math.round(scale*100)+'%'}
  $('#zoom-in').onclick=()=>{scale=Math.min(1.3,scale+.1);setZoom()};
  $('#zoom-out').onclick=()=>{scale=Math.max(.8,scale-.1);setZoom()};
  renderMap();
})();
