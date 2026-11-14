const LANGS = ["de", "en", "ar"];
const PAGES = ["index.html", "course.html", "tolerances.html"];
const NAV = {
  de: ["Startseite", "Grundkurs", "Toleranzübersicht"],
  en: ["Home", "Basic course", "Tolerance guide"],
  ar: ["الصفحة الرئيسية", "الدورة الأساسية", "دليل التفاوتات"],
};
const TITLES = {
  de: ["Mastara: Form- und Lagetoleranzen", "Mastara: Grundkurs", "Mastara: Toleranzübersicht"],
  en: ["Mastara: Geometric tolerances", "Mastara: Basic course", "Mastara: Tolerance guide"],
  ar: ["مسطرة: تفاوتات الشكل والموقع", "مسطرة: الدورة الأساسية", "مسطرة: دليل التفاوتات"],
};
const NAV_LABEL = { de: "Hauptnavigation", en: "Main navigation", ar: "التنقل الرئيسي" };
const LANG_LABEL = { de: "Sprache", en: "Language", ar: "اللغة" };

export function applyChrome(lang) {
  if (!LANGS.includes(lang)) lang = "de";
  const root = document.documentElement;
  root.lang = lang;
  root.dir = lang === "ar" ? "rtl" : "ltr";
  let current = PAGES.indexOf(location.pathname.split("/").pop());
  if (current < 0) current = 0;
  document.title = TITLES[lang][current];
  const nav = document.querySelector(".site-nav");
  if (nav) {
    nav.setAttribute("aria-label", NAV_LABEL[lang]);
    nav.querySelectorAll("a:not([data-workshop])").forEach((a, i) => {
      a.textContent = NAV[lang][i];
      if (i === current) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }
  if (nav) {
    let workshop = nav.querySelector('[data-workshop]');
    if (!workshop) {
      workshop = document.createElement("a");
      workshop.href = "./workshop-ar.html";
      workshop.dataset.workshop = "";
      workshop.hreflang = "ar";
      nav.append(workshop);
    }
    workshop.textContent = {de:"Werkstatt-Lektionen (AR)",en:"Workshop lessons (AR)",ar:"دروس الورشة"}[lang];
  }
  const label = document.getElementById("languageLabel");
  if (label) label.textContent = LANG_LABEL[lang];
  const select = document.getElementById("language");
  if (select) select.value = lang;
}
