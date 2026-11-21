// Prüfaufbauten: Formmessgerät mit Drehtisch für Drehteile und eine Aufnahme für den Gabelkopf.
import * as k from "./kit/iso-kit.mjs";
import * as G from "./kit/lathe.mjs";
import { W, H, U, m, kitFor, surfacePlate } from "./build.mjs";

const RAD = Math.PI / 180;
const ZONE_W = 3; // gezeichnete Zonenbreite in mm (überhöht)

// ---------- Texte für statische Anzeigen ----------
const num = (lang, v, d) => (lang === "de" ? v.toFixed(d).replace(".", ",") : v.toFixed(d));
const tri = (f) => ({ de: f("de"), en: f("en"), ar: f("ar") });
const ok = (v, t) => (v <= t ? "✓" : "✗");
export const say = {
  position: (dx, dy, tol) => {
    const d = 2 * Math.hypot(dx, dy);
    return tri((l) => `${{ de: "Achsversatz", en: "axis offset", ar: "انحراف المحور" }[l]} Δx ${num(l, dx, 2)} · Δy ${num(l, dy, 2)} → ⌀ 2·√(Δx²+Δy²) = ${num(l, d, 3)} ≤ ${num(l, tol, 2)} ${l === "ar" ? "مم" : "mm"} ${ok(d, tol)}`);
  },
  faceStatic: (v, tol) => tri((l) => `${{ de: "Spanne der Stirnfläche zwischen Ebenen ⟂ A", en: "face span between planes ⟂ A", ar: "مدى السطح بين مستويين ⟂ A" }[l]}: ${num(l, v, 3)} ≤ ${num(l, tol, 2)} ${l === "ar" ? "مم" : "mm"} ${ok(v, tol)}`),
  profile: (v, tol) => tri((l) => `${{ de: "größte Abweichung vom Sollprofil", en: "largest deviation from nominal", ar: "أكبر انحراف عن المقطع الاسمي" }[l]} ±${num(l, v / 2, 3)} → ${num(l, v, 3)} ≤ ${num(l, tol, 2)} ${l === "ar" ? "مم" : "mm"} ${ok(v, tol)}`),
  parallel: (v, tol) => tri((l) => `${{ de: "Spanne zur Parallelen von A", en: "span to the parallel of A", ar: "المدى بالنسبة لموازي A" }[l]}: ${num(l, v, 3)} ≤ ${num(l, tol, 2)} ${l === "ar" ? "مم" : "mm"} ${ok(v, tol)}`),
  coax: (v, tol) => tri((l) => `${{ de: "Ist-Achse zur Bezugsachse A", en: "actual axis to datum axis A", ar: "المحور الفعلي إلى المحور المرجعي A" }[l]}: ⌀ ${num(l, v, 3)} ≤ ${num(l, tol, 2)} ${l === "ar" ? "مم" : "mm"} ${ok(v, tol)}`),
  symmetry: (v, tol) => tri((l) => `${{ de: "Mittelebene der Nut zur Mittelebene A", en: "slot median plane to datum plane A", ar: "المستوى الأوسط للمجرى إلى المستوى A" }[l]}: ${num(l, v, 3)} ≤ ${num(l, tol, 2)} ${l === "ar" ? "مم" : "mm"} ${ok(v, tol)}`),
  surface: (v, tol) => tri((l) => `${{ de: "größte Flächenabweichung (KMG)", en: "largest surface deviation (CMM)", ar: "أكبر انحراف للسطح (CMM)" }[l]} ±${num(l, v / 2, 3)} → ${num(l, v, 3)} ≤ ${num(l, tol, 2)} ${l === "ar" ? "مم" : "mm"} ${ok(v, tol)}`),
  perpendicular: (v, tol) => tri((l) => `${{ de: "Achsneigung über die Bohrungslänge", en: "axis tilt over the hole length", ar: "ميل المحور على طول الثقب" }[l]}: ⌀ ${num(l, v, 3)} ≤ ${num(l, tol, 2)} ${l === "ar" ? "مم" : "mm"} ${ok(v, tol)}`),
};

export function liveOf(P, features) {
  return { axes: { o: k.iso([0, 0, 0], P), x: k.axisVector(P, [1, 0, 0]), y: k.axisVector(P, [0, 1, 0]), z: k.axisVector(P, [0, 0, 1]) }, U, features };
}

