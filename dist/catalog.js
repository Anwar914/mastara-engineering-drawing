import { renderCatalogExample } from "./catalog-examples.js";
const rows = [
  [
    "—",
    "Geradheit",
    "Straightness",
    "الاستقامة",
    "Eine Mantellinie muss zwischen zwei parallelen Geraden liegen. Bei einer Achse mit ⌀-Angabe ist die Zone zylindrisch.",
    "A surface line fits between two parallel lines. For an axis with a diameter sign, the zone is cylindrical.",
    "يقع خط السطح بين مستقيمين متوازيين. تكون منطقة تفاوت المحور أسطوانية عند وجود رمز القطر."
  ],
  [
    "▱",
    "Ebenheit",
    "Flatness",
    "الاستواء",
    "Die Fläche muss zwischen zwei parallelen Ebenen liegen. Beispiel: Auflagefläche eines Flanschs.",
    "The surface fits between two parallel planes. Example: a flange seating face.",
    "يقع السطح بين مستويين متوازيين، مثل سطح ارتكاز الفلنجة."
  ],
  [
    "○",
    "Rundheit",
    "Roundness",
    "الاستدارة",
    "In jedem betrachteten Querschnitt liegt die Kontur zwischen zwei konzentrischen Kreisen. Deren Mittelpunkt darf sich je Schnitt ändern.",
    "In each section the contour fits between concentric circles. Their center may vary between sections.",
    "يقع المحيط في كل مقطع بين دائرتين متحدتي المركز. يمكن أن يتغير المركز بين المقاطع."
  ],
  [
    "⌭",
    "Zylinderform",
    "Cylindricity",
    "الأسطوانية",
    "Die gesamte Mantelfläche liegt zwischen zwei koaxialen Zylindern mit radialem Abstand t.",
    "The entire surface fits between two coaxial cylinders separated radially by t.",
    "يقع السطح الأسطواني بأكمله بين أسطوانتين متحدتي المحور بفاصل شعاعي t."
  ],
  [
    "⌒",
    "Linienprofil",
    "Line profile",
    "تفاوت منحنى الخط",
    "Das Profil eines Schnitts liegt zwischen Hülllinien um die Sollkontur. Ein Bezug kann das Profil zusätzlich ausrichten oder positionieren.",
    "A section profile fits between envelopes around the nominal contour. Datums can also orient or locate the profile.",
    "يقع منحنى المقطع بين حدين حول المنحنى النظري. يمكن أن تحدد المراجع اتجاهه أو موقعه."
  ],
  [
    "⌓",
    "Flächenprofil",
    "Surface profile",
    "تفاوت شكل السطح",
    "Die gesamte Fläche liegt zwischen zwei Hüllflächen um die Sollgeometrie. Mit Bezügen kann die Angabe auch Richtung und Ort begrenzen.",
    "The entire surface fits between envelopes around the nominal geometry. Datums can constrain orientation and location.",
    "يقع السطح كله بين سطحين حول الشكل النظري. ويمكن للمراجع ضبط الاتجاه والموقع."
  ],
  [
    "∥",
    "Parallelität",
    "Parallelism",
    "التوازي",
    "Die tolerierte Fläche liegt zwischen zwei Ebenen, die parallel zum Bezug A ausgerichtet sind.",
    "The controlled surface fits between two planes parallel to datum A.",
    "يقع السطح بين مستويين متوازيين مع المرجع A."
  ],
  [
    "⟂",
    "Rechtwinkligkeit",
    "Perpendicularity",
    "التعامد",
    "Eine Bohrungsachse mit ⌀-Angabe liegt in einem Zylinder, dessen Achse senkrecht auf Bezugsebene A steht.",
    "A bore axis with a diameter sign fits inside a cylindrical zone perpendicular to datum plane A.",
    "يقع محور الثقب داخل منطقة أسطوانية عمودية على المستوى المرجعي A عند وجود رمز القطر."
  ],
  [
    "∠",
    "Neigung",
    "Angularity",
    "الميل",
    "Die Zone wird im theoretisch exakten Winkel zum Bezug ausgerichtet. Beispiel: zwei Ebenen bei 30° zu A.",
    "The zone is oriented at the theoretically exact angle to the datum. Example: two planes at 30° to A.",
    "توجّه المنطقة بالزاوية النظرية الدقيقة بالنسبة إلى المرجع، مثل مستويين بزاوية 30° مع A."
  ],
  [
    "⌖",
    "Position",
    "Position",
    "الموضع",
    "Die abgeleitete Mittellinie einer Bohrung liegt in einer zylindrischen Zone an der theoretisch exakten Position. Beim Lochmuster können die Zonen als Gruppe spezifiziert werden.",
    "The extracted median line of a hole fits in a cylindrical zone at its theoretically exact position. Pattern zones can be specified as a group.",
    "يقع الخط الوسطي المستخرج للثقب في منطقة أسطوانية عند الموضع النظري الدقيق. يمكن تحديد مناطق الثقوب كمجموعة."
  ],
  [
    "◎",
    "Koaxialität / Konzentrizität",
    "Coaxiality / concentricity",
    "اتحاد المحور / المركز",
    "Koaxialität bezieht eine Mittellinie auf eine Bezugsachse. Konzentrizität vergleicht Mittelpunkte im betrachteten Schnitt.",
    "Coaxiality relates a median line to a datum axis. Concentricity compares centers in the section considered.",
    "يقارن اتحاد المحور الخط الوسطي بمحور مرجعي، ويقارن اتحاد المركز نقاط المراكز في المقطع."
  ],
  [
    "≡",
    "Symmetrie",
    "Symmetry",
    "التناظر",
    "Die abgeleitete Mittelfläche einer Nut liegt zwischen zwei Ebenen, die symmetrisch zur Bezugsebene liegen.",
    "The extracted median surface of a slot fits between two planes symmetric about the datum plane.",
    "يقع السطح الوسطي المستخرج للمجرى بين مستويين متناظرين حول المستوى المرجعي."
  ],
  [
    "↗",
    "Rundlauf / Planlauf",
    "Circular radial / axial runout",
    "الخفقان الدائري الشعاعي / المحوري",
    "Bei einer Umdrehung um A misst der Taster radial an einer festen axialen Stelle oder axial auf einem festen Messkreis. Bewertet wird jeweils Maximum minus Minimum.",
    "Rotate about A. Probe radially at a fixed axial station or axially on one fixed circle. Use the range of readings on that path.",
    "تُدار القطعة حول A ويُقاس شعاعياً عند موضع محوري ثابت أو محورياً على دائرة ثابتة. يُحسب فرق أعلى وأدنى قراءة على المسار."
  ],
  [
    "↗↗",
    "Gesamtrundlauf / Gesamtplanlauf",
    "Total radial / axial runout",
    "الخفقان الكلي الشعاعي / المحوري",
    "Beim Drehen um A tastet die Messuhr den gesamten Mantel oder die Stirnfläche ab. Maßgeblich ist die Spannweite über die gesamte geprüfte Fläche.",
    "Rotate about A while sweeping the cylindrical surface or end face. Use the range across the entire inspected surface.",
    "تُدار القطعة حول A ويُمسح السطح الأسطواني أو الوجه الطرفي. يُحسب فرق القراءات عبر كامل السطح المفحوص."
  ]
];
const groups=[[0,6],[6,9],[9,12],[12,14]];
const ui={de:["Form- und Lagetoleranzen","Form und Profil","Richtung","Ort","Lauf","Aus der Übersicht: Wähle ein Symbol, um die Toleranzzone und ein Anwendungsbeispiel zu lesen.","Lochgruppe in der Montage-Simulation prüfen"],en:["Geometric tolerances","Form and profile","Orientation","Location","Runout","Choose a symbol to see what its tolerance zone controls.","Inspect the hole pattern in the assembly simulation"],ar:["تفاوتات الشكل والموقع","الشكل والمنحنى","الاتجاه","الموقع","الخفقان","اختر رمزاً لقراءة معنى منطقة التفاوت ومثال تطبيقها.","افحص مجموعة الثقوب في محاكاة التركيب"]};

