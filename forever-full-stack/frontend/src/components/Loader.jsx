import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import '@fontsource/baloo-2/800.css'


// Timeline (seconds)
const T_R = 2.8             // kid starts rising from behind the text
const RISE = 3.0
const FALL = 0.3           // hop down onto the hanger
const T_LD = T_R + RISE + FALL
const T_END = T_LD + 1.3    // loader fades out here
const TEXT_TOP = 0.73       // top edge of the big letters (kid is clipped below this until he is fully up)

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a, b, t) => a + (b - a) * t
const eo3 = (t) => 1 - Math.pow(1 - t, 3)
const oBack = (t) => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2) }

const makeTex = (canvas) => {
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

// Layered "extruded" sprite: dark back layers + front face
function stack(front, back, w, h, n, gap, sc = 1) {
  const g = new THREE.Group()
  const mats = []
  const geo = new THREE.PlaneGeometry(w, h)
  for (let i = n; i >= 0; i--) {
    const m = new THREE.MeshBasicMaterial({ map: i ? back : front, transparent: true, alphaTest: 0.05, opacity: 0 })
    const p = new THREE.Mesh(geo, m)
    p.position.z = -i * gap
    if (i) p.scale.setScalar(sc)
    g.add(p)
    mats.push(m)
  }
  g.userData.m = mats
  return g
}
const setOp = (g, o) => g.userData.m.forEach((m) => (m.opacity = o))

function glyph(ch, cols, o = {}) {
  const F = '800 200px "Baloo 2", sans-serif'
  const lw = o.lw ?? 26, pad = o.pad ?? 44
  const mk = (front) => {
    const c = document.createElement('canvas')
    const x = c.getContext('2d')
    x.font = F
    const w = Math.ceil(x.measureText(ch).width) + pad
    c.width = w
    c.height = 256
    x.font = F
    x.textAlign = 'center'
    x.lineJoin = 'round'
    x.lineWidth = lw
    if (lw) { x.strokeStyle = front ? '#6b3a26' : '#4a2618'; x.strokeText(ch, w / 2, 190) }
    if (front) {
      const g = x.createLinearGradient(0, 50, 0, 200)
      g.addColorStop(0, cols[0])
      g.addColorStop(1, cols[1])
      x.fillStyle = g
    } else x.fillStyle = '#4a2618'
    x.fillText(ch, w / 2, 190)
    return { t: makeTex(c), w: w / 128 }
  }
  const f = mk(true)
  const b = mk(false)
  return { ft: f.t, bt: b.t, w: f.w }
}

// rounded panel (parchment banner / dark pill) with a dark back layer for depth
function panel(w, h, fill, stroke, stitch) {
  const P = 128, W = Math.round(w * P), H = Math.round(h * P), r = H * 0.4
  const mk = (front) => {
    const c = document.createElement('canvas')
    c.width = W; c.height = H
    const x = c.getContext('2d')
    const rr = (i) => { x.beginPath(); x.roundRect(i, i, W - 2 * i, H - 2 * i, Math.max(2, r - i)) }
    rr(3); x.fillStyle = front ? fill : '#3a1d10'; x.fill()
    if (front) {
      x.lineWidth = 6; x.strokeStyle = stroke; x.stroke()
      if (stitch) { rr(14); x.setLineDash([14, 10]); x.lineWidth = 3; x.strokeStyle = stitch; x.stroke() }
    }
    return makeTex(c)
  }
  return stack(mk(true), mk(false), w, h, 3, 0.03, 1)
}

function heartTex() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const x = c.getContext('2d')
  x.fillStyle = '#f4d9a8'
  x.beginPath()
  x.moveTo(32, 54); x.bezierCurveTo(2, 34, 8, 8, 32, 22); x.bezierCurveTo(56, 8, 62, 34, 32, 54)
  x.fill()
  return makeTex(c)
}

