// Zusätzliche Prüfaufbauten für die Toleranzübersicht: Flächenprofil, Neigung, Koaxialität, Symmetrie.
import * as k from "./kit/iso-kit.mjs";
import * as G from "./kit/lathe.mjs";
import { W, H, m, surfacePlate } from "./build.mjs";
import { helpers, liveOf, say, rotaryFigure, scaleModel, dialSvg, needleSvg } from "./rigs.mjs";

const RAD = Math.PI / 180;
const ZONE_W = 3;

// ---------- ◎ Koaxialität: Stufenwelle, Bezug A im Futter ----------
export function coaxFigure() {
  return rotaryFigure({
    id: "coax",
    label: "Stufenwelle im Dreibackenfutter; der Lagerzapfen bildet Bezug A. Der zweite Sitz ist durchscheinend gezeigt, mit der zylindrischen Zone ⌀0,05 um die Bezugsachse und seiner Ist-Achse.",
    profile: [[0, 6.2], [1.8, 8], [11.6, 8], [11.6, 13.1], [28.6, 13.1], [48.6, 17.5], [56.4, 17.5], [56.4, 15], [71.3, 15], [71.3, 9], [102.2, 9], [104, 7.2]],
    centerHole: 1.3,
    hold: { type: "chuck", s1: 10, r: 8 },
    datumA: { kind: "band", s0: 1.8, s1: 11.6, r: 8 },
    features: [{ type: "coaxStatic", s0: 11.6, s1: 28.6, r: 13.1, tol: 0.05, value: 0.036 }],
  });
}

// ---------- ≡ Symmetrie: Nutenstein auf der Messplatte ----------
export function symmetryFigure() {
  const L = 54, WD = 80, HH = 40, SLOT = 24, DEPTH = 22;
  const plan = { x: m(-62), y: m(-62), w: m(124), d: m(124), r: m(6) };
  const P = k.fitProjection([...k.boxCorners(plan, m(-14), 0), [0, 0, m(HH + 30)]], W, H, { pad: 12, azimuth: 30, elevation: 32 });
  const T = helpers(P);
  const { S, L: Ln, D, at } = T;
  const body = [surfacePlate(T, P, plan)];
  const x0 = -L / 2, x1 = L / 2, y0 = -WD / 2, y1 = WD / 2, sl = -SLOT / 2, sr = SLOT / 2, zf = HH - DEPTH;
  const slab = (xa, xb, ya, yb, za, zb, tone = "hi") => S(k.slabOf({ x: m(xa), y: m(ya), w: m(xb - xa), d: m(yb - ya), r: 0.6 }, m(za), m(zb - za), P, 2, 0.6), { tone });
  body.push(`<path class="iso-halo" d="${k.haloOf({ x: m(x0), y: m(y0), w: m(L), d: m(WD), r: m(1) }, 0, m(HH), P)}"/>`);
  const ghost = [];
  ghost.push(slab(x0, x1, y0, y1, 0, zf));
  ghost.push(slab(x0, x1, y0, sl, zf, HH));
  ghost.push(slab(x0, x1, sr, y1, zf, HH));
  // Fasen-/Schliffkanten und Gravur
  ghost.push(Ln(k.lineOnTop([m(x0 + 3), m(y0 + 4)], [m(x0 + 3), m(sl - 4)], m(HH), P), { tone: "faint" }));
  ghost.push(k.faceTextSvg(k.topMatrix([m(4), m((sr + y1) / 2)], m(HH), P, "x"), "NS-80", { size: 4.5, tone: "faint", anchor: "middle" }));
  body.push(`<g data-iso-ghost>${ghost.join("")}</g>`);
  // Anschlagwinkel hinten als Bezugssimulator für die Seitenflächen
  body.push(S(k.slabOf({ x: m(x0 - 4), y: m(y0 - 14), w: m(L + 8), d: m(10), r: m(1) }, 0, m(HH + 6), P, 3, 0.6), { tone: "mid" }));
  body.push(D([[x0 + 4, y0 - 9], [x1 - 4, y0 - 9]].map(([x, y]) => at([m(x), m(y), m(HH + 6)])), { size: 0.5 }));

  const ov = [];
  const w = ZONE_W;
  const rect = (y, za, zb) => T.poly([[m(x0), m(y), m(za)], [m(x1), m(y), m(za)], [m(x1), m(y), m(zb)], [m(x0), m(y), m(zb)]], true);
  // Bezug A: Mittelebene aus den beiden Außenflächen (blau), tolerierte Nutflanken (rot)
  ov.push(`<path data-show="d:A" class="gps-datum-fill" d="${rect(y1, 0, HH)}"/>`);
  ov.push(`<path data-show="d:A" class="gps-datum-axis" d="${rect(0, -4, HH + 10)}"/>`);
  ov.push(`<path data-show="0" class="gps-feature-fill" d="${rect(sl, zf, HH)}"/>`);
  ov.push(`<g data-show="0" class="gps-zone"><path d="${rect(w / 2, zf, HH + 6)}"/><path class="gps-zone-low" d="${rect(-w / 2, zf, HH + 6)}"/></g>`);
  const e = (0.05 / 0.08) * (w / 2);
  ov.push(`<path data-show="0" class="gps-actual" d="${T.poly([[m(x0), m(e * 0.3), m((zf + HH) / 2)], [m(x1), m(-e * 0.9), m((zf + HH) / 2)]])}"/>`);
  body.push(`<g class="gps-overlays">${ov.join("")}</g>`);
  const svg = k.figureSvg({ width: W, height: H, label: "Nutenstein auf der Messplatte an einem Anschlag. Die Mittelebene der beiden Außenflächen ist Bezug A; die Mittelfläche der Nut muss zwischen zwei Ebenen im Abstand 0,08 liegen, symmetrisch zu A.", body });
  return { svg, live: liveOf(P, [{ mode: "static", ghost: false, tol: 0.08, text: say.symmetry(0.05, 0.08) }]) };
}

