// Technische Lehrzeichnungen je Toleranzsymbol, gezeichnet nach ISO 128 (Linienarten),
// ISO 129 (Maßeintragung), ISO 1101 (Toleranzrahmen) und ISO 5459 (Bezüge).
// Breite Volllinie: sichtbare Kanten · schmale Volllinie: Maß-, Hilfs- und Schraffurlinien
// schmale Strichpunktlinie: Mittellinien · schmale Strichpunktlinie mit Rahmen: theoretisch genaue Maße [TED].

const W = 420, H = 270;
const names = {
  de: ["Welle mit Sicherungsringnut", "Flansch mit Lochkreis", "Stufenwelle mit Lagersitz", "Flanschbuchse", "Kupplungsflansch", "Gehäusedeckel", "Gabelkopf", "Gabelkopf", "Schrägblock 30°", "Flansch mit Lochkreis", "Stufenwelle", "Nutenstein", "Stufenwelle", "Flanschbuchse"],
  en: ["Shaft with retaining ring groove", "Flange with bolt circle", "Stepped shaft with bearing seat", "Flanged bushing", "Coupling flange", "Housing cover", "Fork head", "Fork head", "30° wedge block", "Flange with bolt circle", "Stepped shaft", "Slotted block", "Stepped shaft", "Flanged bushing"],
  ar: ["عمود بمجرى حلقة تثبيت", "فلنجة بدائرة ثقوب", "عمود مدرّج بمقعد محمل", "جلبة بفلنجة", "فلنجة اقتران", "غطاء مبيت", "رأس شوكي", "رأس شوكي", "كتلة مائلة 30°", "فلنجة بدائرة ثقوب", "عمود مدرّج", "كتلة بمجرى", "عمود مدرّج", "جلبة بفلنجة"],
};
const sheetText = {
  de: { kind: "Lehrzeichnung", units: "Maße in mm", general: "ISO 2768-mK · ISO 8015", feature: "Toleriertes Element", datum: "Bezugselement", caption: "Technische Zeichnung" },
  en: { kind: "Teaching drawing", units: "Dimensions in mm", general: "ISO 2768-mK · ISO 8015", feature: "Controlled feature", datum: "Datum feature", caption: "Technical drawing" },
  ar: { kind: "رسم تعليمي", units: "الأبعاد بالملليمتر", general: "ISO 2768-mK · ISO 8015", feature: "العنصر الخاضع للتفاوت", datum: "عنصر إسناد المرجع", caption: "رسم فني" },
};