function starTex(col) {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const x = c.getContext('2d')
  x.fillStyle = col
  x.beginPath()
  for (let i = 0; i < 8; i++) {
    const r = i % 2 ? 7 : 30
    const a = (i * Math.PI) / 4 - Math.PI / 2
    x.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r)
  }
  x.fill()
  return makeTex(c)
}

const Loader = ({ onDone }) => {
  const wrapRef = useRef(null)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    const wrap = wrapRef.current
    let cancelled = false
    let raf = 0
    let fadeTimer = 0
    let renderer, scene, cam, root
    const cleanups = []

    const kidH = 2.6, barY = 0.8, restX = 0.35
    const restY = barY + 0.15 // hip height when seated on the bar
    let letters = [], kid, hanger, burst, total = 0, leftX = 0
    const twinkles = []
    const ptr = { x: 0, y: 0 }

    const clip = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1000)
    let released = false
    const pop = [] // extra animated pieces: { obj, t0, kind }

    // a line of letters that pop in one by one, centred at (0, y)
    const addLine = (text, y, targetW, maxS, cols, o, t0, step, offY) => {
      const gs = [...text].map((ch) => (ch === ' ' ? { sp: true, w: 0.5 } : { ...glyph(ch, cols, o), ch }))
      const raw = gs.reduce((n, g) => n + g.w - (o.ov ?? 0), 0)
      const sc = Math.min(maxS, targetW / raw)
      let x = -raw * sc / 2
      gs.forEach((g, i) => {
        const adv = (g.w - (o.ov ?? 0)) * sc
        if (!g.sp) {
          const s = stack(g.ft, g.bt, g.w, 2, o.n ?? 1, 0.03 / sc, 1)
          const w = new THREE.Group()
          w.add(s)
          w.position.set(x + (g.w * sc) / 2, y, 0.02)
          w.scale.setScalar(sc)
          root.add(w)
          letters.push({ wrap: w, s, t0: t0 + i * step, sc, y, offY })
        }
        x += adv
      })
      return raw * sc
    }

    const build = () => {
      // big "Kids Nest": orange + cream, 3D layered letters
      const word = [...'Kids Nest']
      let tw = 0
      const gl = word.map((ch, i) => (ch === ' ' ? null : glyph(ch, i > 4 ? ['#fff6e0', '#f0d7a8'] : ['#ffb84d', '#ef7d1a'])))
      gl.forEach((g) => (tw += g ? g.w - 0.16 : 0.45))
      let x = -tw / 2
      gl.forEach((g, i) => {
        if (!g) { x += 0.45; return }
        const s = stack(g.ft, g.bt, g.w, 2, 9, 0.045, 1)
        const w = new THREE.Group()
        w.add(s)
        w.position.set(x + g.w / 2, 0, 0)
        x += g.w - 0.16
        root.add(w)
        letters.push({ wrap: w, s, t0: 0.3 + i * 0.17, sc: 1, y: 0, offY: 1.2 })
      })
      total = tw

      // parchment banner + tagline
      const banner = panel(total - 0.5, 0.95, '#f6e6c5', '#6b3a26', '#b98a5e')
      banner.position.set(0, -1.45, -0.1)
      root.add(banner)
      pop.push({ obj: banner, t0: 1.7, kind: 'panel' })
      addLine('Where little dreams take flight', -1.4, (total - 0.5) * 0.82, 0.3, ['#7a4a32', '#6b3a26'], { lw: 0, pad: 14, n: 1 }, 2.0, 0.04, 0.5)

      // dark pill + "BABY & KIDS CLOTHING"
      const pill = panel(4.3, 0.46, '#5a3322', '#3a1d10', null)
      pill.position.set(0, -2.12, -0.1)
      root.add(pill)
      pop.push({ obj: pill, t0: 2.6, kind: 'panel' })
      addLine('BABY & KIDS CLOTHING', -2.08, 3.0, 0.2, ['#fff1d6', '#f0d7a8'], { lw: 0, pad: 16, n: 1 }, 2.8, 0.04, 0.3)
      const ht = heartTex()
      ;[-1.85, 1.85].forEach((hx) => {
        const h = new THREE.Sprite(new THREE.SpriteMaterial({ map: ht, transparent: true, opacity: 0 }))
        h.position.set(hx, -2.12, 0.05)
        root.add(h)
        pop.push({ obj: h, t0: 3.0, kind: 'heart' })
      })

      // ---- 3D kid built from primitives (hair, hoodie, pants, sneakers, wink, crown) ----
      const M = (c, r = 0.65) => new THREE.MeshStandardMaterial({ color: c, roughness: r, clippingPlanes: [clip] })
      const skin = M(0xf3c393), hair = M(0x7b3f1d, 0.8), hood = M(0xd2691e), pants = M(0xf1e2c4)
      const shoeM = M(0x8a4a24), sole = M(0xfff3dc), dark = M(0x2a140b, 0.4), gold = M(0xf0a830, 0.4), pink = M(0xf0a07a), mouthM = M(0x7a2a1a)
      const kidG = new THREE.Group()
      const mk = (geo, mat, x, y, z, p = kidG, sc) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); if (sc) m.scale.set(...sc); p.add(m); return m }
      const SP = (r) => new THREE.SphereGeometry(r, 20, 16)
      const CAP = (r, l) => new THREE.CapsuleGeometry(r, l, 6, 16)
      mk(CAP(0.42, 0.42), hood, 0, 0.62, 0)                                   // torso
      mk(new THREE.TorusGeometry(0.36, 0.13, 10, 24), hood, 0, 1.0, 0.05).rotation.x = Math.PI / 2 // collar
      mk(SP(0.4), pants, 0, 0.1, 0, kidG, [1, 0.6, 1])                         // hips
      const head = new THREE.Group()
      head.position.y = 1.35
      kidG.add(head)
      mk(SP(0.6), skin, 0, 0, 0, head)
      ;[-1, 1].forEach((s2) => {
        mk(SP(0.12), skin, s2 * 0.6, 0, 0, head)                              // ears
        mk(SP(0.1), pink, s2 * 0.38, -0.12, 0.46, head, [1, 0.7, 0.5])        // cheeks
      })
      mk(SP(0.08), dark, -0.22, 0.05, 0.54, head, [1, 1.2, 0.6])               // open eye
      mk(new THREE.TorusGeometry(0.1, 0.028, 8, 16, Math.PI), dark, 0.22, 0.04, 0.56, head)  // winking eye ^
      mk(new THREE.CircleGeometry(0.15, 16, Math.PI, Math.PI), mouthM, 0, -0.2, 0.575, head)  // open smile
      const cap = mk(new THREE.SphereGeometry(0.65, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.56), hair, 0, 0.03, -0.02, head)
      cap.rotation.x = -0.5
      for (let i = 0; i < 12; i++) {                                           // curly tufts
        const a = (i / 12) * Math.PI * 2, front = Math.cos(a) > 0.4
        mk(SP(0.17 + (i % 3) * 0.03), hair, Math.sin(a) * 0.6, front ? 0.5 + (i % 2) * 0.1 : 0.2 + (i % 3) * 0.15, Math.cos(a) * 0.5 - 0.05, head)
      }
      const cp = new THREE.CurvePath()
      const cpts = [[-0.3, 0], [-0.34, 0.34], [-0.15, 0.16], [0, 0.4], [0.15, 0.16], [0.34, 0.34], [0.3, 0], [-0.3, 0]].map((p) => new THREE.Vector3(p[0], p[1], 0))
      for (let i = 0; i < cpts.length - 1; i++) cp.add(new THREE.LineCurve3(cpts[i], cpts[i + 1]))
      const crown = mk(new THREE.TubeGeometry(cp, 64, 0.03, 6, false), gold, 0, 0.98, 0, head)
      crown.rotation.z = 0.08
      const arms = [], legs = []
      ;[-1, 1].forEach((s2) => {
        const arm = new THREE.Group()
        arm.position.set(s2 * 0.45, 0.85, 0)
        mk(CAP(0.14, 0.34), hood, 0, -0.3, 0, arm)
        mk(SP(0.15), skin, 0, -0.68, 0, arm)
        kidG.add(arm); arms.push(arm)
        const leg = new THREE.Group()
        leg.position.set(s2 * 0.2, 0.1, 0)
        mk(CAP(0.17, 0.4), pants, 0, -0.35, 0, leg)
        mk(SP(0.22), shoeM, 0, -0.8, 0.1, leg, [1, 0.75, 1.5])
        mk(SP(0.22), sole, 0, -0.95, 0.1, leg, [1.02, 0.25, 1.52])
        kidG.add(leg); legs.push(leg)
      })
      kidG.userData = { arms, legs, head }
      kid = kidG
      root.add(kid)

      // hanger (3D tubes)
      hanger = new THREE.Group()
      const mat = new THREE.MeshStandardMaterial({ color: 0x7a4a32, roughness: 0.5 })
      const tube = (pts, r = 0.08) =>
        hanger.add(new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, 'centripetal'), 48, r, 10, false),
          mat
        ))
      tube([[-2.1, 0, 0], [-1.05, 0.45, 0], [0, 0.9, 0]])
      tube([[2.1, 0, 0], [1.05, 0.45, 0], [0, 0.9, 0]])
      tube([[-2.1, 0, 0], [0, 0, 0], [2.1, 0, 0]])
      tube([[0, 0.9, 0], [0, 1.15, 0], [0.3, 1.5, 0], [0.15, 1.85, 0], [-0.25, 1.85, 0], [-0.35, 1.55, 0]])
      hanger.position.set(restX + 0.2, barY, -0.35)
      hanger.visible = false
      root.add(hanger)

      // sparkles
      const st = starTex('#ffc94d')
      for (let i = 0; i < 5; i++) {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: st, transparent: true, opacity: 0 }))
        s.userData = { a: i * 1.3, x: restX + (i % 2 ? 1.6 : -1.6) + Math.sin(i) * 0.4, y: restY + 0.6 + i * 0.28 }
        s.position.z = 0.6
        root.add(s)
        twinkles.push(s)
      }
      const N = 36
      const pos = new Float32Array(N * 3)
      const vel = []
      for (let i = 0; i < N; i++) {
        const a = Math.random() * 6.28, sp = 1.5 + Math.random() * 2.5
        vel.push([Math.cos(a) * sp, Math.abs(Math.sin(a)) * sp + 1, (Math.random() - 0.5) * 2])
      }
      const bg = new THREE.BufferGeometry()
      bg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      burst = new THREE.Points(bg, new THREE.PointsMaterial({ map: st, size: 0.35, transparent: true, opacity: 0, depthWrite: false }))
      burst.userData.vel = vel
      burst.frustumCulled = false
      root.add(burst)
    }

    const frame = (t) => {
      letters.forEach(({ wrap: w, s, t0, sc, y, offY }) => {
        const p = clamp((t - t0) / 0.5)
        setOp(s, clamp(p * 2))
        w.scale.setScalar(sc * lerp(1.9, 1, clamp(oBack(p), 0, 1.1)))
        w.position.y = y + lerp(offY, 0, eo3(p))
        w.rotation.x = lerp(-0.9, 0, eo3(p))
        w.position.z = lerp(2, 0, eo3(p))
      })
      pop.forEach(({ obj, t0, kind }) => {
        const p = clamp((t - t0) / 0.6)
        if (kind === 'panel') { setOp(obj, clamp(p * 2)); obj.scale.set(lerp(0.3, 1, eo3(p)), lerp(0.4, 1, oBack(p)), 1) }
        else { obj.material.opacity = clamp(p * 2); obj.scale.setScalar(0.3 * clamp(oBack(p), 0, 1.2) * (1 + 0.15 * Math.sin(t * 5))) }
      })

      // 3D kid: hidden behind the text, peeks, struggles up, heaves over and sits on the hanger
      const { arms, legs, head } = kid.userData
      const hideY = TEXT_TOP - 2.8, peekY = TEXT_TOP + 0.3 - 2.1, gripY = barY - 0.6 - 0.0, upY = restY + 0.5
      let oy = hideY, kz = -0.2, up = 0, sit = 0, cheek = 0, kick = 0, ry = 0, rz = 0, hz = 0, lowest = -1.0
      const rt = t - T_R
      if (rt >= 0 && rt < RISE) {
        const u = rt / RISE
        if (u < 0.16) oy = lerp(hideY, peekY, eo3(u / 0.16))                                    // head slowly pokes up
        else if (u < 0.3) { const v = (u - 0.16) / 0.14; oy = peekY; ry = Math.sin(v * Math.PI * 2) * 0.5; hz = Math.sin(v * Math.PI * 2) * 0.12 } // looks around
        else if (u < 0.4) { const v = eo3((u - 0.3) / 0.1); oy = lerp(peekY, gripY, v); up = v }  // reaches for the bar
        else if (u < 0.75) {                                                                   // struggle: three tries and one slip
          const v = (u - 0.4) / 0.35
          up = 1; kick = 1
          oy = gripY + 0.22 * Math.abs(Math.sin(v * Math.PI * 3)) - 0.3 * Math.exp(-Math.pow((v - 0.62) / 0.06, 2))
          rz = 0.1 * Math.sin(v * Math.PI * 6); hz = -0.1 * Math.sin(v * Math.PI * 6)
        } else {                                                                               // final heave
          const v = (u - 0.75) / 0.25
          oy = lerp(gripY, upY, eo3(v)); up = 1 - eo3(v); sit = eo3(v); kick = 1 - v
        }
      } else if (rt >= RISE) {
        const f = clamp((rt - RISE) / FALL), w = t - T_LD
        sit = 1; kz = lerp(-0.2, 0.15, clamp(f * 3)); lowest = -0.15
        cheek = clamp(w / 0.5); hz = 0.08 * cheek
        if (w < 0) oy = lerp(upY, restY, f * f)
        else {
          oy = restY + Math.sin(t * 2.6) * 0.02
          const d = Math.exp(-5 * w) * Math.cos(16 * w)
          kid.scale.set(1 + 0.14 * d, 1 - 0.16 * d, 1)
        }
      }
      if (rt < RISE || t < T_LD) kid.scale.set(1, 1, 1)
      lowest = lerp(-1.0, -0.15, sit)
      if (!released && oy + lowest >= TEXT_TOP) released = true // nothing left below the letter tops -> fully visible
      kid.position.set(restX, oy, kz)
      kid.rotation.z = rz
      head.rotation.y = ry; head.rotation.z = hz
      const DOWN = new THREE.Vector3(0, -1, 0)
      arms.forEach((arm, i) => {
        const s2 = i ? 1 : -1
        const d = new THREE.Vector3(s2 * 0.2, -1, 0.05).lerp(new THREE.Vector3(s2 * 0.45, 1, 0.2), up)
        if (i === 0 && cheek > 0) d.lerp(new THREE.Vector3(0.15, 0.35, 0.5), cheek)           // left hand rests on cheek
        arm.quaternion.setFromUnitVectors(DOWN, d.normalize())
      })
      legs.forEach((leg, i) => {
        const kickA = kick * Math.sin(t * 10 + i * Math.PI) * 0.7
        leg.rotation.x = lerp(kickA, -1.25, sit) + Math.sin(t * 2.2 + i * 3) * 0.07 * sit
      })

      const hp = clamp((t - (T_R + 0.2)) / 0.5)
      hanger.visible = hp > 0
      hanger.scale.setScalar(Math.max(0.001, oBack(hp)))

      const bt = t - T_LD
      if (bt > 0 && bt < 1.4) {
        const a = burst.geometry.attributes.position, v = burst.userData.vel
        for (let i = 0; i < v.length; i++) {
          a.setXYZ(i, restX + v[i][0] * bt * 0.6, barY + 0.2 + v[i][1] * bt - 2.2 * bt * bt, v[i][2] * bt * 0.5)
        }
        a.needsUpdate = true
        burst.material.opacity = 1 - bt / 1.4
      } else burst.material.opacity = 0
      twinkles.forEach((s) => {
        const o = bt > 0.3 ? clamp((bt - 0.3) / 0.5) : 0
        const p = 0.5 + 0.5 * Math.sin(t * 4 + s.userData.a)
        s.material.opacity = o * p
        s.position.set(s.userData.x, s.userData.y + Math.sin(t * 1.5 + s.userData.a) * 0.08, 0.6)
        s.scale.setScalar(0.28 + 0.22 * p)
      })
      root.rotation.y = ptr.x * 0.28 + Math.sin(t * 0.7) * 0.08
      root.rotation.x = -ptr.y * 0.12
      // keep the clip line glued to the top of the letters (world space), then switch it off
      root.updateMatrixWorld(true)
      if (released) clip.set(new THREE.Vector3(0, 1, 0), 1000)
      else clip.set(new THREE.Vector3(0, 1, 0), -TEXT_TOP).applyMatrix4(root.matrixWorld)
    }

    const init = async () => {
      try { await document.fonts.load('800 200px "Baloo 2"') } catch (e) { /* fallback font */ }
      if (cancelled) return

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.localClippingEnabled = true
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      wrap.appendChild(renderer.domElement)
      renderer.domElement.style.cssText = 'display:block;width:100%;height:100%'
      scene = new THREE.Scene()
      cam = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
      cam.position.set(0, 0.5, 14)
      cam.lookAt(0, 0.7, 0)
      scene.add(new THREE.AmbientLight(0xffffff, 2.2))
      const sun = new THREE.DirectionalLight(0xffffff, 2.6)
      sun.position.set(-3, 5, 6)
      scene.add(sun)
      root = new THREE.Group()
      scene.add(root)
      build()

      const size = () => {
        const w = window.innerWidth, h = window.innerHeight
        renderer.setSize(w, h)
        cam.aspect = w / h
        cam.updateProjectionMatrix()
        root.scale.setScalar(Math.min(1, ((w / h) * 8.8) / 12.6, 1.15))
        root.position.y = 0
      }
      const move = (e) => { ptr.x = (e.clientX / window.innerWidth) * 2 - 1; ptr.y = (e.clientY / window.innerHeight) * 2 - 1 }
      window.addEventListener('resize', size)
      window.addEventListener('pointermove', move)
      cleanups.push(() => { window.removeEventListener('resize', size); window.removeEventListener('pointermove', move) })
      size()

      const start = performance.now()
      let fading = false
      const loop = () => {
        const t = (performance.now() - start) / 1000
        frame(t)
        renderer.render(scene, cam)
        if (t > T_END && !fading) {
          fading = true
          wrap.style.opacity = '0'
          fadeTimer = window.setTimeout(() => doneRef.current && doneRef.current(), 500)
        }
        raf = requestAnimationFrame(loop)
      }
      loop()
    }

    init()

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      clearTimeout(fadeTimer)
      cleanups.forEach((fn) => fn())
      if (scene) {
        scene.traverse((o) => {
          if (o.geometry) o.geometry.dispose()
          if (o.material) {
            const ms = Array.isArray(o.material) ? o.material : [o.material]
            ms.forEach((m) => { if (m.map) m.map.dispose(); m.dispose() })
          }
        })
      }
      if (renderer) {
        renderer.dispose()
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-50"
      style={{
        background: 'radial-gradient(circle at 50% 45%, #fff8ea, #f1dcbb)',
        transition: 'opacity 0.5s ease',
      }}
    />
  )
}

export default Loader