// ---------- ∠ Neigung: Schrägblock auf dem Sinuslineal ----------
export function angularityFigure() {
  const TH = -30 * RAD; // Lineal fällt nach +x, damit die 30°-Fläche waagerecht liegt
  const c = Math.cos(TH), s = Math.sin(TH);
  const ROLL = 7, BAR = 14, Y0 = -16, Y1 = 16;
  // Ursprung so, dass die rechte Rolle (u = 100) auf der Platte liegt
  const ox = -40, oz = ROLL - (100 * s + -ROLL * c);
  const W3 = (u, v, y = 0) => [m(ox + u * c - v * s), m(y), m(oz + u * s + v * c)];
  const plan = { x: m(-60), y: m(-62), w: m(150), d: m(100), r: m(6) };
  const stackH = oz + 0 * s + -ROLL * c - ROLL; // Höhe des Endmaßstapels unter der linken Rolle
  const P = k.fitProjection([...k.boxCorners(plan, m(-14), 0), [m(ox), 0, m(oz + 80)], [0, m(-50), m(110)]], W, H, { pad: 12, azimuth: 40, elevation: 30 });
  const T = helpers(P);
  const { S, L: Ln, D, at } = T;
  const body = [surfacePlate(T, P, plan)];
  const prism = (poly, y0, y1, style) => {
    const F = G.frameOf([m(ox), m(y0), m(oz)], [0, 1, 0], [c, 0, s], [-s, 0, c]);
    return S(G.prismOf(F, poly.map(([u, v]) => [m(u), m(v)]), 0, m(y1 - y0), P), style);
  };
  // Endmaßstapel unter der linken Rolle (50 mm = 100·sin 30°)
  const blocks = [25, 20, 5];
  let z = 0;
  for (const h of blocks) {
    body.push(S(k.slabOf({ x: m(ox - 4.5), y: m(-14), w: m(9), d: m(28), r: 0.4 }, m(z), m(h), P, 2, 0.4), { tone: "hi", crease: "lo" }));
    body.push(k.faceTextSvg(k.sideMatrix([m(ox + 4.5), m(0)], m(z + h / 2 + 1.2), P, "left"), String(h), { size: 3.4, tone: "lo", anchor: "middle" }));
    z += h;
  }
  void stackH;
  // Rollen
  for (const u of [0, 100]) {
    const [rx, , rz] = W3(u, -ROLL);
    const F = G.frameOf([rx, m(Y0 - 2), rz], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
    body.push(S(G.disc(0, m(Y1 - Y0 + 4), m(ROLL), F, P), { tone: "mid" }));
  }
  // Linealkörper und Endanschlag
  body.push(prism([[-12, 0], [112, 0], [112, BAR], [-12, BAR]], Y0, Y1, { tone: "mid" }));
  body.push(prism([[-12, BAR], [-6, BAR], [-6, BAR + 10], [-12, BAR + 10]], Y0, Y1, { tone: "mid" }));
  body.push(D([W3(20, BAR, Y1), W3(80, BAR, Y1)].map((p) => at(p)), { size: 0.5 }));
  // Schrägblock: Grundfläche A liegt auf dem Lineal; zwei konvexe Teile
  const v0 = BAR, base = 12, top = base + 70 * Math.tan(30 * RAD);
  const ghost = [];
  ghost.push(prism([[-5, v0], [25, v0], [25, v0 + base], [-5, v0 + base]], -12, 12, { tone: "hi" }));
  ghost.push(prism([[25, v0], [95, v0], [95, v0 + top], [25, v0 + base]], -12, 12, { tone: "hi" }));
  body.push(`<g data-iso-ghost>${ghost.join("")}</g>`);

  // Höhenmessgerät hinten, Messuhr fährt über die nun waagerechte Schrägfläche
  const zS = W3(25, v0 + base)[2] / m(1); // Höhe der Fläche in mm
  const RAIL_Y = -46, DIAL_R = 9, SWEEP = [W3(30, v0 + base)[0] / m(1), W3(90, v0 + top)[0] / m(1)];
  const cyc = 0;
  body.push(S(k.slabOf({ x: m(SWEEP[0] - 20), y: m(RAIL_Y - 6), w: m(SWEEP[1] - SWEEP[0] + 40), d: m(4), r: 1 }, 0, m(2.4), P, 3, 0.4), { tone: "mid" }));
  body.push(S(k.slabOf({ x: m(SWEEP[0] - 20), y: m(RAIL_Y + 4), w: m(SWEEP[1] - SWEEP[0] + 40), d: m(4), r: 1 }, 0, m(2.4), P, 3, 0.4), { tone: "mid" }));
  const g = [];
  const sx = SWEEP[0];
  g.push(S(k.slabOf({ x: m(sx - 10), y: m(RAIL_Y - 9), w: m(20), d: m(20), r: m(2) }, m(2.4), m(8), P, 4, 0.6), { tone: "mid" }));
  g.push(S(k.cylinder(m(sx), m(RAIL_Y), m(3.2), m(10.4), m(zS + 30 - 10.4), P, 28), { tone: "mid", crease: "none" }));
  g.push(S(k.slabOf({ x: m(sx - 6), y: m(RAIL_Y - 6), w: m(12), d: m(12), r: m(2) }, m(zS + 14), m(10), P, 4, 0.6), { tone: "mid" }));
  g.push(S(k.slabOf({ x: m(sx - 2.4), y: m(RAIL_Y + 6), w: m(4.8), d: m(-RAIL_Y - 6 - DIAL_R + 2 + cyc), r: m(1.2) }, m(zS + 17), m(3.4), P, 3, 0.4), { tone: "mid" }));
  g.push(S(k.cylinder(m(sx), m(0), m(1.3), m(zS), m(1.2), P, 16), { tone: "hi", lit: true }));
  g.push(S(k.cylinder(m(sx), m(0), m(0.8), m(zS + 1.2), m(7.8), P, 16), { tone: "hi", crease: "none", lit: true }));
  g.push(dialSvg(T, P, [sx, 0], zS + 9, DIAL_R));
  g.push(needleSvg(T, P, [sx, 0], zS + 15, DIAL_R));
  body.push(`<g data-iso-move="f0">${g.join("")}</g>`);

  const ov = [];
  const w = ZONE_W;
  const slopeQuad = (dv) => T.poly([W3(25, v0 + base + dv * 0, -12), W3(95, v0 + top, -12), W3(95, v0 + top, 12), W3(25, v0 + base, 12)].map(([x, y, zz]) => [x, y, zz + m(dv)]), true);
  ov.push(`<path data-show="0" class="gps-feature-fill" d="${slopeQuad(0)}"/>`);
  ov.push(`<g data-show="0" class="gps-zone"><path d="${slopeQuad(w / 2)}" class="gps-zone-top"/><path class="gps-zone-low" d="${slopeQuad(-w / 2)}"/></g>`);
  ov.push(`<path data-show="d:A" class="gps-datum-line" d="${T.poly([W3(-5, v0, 12), W3(95, v0, 12)])}"/>`);
  const md = scaleModel({ rot: [], lin: [[1, 0.7, 0.3], [0.4, 2.2, 1.1], [0.2, 3.9, 0.4]] }, 0.06);
  const prof = Array.from({ length: 61 }, (_, j) => { const u = j / 60; const x = SWEEP[0] + (SWEEP[1] - SWEEP[0]) * u; return [m(x), 0, m(zS + md.at(0, u) * (w / 0.06))]; });
  ov.push(`<path data-show="0" class="gps-actual" d="${T.poly(prof)}"/>`);
  body.push(`<g class="gps-overlays">${ov.join("")}</g>`);
  const svg = k.figureSvg({ width: W, height: H, label: "Schrägblock auf einem Sinuslineal mit 100 mm Rollenabstand; ein Endmaßstapel von 50 mm kippt das Lineal um 30°, so dass die 30°-Fläche waagerecht liegt. Ein Höhenmessgerät mit Messuhr fährt über die Fläche.", body });
  return {
    svg,
    live: liveOf(P, [{ mode: "run", tol: 0.06, turns: 0, period: 14, move0: [0, 0], move1: k.axisVector(P, [m(SWEEP[1] - SWEEP[0]), 0, 0]), needle: { c: [sx, 0, zS + 15], len: DIAL_R - 2.6, perTurn: 0.1 }, model: { rot: md.rot, lin: md.lin, mid: md.mid } }]),
  };
}

// ---------- ⌓ Flächenprofil: Gehäusedeckel auf dem Koordinatenmessgerät ----------
export function surfaceFigure() {
  const R = 59, HALF = 46, RIM = 56, RIM_H = 7;
  const capH = R - Math.sqrt(R * R - HALF * HALF); // Höhe der Kalotte über dem Bund
  const zc = RIM_H + capH - R; // Kugelmittelpunkt
  const top = RIM_H + capH;
  const plan = { x: m(-72), y: m(-72), w: m(150), d: m(144), r: m(6) };
  const COL = [62, -40];
  const P = k.fitProjection([...k.boxCorners(plan, m(-14), 0), [m(COL[0]), m(COL[1]), m(top + 46)], [0, 0, m(top + 30)]], W, H, { pad: 12, azimuth: 40, elevation: 30 });
  const T = helpers(P);
  const { S, L: Ln, D, at } = T;
  const body = [surfacePlate(T, P, plan)];
  const F = G.frameOf([0, 0, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  // Drei Auflagepunkte
  for (const a of [90, 210, 330]) {
    const p = [m(40 * Math.cos(a * RAD)), m(40 * Math.sin(a * RAD))];
    body.push(S(k.cylinder(p[0], p[1], m(4), 0, m(4), P, 24, 0.4), { tone: "mid" }));
  }
  const F4 = G.frameOf([0, 0, m(4)], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  const dome = [];
  for (let i = 0; i <= 16; i++) { const r = HALF - (HALF * i) / 16; dome.push([m(zc + Math.sqrt(R * R - r * r)), m(r), 1]); }
  const ghost = [];
  ghost.push(`<path class="iso-halo" d="${k.haloOf({ x: m(-RIM), y: m(-RIM), w: m(2 * RIM), d: m(2 * RIM), r: m(RIM) }, m(4), m(RIM_H), P)}"/>`);
  ghost.push(S(G.solidOf([[0, m(RIM)], [m(RIM_H), m(RIM)]], F4, P), { tone: "hi" }));
  ghost.push(S(G.solidOf([[m(RIM_H), m(HALF)], ...dome.slice(1)], F4, P, { smooth: true }), { tone: "hi" }));
  const bolts = Array.from({ length: 8 }, (_, i) => (i / 8) * 2 * Math.PI + 0.2);
  bolts.forEach((a) => ghost.push(T.hole("sf", m(51 * Math.cos(a)), m(51 * Math.sin(a)), m(2.4), m(4 + RIM_H), m(RIM_H), { chamfer: 0.4 })));
  body.push(`<g data-iso-ghost>${ghost.join("")}</g>`);
  void F;

  // Messarm des KMG mit Rubinkugel auf der Kuppel
  const tipA = 25 * RAD, tipR = 30;
  const tip = [tipR * Math.cos(-tipA), tipR * Math.sin(-tipA)];
  const tipZ = 4 + zc + Math.sqrt(R * R - tipR * tipR);
  body.push(S(k.slabOf({ x: m(COL[0] - 11), y: m(COL[1] - 11), w: m(22), d: m(22), r: m(3) }, 0, m(7), P, 4, 0.8), { tone: "mid" }));
  body.push(S(k.cylinder(m(COL[0]), m(COL[1]), m(5), m(7), m(top + 46 - 7), P, 32), { tone: "mid", crease: "none" }));
  const armZ = tipZ + 26;
  {
    const dx = COL[0] - tip[0], dy = COL[1] - tip[1], len = Math.hypot(dx, dy), nx = -dy / len * 2.5, ny = dx / len * 2.5;
    const ring = [[tip[0] + nx, tip[1] + ny], [COL[0] + nx, COL[1] + ny], [COL[0] - nx, COL[1] - ny], [tip[0] - nx, tip[1] - ny]].map(([x, y]) => [m(x), m(y)]);
    body.push(S(k.extrude(ring, m(armZ), m(4), P, { bevel: 0.3 }), { tone: "mid" }));
  }
  const cp = { x: m(COL[0] - 7.5), y: m(COL[1] - 7.5), w: m(15), d: m(15), r: m(2) };
  body.push(S(k.slabOf(cp, m(armZ - 4), m(12), P, 4, 0.6), { tone: "mid" }));
  body.push(S(k.cylinder(m(tip[0]), m(tip[1]), m(5), m(armZ - 8), m(12), P, 32, 0.6), { tone: "mid" }));
  body.push(S(k.cylinder(m(tip[0]), m(tip[1]), m(0.9), m(tipZ + 1.4), m(armZ - 8 - tipZ - 1.4), P, 16), { tone: "hi", crease: "none" }));
  body.push(S(G.sphereOf([m(tip[0]), m(tip[1]), m(tipZ + 1.4)], m(1.6), P), { tone: "hi", lit: true }));
  body.push(D([at([m(tip[0]), m(tip[1]), m(armZ + 4)])], { size: 0.6 }));

  const ov = [];
  const w = ZONE_W;
  // Meridian in der Ebene, die der Betrachter frontal sieht, und ein Breitenkreis
  const [vx, vy] = k.towardViewer(P);
  const b = Math.atan2(vy, vx) - Math.PI / 2;
  const merid = (dR, wob = 0) => Array.from({ length: 41 }, (_, j) => {
    const r = -HALF + (2 * HALF * j) / 40;
    const RR = R + dR;
    const zz = 4 + zc + Math.sqrt(Math.max(RR * RR - r * r, 0)) + wob * Math.sin(j * 0.45 + 0.6) * (0.14 / 0.2) * (w / 2);
    return [m(r * Math.cos(b)), m(r * Math.sin(b)), m(zz)];
  });
  const outline = k.cylinder(0, 0, m(HALF), m(4 + RIM_H), 0.01, P, 64);
  void outline;
  ov.push(`<path data-show="0" class="gps-feature-line-solo" d="${T.poly(merid(0))}"/>`);
  ov.push(`<g data-show="0" class="gps-zone"><path d="${T.poly(merid(w / 2))}"/><path class="gps-zone-low" d="${T.poly(merid(-w / 2))}"/></g>`);
  const lat = (dR) => { const r = 32, RR = R + dR; const zz = 4 + zc + Math.sqrt(RR * RR - r * r); return T.poly(T.full(r, zz), true); };
  ov.push(`<g data-show="0" class="gps-zone"><path d="${lat(w / 2)}"/><path class="gps-zone-low" d="${lat(-w / 2)}"/></g>`);
  ov.push(`<path data-show="0" class="gps-actual" d="${T.poly(merid(0, 1))}"/>`);
  body.push(`<g class="gps-overlays">${ov.join("")}</g>`);
  void Ln;
  const svg = k.figureSvg({ width: W, height: H, label: "Gehäusedeckel mit Kugelkalotte SR59 auf drei Auflagepunkten eines Koordinatenmessgeräts. Die Tasterkugel nimmt Punkte auf der Kuppel auf; die Fläche muss zwischen zwei Hüllflächen im Abstand 0,2 um die Sollform liegen.", body });
  return { svg, live: liveOf(P, [{ mode: "static", ghost: false, tol: 0.2, text: say.surface(0.14, 0.2) }]) };
}