// ---------- Zeichenwerkzeug ----------
function sheet(id, lang) {
  const out = { vis: [], thin: [], ctr: [], hid: [], hatch: [], feat: [], dat: [], text: [], over: [] };
  const f = (v) => (Math.round(v * 10) / 10).toString();
  const num = (v) => (lang === "de" ? String(v).replace(".", ",") : String(v));
  const P = (pts) => "M" + pts.map(([x, y]) => f(x) + " " + f(y)).join("L");
  const arrow = (x, y, ang) => {
    const L = 6.5, w = 1.9, c = Math.cos(ang), s = Math.sin(ang);
    const bx = x - c * L, by = y - s * L;
    return `<path class="td-arrow" d="M${f(x)} ${f(y)}L${f(bx - s * w)} ${f(by + c * w)}L${f(bx + s * w)} ${f(by - c * w)}Z"/>`;
  };
  const text = (x, y, t, { size = 9, anchor = "middle", rot = 0, cls = "" } = {}) =>
    out.text.push(`<text x="${f(x)}" y="${f(y)}" font-size="${size}" text-anchor="${anchor}"${rot ? ` transform="rotate(${rot} ${f(x)} ${f(y)})"` : ""}${cls ? ` class="${cls}"` : ""}>${t}</text>`);
  const D = {
    num,
    vis: (pts, closed) => out.vis.push(`<path d="${P(pts)}${closed ? "Z" : ""}"/>`),
    visD: (d) => out.vis.push(`<path d="${d}"/>`),
    thin: (pts) => out.thin.push(`<path d="${P(pts)}"/>`),
    thinD: (d) => out.thin.push(`<path d="${d}"/>`),
    ctr: (pts) => out.ctr.push(`<path d="${P(pts)}"/>`),
    ctrD: (d) => out.ctr.push(`<path d="${d}"/>`),
    hid: (pts) => out.hid.push(`<path d="${P(pts)}"/>`),
    hatch: (pts) => out.hatch.push(`<path d="${P(pts)}Z"/>`),
    hatchD: (d) => out.hatch.push(`<path d="${d}"/>`),
    feat: (d) => out.feat.push(`<path d="${d}"/>`),
    dat: (d) => out.dat.push(`<path d="${d}"/>`),
    P,
    text,
    circle: (cx, cy, r, kind = "vis") => out[kind].push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"/>`),
    // Lineares Maß von a nach b, Maßlinie um off senkrecht versetzt (Vorzeichen wählt die Seite)
    dim(a, b, off, label, { ext = true, ted = false, inside = true, textSide = 1, at = null } = {}) {
      const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
      const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
      const A = [a[0] + nx * off, a[1] + ny * off], B = [b[0] + nx * off, b[1] + ny * off];
      const sg = Math.sign(off) || 1;
      if (ext && off !== 0) {
        out.thin.push(`<path d="${P([[a[0] + nx * 1.5 * sg, a[1] + ny * 1.5 * sg], [A[0] + nx * 2.5 * sg, A[1] + ny * 2.5 * sg]])}"/>`);
        out.thin.push(`<path d="${P([[b[0] + nx * 1.5 * sg, b[1] + ny * 1.5 * sg], [B[0] + nx * 2.5 * sg, B[1] + ny * 2.5 * sg]])}"/>`);
      }
      const ang = Math.atan2(uy, ux);
      if (inside) {
        out.thin.push(`<path d="${P([A, B])}"/>`);
        out.thin.push(arrow(A[0], A[1], ang + Math.PI), arrow(B[0], B[1], ang));
      } else {
        out.thin.push(`<path d="${P([[A[0] - ux * 12, A[1] - uy * 12], [B[0] + ux * 12, B[1] + uy * 12]])}"/>`);
        out.thin.push(arrow(A[0], A[1], ang), arrow(B[0], B[1], ang + Math.PI));
      }
      let deg = (ang * 180) / Math.PI;
      if (deg >= 89.9) deg -= 180;
      if (deg < -90.1) deg += 180;
      // Text über der Maßlinie, bei senkrechten Maßen links davon (von rechts lesbar, ISO 129)
      const rad = (deg * Math.PI) / 180;
      const ox = Math.sin(rad) * 3.2 * textSide, oy = -Math.cos(rad) * 3.2 * textSide;
      const frac = at ?? (label.startsWith("⌀") && Math.abs(Math.abs(deg) - 90) < 1 ? 0.27 : 0.5);
      const tx = A[0] + (B[0] - A[0]) * frac + ox, ty = A[1] + (B[1] - A[1]) * frac + oy;
      text(tx, ty + (Math.abs(deg) < 0.01 ? -1 : 0), label, { rot: Math.abs(deg) < 0.01 ? 0 : deg, cls: ted ? "td-ted" : "" });
      if (ted) {
        const wv = label.length * 5.2 + 6;
        out.text.push(`<rect class="td-ted-box" x="${f(tx - wv / 2)}" y="${f(ty - 9)}" width="${f(wv)}" height="12"${Math.abs(deg) > 0.01 ? ` transform="rotate(${f(deg)} ${f(tx)} ${f(ty)})"` : ""}/>`);
      }
      return { A, B, mid: [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2] };
    },
    // Hinweislinie mit Text (z. B. 4× ⌀9)
    note(pts, label, { end = "arrow", anchor = "start" } = {}) {
      out.thin.push(`<path d="${P(pts)}"/>`);
      const [a, b] = [pts[1], pts[0]];
      if (end === "arrow") out.thin.push(arrow(b[0], b[1], Math.atan2(b[1] - a[1], b[0] - a[0])));
      if (end === "dot") out.thin.push(`<circle class="td-arrow" cx="${f(b[0])}" cy="${f(b[1])}" r="1.6"/>`);
      const last = pts[pts.length - 1], prev = pts[pts.length - 2];
      if (anchor === "start") text(Math.min(prev[0], last[0]) + 2, last[1] - 2.5, label, { anchor });
      else text(last[0] - 2, last[1] - 2.5, label, { anchor });
    },
    // Toleranzrahmen nach ISO 1101 mit Bezugspfeil; leader beginnt am Rahmen und endet mit Pfeil am Element
    frame(x, y, cells, leader, { active = true } = {}) {
      const hgt = 16;
      let cx = x;
      const parts = [];
      cells.forEach((c, i) => {
        const w = i === 0 ? 18 : i === 1 ? Math.max(30, c.length * 5.8 + 10) : 16;
        parts.push(`<rect x="${f(cx)}" y="${f(y)}" width="${f(w)}" height="${hgt}"/>`);
        parts.push(`<text x="${f(cx + w / 2)}" y="${f(y + 11.6)}" font-size="${i === 0 ? 11 : 9.5}" text-anchor="middle">${c}</text>`);
        cx += w;
      });
      out.over.push(`<g class="td-frame${active ? " is-active" : ""}">${parts.join("")}</g>`);
      if (leader) {
        out.over.push(`<path class="td-leader" d="${P(leader)}"/>`);
        const b = leader[leader.length - 1], a = leader[leader.length - 2];
        out.over.push(arrow(b[0], b[1], Math.atan2(b[1] - a[1], b[0] - a[0])).replace("td-arrow", "td-arrow td-leader-arrow"));
      }
      return { x, y, w: cx - x, h: hgt, right: cx, bottom: y + hgt };
    },
    // Bezugsdreieck nach ISO 5459: Dreieck auf dem Element, Linie, Quadrat mit Buchstabe
    datum(letter, foot, dir, len = 16) {
      const [ux, uy] = dir, nx = -uy, ny = ux, hgt = 6.5, half = 3.8;
      const tip = [foot[0] + ux * hgt, foot[1] + uy * hgt];
      const end = [foot[0] + ux * len, foot[1] + uy * len];
      const c = [end[0] + ux * 7, end[1] + uy * 7];
      out.over.push(`<g class="td-datum"><path class="td-datum-tri" d="${P([[foot[0] + nx * half, foot[1] + ny * half], [foot[0] - nx * half, foot[1] - ny * half], tip])}Z"/>` +
        `<path d="${P([tip, end])}"/><rect x="${f(c[0] - 7)}" y="${f(c[1] - 7)}" width="14" height="14"/>` +
        `<text x="${f(c[0])}" y="${f(c[1] + 3.6)}" font-size="10" text-anchor="middle">${letter}</text></g>`);
    },
    render(name, highlightDatum) {
      const t = sheetText[lang];
      // Rahmen und Schriftfeld
      const tb = { x: W - 168, y: H - 40, w: 160, h: 32 };
      const block =
        `<rect class="td-border" x="4" y="4" width="${W - 8}" height="${H - 8}"/>` +
        `<g class="td-title"><rect x="${tb.x}" y="${tb.y}" width="${tb.w}" height="${tb.h}"/><path d="M${tb.x} ${tb.y + 12}H${tb.x + tb.w}M${tb.x + 96} ${tb.y}V${tb.y + 12}M${tb.x + 120} ${tb.y + 12}V${tb.y + tb.h}"/>` +
        `<text x="${tb.x + 4}" y="${tb.y + 9}" font-size="7.5">${t.kind}</text><text x="${tb.x + 100}" y="${tb.y + 9}" font-size="7.5">${t.units}</text>` +
        `<text x="${tb.x + 4}" y="${tb.y + 22}" font-size="8.5" font-weight="600">${name}</text><text x="${tb.x + 4}" y="${tb.y + 30}" font-size="6.5">${t.general}</text>` +
        // Projektionssymbol Methode 1 (ISO 5456-2)
        `<g transform="translate(${tb.x + 128} ${tb.y + 15})"><path d="M0 2L10 4.5V11.5L0 14Z"/><circle cx="21" cy="8" r="5.5"/><circle cx="21" cy="8" r="2.4"/><path class="td-ctr" d="M-2 8H28M21 0V16"/></g></g>`;
      return `<svg viewBox="0 0 ${W} ${H}" class="tech-drawing" role="img" aria-label="${name}" direction="ltr">` +
        `<defs><pattern id="${id}-h" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V5" class="td-hatch-line"/></pattern></defs>` +
        `<g class="td-hatch" fill="url(#${id}-h)">${out.hatch.join("")}</g>` +
        `<g class="td-feat">${out.feat.join("")}</g><g class="td-dat${highlightDatum ? "" : " is-off"}">${out.dat.join("")}</g>` +
        `<g class="td-ctr">${out.ctr.join("")}</g><g class="td-hid">${out.hid.join("")}</g><g class="td-vis">${out.vis.join("")}</g>` +
        `<g class="td-thin">${out.thin.join("")}</g><g class="td-txt">${out.text.join("")}</g><g class="td-over">${out.over.join("")}</g>${block}</svg>`;
    },
  };
  return D;
}

