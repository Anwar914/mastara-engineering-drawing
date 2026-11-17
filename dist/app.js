import { renderDrawingLesson } from "./drawing-lesson.js";
import { setupFitCalculator } from "./fit-calculator.js";
import {applyChrome} from "./site.js";
import { frameGuide } from "./frame-guide.js";
import { drawDatums, drawingLegend } from "./drawing-light.js";
import {examples} from "./data.js";
import {additionalDrawings} from "./more-drawings.js";
import {setupLab} from "./lab.js";
import {setupAssembly} from "./assembly.js";

const strings = {
 de: ["Form- und Lagetoleranzen","Wähle ein Bauteil und einen Toleranzrahmen. Die Zeichnung markiert das tolerierte Element, die Skizze zeigt die Toleranzzone.","Sprache","Bauteilauswahl","Form","Richtung","Ort","Lauf","Toleranzzone (überhöht)","Lehrzeichnung, Maße in mm"],
 en: ["Geometric tolerances","Choose a part and a tolerance frame. The drawing highlights the controlled feature and the sketch shows the tolerance zone.","Language","Choose a part","Form","Orientation","Location","Runout","Tolerance zone (exaggerated)","Teaching drawing, Dimensions in mm"],
 ar: ["تفاوتات الشكل والموقع","اختر قطعة وإطار تفاوت. يضيء الرسم العنصر الخاضع للتفاوت ويوضح المخطط منطقة التفاوت.","اللغة","اختيار القطعة","الشكل","الاتجاه","الموقع","الخفقان","منطقة التفاوت (مكبّرة)","رسم تعليمي, الأبعاد بالملليمتر"],
};

const geometries = [
 {
  body: '<path d="M77 78H200A104 104 0 1 1 77 78Z"/><circle cx="138" cy="160" r="35"/><circle cx="138" cy="160" r="70" class="axis"/><circle cx="138" cy="90" r="9"/><circle cx="208" cy="160" r="9"/><circle cx="138" cy="230" r="9"/><circle cx="68" cy="160" r="9"/><path d="M28 160H248M138 48V272" class="axis"/><path d="M332 76H352V113H405V139H332Z M332 181H405V207H352V244H332Z" fill="url(#hatch)"/><path d="M305 160H430" class="axis"/>',
  marks:['<path d="M332 78V139M332 181V242"/>','<circle cx="208" cy="160" r="9"/>'], anchors:[[332,88],[208,160]], frames:[[316,28],[233,263]],
  dims:'<path d="M332 240V271M352 240V271M332 263H352"/><text x="337" y="258">12</text><text x="126" y="156">⌀32</text><text x="183" y="230">[⌀70]</text><text x="324" y="116">A</text><text x="391" y="155">B</text><text x="112" y="72">C</text>',
 },
 {
  body:'<path d="M40 132l7-7h120v-19h58v-14h30l78 17h66v20h38l7 7v48l-7 7h-38v20h-66l-78 17h-30v-14h-58v-19H47l-7-7z"/><path d="M167 125v70m58-89v108m30-122v136m78-119v102m66-82v62"/><rect x="65" y="151" width="72" height="18" rx="9"/><path d="M25 160H460" class="axis"/>',
  marks:['<path d="M168 106H225M168 214H225"/>','<path d="M334 109H399M334 211H399"/>'], anchors:[[194,106],[370,109]], frames:[[135,42],[331,42]],
  dims:'<path d="M40 197v65m404-65v65M40 256h404"/><text x="229" y="251">104</text><text x="411" y="216">A</text><text x="173" y="233">⌀30</text>',
 },
 {
  body:'<path d="M83 89a31 31 0 0 0 0 62h150v-62z"/><circle cx="83" cy="120" r="14"/><path d="M40 120h214m-171-43v86" class="axis"/><path d="M52 179h181v-12h28l100 19h64v44h-64l-100 19h-28v-12H52v-18h181v-22H52z"/><path d="M233 179v18m0 22v18M68 179v18m30-18v18m-30 22v18m30-18v18" class="axis"/>',
  marks:['<path d="M52 197H233"/>','<circle cx="83" cy="120" r="14"/>'], anchors:[[184,197],[83,106]], frames:[[274,125],[66,30]],
  dims:'<path d="M52 242v26m181-26v26M52 262h181"/><text x="128" y="257">54</text><text x="151" y="231">A</text><text x="177" y="83">B</text><text x="102" y="110">⌀12</text>',
 },
 {
  body:'<path d="M72 65H121V105H272V124H390V146H209V132H72Z M72 188H209V174H390V196H272V215H121V255H72Z" fill="url(#hatch)"/><path d="M49 160H420" class="axis"/><path d="M209 132v14m0 28v14"/>',
  marks:['<path d="M124 105H270M124 215H270"/>','<path d="M72 65V132M72 188V255"/>'], anchors:[[207,105],[72,91]], frames:[[201,36],[25,23]],
  dims:'<path d="M72 255v28m318-82v82M72 277h318"/><text x="220" y="272">72</text><text x="302" y="157">⌀24</text><text x="374" y="170">A</text>',
 },
];