// Prüfmodell eines Beispielteils: h(θ,u) = Σ a·sin(kθ+φ) + Σ a·sin(2π·f·u+φ), skaliert auf 72 % der Toleranz.
export function scaleModel(model, tol) {
  const at = (th, u) => model.rot.reduce((s, [a, kk, ph]) => s + a * Math.sin(kk * th + ph), 0) + model.lin.reduce((s, [a, f, ph]) => s + a * Math.sin(2 * Math.PI * f * u + ph), 0);
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i <= 360; i++) for (let j = 0; j <= (model.lin.length ? 40 : 0); j++) {
    const h = at((i / 360) * 2 * Math.PI, j / 40);
    lo = Math.min(lo, h); hi = Math.max(hi, h);
  }
  const f = (0.72 * tol) / (hi - lo);
  const mid = (hi + lo) / 2;
  const out = { rot: model.rot.map(([a, kk, ph]) => [a * f, kk, ph]), lin: model.lin.map(([a, fr, ph]) => [a * f, fr, ph]), mid: mid * f };
  out.at = (th, u) => at(th, u) * f - out.mid;
  return out;
}
export const MODELS = {
  roundness: { rot: [[1, 2, 0.3], [0.5, 3, 1.1], [0.25, 5, 2]], lin: [] },
  runout: { rot: [[1, 1, 0.4], [0.4, 2, 1.3], [0.2, 3, 0.2]], lin: [] },
  line: { rot: [], lin: [[1, 0.8, 0.2], [0.5, 2.1, 1], [0.2, 4.3, 0.5]] },
  cyl: { rot: [[0.6, 2, 0.3], [0.3, 3, 1]], lin: [[0.5, 0.7, 0.1], [0.2, 1.9, 1]] },
  axial: { rot: [[1, 1, 0.2], [0.45, 2, 1.4], [0.2, 3, 0.7]], lin: [] },
  axialTotal: { rot: [[0.8, 1, 0.6], [0.3, 2, 0.2]], lin: [[0.5, 1, 0.3]] },
};

// ---------- Geometrie-Helfer ----------
export function helpers(P) {
  const T = kitFor(P);
  const [vx, vy] = k.towardViewer(P);
  const alpha = Math.atan2(vy, vx);
  const pt = (p) => T.at(p).map((v) => v.toFixed(1)).join(" ");
  const poly = (pts, closed = false) => "M" + pts.map(pt).join("L") + (closed ? "Z" : "");
  const arcPts = (r, z, a0, a1, n = 48, rf = null) => Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    const rr = rf ? rf(a) : r;
    return [m(rr) * Math.cos(a), m(rr) * Math.sin(a), m(z)];
  });
  const front = (r, z, rf, n) => arcPts(r, z, alpha - Math.PI / 2, alpha + Math.PI / 2, n, rf);
  const full = (r, z, rf, n = 96) => arcPts(r, z, 0, 2 * Math.PI, n, rf);
  const band = (r, z0, z1) => poly([...front(r, z1), ...front(r, z0).reverse()], true);
  const annulus = (rIn, rOut, z) => poly(full(rOut, z), true) + (rIn > 0 ? poly(full(rIn, z), true) : "");
  // Schmale Leiste entlang einer Richtung φ (für Arme und Taster)
  const radialBar = (phi, d0, d1, w, z, h, style) => {
    const c = Math.cos(phi), s = Math.sin(phi), nx = -s, ny = c;
    const ring = [[d0, -w / 2], [d1, -w / 2], [d1, w / 2], [d0, w / 2]].map(([d, o]) => [m(d * c + o * nx), m(d * s + o * ny)]);
    return T.S(k.extrude(ring, m(z), m(h), P, { bevel: 0.3 }), style);
  };
  return { ...T, alpha, poly, front, full, band, annulus, radialBar };
}

export function dialSvg(T, P, [x, y], z0, R, tone = "hi") {
  const out = [];
  const top = m(z0 + 6);
  out.push(T.S(k.cylinder(m(x), m(y), m(R), m(z0), m(6), P, 64, 0.7), { tone, crease: "lo" }));
  out.push(T.L(k.knurl(m(x), m(y), m(R), top - m(2), top, 70, P, 0.3), { tone: "lo" }));
  out.push(T.L(k.ring(m(x), m(y), m(R - 1.4), top, P, 64), { tone: "lo" }));
  const ticks = k.radialTicks(m(x), m(y), m(R - 1.8), 50, 5, top, [m(0.9), m(1.8)], P);
  out.push(T.L(ticks.minor, { tone: "lo" }), T.L(ticks.major, { tone: "mid" }));
  out.push(T.L(k.ring(m(x), m(y), m(1), top, P, 16), { tone: "mid" }));
  return out.join("");
}
export const needleSvg = (T, P, [x, y], z, R) =>
  `<path data-iso-needle class="iso-line" data-tone="lit" data-free="start" d="${k.lineOnTop([m(x), m(y + 2.4)], [m(x), m(y - R + 2.6)], m(z) + 0.2, P)}" style="stroke-width:1.1"/>`;

