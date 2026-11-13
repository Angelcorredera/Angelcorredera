const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const B = __dirname;
const OUT = process.argv[2] || path.join(B, 'out');
fs.mkdirSync(OUT, { recursive: true });
const f = (p) => 'file://' + path.join(B, p);
const fsrc = (pkg, file) => f(`node_modules/@fontsource/${pkg}/files/${file}`);

const PHONE = '786-309-0210';
const BROKER = 'Cignos Real Estate, LLC';

const css = `
@font-face{font-family:Mont;font-weight:400;src:url(${fsrc('montserrat','montserrat-latin-400-normal.woff2')})}
@font-face{font-family:Mont;font-weight:600;src:url(${fsrc('montserrat','montserrat-latin-600-normal.woff2')})}
@font-face{font-family:Mont;font-weight:700;src:url(${fsrc('montserrat','montserrat-latin-700-normal.woff2')})}
@font-face{font-family:Mont;font-weight:800;src:url(${fsrc('montserrat','montserrat-latin-800-normal.woff2')})}
@font-face{font-family:Bebas;src:url(${fsrc('bebas-neue','bebas-neue-latin-400-normal.woff2')})}
@font-face{font-family:Play;font-style:italic;font-weight:400;src:url(${fsrc('playfair-display','playfair-display-latin-400-italic.woff2')})}
@font-face{font-family:Play;font-style:italic;font-weight:700;src:url(${fsrc('playfair-display','playfair-display-latin-700-italic.woff2')})}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px;overflow:hidden;background:#0b0b0d;color:#fff;font-family:Mont,sans-serif}
:root{--red:#b3121f;--gold:#d4a84b;--ink:#0b0b0d}
.abs{position:absolute}
.phone{display:inline-flex;align-items:center;gap:16px}
.phone svg{width:38px;height:38px}
`;

const phoneIcon = `<svg viewBox="0 0 24 24" fill="#d4a84b"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>`;

/* ---------- COVER ---------- */
function cover() {
  return `<html><head><style>${css}
  .bg{left:0;top:0;width:1080px;height:900px;background:url(${f('01.jpg')}) 38% 0/auto 900px no-repeat;-webkit-mask-image:linear-gradient(#000 72%,transparent);filter:saturate(1.08)}
  .shade{inset:0;background:linear-gradient(180deg,rgba(11,11,13,.25) 0%,rgba(11,11,13,0) 18%,rgba(11,11,13,.35) 42%,rgba(11,11,13,.92) 62%,#0b0b0d 100%)}
  .angel{right:-40px;bottom:0;height:1000px;filter:drop-shadow(0 0 40px rgba(0,0,0,.6))}
  .tag{left:64px;top:64px;background:var(--red);font-weight:800;letter-spacing:6px;font-size:26px;padding:14px 26px;text-transform:uppercase}
  .loc{left:64px;top:128px;margin-top:10px;font-weight:600;letter-spacing:4px;font-size:22px;text-shadow:0 2px 12px rgba(0,0,0,.7)}
  .title{left:56px;top:560px;font-family:Bebas;line-height:.82;font-size:250px;letter-spacing:4px;text-shadow:0 8px 40px rgba(0,0,0,.6)}
  .title .r{color:var(--gold)}
  .bar{left:64px;top:1010px;width:120px;height:6px;background:var(--red)}
  .specs{left:64px;top:950px;font-weight:700;font-size:26px;letter-spacing:3px;color:#e9e9ec}
  .name{left:64px;top:1046px;font-weight:800;font-size:56px;letter-spacing:2px;text-transform:uppercase}
  .sub{left:64px;top:1116px;font-family:Play;font-style:italic;font-size:42px;color:var(--gold)}
  .ph{left:64px;top:1196px;font-weight:700;font-size:46px;letter-spacing:2px}
  .brk{left:64px;bottom:34px;font-size:18px;letter-spacing:3px;color:#9a9aa3;text-transform:uppercase}
  </style></head><body>
  <div class="abs bg"></div><div class="abs shade"></div>
  <div class="abs tag">Miami · FL 33176</div>
  <img class="abs angel" src="${f('angel.png')}">
  <div class="abs title">JUST<br><span class="r">RENTED</span></div>
  <div class="abs specs">3 HAB &nbsp;·&nbsp; 2 BAÑOS &nbsp;·&nbsp; CASA REMODELADA</div>
  <div class="abs bar"></div>
  <div class="abs name">Angel Corredera</div>
  <div class="abs sub">El Realtor de tu Familia</div>
  <div class="abs ph"><span class="phone">${phoneIcon}${PHONE}</span></div>
  <div class="abs brk">${BROKER}</div>
  </body></html>`;
}