const get = (id) => document.getElementById(id);
let lang = "de";
try { if (Object.hasOwn(strings, localStorage.getItem("edl-gps-lang"))) lang = localStorage.getItem("edl-gps-lang"); } catch {}
let part = 0;
let feature = 0;
const category = {form:4,orientation:5,location:6,runout:7};
const zoneShapes = [
 ['<path d="M32 49H258M32 83H258"/><path class="actual" d="M32 71q27-29 52-8t55 3 58-1 61-6"/>','<ellipse cx="145" cy="55" rx="26" ry="15"/><path d="M119 55v39m52-39v39"/><ellipse cx="145" cy="94" rx="26" ry="15"/><path class="actual" d="M145 48l6 49"/>'],
 ['<circle cx="145" cy="72" r="43"/><circle cx="145" cy="72" r="30"/><path class="actual" d="M145 36c23-2 39 18 38 37s-16 38-38 36-37-14-36-36 12-35 36-37Z"/>','<circle cx="145" cy="72" r="43"/><circle cx="145" cy="72" r="30"/><path class="actual" d="M145 28v88m-44-44h88"/>'],
 ['<path d="M30 40H260M30 67H260M30 107H260"/><text x="39" y="102">A</text><path class="actual" d="M30 59q30-16 55-8t58 0 53 1 64 0"/>','<path d="M30 107H260M120 40v60m50-60v60"/><ellipse cx="145" cy="40" rx="25" ry="13"/><text x="38" y="101">B</text><path class="actual" d="M143 34l9 65"/>'],
 ['<ellipse cx="115" cy="54" rx="18" ry="36"/><ellipse cx="195" cy="74" rx="18" ry="36"/><path d="M115 18l80 20m-80 52 80 20"/><path class="actual" d="M115 54l80 20"/>','<path d="M126 28v89m36-89v89"/><path class="actual" d="M146 28q-7 20 0 40t-1 49"/><path d="M45 72H237" stroke-dasharray="10 4 2 4"/><text x="205" y="65">A</text>'],
];

for (const {example, geometry, zones} of additionalDrawings) {
 examples.push(example);
 geometries.push(geometry);
 zoneShapes.push(zones);
}