// Drehteil in der Vorderansicht: profile [[s, r], …] von links nach rechts, k = px je mm
function shaft(D, profile, x0, cy, k, { flip = false, hatchHalf = false, bore = null } = {}) {
  const X = (s) => (flip ? x0 - s * k : x0 + s * k);
  const up = profile.map(([s, r]) => [X(s), cy - r * k]);
  const lo = profile.map(([s, r]) => [X(s), cy + r * k]);
  const first = profile[0], last = profile[profile.length - 1];
  D.vis([...up, ...lo.slice().reverse()], true);
  // Kanten an Absätzen und Fasen
  const seen = new Set();
  profile.forEach(([s], i) => {
    if (i === 0 || i === profile.length - 1 || seen.has(s)) return;
    seen.add(s);
    const r = Math.max(...profile.filter(([q]) => q === s).map(([, q]) => q));
    D.vis([[X(s), cy - r * k], [X(s), cy + r * k]]);
  });
  D.ctr([[X(first[0]) - (flip ? -8 : 8), cy], [X(last[0]) + (flip ? -8 : 8), cy]]);
  return { X, Y: (r) => cy - r * k, Yl: (r) => cy + r * k };
}
const contour = (profile, X, Y, s0, s1) => profile.filter(([s]) => s >= s0 - 1e-6 && s <= s1 + 1e-6).map(([s, r]) => [X(s), Y(r)]);

// ---------- Bauteildaten (mm), wie in den Prüfaufbauten ----------
const GROOVE = [[0, 8.6], [1.5, 10], [26.5, 10], [26.5, 18.4], [62, 18.4], [62, 10], [72.3, 10], [72.3, 8.3], [74.8, 8.3], [74.8, 10], [94.6, 10], [96.1, 8.6]];
const STEPPED = [[0, 6.2], [1.8, 8], [11.6, 8], [11.6, 13.1], [28.6, 13.1], [48.6, 17.5], [56.4, 17.5], [56.4, 15], [71.3, 15], [71.3, 9], [102.2, 9], [104, 7.2]];

