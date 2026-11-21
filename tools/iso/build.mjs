// Baut die isometrischen Prüfaufbau-Figuren für die Zeichnungsseite.
// Aufruf: node tools/iso/build.mjs  →  schreibt dist/iso/fig-0.js … fig-6.js
// Geometrie mit dem Anatomy-Kit (MIT, siehe kit/LICENSE-anatomy).
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "./kit/iso-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, "..", "..", "dist", "iso");

export const W = 600;
export const H = 400;
export const U = 2.2; // Welteinheiten je Millimeter
export const m = (mm) => mm * U;

// ---------- kleine Helfer ----------
export function kitFor(P) {
  const at = (p) => k.iso(p, P);
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const D = (points, style) => k.dotsSvg(points, style);
  const depth = ([x, y, z = 0]) => k.depthOf([x, y, z], P);
  let clip = 0;
  // Bohrung in einer Deckfläche: dunkle Öffnung, sichtbare Innenwand, Fase.
  function hole(id, cx, cy, r, z, deep, { chamfer = 0.5, rim = "mid" } = {}) {
    const top = k.ring(cx, cy, r, z, P, 48);
    const floor = k.ring(cx, cy, r, z - deep, P, 48);
    const cid = `${id}-h${clip++}`;
    return (
      `<clipPath id="${cid}"><path d="${top}"/></clipPath>` +
      `<path class="iso-hole" d="${top}"/>` +
      `<path class="iso-hole-floor" clip-path="url(#${cid})" d="${floor}"/>` +
      L(top, { tone: rim }) +
      (chamfer ? L(k.ring(cx, cy, r + chamfer, z, P, 48), { tone: "faint" }) : "")
    );
  }
  // Ebene Kontur leicht über/unter einer Fläche (Toleranzzone, überhöht).
  const outlineAt = (ring, z) => k.onTop(ring, z, P, true);
  return { at, S, L, D, depth, hole, outlineAt };
}

// Ring: Kreis mit Abflachung (Sehne) auf +y-Seite.
export function flatCircle(r, flatY, steps = 96) {
  const pts = [];
  const a0 = Math.asin(flatY / r);
  const a1 = Math.PI - a0;
  for (let i = 0; i <= steps; i++) {
    const a = a1 + (i / steps) * (2 * Math.PI - (a1 - a0));
    pts.push([r * Math.cos(a), r * Math.sin(a)]);
  }
  return pts;
}

