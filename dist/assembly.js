import { evaluate, fits, stations } from "./assembly-model.js";
const words = {
de:["Montage-Simulation: Welle und Kupplungsnabe","Ändere Passung, Istmaße und Lochbild. Schnitt und Stirnansicht zeigen, wo die Montage klemmt.","Wellenpassung","Bohrung H7: Istmaß im Feld (%)","Welle: Istmaß im Feld (%)","Exzentrizität der Welle (µm)","Formfehler: Zweilappigkeit (µm)","Formtoleranz (µm)","Lochgruppe: X-Versatz (µm)","Lochgruppe: Drehung (mrad)","Loch 1: radialer Fehler (µm)","Positionstoleranz ⌀ (µm)","Loch-Ø (mm)","Bolzen-Ø (mm)","Montageversatz X (µm)","Montage versuchen","Zurücksetzen","Fügt sich","Klemmt am Sitz","Bolzen blockiert","Spiel / Übermaß","Kleinster radialer Spalt","Formprüfung","Positionsprüfung","eingehalten","überschritten","Schnitt A–A: Spalt überhöht","Lochkreis: Versätze überhöht","Spielpassung","Übergangspassung","Übermaßpassung","Grün: Bolzen passt durch. Rot: Bolzen trifft Lochrand.","A: Anlagefläche; B: Zentrierachse; C: Passfedernut legt die Drehstellung fest.","Die sechs Sollpositionen bleiben als Muster fest. Versatz und Drehung wirken auf die gesamte Istgruppe, der Einzelfehler nur auf Loch 1. Der Montageversatz verschiebt Nabe und Lochgruppe gemeinsam. Die Positionsprüfung bleibt im Bezugssystem A–B–C.","Ebener Lehrschnitt mit starren Teilen. Pressen, Erwärmen, Achsneigung und Verformung sind hier nicht modelliert.","Grenzspiel der Passung"],
en:["Assembly simulation: Shaft and coupling hub","Change the fit, actual sizes and hole pattern. The section and end view show where assembly binds.","Shaft fit","H7 bore: actual position in range (%)","Shaft: actual position in range (%)","Shaft eccentricity (µm)","Form error: two lobes (µm)","Form tolerance (µm)","Hole pattern: X shift (µm)","Hole pattern: rotation (mrad)","Hole 1: radial error (µm)","Position tolerance ⌀ (µm)","Hole diameter (mm)","Pin diameter (mm)","Assembly X shift (µm)","Try assembly","Reset","Assembles","Seat binds","Pin blocked","Clearance / interference","Smallest radial gap","Form check","Position check","within tolerance","out of tolerance","Section A–A: exaggerated gap","Bolt circle: exaggerated offsets","Clearance fit","Transition fit","Interference fit","Green: pin clears the hole. Red: pin strikes the hole edge.","A: seating face; B: locating axis; C: keyway sets angular orientation.","The six nominal positions form a fixed pattern. Translation and rotation affect all actual holes, while the individual error affects only hole 1. Assembly shift moves the hub and pattern together. Position inspection stays in the A–B–C datum system.","Planar teaching model with rigid parts. Pressing, heating, tilt and deformation are outside the model.","Fit clearance limits"],
ar:["محاكاة التركيب: عمود وصرّة اقتران","غيّر التوافق والمقاسات الفعلية ونمط الثقوب. يبيّن المقطع والمسقط الأمامي موضع التعارض.","توافق العمود","ثقب H7: المقاس ضمن المجال (%)","العمود: المقاس ضمن المجال (%)","لامركزية العمود (µm)","انحراف الشكل ثنائي الفص (µm)","تفاوت الشكل (µm)","مجموعة الثقوب: إزاحة X (µm)","مجموعة الثقوب: الدوران (mrad)","الخطأ الشعاعي للثقب 1 (µm)","تفاوت الموضع ⌀ (µm)","قطر الثقب (mm)","قطر المسمار (mm)","إزاحة التركيب X (µm)","جرّب التركيب","إعادة الضبط","التركيب ممكن","تعارض عند سطح التمركز","المسمار محجوب","الخلوص / التداخل","أصغر خلوص شعاعي","فحص الشكل","فحص الموضع","ضمن التفاوت","خارج التفاوت","مقطع A–A: الخلوص مكبّر","دائرة الثقوب: الإزاحات مكبّرة","توافق خلوصي","توافق انتقالي","توافق تداخلي","الأخضر: المسمار يمر. الأحمر: يصطدم بحافة الثقب.","A سطح الارتكاز، B محور التمركز، C مجرى المفتاح يحدد اتجاه الدوران.","تشكل المواضع الاسمية الستة نمطاً ثابتاً. تؤثر الإزاحة والدوران على مجموعة الثقوب الفعلية، والخطأ الفردي على الثقب 1 فقط. تحرّك إزاحة التركيب الصرّة ومجموعة الثقوب معاً. يظل فحص الموضع في نظام A–B–C.","نموذج تعليمي مستوٍ بأجزاء صلبة. لا يحاكي الكبس أو التسخين أو الميل أو التشوه.","حدود خلوص التوافق"],
};
const controls=[
 ["bore",2,0,100,1,50],["shaft",3,0,100,1,50],["offset",4,-40,40,1,0],["form",5,0,60,1,0],["formLimit",6,0,60,1,20],["groupX",7,-350,350,5,0],["angle",8,-8,8,.1,0],["local",9,-300,300,5,0],["position",10,0,800,10,200],["hole",11,7.8,9,.01,8.4],["pin",12,7.8,9,.01,8],["float",13,-40,40,1,0],
];
const initial=()=>Object.fromEntries([["fit","g6"],...controls.map(([key,,,,,value])=>[key,value])]);
const axis='stroke="#718b98" stroke-dasharray="10 4 2 4"';
const safeGap=(n)=>Math.max(-27,Math.min(27,n*0.8));
const scenarios = {
 de:["Leichtgängig","Sitz klemmt","Lochgruppe verdreht","Ein Loch versetzt"],
 en:["Free fit","Seat binds","Pattern rotated","One hole offset"],
 ar:["تركيب سهل","تداخل عند المقعد","دوران المجموعة","إزاحة ثقب واحد"],
};
const presets = [{},{fit:"p6"},{angle:8},{local:260}];