// ---------- Zeichnungen ----------
const drawings = [
  // 0 Geradheit einer Mantellinie
  (D) => {
    const k = 2.55, x0 = 52, cy = 118;
    const { X, Y, Yl } = shaft(D, GROOVE, x0, cy, k);
    D.feat(D.P(contour(GROOVE, X, Y, 26.5, 62)));
    D.dim([X(0), Yl(8.6)], [X(96.1), Yl(8.6)], 58, "96");
    D.dim([X(44), Y(18.4)], [X(44), Yl(18.4)], 0, "⌀36,8".replace(",", D.num(".") === "." ? "." : ","), { ext: false });
    D.dim([X(13), Y(10)], [X(13), Yl(10)], 0, "⌀20", { ext: false });
    D.dim([X(72.3), Y(10)], [X(74.8), Y(10)], -26, D.num("2.5"), { inside: false });
    D.dim([X(84), Y(10)], [X(84), Yl(10)], 0, "⌀20 h6", { ext: false });
    D.frame(X(36), 22, ["—", D.num("0.03")], [[X(36) + 9, 38], [X(36) + 9, Y(18.4)]]);
  },
  // 1 Ebenheit der Anlagefläche (Flansch)
  (D) => flange(D, "flat"),
  // 2 Rundheit des Lagersitzes
  (D) => {
    const k = 2.4, x0 = 46, cy = 120;
    const { X, Y, Yl } = shaft(D, STEPPED, x0, cy, k);
    D.feat(D.P(contour(STEPPED, X, Y, 56.4, 71.3)) + D.P(contour(STEPPED, X, Yl, 56.4, 71.3)));
    D.dim([X(0), Yl(7.2)], [X(104), Yl(7.2)], 58, "104");
    D.dim([X(64), Y(15)], [X(64), Yl(15)], 0, "⌀30 k6", { ext: false });
    D.dim([X(6), Y(8)], [X(6), Yl(8)], 0, "⌀16", { ext: false });
    D.dim([X(52), Y(17.5)], [X(52), Yl(17.5)], 0, "⌀35", { ext: false });
    D.dim([X(56.4), Yl(15)], [X(71.3), Yl(15)], 30, D.num("15"));
    D.frame(X(66), 22, ["○", D.num("0.02")], [[X(66) + 9, 38], [X(66) + 9, Y(15)]]);
  },
  // 3 Zylinderform des Außensitzes (Flanschbuchse im Längsschnitt)
  (D) => bushing(D, "cyl"),
  // 4 Linienprofil des Übergangsradius (Kupplungsflansch, Halbschnitt)
  (D) => {
    const k = 1.6, x0 = 80, cy = 134;
    const X = (s) => x0 + s * k, Y = (r) => cy - r * k, Yl = (r) => cy + r * k;
    const fil = Array.from({ length: 9 }, (_, i) => { const t = (i / 8) * (Math.PI / 2); return [39 + 7 * Math.sin(t), 32 - 7 * Math.cos(t)]; });
    const outer = [[0, 24], [1, 25], ...fil, [46, 52], [77, 52], [78, 51]];
    // obere Hälfte geschnitten
    const up = outer.map(([s, r]) => [X(s), Y(r)]);
    D.hatch([[X(0), Y(19)], ...up, [X(78), Y(19)]]);
    D.vis([[X(0), Y(19)], ...up, [X(78), Y(19)]], true);
    // untere Hälfte Ansicht
    const lo = outer.map(([s, r]) => [X(s), Yl(r)]);
    D.vis([[X(0), Yl(24)], ...lo, [X(78), cy]]);
    D.vis([[X(0), Yl(24)], [X(0), cy]]);
    D.vis([[X(46), Yl(52)], [X(46), Yl(32)]]);
    D.hid([[X(0), Yl(19)], [X(78), Yl(19)]]);
    D.ctr([[X(0) - 8, cy], [X(78) + 8, cy]]);
    D.ctr([[X(72) - 0, Y(39) - 10], [X(72), Y(39) + 10]]);
    D.circle(X(70), Y(39), 6.5 * k, "hid");
    D.feat(D.P(fil.map(([s, r]) => [X(s), Y(r)])));
    D.dim([X(0), Yl(52)], [X(78), Yl(52)], 14, "78");
    D.dim([X(10), Y(19)], [X(10), Yl(19)], 0, "⌀38 H7", { ext: false });
    D.dim([X(78), Y(52)], [X(78), Yl(52)], -18, "⌀104");
    D.note([[X(43.5), Y(30)], [X(60), Y(68)], [X(78) + 34, Y(68)]], "R7");
    D.frame(X(0), 18, ["⌒", D.num("0.1")], [[X(0) + 9, 34], [X(0) + 9, Y(46)], [X(36), Y(46)], [X(40.6), Y(27.6)]]);
  },
  // 5 Flächenprofil der Deckelwölbung
  (D) => {
    const cx = 160, base = 190, R = 118, half = 92; // SR 59 bei k = 2
    const zc = base + Math.sqrt(R * R - half * half) ;
    const top = zc - R;
    const pts = Array.from({ length: 41 }, (_, i) => { const x = -half + (2 * half * i) / 40; return [cx + x, zc - Math.sqrt(R * R - x * x)]; });
    const inner = Array.from({ length: 41 }, (_, i) => { const x = -(half - 8) + (2 * (half - 8) * i) / 40; return [cx + x, zc - Math.sqrt((R - 8) ** 2 - x * x)]; });
    // Schnitt: Schale mit Bund
    const shell = [[cx - half - 10, base + 14], [cx - half - 10, base], ...pts, [cx + half + 10, base], [cx + half + 10, base + 14], [cx + half - 8, base + 14], ...inner.slice().reverse(), [cx - half + 8, base + 14]];
    D.hatch(shell);
    D.vis(shell, true);
    D.ctr([[cx, top - 14], [cx, base + 24]]);
    D.feat(D.P(pts));
    D.dim([cx - half - 10, base + 14], [cx + half + 10, base + 14], 22, "⌀112");
    D.note([[cx + 40, zc - Math.sqrt(R * R - 1600)], [cx + 92, top - 6], [cx + 122, top - 6]], "SR59");
    D.dim([cx - half - 10, base + 14], [cx - half - 10, top], 22, "38");
    D.frame(cx - 60, 22, ["⌓", D.num("0.2")], [[cx - 51, 38], [cx - 51, pts[8][1] - 4], [pts[8][0], pts[8][1]]]);
  },
  // 6 Parallelität der Gabelwange
  (D) => fork(D, "par"),
  // 7 Rechtwinkligkeit der Bolzenbohrung
  (D) => fork(D, "perp"),
  // 8 Neigung der Schrägfläche 30° zu A
  (D) => {
    const x0 = 70, base = 196, k = 2.2;
    const L = 100 * k, h0 = 12 * k;
    const rise = Math.tan((30 * Math.PI) / 180);
    const slope0 = [x0 + 30 * k, base - h0], slope1 = [x0 + L, base - h0 - 70 * k * rise];
    const poly = [[x0, base], [x0 + L, base], slope1, slope0, [x0, base - h0]];
    D.vis(poly, true);
    D.feat(D.P([slope0, slope1]));
    D.dat(D.P([[x0, base], [x0 + L, base]]));
    D.dim([x0, base], [x0 + L, base], 18, "100");
    D.dim([x0, base], [x0, base - h0], 18, "12");
    D.dim([x0 + L, base], slope1, -18, "52,4".replace(",", D.num(".") === "." ? "." : ","));
    // TED-Winkel 30° als Bogen
    const r = 52;
    const a1 = -30 * Math.PI / 180;
    D.thinD(`M${slope0[0] + r} ${slope0[1]}A${r} ${r} 0 0 0 ${(slope0[0] + r * Math.cos(a1)).toFixed(1)} ${(slope0[1] + r * Math.sin(a1)).toFixed(1)}`);
    D.thin([slope0, [slope0[0] + r + 10, slope0[1]]]);
    D.text(slope0[0] + r + 14, slope0[1] - 8, "30°", { anchor: "start", cls: "td-ted" });
    D.thinD(`M${slope0[0] + r + 11} ${slope0[1] - 17}h20v12h-20z`);
    D.datum("A", [x0 + 60, base], [0, 1], 14);
    const mid = [(slope0[0] + slope1[0]) / 2, (slope0[1] + slope1[1]) / 2];
    D.frame(x0 + 10, 22, ["∠", D.num("0.06"), "A"], [[x0 + 19, 38], [x0 + 19, 54], [mid[0] - 30, 54], [mid[0] - 6, mid[1] - 2]]);
  },
  // 9 Position der Befestigungsbohrung
  (D) => flange(D, "pos"),
  // 10 Koaxialität des zweiten Sitzes zur Bezugsachse A
  (D) => {
    const k = 2.4, x0 = 46, cy = 120;
    const { X, Y, Yl } = shaft(D, STEPPED, x0, cy, k);
    D.feat(D.P(contour(STEPPED, X, Y, 11.6, 28.6)) + D.P(contour(STEPPED, X, Yl, 11.6, 28.6)));
    D.dat(D.P(contour(STEPPED, X, Y, 1.8, 11.6)) + D.P(contour(STEPPED, X, Yl, 1.8, 11.6)));
    D.dim([X(0), Yl(7.2)], [X(104), Yl(7.2)], 58, "104");
    const dA = D.dim([X(6.5), Y(8)], [X(6.5), Yl(8)], 0, "⌀16 g6", { ext: false });
    const dF = D.dim([X(20), Y(13.1)], [X(20), Yl(13.1)], 0, "⌀26,2".replace(",", D.num(".") === "." ? "." : ","), { ext: false });
    // Bezug A auf der Maßlinie ⌀16 (Achse), Rahmen in Verlängerung der Maßlinie ⌀26,2
    D.datum("A", [X(6.5), Yl(8)], [0, 1], 22);
    D.frame(X(20) - 9, 22, ["◎", "⌀" + D.num("0.05"), "A"], [[X(20), 38], [X(20), Y(13.1)]]);
    void dA; void dF;
  },
  // 11 Symmetrie der Nut zur Mittelebene A
  (D) => {
    const x0 = 96, base = 196, k = 2.6, Wd = 80 * k, Hh = 40 * k, slot = 24 * k, depth = 22 * k;
    const l = x0, r = x0 + Wd, sl = x0 + (Wd - slot) / 2, sr = sl + slot;
    D.vis([[l, base], [r, base], [r, base - Hh], [sr, base - Hh], [sr, base - Hh + depth], [sl, base - Hh + depth], [sl, base - Hh], [l, base - Hh]], true);
    D.ctr([[x0 + Wd / 2, base - Hh - 16], [x0 + Wd / 2, base + 26]]);
    D.feat(D.P([[sl, base - Hh], [sl, base - Hh + depth]]) + D.P([[sr, base - Hh], [sr, base - Hh + depth]]));
    D.dat(D.P([[l, base], [l, base - Hh]]) + D.P([[r, base], [r, base - Hh]]));
    D.dim([l, base], [r, base], 26, "80");
    D.dim([sl, base - Hh], [sr, base - Hh], -16, "24 H9");
    D.dim([r, base - Hh], [r, base], -22, "40");
    // Bezug A: Mittelebene, Dreieck in Verlängerung der Maßlinie 80; Rahmen in Verlängerung der Maßlinie 24
    D.datum("A", [r + 2.5, base + 26], [1, 0], 8);
    D.frame(sr + 36, base - Hh - 50, ["≡", D.num("0.08"), "A"], [[sr + 36, base - Hh - 42], [sr + 24, base - Hh - 42], [sr + 24, base - Hh - 16], [sr, base - Hh - 16]]);
  },
  // 12 Rundlauf
  (D) => {
    const k = 2.4, x0 = 46, cy = 120;
    const { X, Y, Yl } = shaft(D, STEPPED, x0, cy, k);
    D.feat(D.P(contour(STEPPED, X, Y, 11.6, 28.6)));
    D.dat(D.P(contour(STEPPED, X, Y, 1.8, 11.6)) + D.P(contour(STEPPED, X, Yl, 1.8, 11.6)));
    D.dim([X(0), Yl(7.2)], [X(104), Yl(7.2)], 58, "104");
    D.dim([X(6.5), Y(8)], [X(6.5), Yl(8)], 0, "⌀16 g6", { ext: false });
    D.datum("A", [X(6.5), Yl(8)], [0, 1], 22);
    D.frame(X(20) - 9, 22, ["↗", D.num("0.03"), "A"], [[X(20), 38], [X(20), Y(13.1)]]);
  },
  // 13 Gesamtplanlauf der Flanschfläche
  (D) => bushing(D, "total"),
];