// Gemeinsame Messplatte mit Füßen, Nut, Schrauben, Lineal und Typenschild.
export function surfacePlate(T, P, plan) {
  const { S, L, D, at } = T;
  const PLATE_H = m(10);
  const FOOT_H = m(4);
  const out = [`<path class="iso-halo" d="${k.haloOf(plan, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  const feet = [...k.corners(plan, m(16))].sort((a, b) => T.depth(a) - T.depth(b));
  for (const [x, y] of feet) {
    out.push(S(k.cylinder(x, y, m(6), -PLATE_H - FOOT_H, m(1.4), P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, m(4.6), -PLATE_H - FOOT_H + m(1.4), FOOT_H - m(1.4), P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(plan, -PLATE_H, PLATE_H, P, 8, 1.4), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(plan, m(4)), 0, P), { tone: "lo" }));
  const screws = k.corners(plan, m(8));
  out.push(L(screws.map(([x, y]) => k.ring(x, y, m(1.8), 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // Lineal an der vorderen Kante
  const strip = { x: plan.x + m(18), y: plan.y + plan.d - m(11), w: plan.w - m(36), d: m(5), r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + m(3), strip.x + strip.w - m(3), m(2), 5, strip.y + 0.8, 0.6, [m(1.2), m(2.4)], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + m(1.4), strip.y + m(2.5), 0.6]), at([strip.x + strip.w - m(1.4), strip.y + m(2.5), 0.6])], { size: 0.45 }));
  return out.join("");
}

// ---------- Figur 0: Flansch mit Lochkreis ----------
function flange() {
  // Teilmaße (mm) aus der Zeichnung
  const R = 52, FLAT = 41, THK = 12, HUB_R = 23.5, HUB_L = 26, BORE_R = 16, BC_R = 35, HOLE_R = 4.5;
  const DISC_H = 6, POST_H = 28, BUTTON_H = 2;
  const Z_BOT = DISC_H + POST_H + BUTTON_H; // Unterseite Flanschplatte
  const Z_TOP = Z_BOT + THK; // Fläche A
  const HUB_Z = Z_BOT - HUB_L;
  const RAIL_Y = -70;
  const SWEEP_Y = -26;
  const SWEEP = [-34, 34];
  const DIAL_R = 12, DIAL_Z = Z_TOP + 20, DIAL_H = 7, POST_TOP = DIAL_Z + 26, ARM_Z = DIAL_Z + 12;
  const PER_TURN = 0.1; // mm je Zeigerumdrehung (Feinmessuhr 0,001 mm)
  const EXAG = 30; // Überhöhung der Toleranzzonen

  const plan = { x: m(-86), y: m(-84), w: m(168), d: m(150), r: m(6) };
  const P = k.fitProjection(
    [...k.boxCorners(plan, m(-14), 0), [0, m(RAIL_Y), m(POST_TOP + 3)], [m(R), 0, m(Z_TOP)], [0, m(R), m(Z_TOP)]],
    W, H, { pad: 10, azimuth: 40, elevation: 32 },
  );
  const T = kitFor(P);
  const { S, L, D, at, hole } = T;
  const body = [];

  body.push(surfacePlate(T, P, plan));

  // --- Führungsschiene hinten für den Messuhrständer
  const rail = (y) => ({ x: m(-70), y: m(y), w: m(140), d: m(4), r: 1 });
  for (const y of [RAIL_Y - 9, RAIL_Y + 5]) {
    body.push(S(k.slabOf(rail(y), 0, m(2.4), P, 3, 0.4), { tone: "mid" }));
    body.push(D([m(-64), m(64)].map((x) => at([x, m(y + 2), m(2.4)])), { size: 0.4 }));
  }
  for (const x of [-74, 70]) {
    body.push(S(k.slabOf({ x: m(x), y: m(RAIL_Y - 12), w: m(4), d: m(24), r: 1.2 }, 0, m(6), P, 3, 0.5), { tone: "mid" }));
    body.push(D([at([m(x + 2), m(RAIL_Y - 8), m(6)]), at([m(x + 2), m(RAIL_Y + 8), m(6)])], { size: 0.45 }));
  }

  const standAt = body.length;

  // --- Messuhrständer (bewegt sich entlang x): Schlitten, Säule, Klemme
  const stand = [];
  const sled = { x: m(-11), y: m(RAIL_Y - 12), w: m(22), d: m(24), r: m(2) };
  stand.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(sled, 2), m(2.4), 0.1, P)}" style="filter:blur(4px)"/>`);
  stand.push(S(k.slabOf(sled, m(2.4), m(9), P, 4, 0.7), { tone: "mid" }));
  stand.push(L(k.planOutline(k.insetPlan(sled, m(2.4)), m(11.4), P, 4), { tone: "faint" }));
  stand.push(D([[-7, -8], [7, -8], [-7, 8], [7, 8]].map(([x, y]) => at([m(x), m(RAIL_Y + y), m(11.4)])), { size: 0.45 }));
  const knob = [m(11), m(RAIL_Y + 4)];
  stand.push(S(k.slabOf({ x: m(10), y: m(RAIL_Y + 2.6), w: m(3), d: m(2.8), r: 0.6 }, m(5), m(3), P, 2), { tone: "mid", crease: "none" }));
  stand.push(S(k.cylinder(knob[0] + m(3.4), knob[1], m(3.2), m(3.6), m(6), P, 24), { tone: "mid" }));
  stand.push(L(k.knurl(knob[0] + m(3.4), knob[1], m(3.2), m(3.6), m(9.6), 22, P), { tone: "lo" }));
  stand.push(S(k.cylinder(0, m(RAIL_Y), m(3), m(11.4), m(POST_TOP - 11.4), P, 28), { tone: "mid", crease: "none" }));
  stand.push(L([30, 60].map((z) => k.sideArc(0, m(RAIL_Y), m(3), m(z), P, 16)).join(""), { tone: "faint" }));
  stand.push(S(k.cylinder(0, m(RAIL_Y), m(3.6), m(POST_TOP), m(1.6), P, 28), { tone: "mid" }));
  const clamp = { x: m(-6), y: m(RAIL_Y - 6), w: m(12), d: m(12), r: m(2) };
  stand.push(S(k.slabOf(clamp, m(ARM_Z - 4), m(10), P, 4, 0.6), { tone: "mid" }));
  stand.push(S(k.slabOf({ x: m(-1.2), y: m(RAIL_Y - 9), w: m(2.4), d: m(3), r: 0.6 }, m(ARM_Z - 1), m(4), P, 2), { tone: "mid", crease: "none" }));

  // --- Aufnahme: Grundscheibe, drei Auflagestifte mit gehärteten Kuppen
  body.push(`<path class="iso-halo" d="${k.haloOf({ x: m(-46), y: m(-46), w: m(92), d: m(92), r: m(46) }, 0, m(DISC_H), P)}"/>`);
  body.push(S(k.cylinder(0, 0, m(46), 0, m(DISC_H), P, 96, 1.2), { tone: "mid" }));
  body.push(L(k.ring(0, 0, m(42), m(DISC_H), P, 96), { tone: "faint" }));
  const discScrews = [15, 135, 255].map((a) => [m(30) * Math.cos((a * Math.PI) / 180), m(30) * Math.sin((a * Math.PI) / 180)]);
  body.push(L(discScrews.map(([x, y]) => k.ring(x, y, m(2.2), m(DISC_H), P, 16)).join(""), { tone: "lo" }));
  body.push(D(discScrews.map(([x, y]) => at([x, y, m(DISC_H)])), { size: 0.5 }));
  const posts = [45, 165, 285].map((a) => [m(38) * Math.cos((a * Math.PI) / 180), m(38) * Math.sin((a * Math.PI) / 180)]);
  const postSvg = ([x, y]) =>
    S(k.cylinder(x, y, m(5), m(DISC_H), m(POST_H), P, 32, 0.6), { tone: "mid", inner: L(k.sideArc(x, y, m(5), m(DISC_H + 4), P, 20), { tone: "faint" }) }) +
    S(k.cylinder(x, y, m(3.2), m(DISC_H + POST_H), m(BUTTON_H), P, 24), { tone: "hi" });
  const behind = posts.filter((p) => T.depth(p) < 0);
  const front = posts.filter((p) => T.depth(p) >= 0);
  behind.forEach((p) => body.push(postSvg(p)));

  // --- Nabe unter der Platte
  body.push(S(k.cylinder(0, 0, m(HUB_R), m(HUB_Z), m(HUB_L), P, 96), { tone: "mid", inner: L(k.sideArc(0, 0, m(HUB_R), m(HUB_Z + 1.2), P, 64), { tone: "faint" }) }));
  front.forEach((p) => body.push(postSvg(p)));

  // Ständer hinten, vor der Platte zeichnen (liegt dahinter)
  // Ständer liegt hinter der Aufnahme: direkt nach Schiene und Endanschlägen malen
  body.splice(standAt, 0, `<g data-iso-move="f0 f1">${stand.join("")}</g>`);

  // --- Flanschplatte mit Abflachung (Bezug C), Bohrung (Bezug B) und Lochkreis
  const ring = flatCircle(m(R), m(FLAT));
  const flangeParts = [];
  flangeParts.push(`<path class="iso-halo" d="${k.haloOf({ x: m(-R), y: m(-R), w: m(2 * R), d: m(2 * R), r: m(R) }, m(Z_BOT), m(THK), P)}" style="opacity:.18"/>`);
  flangeParts.push(S(k.extrude(ring, m(Z_BOT), m(THK), P, { bevel: 1.2 }), { tone: "hi" }));
  flangeParts.push(L(k.onTop(flatCircle(m(R - 1.2), m(FLAT - 1.2)), m(Z_TOP), P, true), { tone: "faint" }));
  flangeParts.push(hole("fl", 0, 0, m(BORE_R), m(Z_TOP), m(THK + HUB_L), { chamfer: 0.9 }));
  const holes = [0, 90, 180, 270].map((a) => [m(BC_R) * Math.cos((a * Math.PI) / 180), m(BC_R) * Math.sin((a * Math.PI) / 180)]);
  holes.forEach(([x, y]) => flangeParts.push(hole("fl", x, y, m(HOLE_R), m(Z_TOP), m(THK))));
  // Gravur auf der Fläche: Teilenummer
  flangeParts.push(k.faceTextSvg(k.topMatrix([m(-30), m(14)], m(Z_TOP), P, "y"), "G2A-01", { size: 5, tone: "faint", anchor: "middle" }));
  body.push(`<g data-iso-ghost>${flangeParts.join("")}</g>`);

  // --- Messuhr am Arm (bewegt sich mit dem Ständer)
  const gauge = [];
  const arm = { x: m(-2.4), y: m(RAIL_Y + 6), w: m(4.8), d: m(SWEEP_Y - DIAL_R - RAIL_Y - 4), r: m(1.4) };
  gauge.push(S(k.slabOf(arm, m(ARM_Z), m(3.6), P, 3, 0.4), { tone: "mid" }));
  gauge.push(D([at([0, arm.y + m(3), m(ARM_Z + 3.6)]), at([0, arm.y + arm.d - m(3), m(ARM_Z + 3.6)])], { size: 0.45 }));
  gauge.push(S(k.slabOf({ x: m(-3.5), y: m(SWEEP_Y - DIAL_R - 5), w: m(7), d: m(6), r: 1 }, m(DIAL_Z + 2), m(ARM_Z - DIAL_Z + 1.6), P, 3, 0.4), { tone: "mid" }));
  // Messbolzen bis zur Fläche A
  gauge.push(S(k.cylinder(0, m(SWEEP_Y), m(1.6), m(Z_TOP), m(1.4), P, 20), { tone: "hi", lit: true }));
  gauge.push(S(k.cylinder(0, m(SWEEP_Y), m(0.9), m(Z_TOP + 1.4), m(DIAL_Z - Z_TOP - 1.4), P, 16), { tone: "hi", crease: "none", lit: true }));
  gauge.push(S(k.cylinder(0, m(SWEEP_Y), m(2.2), m(DIAL_Z - 4), m(4), P, 20), { tone: "mid" }));
  const DT = m(DIAL_Z + DIAL_H);
  gauge.push(S(k.cylinder(0, m(SWEEP_Y), m(DIAL_R), m(DIAL_Z), m(DIAL_H), P, 72, 0.8), { tone: "hi", crease: "lo" }));
  gauge.push(L(k.knurl(0, m(SWEEP_Y), m(DIAL_R), DT - m(2.4), DT, 80, P, 0.3), { tone: "lo" }));
  gauge.push(L(k.sideArc(0, m(SWEEP_Y), m(DIAL_R), DT - m(2.4), P, 40), { tone: "faint" }));
  gauge.push(L(k.ring(0, m(SWEEP_Y), m(DIAL_R - 1.6), DT, P, 72), { tone: "lo" }));
  const ticks = k.radialTicks(0, m(SWEEP_Y), m(DIAL_R - 2), 50, 5, DT, [m(1), m(2)], P);
  gauge.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  gauge.push(L(k.ring(0, m(SWEEP_Y), m(1.1), DT, P, 16), { tone: "mid" }));
  gauge.push(k.faceTextSvg(k.topMatrix([0, m(SWEEP_Y + 6)], DT, P, "x"), "0.001", { size: 3.2, tone: "lo", anchor: "middle" }));
  // Krone seitlich
  gauge.push(S(k.slabOf({ x: m(DIAL_R - 1), y: m(SWEEP_Y - 1.6), w: m(4), d: m(3.2), r: 0.8 }, m(DIAL_Z + 1.6), m(3.6), P, 3), { tone: "mid" }));
  gauge.push(S(k.slabOf({ x: m(DIAL_R + 2.6), y: m(SWEEP_Y - 2.4), w: m(2), d: m(4.8), r: 0.8 }, m(DIAL_Z + 1), m(5), P, 3), { tone: "mid" }));
  const needleD = (turn) => {
    const a = turn * Math.PI * 2;
    return k.lineOnTop([-Math.sin(a) * m(2.6), m(SWEEP_Y) + Math.cos(a) * m(2.6)], [Math.sin(a) * m(DIAL_R - 3), m(SWEEP_Y) - Math.cos(a) * m(DIAL_R - 3)], DT + 0.2, P);
  };
  gauge.push(`<path data-iso-needle class="iso-line" data-tone="lit" data-free="start" d="${needleD(0)}" style="stroke-width:1.1"/>`);
  body.push(`<g data-iso-move="f0 f1">${gauge.join("")}</g>`);

  const SW = { from: SWEEP[0], to: SWEEP[1], a: 0.012, b: 0.007, c: 0.003 };
  const deviationAt = (x) => {
    const t = (x - SW.from) / (SW.to - SW.from);
    return SW.a * Math.sin(2 * Math.PI * t * 0.9) + SW.b * Math.sin(2 * Math.PI * t * 2.3 + 1) + SW.c * Math.cos(2 * Math.PI * t * 4.1);
  };

  // ---------- Überlagerungen je Toleranz ----------
  const ov = [];
  const top = k.onTop(ring, m(Z_TOP), P, true);
  // Fläche A als Bezug (blau) oder toleriertes Element (rot)
  ov.push(`<path data-show="d:A" class="gps-datum-fill" d="${top}"/>`);
  ov.push(`<path data-show="0" class="gps-feature-fill" d="${top}"/>`);
  // Ebenheitszone: zwei parallele Ebenen im Abstand t, stark überhöht (×FLAT_EXAG),
  // dazwischen das Ist-Profil des Beispielteils entlang der Messbahn.
  const FLAT_EXAG = 100;
  const dz = m((0.05 * FLAT_EXAG) / 2);
  ov.push(`<g data-show="0" class="gps-zone">` + `<path d="${T.outlineAt(ring, m(Z_TOP) + dz)}" class="gps-zone-top"/>` + `<path d="${T.outlineAt(ring, m(Z_TOP) - dz)}" class="gps-zone-low"/>` + `</g>`);
  const profile = [];
  for (let i = 0; i <= 80; i++) {
    const x = SWEEP[0] + ((SWEEP[1] - SWEEP[0]) * i) / 80;
    profile.push(at([m(x), m(SWEEP_Y), m(Z_TOP) + m(deviationAt(x) * FLAT_EXAG)]));
  }
  ov.push(`<path data-show="0" class="gps-actual" d="M${profile.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join("L")}"/>`);
  // Bezug B: Bohrung, Bezug C: Abflachung
  const boreTop = k.ring(0, 0, m(BORE_R), m(Z_TOP), P, 64);
  ov.push(`<path data-show="d:B" class="gps-datum-line" d="${boreTop}"/>`);
  const cx = Math.sqrt(R * R - FLAT * FLAT);
  const flatFace = [[-cx, FLAT, Z_BOT], [cx, FLAT, Z_BOT], [cx, FLAT, Z_TOP], [-cx, FLAT, Z_TOP]].map(([x, y, z]) => at([m(x), m(y), m(z)]));
  ov.push(`<path data-show="d:C" class="gps-datum-fill" d="M${flatFace.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join("L")}Z"/>`);
  // Positionstoleranz: Bohrung bei +x, Zone ⌀t überhöht um ihre theoretisch genaue Lage
  const [hx, hy] = holes[0];
  const zr = m((0.2 * EXAG) / 2);
  const cyl = k.cylinder(hx, hy, zr, m(Z_BOT), m(THK), P, 40);
  ov.push(`<g data-show="1" class="gps-zone-solid"><path d="${cyl.fill}"/></g>`);
  ov.push(`<g data-show="1" class="gps-feature-line"><path d="${k.ring(hx, hy, m(HOLE_R), m(Z_TOP), P, 48)}"/><path d="${k.ring(hx, hy, m(HOLE_R), m(Z_BOT), P, 48)}" class="gps-hidden"/>` +
    `<path d="${k.segment([hx - m(HOLE_R) * 0.77, hy + m(HOLE_R) * 0.64, m(Z_BOT)], [hx - m(HOLE_R) * 0.77, hy + m(HOLE_R) * 0.64, m(Z_TOP)], P)}" class="gps-hidden"/>` +
    `<path d="${k.segment([hx + m(HOLE_R) * 0.77, hy - m(HOLE_R) * 0.64, m(Z_BOT)], [hx + m(HOLE_R) * 0.77, hy - m(HOLE_R) * 0.64, m(Z_TOP)], P)}" class="gps-hidden"/></g>`);
  ov.push(`<g data-show="1" class="gps-zone"><path d="${k.ring(hx, hy, zr, m(Z_TOP), P, 40)}"/><path d="${k.ring(hx, hy, zr, m(Z_BOT), P, 40)}" class="gps-zone-low"/></g>`);
  // Theoretisch genaue Lage (Mittellinie) und Ist-Achse (Beispielteil: 0,06 / 0,04 mm Versatz)
  ov.push(`<path data-show="1" class="gps-axis" d="${k.segment([hx, hy, m(Z_BOT - 6)], [hx, hy, m(Z_TOP + 10)], P)}"/>`);
  const off = (z, f) => [hx + m(0.06 * EXAG * f), hy + m(0.04 * EXAG * f), m(z)];
  ov.push(`<path data-show="1" class="gps-actual" d="${k.segment(off(Z_BOT, 0.55), off(Z_TOP, 1), P)}"/>`);
  // Lochkreis-TED: Mittellinien auf der Fläche
  ov.push(`<path data-show="1" class="gps-axis" d="${k.onTop(k.circleRing(0, 0, m(BC_R), 96), m(Z_TOP), P, true)}"/>`);

  body.push(`<g class="gps-overlays">${ov.join("")}</g>`);

  const svg = k.figureSvg({
    width: W,
    height: H,
    label: "Flansch auf einer Prüfaufnahme mit drei Auflagestiften über einer Messplatte; eine Feinmessuhr auf einem Schlitten tastet die Fläche A ab.",
    body,
  });

  return {
    svg,
    live: liveOf(P, [
      { mode: "run", tol: 0.05, period: 14, turns: 0, move0: k.axisVector(P, [m(SWEEP[0]), 0, 0]), move1: k.axisVector(P, [m(SWEEP[1]), 0, 0]),
        needle: { c: [0, SWEEP_Y, DIAL_Z + DIAL_H], len: DIAL_R - 3, perTurn: PER_TURN }, model: { rot: [], lin: [[SW.a, 0.9, 0], [SW.b, 2.3, 1], [SW.c, 4.1, Math.PI / 2]] } },
      { mode: "static", ghost: true, tol: 0.2, text: say.position(0.06, 0.04, 0.2) },
    ]),
  };
}