/* ---------- PHOTO SLIDE ---------- */
function photo(file, label, n, total) {
  return `<html><head><style>${css}
  .top{left:64px;top:92px}
  .k{font-weight:700;letter-spacing:6px;font-size:22px;color:var(--gold)}
  .lbl{font-family:Bebas;font-size:96px;letter-spacing:3px;line-height:1;margin-top:10px}
  .num{right:64px;top:100px;font-weight:600;font-size:22px;letter-spacing:4px;color:#8d8d96}
  .ph{left:0;top:320px;width:1080px;height:720px;background:url(${f(file)}) center/cover}
  .rule{left:64px;top:1020px;width:100%;height:6px;background:var(--red);width:120px}
  .foot{left:64px;right:64px;bottom:96px;display:flex;justify-content:space-between;align-items:flex-end}
  .nm{font-weight:800;font-size:34px;letter-spacing:2px;text-transform:uppercase}
  .sb{font-family:Play;font-style:italic;font-size:28px;color:var(--gold);margin-top:6px}
  .pn{font-weight:700;font-size:34px;letter-spacing:1px}
  .pn svg{width:30px;height:30px}
  .badge{left:64px;top:1060px;font-size:18px;letter-spacing:3px;color:#9a9aa3;display:none}
  </style></head><body>
  <div class="abs top"><div class="k">JUST RENTED · MIAMI</div><div class="lbl">${label}</div></div>
  <div class="abs num">${String(n).padStart(2,'0')} / ${String(total).padStart(2,'0')}</div>
  <div class="abs ph"></div>
  <div class="abs foot">
    <div><div class="nm">Angel Corredera</div><div class="sb">El Realtor de tu Familia</div></div>
    <div class="pn"><span class="phone">${phoneIcon}${PHONE}</span></div>
  </div>
  </body></html>`;
}

/* ---------- CLOSING ---------- */
function closing(n, total) {
  return `<html><head><style>${css}
  .glow{left:380px;top:200px;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(179,18,31,.38),rgba(179,18,31,0) 65%)}
  .angel{right:-60px;bottom:0;height:1080px}
  .fade{left:0;right:0;bottom:0;height:420px;background:linear-gradient(180deg,rgba(11,11,13,0),rgba(11,11,13,.85) 75%)}
  .num{right:64px;top:100px;font-weight:600;font-size:22px;letter-spacing:4px;color:#8d8d96}
  .q{left:64px;top:120px;width:620px}
  .k{font-weight:700;letter-spacing:6px;font-size:22px;color:var(--gold)}
  .h{font-family:Bebas;font-size:120px;line-height:.92;letter-spacing:2px;margin-top:18px}
  .h span{color:var(--gold)}
  .p{font-size:28px;line-height:1.45;color:#d6d6db;margin-top:28px;width:520px}
  .bar{left:64px;top:1000px;width:120px;height:6px;background:var(--red)}
  .name{left:64px;top:1036px;font-weight:800;font-size:56px;letter-spacing:2px;text-transform:uppercase}
  .sub{left:64px;top:1106px;font-family:Play;font-style:italic;font-size:42px;color:var(--gold)}
  .ph{left:64px;top:1186px;font-weight:700;font-size:46px;letter-spacing:2px}
  .brk{left:64px;bottom:34px;font-size:18px;letter-spacing:3px;color:#9a9aa3;text-transform:uppercase}
  </style></head><body>
  <div class="abs glow"></div>
  <img class="abs angel" src="${f('angel.png')}">
  <div class="abs fade"></div>
  <div class="abs num">${String(n).padStart(2,'0')} / ${String(total).padStart(2,'0')}</div>
  <div class="abs q">
    <div class="k">¿TE GUSTÓ ESTA CASA?</div>
    <div class="h">¿Buscas<br>casa para<br><span>rentar o<br>comprar?</span></div>
    <div class="p">Te ayudo a encontrar el hogar ideal para tu familia.</div>
  </div>
  <div class="abs bar"></div>
  <div class="abs name">Angel Corredera</div>
  <div class="abs sub">El Realtor de tu Familia</div>
  <div class="abs ph"><span class="phone">${phoneIcon}${PHONE}</span></div>
  <div class="abs brk">${BROKER}</div>
  </body></html>`;
}

const photos = [
  ['02.jpg', 'Casa en esquina'],
  ['28.jpg', 'Lote de 9,000 sqft'],
  ['03.jpg', 'Totalmente remodelada'],
  ['04.jpg', 'Cocina nueva'],
  ['05.jpg', 'Acero inoxidable'],
  ['07.jpg', 'Cocina moderna'],
  ['08.jpg', 'Acabados de lujo'],
  ['11.jpg', 'Sala amplia'],
  ['12.jpg', 'Espacios abiertos'],
  ['19.jpg', 'Habitación principal'],
  ['22.jpg', '3 habitaciones'],
  ['20.jpg', 'Baño remodelado'],
  ['26.jpg', '2 baños completos'],
  ['13.jpg', 'Lavandería'],
  ['14.jpg', 'Mucho parqueo'],
  ['16.jpg', 'Patio cercado'],
  ['17.jpg', 'Espacio para la familia'],
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  const total = photos.length + 2;
  const slides = [['cover', cover()]];
  photos.forEach(([file, label], i) => slides.push([`photo-${file}`, photo(file, label, i + 2, total)]));
  slides.push(['closing', closing(total, total)]);
  for (let i = 0; i < slides.length; i++) {
    const tmp = path.join(B, `_slide.html`);
    fs.writeFileSync(tmp, slides[i][1]);
    await page.goto('file://' + tmp);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    const name = `${String(i + 1).padStart(2, '0')}-${slides[i][0].replace('.jpg', '')}.jpg`;
    await page.screenshot({ path: path.join(OUT, name), type: 'jpeg', quality: 95 });
    console.log(name);
  }
  await browser.close();
})();