function flange(D, mode) {
  const k = 1.38, cx = 112, cy = 118;
  const R = 52 * k, flat = 41 * k, bore = 16 * k, bc = 35 * k, hole = 4.5 * k;
  const a0 = Math.asin(flat / R);
  // Vorderansicht: Kreis mit Abflachung oben, Bohrung, Lochkreis
  const x1 = cx + R * Math.cos(a0);
  D.visD(`M${(cx - R * Math.cos(a0)).toFixed(1)} ${(cy - flat).toFixed(1)}L${x1.toFixed(1)} ${(cy - flat).toFixed(1)}A${R} ${R} 0 1 1 ${(cx - R * Math.cos(a0)).toFixed(1)} ${(cy - flat).toFixed(1)}`);
  D.circle(cx, cy, bore);
  D.circle(cx, cy, bc, "ctr");
  [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy]) => {
    D.circle(cx + dx * bc, cy + dy * bc, hole);
    D.ctr([[cx + dx * bc - 9, cy + dy * bc], [cx + dx * bc + 9, cy + dy * bc]]);
    D.ctr([[cx + dx * bc, cy + dy * bc - 9], [cx + dx * bc, cy + dy * bc + 9]]);
  });
  D.ctr([[cx - R - 8, cy], [cx + R + 8, cy]]);
  D.ctr([[cx, cy - R - 8], [cx, cy + R + 8]]);
  // Seitenansicht im Schnitt A–A
  const sx = 262, t = 12 * k, hub = 26 * k, hubR = 23.5 * k;
  const plateUp = [[sx, cy - flat], [sx + t, cy - flat], [sx + t, cy - hubR], [sx + t + hub, cy - hubR], [sx + t + hub, cy - bore], [sx, cy - bore]];
  const plateLo = plateUp.map(([x, y]) => [x, 2 * cy - y]).map((p, i, arr) => (i === 0 ? [sx, cy + R] : i === 1 ? [sx + t, cy + R] : p));
  // Lochschnitt in der Platte bei ±bc
  const cut = (pts, sign) => {
    const yh0 = cy + sign * (bc - hole), yh1 = cy + sign * (bc + hole);
    const outer = sign < 0 ? cy - flat : cy + R;
    D.hatch([[sx, outer], [sx + t, outer], [sx + t, yh1], [sx, yh1]]);
    D.hatch([[sx, yh0], [sx + t, yh0], [sx + t, cy + sign * hubR], [sx + t + hub, cy + sign * hubR], [sx + t + hub, cy + sign * bore], [sx, cy + sign * bore]]);
    D.vis(pts, true);
    D.vis([[sx, yh0], [sx + t, yh0]]);
    D.vis([[sx, yh1], [sx + t, yh1]]);
  };
  cut(plateUp, -1);
  cut(plateLo, 1);
  D.ctr([[sx - 8, cy], [sx + t + hub + 8, cy]]);
  D.ctr([[sx - 5, cy - bc], [sx + t + 5, cy - bc]]);
  D.ctr([[sx - 5, cy + bc], [sx + t + 5, cy + bc]]);
  D.text(sx + t + hub + 14, cy - flat + 4, "A–A", { size: 8 });
  // Maße
  D.dim([cx - R, cy], [cx + R, cy], R + 14, "⌀104");
  D.dim([sx, cy - flat], [sx + t, cy - flat], -12, "12", { inside: false });
  D.dim([sx, cy - flat], [sx + t + hub, cy - flat], -28, "38");
  D.dim([sx + t + hub, cy - bore], [sx + t + hub, cy + bore], -12, "⌀32 H7");
  D.dim([sx + t + hub, cy - hubR], [sx + t + hub, cy + hubR], -34, "⌀47");
  D.dim([cx, cy], [cx, cy - flat], -(R + 16), "41");
  const noteY = cy + R + 10;
  D.note([[cx + bc + hole * 0.7, cy + hole * 0.7], [sx - 14, noteY], [sx + 50, noteY]], "4× ⌀9 H12");
  const face = D.P([[sx, cy - flat], [sx, cy - bore]]) + D.P([[sx, cy + bore], [sx, cy + R]]);
  if (mode === "flat") {
    D.feat(face);
    D.frame(sx - 110, 18, ["▱", D.num("0.05")], [[sx - 110 + 48, 26], [sx - 20, 26], [sx - 20, cy - 34], [sx, cy - 34]]);
  } else {
    // TED Lochkreis und Bezüge A (Anlagefläche), B (Bohrung), C (Abflachung)
    D.dim([cx - bc * 0.707, cy + bc * 0.707], [cx + bc * 0.707, cy - bc * 0.707], 0, "⌀70", { ext: false, ted: true });
    D.feat(D.P([[cx + bc - hole, cy], [cx + bc + hole, cy]]));
    D.circle(cx + bc, cy, hole + 1.6, "feat");
    D.dat(face + D.P([[cx - R * Math.cos(a0), cy - flat], [cx + R * Math.cos(a0), cy - flat]]));
    D.datum("A", [sx, cy + 50], [-1, 0], 12);
    D.datum("B", [sx + t + hub + 12, cy + bore], [0, 1], 10);
    D.datum("C", [cx - 30, cy - flat], [0, -1], 10);
    D.frame(sx - 12, noteY + 2, ["⌖", "⌀" + D.num("0.2"), "A", "B", "C"], null);
  }
}

