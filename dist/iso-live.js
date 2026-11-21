// Isometrische Prüfaufbau-Karte neben der Normzeichnung.
// Die Figuren erzeugt tools/iso/build.mjs (iso/fig-N.js), jede wird erst bei Bedarf geladen.

const text = {
  de: { fig: "Abb. 2", title: "Prüfaufbau isometrisch", hint: "Toleranzzonen überhöht · Beispielteil", feature: "Toleriertes Element, Zone", datum: "Bezug", actual: "Ist-Geometrie", label: "Isometrischer Prüfaufbau", dial: "Messuhr", span: "Spanne bisher", turn: "Drehung" },
  en: { fig: "Fig. 2", title: "Inspection setup, isometric", hint: "Tolerance zones exaggerated · sample part", feature: "Controlled feature, zone", datum: "Datum", actual: "Actual geometry", label: "Isometric inspection setup", dial: "dial", span: "span so far", turn: "turn" },
  ar: { fig: "شكل 2", title: "إعداد الفحص، منظور متساوي القياس", hint: "مناطق التفاوت مكبّرة · قطعة مثال", feature: "العنصر الخاضع للتفاوت، المنطقة", datum: "مرجع", actual: "الشكل الفعلي", label: "إعداد فحص متساوي القياس", dial: "القراءة", span: "المدى", turn: "الدوران" },
};

const num = (lang, value, digits) => (lang === "de" ? value.toFixed(digits).replace(".", ",") : value.toFixed(digits));
const still = matchMedia("(prefers-reduced-motion: reduce)");
const cache = new Map();
const load = (src) => {
  if (!cache.has(src)) cache.set(src, import(`./iso/${src}.js`).then((mod) => mod.figure).catch(() => null));
  return cache.get(src);
};

let state = null;

const model = (md, th, u) =>
  md.rot.reduce((s, [a, k, ph]) => s + a * Math.sin(k * th + ph), 0) + md.lin.reduce((s, [a, f, ph]) => s + a * Math.sin(2 * Math.PI * f * u + ph), 0) - (md.mid || 0);