import { liveOf, say, rotaryFigure, forkFigure } from "./rigs.mjs";
import { parts } from "./parts.mjs";
const figures = [flange(), rotaryFigure(parts.steppedShaft), forkFigure(), rotaryFigure(parts.bushing), rotaryFigure(parts.grooveShaft), rotaryFigure(parts.hub), rotaryFigure(parts.coupling)];
import { coaxFigure, symmetryFigure, angularityFigure, surfaceFigure } from "./tolerances.mjs";
const extra = { "tol-5": surfaceFigure(), "tol-8": angularityFigure(), "tol-10": coaxFigure(), "tol-11": symmetryFigure() };
mkdirSync(OUT_DIR, { recursive: true });
let total = 0;
figures.forEach((fig, i) => {
  const src = `// Automatisch erzeugt von tools/iso/build.mjs — nicht von Hand bearbeiten.
export const figure = ${JSON.stringify(fig)};
`;
  writeFileSync(join(OUT_DIR, `fig-${i}.js`), src);
  total += src.length;
  console.log(`fig-${i}.js`, (src.length / 1024).toFixed(0) + " KB");
});
for (const [name, fig] of Object.entries(extra)) {
  const src = `// Automatisch erzeugt von tools/iso/build.mjs — nicht von Hand bearbeiten.
export const figure = ${JSON.stringify(fig)};
`;
  writeFileSync(join(OUT_DIR, `${name}.js`), src);
  total += src.length;
  console.log(`${name}.js`, (src.length / 1024).toFixed(0) + " KB");
}
console.log("total", (total / 1024).toFixed(0) + " KB");