function bushing(D, mode) {
  const k = 2.9, x0 = 58, cy = 126;
  // Flansch links (s von rechts gezählt wie im Prüfaufbau: Flansch oben = links in der Zeichnung)
  const L = 71.9;
  const X = (s) => x0 + (L - s) * k, Y = (r) => cy - r * k, Yl = (r) => cy + r * k;
  const outer = [[0, 8.1], [26.7, 8.1], [26.7, 12.4], [60.9, 12.4], [60.9, 21.5], [71.9, 21.5]];
  const half = (sgn) => {
    const Yf = sgn < 0 ? Y : Yl;
    const pts = [[X(0), Yf(3.2)], ...outer.map(([s, r]) => [X(s), Yf(r)]), [X(71.9), Yf(6.3)], [X(41), Yf(6.3)], [X(41), Yf(3.2)]];
    D.hatch(pts);
    D.vis(pts, true);
  };
  half(-1);
  half(1);
  D.vis([[X(41), Y(3.2)], [X(41), Yl(3.2)]]);
  D.vis([[X(0), Y(3.2)], [X(0), Yl(3.2)]]);
  D.vis([[X(71.9), Y(6.3)], [X(71.9), Yl(6.3)]]);
  D.ctr([[X(71.9) - 8, cy], [X(0) + 8, cy]]);
  D.dim([X(71.9), Yl(21.5)], [X(0), Yl(21.5)], -24, "72");
  D.dim([X(71.9), Yl(21.5)], [X(60.9), Yl(21.5)], -10, "11", { inside: false });
  D.dim([X(10), Y(8.1)], [X(10), Yl(8.1)], 0, "⌀16", { ext: false });
  // Bohrung ⌀6,4 H7: Maßlinie nach außen verlängert, dort sitzt bei Bedarf das Bezugsdreieck
  D.dim([X(20), Yl(3.2)], [X(20), Y(3.2)], 0, "", { ext: false });
  D.thin([[X(20), Y(3.2)], [X(20), Y(8.1) - 12]]);
  D.text(X(20) - 4, Y(8.1) - 15, "⌀6,4 H7".replace(",", D.num(".") === "." ? "." : ","), { anchor: "end" });
  if (mode === "cyl") {
    D.feat(D.P([[X(60.2), Y(12.4)], [X(27.1), Y(12.4)]]) + D.P([[X(60.2), Yl(12.4)], [X(27.1), Yl(12.4)]]));
    D.dim([X(44), Y(12.4)], [X(44), Yl(12.4)], 0, "⌀24,8 p6".replace(",", D.num(".") === "." ? "." : ","), { ext: false });
    D.frame(X(50) - 9, 20, ["⌭", D.num("0.04")], [[X(50), 36], [X(50), Y(12.4)]]);
  } else {
    D.dim([X(44), Y(12.4)], [X(44), Yl(12.4)], 0, "⌀24,8".replace(",", D.num(".") === "." ? "." : ","), { ext: false });
    D.feat(D.P([[X(71.9), Y(21.5)], [X(71.9), Y(6.3)]]) + D.P([[X(71.9), Yl(6.3)], [X(71.9), Yl(21.5)]]));
    D.dat(D.P([[X(41), Y(3.2)], [X(0), Y(3.2)]]) + D.P([[X(41), Yl(3.2)], [X(0), Yl(3.2)]]));
    D.datum("A", [X(20), Y(8.1) - 12], [0, -1], 6);
    D.frame(14, 18, ["↗↗", D.num("0.06"), "A"], [[23, 34], [23, Y(16)], [X(71.9), Y(16)]]);
  }
}