let activeCell = null;
function render() {
 document.documentElement.lang = lang;
 document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
 const t = strings[lang];
 applyChrome(lang);
 const example = examples[part];
 const [kind, , value, datum, title, explanation] = example.items[feature];
 const geometry = geometries[part];
 get("title").textContent = t[0];
 get("intro").textContent = t[1];
 get("languageLabel").textContent = t[2];
 get("language").value = lang;
 get("parts").setAttribute("aria-label",t[3]);
 get("parts").innerHTML = examples.map((entry,i) => '<button data-part="'+i+'" aria-pressed="'+(i===part)+'">'+entry.part[lang]+'</button>').join("");
 get("part").textContent = example.part[lang];
 get("category").textContent = t[category[kind]];
 get("feature").textContent = title[lang];
 get("explanation").textContent = explanation[lang];
 get("features").innerHTML = example.items.map((item,i)=>'<button data-feature="'+i+'" aria-pressed="'+(i===feature)+'">'+item[4][lang]+'</button>').join("");
 document.querySelector(".frame-guide")?.remove();
 get("explanation").insertAdjacentHTML("afterend", frameGuide(lang, example.items[feature][1], value, datum, title[lang], activeCell));
 const frames = example.items.map((item,i)=>{
   const [,symbol, amount, refs] = item;
   const [x,y] = geometry.frames[i];
   const [ax,ay] = geometry.anchors[i];
   const cells = [symbol, amount, ...refs.split(" ").filter(Boolean)];
   let left = 0;
   const box = cells.map((cell,j)=>{
     const width = j===1 ? 57 : j===0 && cell==="↗↗" ? 31 : 24;
     const markup = '<rect data-cell="'+Math.min(j,2)+'" x="'+left+'" width="'+width+'" height="24"/><text data-cell="'+Math.min(j,2)+'" x="'+(left+width/2)+'" y="16" text-anchor="middle">'+cell+'</text>';
     left += width;
     return markup;
   }).join("");
   return '<path d="M'+(x+12)+' '+(y+12)+'L'+ax+' '+ay+'" class="'+(i===feature?'laser-leader':'context-leader')+'" stroke="#758e9a"/><circle cx="'+ax+'" cy="'+ay+'" r="2" stroke="none" fill="'+(i===feature?'#c04a00':'#758e9a')+'"/><g transform="translate('+x+' '+y+')" data-feature="'+i+'" role="button" tabindex="0" aria-pressed="'+(i===feature)+'" aria-label="'+item[4][lang]+'" fill="'+(i===feature?'#fff2e8':'white')+'">'+box+'</g>';
 }).join("");
 get("drawing").innerHTML = '<svg viewBox="0 0 480 315" role="group" aria-label="'+example.part[lang]+'"><defs><pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v8" stroke="#76929d"/></pattern></defs><style>.axis{stroke:#667f8d;stroke-dasharray:9 4 2 4}</style><g fill="none" stroke="#183649" stroke-width="1.5">'+'<g class="drawing-context">'+geometry.body+'<g stroke="#657d8a" font-size="12">'+geometry.dims+'</g></g>'+drawDatums(part,datum)+'<g class="selected">'+geometry.marks[feature]+'</g>'+frames+'</g><text x="238" y="302" text-anchor="middle" font-size="10" direction="'+document.documentElement.dir+'">'+t[9]+'</text></svg>'+drawingLegend(lang,datum);
 get("zone").innerHTML = '<svg viewBox="0 0 290 153" role="img" aria-label="'+t[8]+'"><style>.actual{stroke:#007f86;stroke-width:3}</style><g fill="none" stroke="#506f80" stroke-width="1.5">'+zoneShapes[part][feature]+'</g><text x="145" y="133" text-anchor="middle" font-size="12">'+value+' mm'+(datum?', '+datum:'')+'</text><text x="145" y="148" text-anchor="middle" font-size="9" direction="'+document.documentElement.dir+'">'+t[8]+'</text></svg>';
}
document.addEventListener("click",(event)=>{
 activeCell = event.target.dataset.cell === undefined ? null : Number(event.target.dataset.cell);
 const control = event.target.closest("[data-part],[data-feature]");
 if (!control) return;
 const {part:nextPart,feature:nextFeature} = control.dataset;
 if (nextPart !== undefined) { part = Number(nextPart); feature = 0; }
 else feature = Number(nextFeature);
 const parent = control.closest("#parts,#features,#drawing").id;
 const selector = nextPart === undefined ? '[data-feature="'+feature+'"]' : '[data-part="'+part+'"]';
 render();
 get(parent).querySelector(selector)?.focus();
});
get("drawing").addEventListener("keydown",(event)=>{
 const target = event.target.closest("[data-feature]");
 if (target && ["Enter"," "].includes(event.key)) { event.preventDefault(); target.dispatchEvent(new MouseEvent("click",{bubbles:true})); }
});
get("language").addEventListener("change",(event)=>{
 lang = event.target.value;
 try { localStorage.setItem("edl-gps-lang",lang); } catch {}
 render();
 renderLab(lang);
 renderAssembly(lang);
 renderFitCalculator(lang);
 renderDrawing(lang);
 renderStudyLinks();
});
const lab = document.createElement("section");
lab.id = "lab";
const labStyle = document.createElement("link");
labStyle.rel = "stylesheet";
labStyle.href = "./lab.css";
document.getElementById("mizan").before(labStyle);
document.querySelector("footer").before(lab);
const renderLab = setupLab(lab);
const assembly = document.createElement("section");
assembly.id = "assembly";
const assemblyStyle = document.createElement("link");
assemblyStyle.rel = "stylesheet";
assemblyStyle.href = "./assembly.css";
document.getElementById("mizan").before(assemblyStyle);
document.querySelector(".layout").after(assembly);
const renderAssembly = setupAssembly(assembly);
const fitCalculator = document.createElement("section");
fitCalculator.id = "fit-calculator";
assembly.before(fitCalculator);
const renderFitCalculator = setupFitCalculator(fitCalculator);
const drawingLesson = document.createElement("section");
drawingLesson.id = "drawing-lesson";
fitCalculator.after(drawingLesson);
const renderDrawing = (language) => renderDrawingLesson(drawingLesson, language);
const studyLinks = document.createElement("nav");
studyLinks.id = "sections";
studyLinks.className = "section-links";
studyLinks.style.marginBlock = "1rem";
get("parts").before(studyLinks);
const studyStyle = document.createElement("link");
studyStyle.rel = "stylesheet";
studyStyle.href = "./study.css";
document.getElementById("mizan").before(studyStyle);
function renderStudyLinks(){
 const names = {de:["Zeichnungen","Zeichnung lesen","Passungsrechner","Montage-Simulation","Prüflabor"],en:["Drawings","Read the drawing","Fit calculator","Assembly simulation","Inspection lab"],ar:["الرسومات","قراءة الرسم","حاسبة التوافقات","محاكاة التركيب","مختبر القياس"]}[lang];
 studyLinks.setAttribute("aria-label", {de:"Auf dieser Seite",en:"On this page",ar:"في هذه الصفحة"}[lang]);
 studyLinks.innerHTML = ["#parts","#drawing-lesson","#fit-calculator","#assembly","#lab"].map((h,i)=>'<a href="'+h+'">'+names[i]+'</a>').join("");
}
render();
renderLab(lang);
renderAssembly(lang);
renderFitCalculator(lang);
 renderDrawing(lang);
renderStudyLinks();