function project(live, [x, y, z]) {
  const { axes, U } = live;
  const X = x * U, Y = y * U, Z = z * U;
  return [axes.o[0] + X * axes.x[0] + Y * axes.y[0] + Z * axes.z[0], axes.o[1] + X * axes.x[1] + Y * axes.y[1] + Z * axes.z[1]];
}
const seg = (a, b) => `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;

function needlePath(live, n, turn) {
  const a = turn * Math.PI * 2;
  const [cx, cy, cz] = n.c;
  return seg(project(live, [cx - Math.sin(a) * 2.4, cy + Math.cos(a) * 2.4, cz]), project(live, [cx + Math.sin(a) * n.len, cy - Math.cos(a) * n.len, cz]));
}

function stop() {
  if (state?.frame) cancelAnimationFrame(state.frame);
  if (state) { state.frame = 0; state.resume = null; }
}

function setMarks(theta) {
  const { live } = state.fig;
  (live.marks || []).forEach((mk, i) => {
    const el = state.stage.querySelector(`[data-iso-mark="${i}"]`);
    if (!el) return;
    const c = Math.cos(theta), s = Math.sin(theta);
    el.setAttribute("d", seg(project(live, [mk.r0 * c, mk.r0 * s, mk.z]), project(live, [mk.r1 * c, mk.r1 * s, mk.z])));
  });
}

function movers(i) {
  return state.stage.querySelectorAll(`[data-iso-move~="f${i}"]`);
}
const translate = (a, b, u) => `translate(${(a[0] + (b[0] - a[0]) * u).toFixed(2)} ${(a[1] + (b[1] - a[1]) * u).toFixed(2)})`;

function run() {
  const s = state;
  const i = s.feature;
  const f = s.fig.live.features[i];
  const t = text[s.lang];
  const group = movers(i);
  const needle = [...s.stage.querySelectorAll(`[data-show="${i}"] [data-iso-needle], [data-iso-move~="f${i}"] [data-iso-needle]`)][0];
  const readout = s.el.querySelector("[data-readout]");
  let clock = 0, last = 0, lo = Infinity, hi = -Infinity;
  const place = (th, u) => {
    const h = model(f.model, th, u);
    lo = Math.min(lo, h);
    hi = Math.max(hi, h);
    group.forEach((g) => g.setAttribute("transform", translate(f.move0, f.move1, u)));
    needle?.setAttribute("d", needlePath(s.fig.live, f.needle, h / f.needle.perTurn));
    setMarks(th);
    const span = hi - lo;
    const deg = f.turns ? `${t.turn} ${String(Math.round(((th / (2 * Math.PI)) * 360) % 360)).padStart(3, " ")}° · ` : "";
    readout.textContent = `${deg}${t.dial} ${h >= 0 ? "+" : "−"}${num(s.lang, Math.abs(h), 3)} · ${t.span} ${num(s.lang, span, 3)} ≤ ${num(s.lang, f.tol, 2)} ${s.lang === "ar" ? "مم" : "mm"} ${span <= f.tol ? "✓" : "✗"}`;
  };
  const at = (c) => {
    const u = f.move1[0] || f.move1[1] ? 0.5 - 0.5 * Math.cos((2 * Math.PI * c) / f.period) : 0;
    const th = f.turns ? (2 * Math.PI * c * (f.move1[0] || f.move1[1] ? f.turns : 1)) / f.period : 0;
    return [th, u];
  };
  if (still.matches) {
    for (let j = 0; j <= 240; j++) place(...at((j / 240) * f.period));
    place(...at(0));
    return;
  }
  const tick = (now) => {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    clock += dt;
    place(...at(clock));
    s.frame = s.visible ? requestAnimationFrame(tick) : 0;
  };
  s.resume = () => { if (!s.frame && s.visible) { last = 0; s.frame = requestAnimationFrame(tick); } };
  s.resume();
}

function park() {
  const s = state;
  const f = s.fig.live.features[s.feature];
  s.stage.querySelectorAll("[data-iso-move]").forEach((g) => g.removeAttribute("transform"));
  s.stage.querySelectorAll("[data-iso-needle]").forEach((n) => n.removeAttribute("transform"));
  setMarks(0);
  s.el.querySelector("[data-readout]").textContent = f.text?.[s.lang] ?? "";
}

function apply(host, args, fig) {
  const { feature, datum, lang } = args;
  const part = args.src;
  const shown = args.datumShow ?? datum;
  let el = host.querySelector(".iso-card");
  const t = text[lang];
  if (!el || !state || state.part !== part || state.fig !== fig) {
    stop();
    el?.remove();
    host.insertAdjacentHTML(
      "beforeend",
      `<figure class="iso iso-card" data-theme="light"><div class="iso-head"><span data-t="fig"></span><b data-t="title"></b></div>` +
        `<div class="iso-stage" role="img" dir="ltr">${fig.svg}</div>` +
        `<figcaption class="iso-foot"><span data-t="hint"></span><span data-readout aria-live="off"></span></figcaption>` +
        `<ul class="iso-keys"><li class="k-feature" data-t="feature"></li><li class="k-datum"></li><li class="k-actual" data-t="actual"></li></ul></figure>`,
    );
    el = host.querySelector(".iso-card");
    state = { part, el, stage: el.querySelector(".iso-stage"), fig, frame: 0, visible: true };
    const mine = state;
    new IntersectionObserver((entries) => {
      mine.visible = entries[entries.length - 1].isIntersecting;
      if (mine.visible) mine.resume?.();
    }).observe(el);
  }
  el.hidden = false;
  el.dir = lang === "ar" ? "rtl" : "ltr";
  el.querySelectorAll("[data-t]").forEach((n) => { n.textContent = t[n.dataset.t]; });
  state.stage.setAttribute("aria-label", t.label);
  const key = el.querySelector(".k-datum");
  key.hidden = !datum;
  key.textContent = t.datum + (datum ? " " + datum : "");
  const refs = shown.split(" ").filter(Boolean);
  el.querySelectorAll("[data-show]").forEach((n) => {
    const v = n.dataset.show;
    n.toggleAttribute("hidden", v.startsWith("d:") ? !refs.includes(v.slice(2)) : Number(v) !== feature);
  });
  stop();
  const f = fig.live.features[feature];
  Object.assign(state, { feature, lang });
  state.stage.toggleAttribute("data-ghost", !!f.ghost);
  if (f.mode === "run") run();
  else park();
}

let pending = 0;
// args: { part | src, feature, datum (Legende), datumShow (hervorgehobene Bezüge, Standard = datum), lang }
export function renderIso(host, args) {
  const ticket = ++pending;
  args = { ...args, src: args.src ?? `fig-${args.part}` };
  load(args.src).then((fig) => {
    if (ticket !== pending) return;
    if (!fig) {
      stop();
      const el = host.querySelector(".iso-card");
      if (el) el.hidden = true;
      return;
    }
    apply(host, args, fig);
  });
}
