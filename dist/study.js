import {setupCourse} from "./course.js";
import {setupCatalog} from "./catalog.js";
const labels={de:["Zur Startseite","Grundkurs","Toleranzübersicht","Sprache"],en:["Home","Basic course","Tolerance guide","Language"],ar:["الصفحة الرئيسية","الدورة الأساسية","دليل التفاوتات","اللغة"]};
let lang="de";
try{const saved=localStorage.getItem("edl-gps-lang");if(Object.hasOwn(labels,saved))lang=saved;}catch{}
const select=document.querySelector("#language");
const root=document.querySelector("main section");
const render=root.id==="course"?setupCourse(root):setupCatalog(root);
function show(){
 document.documentElement.lang=lang;
 document.documentElement.dir=lang==="ar"?"rtl":"ltr";
 select.value=lang;
 document.querySelector("#languageLabel").textContent=labels[lang][3];
 document.querySelectorAll(".page-links a").forEach((a,i)=>{a.textContent=labels[lang][i];});
 render(lang);
}
select.addEventListener("change",()=>{lang=select.value;try{localStorage.setItem("edl-gps-lang",lang);}catch{}show();});
show();