export function setupAssembly(root){
 let state=initial(),lang="de",tried=false;
 const find=(sel)=>root.querySelector(sel);
 const fmt=(n)=>new Intl.NumberFormat(lang,{maximumFractionDigits:3}).format(Math.abs(n)<1e-7?0:n);
 function update(){
  const t=words[lang], r=evaluate(state);
  const color=r.assembly?"#007b76":"#b33337";
  const split=tried?(r.assembly?0:66):125;
  const eccentricity=state.offset-state.float;
  const top=116-safeGap(r.clearance/2-eccentricity-state.form/2);
  const bottom=184+safeGap(r.clearance/2+eccentricity-state.form/2);
  find(".mount").innerHTML=`<svg viewBox="0 0 510 296" role="img" aria-label="${t[27]}"><defs><pattern id="assemblyHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v8" stroke="#698897"/></pattern></defs>
  <g fill="none" stroke="#173649" stroke-width="1.5"><path d="M15 150H488" ${axis}/><path d="M258 53h52v22h140l18 17v${top-92}H258Z M258 ${bottom}H468v${208-bottom}l-18 17H310v22h-52Z" fill="url(#assemblyHatch)"/>
  <path d="M270 53v26h26V53m-26 194v-26h26v26M310 81h140M310 219h140" stroke-dasharray="4 3"/>
  <g transform="translate(${-split} 0)"><path d="M147 128l6-6h37v-19h39v13h128l8 8v52l-8 8H229v13h-39v-19h-37l-6-6Z" fill="#b6d3df"/><path d="M243 116v8h8v-8m-8 68v-8h8v8M273 116v-6h42v6M152 150h216" ${axis}/></g>
  <path d="M258 49V23m210 65V23M258 29H468m-210 0 7-3m-7 3 7 3m203-3-7-3m7 3-7 3M468 94h22m-22 113h22m-6-113v113"/>
  <path d="M260 247v24h-18m226-87v52h-18"/><rect x="220" y="260" width="22" height="20"/><rect x="428" y="226" width="22" height="20"/></g>
  <g font-size="12"><text x="351" y="24">64</text><text x="489" y="146">⌀</text><text x="326" y="102">⌀30 H7</text><text x="203" y="216">⌀30 ${state.fit}</text><text x="226" y="275">A</text><text x="434" y="241">B</text><text x="326" y="268">A–A</text></g>
  ${tried&&!r.assembly?'<path d="M259 102v96" stroke="'+color+'" stroke-width="4"/>':""}</svg>`;
  find(".face").innerHTML=`<svg viewBox="0 0 360 296" role="img" aria-label="${t[28]}"><g fill="none" stroke="#173649" stroke-width="1.5"><circle cx="180" cy="149" r="118"/><circle cx="180" cy="149" r="97" ${axis}/><path d="M45 149H315M180 18V278" ${axis}/><path d="M170 107v-12h20v12a43 43 0 1 1-20 0z"/><path d="M190 96l29-23h23"/><rect x="242" y="63" width="21" height="20"/>
  ${stations.map(([ux,uy],i)=>{
    const h=r.holes[i], x=180+97*ux, y=149+97*uy;
    const hx=x+(h.dx-state.float)*.065, hy=y+h.dy*.065;
    const displayRadius=(diameter)=>12+(diameter-8)*32.5;
    const minDiameter=Math.min(state.hole,state.pin);
    const radius=(diameter)=>displayRadius(diameter)+Math.max(0,8-minDiameter)*32.5;
    return '<g><circle cx="'+x+'" cy="'+y+'" r="'+Math.max(1,state.position*.0325)+'" stroke="#63808c" stroke-dasharray="3 3"/><circle cx="'+hx+'" cy="'+hy+'" r="'+radius(state.hole)+'" fill="#f4fafb"/><circle cx="'+x+'" cy="'+y+'" r="'+radius(state.pin)+'" fill="'+(h.gap>=-1e-7?'#9ad5c8':'#ffb9aa')+'" fill-opacity=".62"/><path d="M'+x+' '+y+'L'+hx+' '+hy+'" stroke="#335765"/><text x="'+(180+135*ux)+'" y="'+(153+130*uy)+'" text-anchor="middle" font-size="11">'+(i+1)+'</text></g>';
  }).join("")}</g><text x="249" y="77" font-size="12">C</text><text x="143" y="288" font-size="12">6 × ⌀${fmt(state.hole)}, [⌀70]</text></svg>`;
  const kind=r.minClearance>=0?29:r.maxClearance<=0?31:30;
  const check=(name,ok)=>'<span>'+name+'</span><strong class="'+(ok?'ok':'bad')+'">'+t[ok?25:26]+'</strong>';
  find(".sim-results").innerHTML='<strong class="'+(r.assembly?'ok':'bad')+'">'+(r.assembly?t[17]:[r.clearanceAfterShift < -1e-7?t[18]:"",!r.bolts?t[19]:""].filter(Boolean).join(", "))+'</strong><dl><dt>⌀ H7 / '+state.fit+'</dt><dd><bdi>'+fmt(r.bore)+' / '+fmt(r.shaft)+' mm</bdi></dd><dt>'+t[kind]+': '+t[36]+'</dt><dd><bdi>'+fmt(r.minClearance)+' … '+fmt(r.maxClearance)+' µm</bdi></dd><dt>'+t[20]+'</dt><dd><bdi>'+fmt(r.clearance)+' µm</bdi></dd><dt>'+t[21]+'</dt><dd><bdi>'+fmt(r.clearanceAfterShift)+' µm</bdi></dd></dl><div class="sim-checks">'+check(t[22],r.geometry)+check(t[23],r.position)+'</div>';
  find(".sim-holes").innerHTML='<tbody>'+r.holes.map((h,i)=>'<tr><th scope="row">'+(i+1)+'</th><td>'+fmt(h.error)+'</td><td class="'+(h.gap>=-1e-7?'ok':'bad')+'">'+fmt(h.gap)+'</td></tr>').join("")+'</tbody>';
 }
 function render(nextLang){
  lang=nextLang;const t=words[lang];
  root.innerHTML='<h2>'+t[0]+'</h2><p>'+t[1]+'</p><div class="sim-layout"><div class="sim-controls"><label>'+t[2]+' <select data-fit>'+Object.keys(fits).map(f=>'<option '+(state.fit===f?'selected':'')+' value="'+f+'">H7/'+f+'</option>').join("")+'</select></label>'+controls.map(([key,i,min,max,step])=>'<label><span>'+t[i+1]+' <output dir="ltr">'+fmt(state[key])+'</output></span><input dir="ltr" type="range" data-key="'+key+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+state[key]+'"></label>').join("")+'<div class="sim-actions"><button data-try>'+t[15]+'</button><button data-reset>'+t[16]+'</button></div></div><div><div class="sim-views"><figure><figcaption>'+t[27]+'</figcaption><div class="mount" dir="ltr"></div></figure><figure><figcaption>'+t[28]+'</figcaption><div class="face" dir="ltr"></div></figure></div><div class="sim-results" aria-live="polite"></div><table class="sim-holes" aria-label="'+t[23]+'"><caption>⌖ · 2r (µm) / Δr (µm)</caption></table><p>'+t[32]+'</p><p>'+t[33]+'</p></div></div><p>'+t[34]+' <a target="_blank" rel="noopener" href="https://www.iso.org/standard/65559.html">ISO 5458</a></p><p class="sim-note">'+t[35]+' <a target="_blank" rel="noopener" href="https://www.iso.org/standard/54915.html">ISO 286-2</a></p>';
  const buttons = document.createElement("div");
  buttons.className = "sim-actions";
  buttons.innerHTML = scenarios[lang].map((name,i)=>'<button type="button" data-case="'+i+'">'+name+'</button>').join("");
  find(".sim-layout").before(buttons);
  update();
 }
 root.addEventListener("input",e=>{
  const {key}=e.target.dataset;
  if(key){state[key]=Number(e.target.value);e.target.previousElementSibling.querySelector("output").textContent=fmt(state[key]);}
  else if(e.target.matches("[data-fit]")) state.fit=e.target.value;
  else return;
  update();
 });
 root.addEventListener("click",e=>{
  if(e.target.matches("[data-case]")){
   const index=Number(e.target.dataset.case);
   state={...initial(),...presets[index]};tried=true;render(lang);
   find('[data-case="'+index+'"]').focus();
  }
  if(e.target.matches("[data-try]")){tried=true;update();}
  if(e.target.matches("[data-reset]")){state=initial();tried=false;render(lang);find("[data-reset]").focus();}
 });
 return render;
}
