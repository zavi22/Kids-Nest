/**
 * cartBurst.js: "Add to cart" celebration for Kids Nest.
 * Stars and hearts burst out of the button, then fly into the cart icon.
 *
 * Works with: React / Vite / Next (npm i three) or plain HTML / WordPress
 * (load three from a CDN first; this file then uses window.THREE).
 */
const COLORS = [0xc46a3e, 0xe8b53c, 0xf2e6c9, 0x7fb2d6, 0x6b7a3a, 0xe99aa5]; // brand palette
const EXPLODE = 0.4; // seconds spent bursting outward
const FLY = 0.7;     // seconds spent flying to the cart

let ctx = null, raf = 0, last = 0, idleTimer = 0;
const parts = [];
const bursts = new Set();

const getThree = () => (window.THREE ? Promise.resolve(window.THREE) : import('three'));
const $ = (x) => (typeof x === 'string' ? document.querySelector(x) : x);

function starShape(T, R, r) {
  const s = new T.Shape();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 + Math.PI / 2, k = i % 2 ? r : R;
    const x = Math.cos(a) * k, y = Math.sin(a) * k;
    i ? s.lineTo(x, y) : s.moveTo(x, y);
  }
  s.closePath();
  return s;
}

function heartShape(T) {
  const s = new T.Shape();
  s.moveTo(0, -1);
  s.bezierCurveTo(-0.3, -0.6, -1.2, -0.1, -1.2, 0.5);
  s.bezierCurveTo(-1.2, 1.1, -0.4, 1.4, 0, 0.8);
  s.bezierCurveTo(0.4, 1.4, 1.2, 1.1, 1.2, 0.5);
  s.bezierCurveTo(1.2, -0.1, 0.3, -0.6, 0, -1);
  return s;
}

function extrude(T, shape, depth) {
  const g = new T.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelSize: depth * 0.4,
    bevelThickness: depth * 0.4, bevelSegments: 2, curveSegments: 10,
  });
  g.center();
  return g;
}

function createCtx(T) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed', left: '0', top: '0', width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '2147483000',
  });
  document.body.appendChild(canvas);

  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); // keep phones fast
  const scene = new T.Scene();
  const cam = new T.OrthographicCamera(0, 1, 1, 0, -500, 500); // 1 unit = 1 CSS pixel
  cam.position.z = 100;

  const geos = [extrude(T, starShape(T, 1, 0.48), 0.35), extrude(T, heartShape(T), 0.4)];
  const mats = COLORS.map((c) => new T.MeshBasicMaterial({ color: c }));

  const c = { T, canvas, renderer, scene, cam, geos, mats, h: 1 };
  c.resize = () => {
    const r = canvas.getBoundingClientRect();
    c.h = r.height;
    renderer.setSize(r.width, r.height, false);
    cam.right = r.width;
    cam.top = r.height;
    cam.updateProjectionMatrix();
  };
  c.destroy = () => {
    removeEventListener('resize', c.resize);
    geos.forEach((g) => g.dispose());
    mats.forEach((m) => m.dispose());
    renderer.dispose();
    canvas.remove();
  };
  addEventListener('resize', c.resize);
  c.resize();
  return c;
}

// centre of an element in scene coordinates (y is flipped: scene y goes up)
function centre(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: ctx.h - (r.top + r.height / 2) };
}

function tick(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  bursts.forEach((b) => (b.target = centre(b.toEl))); // follow the cart if the page scrolls

  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i], m = p.mesh;
    p.age += dt;
    if (p.age < EXPLODE) {
      m.position.x += p.vx * dt;
      m.position.y += p.vy * dt;
      p.vx *= 0.93; p.vy *= 0.93;
      p.sx = m.position.x; p.sy = m.position.y;
    } else {
      const k = Math.min(1, (p.age - EXPLODE) / FLY), e = k * k * (3 - 2 * k);
      const t = p.burst.target;
      m.position.x = p.sx + (t.x - p.sx) * e;
      m.position.y = p.sy + (t.y - p.sy) * e + Math.sin(e * Math.PI) * 60; // little arc
      m.scale.multiplyScalar(0.985);
      if (k >= 1) {
        const b = p.burst;
        if (!b.fired) { b.fired = true; b.onArrive && b.onArrive(); }
        if (--b.left === 0) bursts.delete(b);
        ctx.scene.remove(m);
        parts.splice(i, 1);
        continue;
      }
    }
    m.rotation.z += p.spin * dt;
    m.rotation.y += p.spin * dt * 0.5;
  }

  ctx.renderer.render(ctx.scene, ctx.cam);
  if (parts.length) {
    raf = requestAnimationFrame(tick);
  } else {
    raf = 0;
    idleTimer = setTimeout(() => { ctx && ctx.destroy(); ctx = null; }, 5000); // free the GPU context
  }
}

/**
 * Fire the celebration.
 * @param from  button element or CSS selector the burst starts from
 * @param to    cart icon element or CSS selector, e.g. '[data-cart-icon]'
 * @param opts  { count = 34, onArrive }  onArrive runs when the first piece lands
 */
export async function cartBurst(from, to, { count = 34, onArrive } = {}) {
  const fromEl = $(from), toEl = $(to);
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fromEl || !toEl || reduce) { onArrive && onArrive(); return; }

  try {
    const T = await getThree();
    ctx = ctx || createCtx(T);
  } catch (e) { // no WebGL or three failed to load: skip the effect, never break checkout
    onArrive && onArrive();
    return;
  }
  clearTimeout(idleTimer);
  ctx.resize();

  const o = centre(fromEl);
  const burst = { toEl, left: count, fired: false, onArrive, target: centre(toEl) };
  bursts.add(burst);

  for (let i = 0; i < count; i++) {
    const mesh = new ctx.T.Mesh(ctx.geos[i % 2], ctx.mats[i % COLORS.length]);
    mesh.scale.setScalar(7 + Math.random() * 7);
    mesh.position.set(o.x, o.y, 0);
    ctx.scene.add(mesh);
    const a = Math.random() * Math.PI * 2, sp = 150 + Math.random() * 320;
    parts.push({
      mesh, burst, age: 0, sx: o.x, sy: o.y,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp + 120,
      spin: (Math.random() - 0.5) * 10,
    });
  }
  if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
}

/** Little pop on the cart icon. Call it from onArrive. */
export function bump(el) {
  el = $(el);
  el && el.animate && el.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }],
    { duration: 320, easing: 'ease-out' }
  );
}