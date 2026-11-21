// Teiledaten der Drehteile in mm, aus den 2D-Lehrzeichnungen abgeleitet.
// s läuft entlang der Achse von unten (Aufspannung) nach oben, r ist der Radius.
// Wo die Zeichnung ein Maß nennt, gilt das Maß; sonst die Proportion der Skizze.

const fillet = (rHub, sFace, R, n = 8) => {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * (Math.PI / 2);
    pts.push([sFace - R + R * Math.sin(t), rHub + R - R * Math.cos(t), 1]);
  }
  return pts;
};

export const parts = {
  // Stufenwelle mit Nut: rechter Lagerzapfen (Bezug A) steckt im Dreibackenfutter.
  steppedShaft: {
    id: "stufenwelle",
    label: "Stufenwelle im Dreibackenfutter eines Formmessgeräts; der rechte Lagerzapfen bildet Bezug A, eine Messuhr tastet radial.",
    profile: [[0, 6.2], [1.8, 8], [11.6, 8], [11.6, 13.1], [28.6, 13.1], [48.6, 17.5], [56.4, 17.5], [56.4, 15], [71.3, 15], [71.3, 9], [102.2, 9], [104, 7.2]],
    centerHole: 1.3,
    keyway: { s0: 79, s1: 97.6, w: 4.6, r: 9 },
    hold: { type: "chuck", s1: 10, r: 8 },
    datumA: { kind: "band", s0: 1.8, s1: 11.6, r: 8 },
    features: [
      { type: "radial", s: 63.8, r: 15, tol: 0.02, band: [56.4, 71.3] },
      { type: "radial", s: 20, r: 13.1, tol: 0.03, band: [11.6, 28.6] },
    ],
  },
  // Flanschbuchse: auf einem Spanndorn in der kleinen Bohrung (Bezug A), Flansch oben.
  bushing: {
    id: "buchse",
    label: "Flanschbuchse auf einem Spanndorn in der Innenbohrung (Bezug A) auf dem Drehtisch; die Messuhr fährt den Außensitz oder die Flanschfläche ab.",
    profile: [[0, 7.4], [0.8, 8.1], [26.7, 8.1], [26.7, 12.4], [60.9, 12.4], [60.9, 21.5], [71.1, 21.5], [71.9, 20.7]],
    bore: [[0, 41, 3.2], [41, 71.9, 6.3]],
    hold: { type: "mandrel", r: 3.2, washer: 9, nut: 6.5, shoulder: 11 },
    datumA: { kind: "bore", s0: 0, s1: 41, r: 3.2 },
    features: [
      { type: "cyl", s0: 31, s1: 57, r: 12.4, tol: 0.04, band: [27.1, 60.2] },
      { type: "axialTotal", s: 71.9, r0: 11, r1: 19, tol: 0.06, face: [6.3, 20.7] },
    ],
  },
  // Welle mit Sicherungsringnut: linker Sitz (Bezug A) im Futter.
  grooveShaft: {
    id: "welle",
    label: "Welle mit Sicherungsringnut im Dreibackenfutter; der linke Sitz bildet Bezug A. Die Messuhr fährt eine Mantellinie ab oder tastet den rechten Sitz radial.",
    profile: [[0, 8.6], [1.5, 10], [26.5, 10], [26.5, 18.4], [62, 18.4], [62, 10], [72.3, 10], [72.3, 8.3], [74.8, 8.3], [74.8, 10], [94.6, 10], [96.1, 8.6]],
    centerHole: 1.3,
    hold: { type: "chuck", s1: 12, r: 10 },
    datumA: { kind: "band", s0: 1.5, s1: 26.5, r: 10 },
    features: [
      { type: "line", s0: 30, s1: 58, r: 18.4, tol: 0.03, band: [27.2, 61.3] },
      { type: "radial", s: 86, r: 10, tol: 0.04, band: [75.5, 94.6] },
    ],
  },
  // Nabe mit Passfedernut: auf Spreizdorn in der Bohrung ⌀52 H7 (Bezug A), Bund oben.
  hub: {
    id: "nabe",
    label: "Nabe auf einem Spreizdorn in der Bohrung ⌀52 H7 (Bezug A). Die Messuhr tastet den Bund axial auf einem Messkreis; die untere Stirnfläche ist für die Rechtwinkligkeit durchscheinend gezeigt.",
    profile: [[0, 31.5], [1, 32.5], [46, 32.5], [46, 52], [63, 52], [64, 51]],
    bore: [[0, 64, 26]],
    keyhole: { w: 14, depth: 6 },
    hold: { type: "mandrel", r: 26, washer: 33, nut: 22, shoulder: 36 },
    datumA: { kind: "bore", s0: 0, s1: 64, r: 26 },
    features: [
      { type: "faceStatic", s: 0, rIn: 26, rOut: 32.5, tol: 0.05, value: 0.031 },
      { type: "axial", s: 64, r: 44, tol: 0.08, face: [33, 51] },
    ],
  },
  // Kupplungsflansch: auf Spanndorn in ⌀38 H7 (Bezug A), Kupplungsfläche oben.
  coupling: {
    id: "kupplung",
    label: "Kupplungsflansch auf einem Spanndorn in der Bohrung ⌀38 H7 (Bezug A). Die Messuhr fährt die Kupplungsfläche spiralförmig ab; der Übergangsradius ist im Längsschnitt mit seiner Profilzone gezeigt.",
    profile: [[0, 24], [1, 25], ...fillet(25, 46, 7), [46, 52], [77, 52], [78, 51]],
    bore: [[0, 78, 19]],
    holes: { r: 39, hole: 6.5, n: 6, s0: 46 },
    hold: { type: "mandrel", r: 19, washer: 22.5, nut: 16, shoulder: 29 },
    datumA: { kind: "bore", s0: 0, s1: 78, r: 19 },
    features: [
      { type: "profileStatic", hub: 25, face: 46, R: 7, tol: 0.1, value: 0.07 },
      { type: "axialTotal", s: 78, r0: 24, r1: 31, tol: 0.05, face: [22.5, 51] },
    ],
  },
};