// ---------- Formmessgerät mit Drehtisch ----------
export function rotaryFigure(part) {
  const PHI = -35 * RAD;
  const DIAL_R = 9;
  const maxR = Math.max(...part.profile.map(([, r]) => r));
  const top = part.profile[part.profile.length - 1][0];
  const topR = part.profile[part.profile.length - 1][1];
  const Rt = Math.max(maxR + 18, 44);
  const ZT = 22; // Tischoberfläche
  const hold = part.hold;
  const z0 = ZT + (hold.type === "chuck" ? 14 : 10);
  const zTop = z0 + top;
  const Dc = Rt + 18;
  const col = [Dc * Math.cos(PHI), Dc * Math.sin(PHI)];
  const colTop = zTop + 24;
  const plan = { x: m(-Rt - 12), y: m(Math.min(-Rt - 12, col[1] - 16)), w: 0, d: 0, r: m(6) };
  plan.w = m(col[0] + 16) - plan.x;
  plan.d = m(Rt + 12) - plan.y;
  const P = k.fitProjection(
    [...k.boxCorners(plan, m(-14), 0), [m(col[0]), m(col[1]), m(colTop + 2)], [0, 0, m(zTop + 8)], [m(-maxR), 0, m(zTop)], [0, m(maxR), m(zTop)]],
    W, H, { pad: 10, azimuth: 40, elevation: 30 },
  );
  const T = helpers(P);
  const { S, L, D, at, hole } = T;
  const body = [];
  const F = G.frameOf([0, 0, m(z0)], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  const zs = (s) => z0 + s;

  body.push(surfacePlate(T, P, plan));

  // Drehtisch: Gehäuse, Teller mit Teilung und Rändel
  body.push(`<path class="iso-halo" d="${k.haloOf({ x: m(-Rt - 4), y: m(-Rt - 4), w: m(2 * Rt + 8), d: m(2 * Rt + 8), r: m(Rt + 4) }, 0, m(16), P)}"/>`);
  body.push(S(k.cylinder(0, 0, m(Rt + 4), 0, m(15), P, 120, 1), { tone: "mid", inner: L(k.sideArc(0, 0, m(Rt + 4), m(4), P, 80), { tone: "faint" }) }));
  body.push(L(k.ring(0, 0, m(Rt + 1.5), m(15), P, 120), { tone: "faint" }));
  body.push(S(k.cylinder(0, 0, m(Rt), m(15), m(ZT - 15), P, 120, 0.8), { tone: "hi", crease: "lo" }));
  body.push(L(k.knurl(0, 0, m(Rt), m(15.6), m(ZT - 0.6), 140, P, 0.3), { tone: "lo" }));
  const tt = k.radialTicks(0, 0, m(Rt - 1.4), 72, 6, m(ZT), [m(1.4), m(3)], P);
  body.push(L(tt.minor, { tone: "lo" }), L(tt.major, { tone: "mid" }));
  body.push(L(k.ring(0, 0, m(Rt - 6), m(ZT), P, 120), { tone: "faint" }));
  const tScrews = [30, 150, 270].map((a) => [m(Rt - 10) * Math.cos(a * RAD), m(Rt - 10) * Math.sin(a * RAD)]);
  body.push(L(tScrews.map(([x, y]) => k.ring(x, y, m(2), m(ZT), P, 16)).join(""), { tone: "lo" }));
  body.push(D(tScrews.map(([x, y]) => at([x, y, m(ZT)])), { size: 0.5 }));
  body.push(`<path data-iso-mark="0" class="iso-line" data-tone="lit" style="stroke-width:1.3" d=""/>`);
  const marks = [{ r0: Rt - 5, r1: Rt - 0.8, z: ZT }];

  // Aufspannung
  const jaws = [];
  if (hold.type === "chuck") {
    const cr = hold.r + 14;
    body.push(S(k.cylinder(0, 0, m(cr), m(ZT), m(14), P, 96, 0.8), { tone: "mid", inner: L(k.sideArc(0, 0, m(cr), m(ZT + 4), P, 64), { tone: "faint" }) }));
    body.push(L(k.ring(0, 0, m(cr - 3), m(z0), P, 96), { tone: "faint" }));
    for (const a of [90, 210, 330]) {
      const ph = a * RAD;
      const svg = T.radialBar(ph, hold.r, hold.r + 10, 7, z0, hold.s1, { tone: "mid" }) + D([at([m((hold.r + 6) * Math.cos(ph)), m((hold.r + 6) * Math.sin(ph)), m(z0 + hold.s1)])], { size: 0.5 });
      jaws.push({ depth: T.depth([Math.cos(ph), Math.sin(ph), 0]), svg });
    }
    const keyHole = [m((cr - 6) * Math.cos(150 * RAD)), m((cr - 6) * Math.sin(150 * RAD))];
    body.push(L(k.ring(keyHole[0], keyHole[1], m(1.6), m(z0), P, 16), { tone: "mid" }));
  } else {
    const sr = hold.shoulder ?? hold.r + 6;
    body.push(S(k.cylinder(0, 0, m(sr), m(ZT), m(10), P, 96, 0.6), { tone: "mid", inner: L(k.sideArc(0, 0, m(sr), m(ZT + 3), P, 64), { tone: "faint" }) }));
  }
  jaws.filter((j) => j.depth < 0).forEach((j) => body.push(j.svg));

  // Werkstück: eine Drehkontur
  const ghost = [];
  // Kontur an jedem Absatz (gleiches s) teilen und Absatz für Absatz von unten malen
  const runs = [[part.profile[0]]];
  for (let j = 1; j < part.profile.length; j++) {
    const [s, r, sm] = part.profile[j];
    if (Math.abs(s - part.profile[j - 1][0]) < 1e-6) runs.push([[s, r, sm]]);
    else runs[runs.length - 1].push([s, r, sm]);
  }
  for (const run of runs.filter((r) => r.length > 1)) {
    ghost.push(S(G.solidOf(run.map(([s, r, sm]) => (sm ? [m(s), m(r), 1] : [m(s), m(r)])), F, P), { tone: "hi" }));
  }
  const boreTop = part.bore ? part.bore[part.bore.length - 1][2] : 0;
  if (part.bore) ghost.push(hole("rt", 0, 0, m(boreTop), m(zTop), m(top), { chamfer: 0.8 }));
  if (part.keyhole) {
    const { w, depth } = part.keyhole;
    const a = Math.asin(w / 2 / boreTop);
    const pts = [[boreTop * Math.cos(Math.PI / 2 - a), boreTop * Math.sin(Math.PI / 2 - a)], [w / 2, boreTop + depth], [-w / 2, boreTop + depth], [-boreTop * Math.cos(Math.PI / 2 - a), boreTop * Math.sin(Math.PI / 2 - a)]];
    ghost.push(`<path class="iso-hole" d="${T.poly(pts.map(([x, y]) => [m(x), m(y), m(zTop)]), true)}"/>` + L(T.poly(pts.map(([x, y]) => [m(x), m(y), m(zTop)])), { tone: "mid" }));
  }
  if (part.centerHole) ghost.push(hole("rt", 0, 0, m(part.centerHole), m(zTop), m(3), { chamfer: 0.9 }));
  if (part.holes) {
    const { r, hole: hr, n } = part.holes;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 2 * Math.PI + Math.PI / 6;
      ghost.push(hole("rt", m(r * Math.cos(a)), m(r * Math.sin(a)), m(hr), m(zTop), m(top - part.holes.s0)));
    }
  }
  if (part.keyway) {
    // Passfedernut auf der sichtbaren Mantelseite
    const { s0, s1, w, r } = part.keyway;
    const half = w / 2 / r;
    const a0 = T.alpha - 0.25;
    const pts = [];
    for (let i = 0; i <= 8; i++) pts.push([r, a0 - half + (2 * half * i) / 8, s1 - w / 2 + (w / 2) * Math.sin((i / 8) * Math.PI)]);
    for (let i = 0; i <= 8; i++) pts.push([r, a0 + half - (2 * half * i) / 8, s0 + w / 2 - (w / 2) * Math.sin((i / 8) * Math.PI)]);
    const P3 = pts.map(([rr, a, s]) => [m(rr * Math.cos(a)), m(rr * Math.sin(a)), m(zs(s))]);
    ghost.push(`<path class="iso-hole" d="${T.poly(P3, true)}"/>` + L(T.poly(P3, true), { tone: "mid" }));
  }
  body.push(`<g data-iso-ghost>${ghost.join("")}</g>`);
  jaws.filter((j) => j.depth >= 0).forEach((j) => body.push(j.svg));

  if (hold.type === "mandrel") {
    body.push(S(k.cylinder(0, 0, m(hold.washer), m(zTop), m(1.6), P, 72, 0.4), { tone: "mid" }));
    body.push(S(k.cylinder(0, 0, m(hold.nut), m(zTop + 1.6), m(6), P, 6, 0.6), { tone: "mid" }));
    body.push(S(k.cylinder(0, 0, m(Math.min(hold.r, hold.nut * 0.55)), m(zTop + 7.6), m(3), P, 32, 0.4), { tone: "mid" }));
  }
  const markIn = hold.type === "mandrel" ? hold.washer + 1.2 : Math.max(boreTop, part.centerHole ?? 0) + 1.6;
  const markOut = (hold.type === "mandrel" ? topR : topR) - 1.4;
  body.push(`<path data-iso-mark="1" class="iso-line" data-tone="lit" style="stroke-width:1.3" d=""/>`);
  marks.push({ r0: markIn, r1: markOut, z: zTop });

  // ---------- Überlagerungen ----------
  const gaugesSvg = [];
  const ov = [];
  const live = [];
  const dA = part.datumA;
  ov.push(`<path data-show="d:A" class="gps-datum-axis" d="${T.poly([[0, 0, m(z0 - 8)], [0, 0, m(zTop + 12)]])}"/>`);
  if (dA.kind === "band") ov.push(`<path data-show="d:A" class="gps-datum-fill" d="${T.band(dA.r, zs(dA.s0), zs(dA.s1))}"/>`);
  else {
    const side = (sign) => T.poly([[m(dA.r * Math.cos(T.alpha + sign * Math.PI / 2)), m(dA.r * Math.sin(T.alpha + sign * Math.PI / 2)), m(zs(dA.s0))], [m(dA.r * Math.cos(T.alpha + sign * Math.PI / 2)), m(dA.r * Math.sin(T.alpha + sign * Math.PI / 2)), m(zs(dA.s1))]]);
    ov.push(`<g data-show="d:A" class="gps-datum-hidden"><path d="${side(1)}"/><path d="${side(-1)}"/><path d="${T.poly(T.front(dA.r, zs(dA.s0)))}"/></g>`);
    if (dA.s1 >= top - 0.01) ov.push(`<path data-show="d:A" class="gps-datum-line" d="${T.poly(T.full(dA.r, zTop), true)}"/>`);
  }

  part.features.forEach((f, i) => {
    const w = ZONE_W;
    const exag = w / f.tol;
    const zone = (paths, cls = "gps-zone") => ov.push(`<g data-show="${i}" class="${cls}">${paths.map(([d, c]) => `<path d="${d}"${c ? ` class="${c}"` : ""}/>`).join("")}</g>`);
    const actual = (d) => ov.push(`<path data-show="${i}" class="gps-actual" d="${d}"/>`);
    const featFill = (d) => ov.push(`<path data-show="${i}" class="gps-feature-fill" d="${d}"/>`);
    const key = f.type === "radial" ? (dA && i === 1 && part.id !== "x" && f.tol !== 0.02 ? "runout" : "roundness") : f.type;
    if (f.type === "radial") {
      const md = scaleModel(MODELS[f.tol === 0.02 ? "roundness" : "runout"], f.tol);
      const zc = zs(f.s);
      featFill(T.band(f.r, zs(f.band[0]), zs(f.band[1])));
      zone([[T.poly(T.front(f.r + w / 2, zc))], [T.poly(T.front(f.r - w / 2, zc)), "gps-zone-low"]]);
      actual(T.poly(T.front(f.r, zc, (a) => f.r + md.at(a, 0) * exag)));
      live.push(radialGauge(i, f.r, zc, false, md, f.tol));
    } else if (f.type === "line") {
      const md = scaleModel(MODELS.line, f.tol);
      featFill(T.band(f.r, zs(f.band[0]), zs(f.band[1])));
      const gen = (rr) => T.poly([[m(rr * Math.cos(PHI)), m(rr * Math.sin(PHI)), m(zs(f.s0))], [m(rr * Math.cos(PHI)), m(rr * Math.sin(PHI)), m(zs(f.s1))]]);
      zone([[gen(f.r + w / 2)], [gen(f.r - w / 2), "gps-zone-low"]]);
      const pts = Array.from({ length: 61 }, (_, j) => { const u = j / 60; const rr = f.r + md.at(0, u) * exag; return [m(rr * Math.cos(PHI)), m(rr * Math.sin(PHI)), m(zs(f.s0 + (f.s1 - f.s0) * u))]; });
      actual(T.poly(pts));
      live.push(radialGauge(i, f.r, zs(f.s0), true, md, f.tol, f.s1 - f.s0));
    } else if (f.type === "cyl") {
      const md = scaleModel(MODELS.cyl, f.tol);
      featFill(T.band(f.r, zs(f.band[0]), zs(f.band[1])));
      const sil = (rr) => { const a = T.alpha - Math.PI / 2; return T.poly([[m(rr * Math.cos(a)), m(rr * Math.sin(a)), m(zs(f.s0))], [m(rr * Math.cos(a)), m(rr * Math.sin(a)), m(zs(f.s1))]]); };
      zone([[T.poly(T.front(f.r + w / 2, zs(f.s1)))], [T.poly(T.front(f.r + w / 2, zs(f.s0)))], [sil(f.r + w / 2)], [T.poly(T.front(f.r - w / 2, zs(f.s1))), "gps-zone-low"], [T.poly(T.front(f.r - w / 2, zs(f.s0))), "gps-zone-low"], [sil(f.r - w / 2), "gps-zone-low"]]);
      for (const u of [0, 0.5, 1]) actual(T.poly(T.front(f.r, zs(f.s0 + (f.s1 - f.s0) * u), (a) => f.r + md.at(a, u) * exag)));
      live.push(radialGauge(i, f.r, zs(f.s0), true, md, f.tol, f.s1 - f.s0, 3));
    } else if (f.type === "axial" || f.type === "axialTotal") {
      const md = scaleModel(MODELS[f.type], f.tol);
      const zc = zs(f.s);
      featFill(T.annulus(f.face[0], f.face[1], zc));
      if (f.type === "axial") {
        zone([[T.poly(T.full(f.r, zc + w / 2), true)], [T.poly(T.full(f.r, zc - w / 2), true), "gps-zone-low"]]);
        actual(T.poly(T.full(f.r, zc).map(([x, y, z], j, arr) => [x, y, z + m(md.at((j / (arr.length - 1)) * 2 * Math.PI, 0) * exag)]), true));
        live.push(axialGauge(i, f.r, zc, 0, md, f.tol));
      } else {
        zone([[T.poly(T.full(f.face[1], zc + w / 2), true)], [T.poly(T.full(f.face[0], zc + w / 2), true)], [T.poly(T.full(f.face[1], zc - w / 2), true), "gps-zone-low"], [T.poly(T.full(f.face[0], zc - w / 2), true), "gps-zone-low"]]);
        const spiral = Array.from({ length: 361 }, (_, j) => { const u = j / 360; const a = u * 6 * Math.PI; const rr = f.r0 + (f.r1 - f.r0) * u; return [m(rr * Math.cos(a)), m(rr * Math.sin(a)), m(zc + md.at(a, u) * exag)]; });
        actual(T.poly(spiral));
        live.push(axialGauge(i, f.r0, zc, f.r1 - f.r0, md, f.tol));
      }
    } else if (f.type === "faceStatic") {
      const zc = zs(f.s);
      featFill(T.annulus(f.rIn, f.rOut, zc));
      zone([[T.poly(T.full(f.rOut, zc + w / 2), true)], [T.poly(T.full(f.rIn, zc + w / 2), true)], [T.poly(T.full(f.rOut, zc - w / 2), true), "gps-zone-low"], [T.poly(T.full(f.rIn, zc - w / 2), true), "gps-zone-low"]]);
      const md = scaleModel(MODELS.axial, f.value / 0.72);
      actual(T.poly(T.full((f.rIn + f.rOut) / 2, zc).map(([x, y, z], j, arr) => [x, y, z + m(md.at((j / (arr.length - 1)) * 2 * Math.PI, 0) * exag)]), true));
      live.push({ mode: "static", ghost: true, tol: f.tol, text: say.faceStatic(f.value, f.tol) });
    } else if (f.type === "coaxStatic") {
      // Zylindrische Zone ⌀t um die Bezugsachse A über die Länge des Sitzes, Ist-Achse darin
      const zr = w / 2;
      featFill(T.band(f.r, zs(f.s0), zs(f.s1)));
      const c = k.cylinder(0, 0, m(zr), m(zs(f.s0)), m(f.s1 - f.s0), P, 48);
      ov.push(`<g data-show="${i}" class="gps-zone-solid"><path d="${c.fill}"/></g>`);
      zone([[T.poly(T.full(zr, zs(f.s1)), true)], [T.poly(T.full(zr, zs(f.s0)), true), "gps-zone-low"]]);
      const e = (f.value / f.tol) * zr;
      actual(T.poly([[m(e * 0.5), m(-e * 0.6), m(zs(f.s0))], [m(-e * 0.7), m(e * 0.55), m(zs(f.s1))]]));
      live.push({ mode: "static", ghost: true, tol: f.tol, text: say.coax(f.value, f.tol) });
    } else if (f.type === "profileStatic") {
      // Längsschnitt in der Ebene, die der Betrachter frontal sieht
      const b = T.alpha - Math.PI / 2;
      const { hub, face, R } = f;
      const c = [hub + R, face - R]; // Mittelpunkt (r, s)
      const curve = (off, wob = 0) => Array.from({ length: 41 }, (_, j) => {
        const t = (j / 40) * (Math.PI / 2);
        const rr = R - off + wob * Math.sin(3 * t + 0.4) * (f.value / f.tol) * (w / 2);
        const r = c[0] - rr * Math.cos(t), s = c[1] + rr * Math.sin(t);
        return [m(r * Math.cos(b)), m(r * Math.sin(b)), m(zs(s))];
      });
      ov.push(`<path data-show="${i}" class="gps-feature-line-solo" d="${T.poly(curve(0))}"/>`);
      zone([[T.poly(curve(w / 2))], [T.poly(curve(-w / 2)), "gps-zone-low"]]);
      actual(T.poly(curve(0, 1)));
      // Schnittebene andeuten
      const sec = [[hub, 0], [hub, face - R], [face < 0 ? 0 : hub + R, face], [52, face], [52, top], [boreTop, top], [boreTop, 0]].map(([r, s]) => [m(r * Math.cos(b)), m(r * Math.sin(b)), m(zs(s))]);
      ov.push(`<path data-show="${i}" class="gps-section" d="${T.poly(sec, true)}"/>`);
      live.push({ mode: "static", ghost: true, tol: f.tol, text: say.profile(f.value, f.tol) });
    }
    void key;
  });
  body.push(`<g class="gps-overlays">${ov.join("")}</g>`);

  // Messsäule mit Fuß
  body.push(S(k.slabOf({ x: m(col[0] - 11), y: m(col[1] - 11), w: m(22), d: m(22), r: m(3) }, 0, m(7), P, 4, 0.8), { tone: "mid" }));
  body.push(D([[-7, -7], [7, -7], [-7, 7], [7, 7]].map(([x, y]) => at([m(col[0] + x), m(col[1] + y), m(7)])), { size: 0.45 }));
  body.push(S(k.cylinder(m(col[0]), m(col[1]), m(5), m(7), m(colTop - 7), P, 32), { tone: "mid", crease: "none" }));
  body.push(S(k.cylinder(m(col[0]), m(col[1]), m(5.8), m(colTop), m(1.6), P, 32), { tone: "mid" }));
  body.push(gaugesSvg.join(""));

  // ---------- Messuhren je Merkmal ----------
  function carriageSvg(zc) {
    const cp = { x: m(col[0] - 7.5), y: m(col[1] - 7.5), w: m(15), d: m(15), r: m(2) };
    return S(k.slabOf(cp, m(zc), m(13), P, 4, 0.6), { tone: "mid" }) +
      S(k.cylinder(m(col[0]), m(col[1]), m(5), m(zc + 13), m(3), P, 32), { tone: "mid", crease: "none" }) +
      S(k.slabOf({ x: m(col[0] + 7.5), y: m(col[1] - 1.4), w: m(3), d: m(2.8), r: 0.5 }, m(zc + 5), m(3), P, 2), { tone: "mid", crease: "none" }) +
      S(k.cylinder(m(col[0] + 12), m(col[1]), m(2.8), m(zc + 3.6), m(5.8), P, 20), { tone: "mid" }) +
      L(k.knurl(m(col[0] + 12), m(col[1]), m(2.8), m(zc + 3.6), m(zc + 9.4), 18, P), { tone: "lo" });
  }
  function radialGauge(i, r, zc, vertical, model, tol, travel = 0, turns = 1) {
    const c = Math.cos(PHI), s = Math.sin(PHI);
    const d = r + 7 + DIAL_R;
    const dc = [d * c, d * s];
    const parts = [];
    parts.push(S(k.cylinder(m((r + 1.2) * c), m((r + 1.2) * s), m(1.2), m(zc - 1.2), m(2.4), P, 16), { tone: "hi", lit: true }));
    parts.push(T.radialBar(PHI, r + 1.2, d - DIAL_R + 1, 1.4, zc - 0.7, 1.4, { tone: "hi", lit: true }));
    parts.push(dialSvg(T, P, dc, zc - 2, DIAL_R));
    parts.push(needleSvg(T, P, dc, zc + 4, DIAL_R));
    parts.push(T.radialBar(PHI, d + DIAL_R - 2, Dc, 5, zc - 6, 3.4, { tone: "mid" }));
    parts.push(carriageSvg(zc - 9));
    gaugesSvg.push(`<g data-show="${i}"><g data-iso-move="f${i}">${parts.join("")}</g></g>`);
    return {
      mode: "run", tol, turns: vertical && turns === 1 ? 0 : turns, period: vertical ? 16 : 6,
      move0: [0, 0], move1: vertical ? k.axisVector(P, [0, 0, m(travel)]) : [0, 0],
      needle: { c: [dc[0], dc[1], zc + 4], len: DIAL_R - 2.6, perTurn: 0.1 },
      model: { rot: model.rot, lin: model.lin, mid: model.mid },
    };
  }
  function axialGauge(i, r, zc, travel, model, tol) {
    const c = Math.cos(PHI), s = Math.sin(PHI);
    const p = [r * c, r * s];
    const parts = [];
    parts.push(S(k.cylinder(m(p[0]), m(p[1]), m(1.3), m(zc), m(1.2), P, 16), { tone: "hi", lit: true }));
    parts.push(S(k.cylinder(m(p[0]), m(p[1]), m(0.8), m(zc + 1.2), m(5.8), P, 16), { tone: "hi", crease: "none", lit: true }));
    parts.push(dialSvg(T, P, p, zc + 7, DIAL_R));
    parts.push(needleSvg(T, P, p, zc + 13, DIAL_R));
    parts.push(T.radialBar(PHI, r + DIAL_R - 2, Dc + (travel ? 0 : 0), 5, zc + 8.4, 3.4, { tone: "mid" }));
    const carriage = carriageSvg(zc + 5);
    gaugesSvg.push(`<g data-show="${i}">` + (travel ? `<g data-iso-move="f${i}">${parts.join("")}</g>${carriage}` : `<g data-iso-move="f${i}">${parts.join("")}${carriage}</g>`) + `</g>`);
    return {
      mode: "run", tol, turns: travel ? 4 : 1, period: travel ? 16 : 6,
      move0: [0, 0], move1: travel ? k.axisVector(P, [m(travel * c), m(travel * s), 0]) : [0, 0],
      needle: { c: [p[0], p[1], zc + 13], len: DIAL_R - 2.6, perTurn: 0.1 },
      model: { rot: model.rot, lin: model.lin, mid: model.mid },
    };
  }

  const svg = k.figureSvg({ width: W, height: H, label: part.label, body });
  return { svg, live: { ...liveOf(P, live), marks } };
}