function fork(D, mode) {
  // Draufsicht (oben) und Vorderansicht (unten), Methode 1
  const k = 2.6, x0 = 52;
  const X = (x) => x0 + x * k;
  // Vorderansicht: Gabel liegt mit Wangen übereinander (y = Höhe der Wangen)
  const cy = 186, half = 8.7, cheek = 5.4, slot = 6.6;
  const Yt = (z) => cy - z * k;
  const zB = -half, zF = zB + cheek, zA = zF + slot, zT = zA + cheek;
  D.vis([[X(0), Yt(zT)], [X(62.4), Yt(zT)], [X(62.4), Yt(zT + 3.6)], [X(70), Yt(zT + 3.6)], [X(92), Yt(6.5)], [X(112), Yt(6.5)], [X(112), Yt(-6.5)], [X(92), Yt(-6.5)], [X(70), Yt(zB - 3.6)], [X(62.4), Yt(zB - 3.6)], [X(62.4), Yt(zB)], [X(0), Yt(zB)], [X(0), Yt(zF)], [X(54), Yt(zF)], [X(54), Yt(zA)], [X(0), Yt(zA)]], true);
  D.vis([[X(62.4), Yt(zT + 3.6)], [X(62.4), Yt(zB - 3.6)]]);
  D.vis([[X(92), Yt(6.5)], [X(92), Yt(-6.5)]]);
  D.hid([[X(3.25), Yt(zT)], [X(3.25), Yt(zB)]]);
  D.hid([[X(15.25), Yt(zT)], [X(15.25), Yt(zB)]]);
  D.ctr([[X(9.25), Yt(zT) - 8], [X(9.25), Yt(zB) + 8]]);
  D.ctr([[X(-4), cy], [X(116), cy]]);
  // Draufsicht
  const ty = 84;
  D.visD(`M${X(54)} ${ty - 9.25 * k}H${X(9.25)}A${9.25 * k} ${9.25 * k} 0 0 0 ${X(9.25)} ${ty + 9.25 * k}H${X(54)}Z`);
  D.vis([[X(54), ty - 9.25 * k], [X(62.4), ty - 9.25 * k], [X(62.4), ty + 9.25 * k], [X(54), ty + 9.25 * k]]);
  D.vis([[X(62.4), ty - 9.25 * k], [X(70), ty - 9.25 * k], [X(92), ty - 6.5 * k], [X(112), ty - 6.5 * k], [X(112), ty + 6.5 * k], [X(92), ty + 6.5 * k], [X(70), ty + 9.25 * k], [X(62.4), ty + 9.25 * k]]);
  D.vis([[X(70), ty - 9.25 * k], [X(70), ty + 9.25 * k]]);
  D.vis([[X(92), ty - 6.5 * k], [X(92), ty + 6.5 * k]]);
  D.circle(X(9.25), ty, 6 * k);
  D.ctr([[X(9.25) - 22, ty], [X(116), ty]]);
  D.ctr([[X(9.25), ty - 22], [X(9.25), ty + 22]]);
  D.dim([X(0), Yt(zT)], [X(54), Yt(zT)], -14, "54");
  D.dim([X(54), Yt(zF)], [X(54), Yt(zA)], -14, D.num("6.6") + " H11", { inside: false });
  D.note([[X(9.25) + 6 * k * 0.7, ty - 6 * k * 0.7], [X(30), ty - 44], [X(52), ty - 44]], "⌀12 H7");
  if (mode === "par") {
    D.feat(D.P([[X(0), Yt(zF)], [X(54), Yt(zF)]]));
    D.dat(D.P([[X(0), Yt(zA)], [X(54), Yt(zA)]]));
    // Hilfslinien der Innenflächen nach links herausgezogen
    D.thin([[X(0) - 2, Yt(zA)], [X(0) - 22, Yt(zA)]]);
    D.thin([[X(0) - 2, Yt(zF)], [X(0) - 36, Yt(zF)]]);
    D.datum("A", [X(0) - 14, Yt(zA)], [0, -1], 12);
    D.frame(X(0) - 40, Yt(zT) - 36, ["∥", D.num("0.04"), "A"], [[X(0) - 31, Yt(zT) - 20], [X(0) - 31, Yt(zF)]]);
  } else {
    D.feat(D.P([[X(3.25), Yt(zT)], [X(3.25), Yt(zB)]]) + D.P([[X(15.25), Yt(zT)], [X(15.25), Yt(zB)]]));
    D.dat(D.P([[X(0), Yt(zB)], [X(54), Yt(zB)]]));
    D.datum("A", [X(40), Yt(zB)], [0, 1], 6);
    D.frame(X(30), ty - 42, ["⟂", "⌀" + D.num("0.08"), "A"], null);
  }
}

export function renderTechDrawing(index, lang, uid = "td") {
  const D = sheet(`${uid}${index}`, lang);
  drawings[index](D);
  const t = sheetText[lang];
  const hasDatum = ![0, 1, 2, 3, 4, 5].includes(index);
  return `<figure class="tech-sheet">${D.render(names[lang][index], hasDatum)}<figcaption>${t.caption} · <span class="k-feat">${t.feature}</span>${hasDatum ? ` · <span class="k-dat">${t.datum}</span>` : ""}</figcaption></figure>`;
}