export function setupCatalog(root) {
 let active=0,lang="de";
 function render(nextLang){
  lang=nextLang;
  const n={de:1,en:2,ar:3}[lang], t=ui[lang], row=rows[active];
  root.innerHTML='<h2>'+t[0]+'</h2><p>'+t[5]+'</p><div class="catalog-grid">'+groups.map(([from,to],group)=>'<section><h3>'+t[group+1]+'</h3>'+rows.slice(from,to).map((r,i)=>'<button data-symbol="'+(from+i)+'" aria-pressed="'+(from+i===active)+'"><bdi>'+r[0]+'</bdi> '+r[n]+'</button>').join("")+'</section>').join("")+'</div><article class="catalog-detail" aria-live="polite"><h3><bdi>'+row[0]+'</bdi> '+row[n]+'</h3><p>'+row[n+3]+'</p>'+renderCatalogExample(active,row[0],lang)+(active===9?'<a href="./#assembly">'+t[6]+'</a>':'')+'</article><a href="https://www.iso.org/standard/66777.html">ISO 1101</a> · <a href="https://www.iso.org/standard/65559.html">ISO 5458</a>';
 }
 root.addEventListener("click",event=>{
  const button=event.target.closest("[data-symbol]");
  if(!button)return;
  active=Number(button.dataset.symbol);
  render(lang);
  root.querySelector('[data-symbol="'+active+'"]').focus();
 });
 return render;
}