// ---------- Gabelkopf auf Parallelunterlagen ----------
export function forkFigure() {
  // Maße in mm aus der Zeichnung: Länge 54, Wangen 5,4, Schlitz 6,6, Höhe 18,5, Bohrung ⌀12
  const L0 = 54, HALF = 9.25, CHEEK = 5.4, SLOT = 6.6, HOLE_R = 6, HX = 9.25;
  const PAR_H = 6; // Parallelunterlagen
  const zB = PAR_H; // Bezug B liegt auf den Unterlagen
  const zA = zB + CHEEK + SLOT; // Innenfläche der oberen Wange (Bezug A, nach unten)
  const zF = zB + CHEEK; // tolerierte Innenfläche der unteren Wange
  const zT = zA + CHEEK;
  const plan = { x: m(-16), y: m(-28), w: m(140), d: m(58), r: m(5) };
  const P = k.fitProjection([...k.boxCorners(plan, m(-14), 0), [m(HX), 0, m(zT + 34)], [m(L0 + 60), 0, m(zT)]], W, H, { pad: 10, azimuth: 40, elevation: 30 });
  const T = helpers(P);
  const { S, L, D, at, hole } = T;
  const body = [surfacePlate(T, P, plan)];

  // Kontur der Wange: Halbkreis um die Bohrung, dann gerade bis x = 54
  const outline = [];
  for (let i = 0; i <= 24; i++) { const a = Math.PI / 2 + (i / 24) * Math.PI; outline.push([m(HX + HALF * Math.cos(a)), m(HALF * Math.sin(a))]); }
  outline.push([m(L0), m(-HALF)], [m(L0), m(HALF)]);
  // Parallelunterlagen
  for (const y of [-HALF + 1, HALF - 7]) {
    const pl = { x: m(-2), y: m(y), w: m(52), d: m(6), r: 0.6 };
    body.push(S(k.slabOf(pl, 0, m(PAR_H), P, 2, 0.4), { tone: "mid" }));
    body.push(L(k.lineOnTop([pl.x + m(3), pl.y + m(3)], [pl.x + pl.w - m(3), pl.y + m(3)], m(PAR_H), P), { tone: "faint" }));
  }
  const ghost = [];
  ghost.push(S(k.extrude(outline, m(zB), m(CHEEK), P, { bevel: 0.6 }), { tone: "hi" }));
  ghost.push(hole("fk", m(HX), 0, m(HOLE_R), m(zF), m(CHEEK), { chamfer: 0.6 }));
  ghost.push(S(k.extrude(outline, m(zA), m(CHEEK), P, { bevel: 0.6 }), { tone: "hi" }));
  ghost.push(hole("fk", m(HX), 0, m(HOLE_R), m(zT), m(CHEEK), { chamfer: 0.6 }));
  // Gabelgrund, Schaftblock, Übergang und Rundschaft
  const blockZ0 = zB - 3.6, blockZ1 = zT + 3.6;
  ghost.push(S(k.slabOf({ x: m(L0), y: m(-HALF), w: m(8.4), d: m(2 * HALF), r: m(1) }, m(blockZ0), m(blockZ1 - blockZ0), P, 3, 0.6), { tone: "hi" }));
  const zc = (zB + zT) / 2;
  const FX = G.frameOf([m(L0 + 8.4), 0, m(zc)], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  ghost.push(S(G.solidOf([[0, m(11.5)], [m(30), m(6.5)], [m(49), m(6.5)], [m(50), m(5.8)]], FX, P), { tone: "hi" }));
  body.push(`<g data-iso-ghost>${ghost.join("")}</g>`);
  // Stützbock unter dem Schaft
  body.push(S(k.slabOf({ x: m(L0 + 40), y: m(-8), w: m(12), d: m(16), r: m(1.5) }, 0, m(zc - 6.5), P, 3, 0.5), { tone: "mid" }));

  const ov = [];
  const w = ZONE_W;
  const out3 = (z) => outline.map(([x, y]) => [x, y, m(z)]);
  // Merkmal 0: Parallelität der unteren Innenfläche zu A
  ov.push(`<path data-show="d:A" class="gps-datum-fill" d="${T.poly(out3(zA), true)}"/>`);
  ov.push(`<path data-show="0" class="gps-feature-fill" d="${T.poly(out3(zF), true)}"/>`);
  ov.push(`<g data-show="0" class="gps-zone"><path d="${T.poly(out3(zF + w / 2), true)}"/><path class="gps-zone-low" d="${T.poly(out3(zF - w / 2), true)}"/></g>`);
  const wave = Array.from({ length: 41 }, (_, j) => { const u = j / 40; const x = 2 + (L0 - 4) * u; return [m(x), m(-2), m(zF + (0.4 * Math.sin(2 * Math.PI * u * 1.3 + 0.5) + 0.25 * Math.sin(2 * Math.PI * u * 3.1)) * (w / 2) / 0.65 * 0.85)]; });
  ov.push(`<path data-show="0" class="gps-actual" d="${T.poly(wave)}"/>`);
  // Merkmal 1: Rechtwinkligkeit der Bohrung zu B; Prüfdorn mit Zonenzylinder
  ov.push(`<path data-show="d:B" class="gps-datum-fill" d="${T.poly(out3(zB), true)}"/>`);
  const exag = w / 0.08;
  const zr = (0.08 * exag) / 2;
  const cylZone = k.cylinder(m(HX), 0, m(zr), m(zB), m(zT - zB), P, 40);
  ov.push(`<g data-show="1" class="gps-zone-solid"><path d="${cylZone.fill}"/></g>`);
  ov.push(`<g data-show="1" class="gps-zone"><path d="${k.ring(m(HX), 0, m(zr), m(zT), P, 40)}"/><path class="gps-zone-low" d="${k.ring(m(HX), 0, m(zr), m(zB), P, 40)}"/></g>`);
  ov.push(`<path data-show="1" class="gps-axis" d="${T.poly([[m(HX), 0, m(zB - 4)], [m(HX), 0, m(zT + 30)]])}"/>`);
  const tilt = (0.05 / 2) * exag; // Beispiel: ⌀0,05
  ov.push(`<path data-show="1" class="gps-actual" d="${T.poly([[m(HX - tilt * 0.6), m(-tilt * 0.8), m(zB)], [m(HX + tilt * 0.6), m(tilt * 0.8), m(zT)]])}"/>`);
  ov.push(`<g data-show="1" class="gps-feature-line"><path d="${k.ring(m(HX), 0, m(HOLE_R), m(zT), P, 48)}"/></g>`);
  body.push(`<g class="gps-overlays">${ov.join("")}</g>`);
  // Prüfdorn in der Bohrung (nur bei Merkmal 1)
  const pin = S(k.cylinder(m(HX), 0, m(HOLE_R - 0.3), m(zT), m(22), P, 48), { tone: "hi", lit: true, inner: L(k.sideArc(m(HX), 0, m(HOLE_R - 0.3), m(zT + 4), P, 32), { tone: "faint" }) }) +
    S(k.cylinder(m(HX), 0, m(HOLE_R + 2), m(zT + 22), m(6), P, 48, 0.6), { tone: "mid" }) +
    L(k.knurl(m(HX), 0, m(HOLE_R + 2), m(zT + 22.6), m(zT + 27.4), 40, P), { tone: "lo" });
  body.push(`<g data-show="1">${pin}</g>`);
  void D; void at;
  const svg = k.figureSvg({ width: W, height: H, label: "Gabelkopf auf zwei Parallelunterlagen; die Unterlagen bilden die seitliche Bezugsfläche B nach. Ein Prüfdorn steckt in der Bolzenbohrung.", body });
  return { svg, live: liveOf(P, [{ mode: "static", ghost: true, tol: 0.04, text: say.parallel(0.026, 0.04) }, { mode: "static", ghost: true, tol: 0.08, text: say.perpendicular(0.05, 0.08) }]) };
}
