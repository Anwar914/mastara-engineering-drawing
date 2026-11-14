// Selected ISO 286-2 rows: IT6–IT8, g upper deviation and p lower deviation.
const sizeBands = [
 [3,6,10,14,-2,6],[6,8,12,18,-4,12],[10,9,15,22,-5,15],
 [18,11,18,27,-6,18],[30,13,21,33,-7,22],[50,16,25,39,-9,26],
 [80,19,30,46,-10,32],[120,22,35,54,-12,37],
];
const kLower = [0,1,1,1,2,2,2,3];
const holeClasses = ["H6","H7","H8","G7","JS7"];
const shaftClasses = ["h6","h7","h8","g6","g7","js6","k6","p6"];
const parse = value => /^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(value.trim()) ? Number(value.replace(",",".")) : NaN;
function deviations(code, band) {
 const width = band[Number(code.at(-1))-5];
 if (/^JS/i.test(code)) return [-width/2,width/2];
 switch (code[0]) {
  case "H": return [0,width];
  case "G": return [-band[4],-band[4]+width];
  case "h": return [-width,0];
  case "g": return [band[4]-width,band[4]];
  case "k": {
   const lower=kLower[sizeBands.indexOf(band)];
   return [lower,lower+width];
  }
  case "p": return [band[5],band[5]+width];
 }
}
export function clearanceBounds(hole, shaft) {
 return [hole[0]-shaft[1],hole[1]-shaft[0]].map(value=>Math.round(value*1000)/1000);
}

const copy = {
 de:["Passungsrechner","Nennmaß (mm)","Passungssystem","Einheitsbohrung","Einheitswelle","Freie Klassenwahl","Eigene Abmaße","Welle / Bohrung","Welle / Nabe","Gegenstücke","Bohrung","Nabenbohrung","Welle","Kleinstmaß","Größtmaß","Unteres / oberes Abmaß","Spielpassung","Übergangspassung","Übermaßpassung","Diametrales Grenzspiel (Bohrung − Welle)","Istmaß im Toleranzfeld","Radialspalt überhöht · ideal zentrisch","Spiel","Übermaß","Berührung","Für ISO-Felder ein Nennmaß über 0 bis einschließlich 120 mm eingeben. Bei eigenen Abmaßen müssen die Grenzmaße positiv sein und das untere Abmaß darf das obere nicht überschreiten. Bis zu drei Nachkommastellen in µm.","Nulllinie","Maßgrenzen (mm)","Montage-Simulation mit Formabweichung und Lochgruppe","Ausgewählte Toleranzfelder nach","Unteres Abmaß (µm)","Oberes Abmaß (µm)"],
 en:["Fit calculator","Nominal size (mm)","Fit system","Basic hole","Basic shaft","Free class selection","Custom deviations","Shaft / bore","Shaft / hub","Mating parts","Bore","Hub bore","Shaft","Minimum size","Maximum size","Lower / upper deviation","Clearance fit","Transition fit","Interference fit","Diametral clearance limits (bore − shaft)","Actual size in tolerance zone","Exaggerated radial gap · ideal concentric parts","Clearance","Interference","Contact","For ISO zones enter a nominal size above 0 and up to 120 mm. Custom limits must be positive and lower deviations must not exceed upper deviations. Up to three decimal places in µm.","Zero line","Size limits (mm)","Assembly simulation with form error and hole pattern","Selected tolerance zones from","Lower deviation (µm)","Upper deviation (µm)"],
 ar:["حاسبة التوافقات","المقاس الاسمي (مم)","نظام التوافق","أساس الثقب","أساس العمود","اختيار الفئات بحرية","انحرافات مخصصة","عمود / ثقب","عمود / صرّة","القطع المتزاوجة","الثقب","ثقب الصرّة","العمود","أصغر مقاس","أكبر مقاس","الانحراف السفلي / العلوي","توافق خلوصي","توافق انتقالي","توافق تداخلي","حدود الخلوص القطري (الثقب − العمود)","المقاس الفعلي داخل مجال التفاوت","الخلوص الشعاعي مكبّر · تمركز مثالي","خلوص","تداخل","تماس","لمجالات ISO أدخل مقاسًا أكبر من صفر وحتى 120 مم. للانحرافات المخصصة يجب أن تكون حدود المقاس موجبة وألا يتجاوز الانحراف السفلي العلوي. حتى ثلاث منازل عشرية بالميكرومتر.","خط الصفر","حدود المقاس (مم)","محاكاة التركيب مع انحراف الشكل ونمط الثقوب","مجالات تفاوت مختارة من","الانحراف السفلي (µm)","الانحراف العلوي (µm)"],
};

export function setupFitCalculator(root) {
 const state = {size:"30",system:"0",part:"0",hole:"H7",shaft:"g6",h0:"0",h1:"21",s0:"-20",s1:"-7",hp:"50",sp:"50"};
 let t,format;
 const number=(value)=>format.format(value);
 const signed=(value)=>(value>0?"+":"")+number(value);
 const choose=(key,label,options)=>'<label>'+label+'<select data-fit="'+key+'">'+options.map(([value,name])=>'<option value="'+value+'"'+(state[key]===value?' selected':'')+'>'+name+'</option>').join("")+'</select></label>';
 const field=(key,label)=>'<label>'+label+'<input dir="ltr" inputmode="decimal" data-fit="'+key+'" value="'+state[key].replace(/[^0-9.,+ -]/g,"")+'"></label>';
 const options=items=>items.map((value,i)=>[String(i),value]);
 const names=()=>[t[state.part==="1"?11:10],t[12]];
 function controls() {
  const [h,s]=names();
  root.querySelector("[data-fit-fields]").innerHTML=state.system==="3"?
   ["h","s"].map((key,i)=>[30,31].map((j,k)=>field(key+k,[h,s][i]+" · "+t[j])).join("")).join(""):
   choose("hole",h,(state.system==="0"?holeClasses.filter(c=>c.startsWith("H")):holeClasses).map(c=>[c,c]))+
   choose("shaft",s,(state.system==="1"?shaftClasses.filter(c=>c.startsWith("h")):shaftClasses).map(c=>[c,c]));
 }
 function update() {
  const out=root.querySelector("[data-fit-output]");
  const d=parse(state.size);
  const band=sizeBands.find(row=>d<=row[0]);
  const manual=state.system==="3";
  const hole=manual?[parse(state.h0),parse(state.h1)]:band&&deviations(state.hole,band);
  const shaft=manual?[parse(state.s0),parse(state.s1)]:band&&deviations(state.shaft,band);
  if(!(d>0&&d<=1e6&&hole&&shaft&&[hole,shaft].every(f=>f.every(v=>Number.isFinite(v)&&Math.abs(v)<=1e6&&Math.abs(v*1000-Math.round(v*1000))<1e-6)&&f[0]<=f[1]&&d+f[0]/1000>0))){
   out.innerHTML='<p>'+t[25]+'</p>';return;
  }
  const [min,max]=clearanceBounds(hole,shaft);
  const gaps=[hole,shaft].map(([lo,hi],i)=>lo+(hi-lo)*Number(state[i?"sp":"hp"])/100);
  const gap=Math.round((gaps[0]-gaps[1])*100000)/100000;
  const left=Math.min(0,hole[0],shaft[0]),right=Math.max(0,hole[1],shaft[1]);
  const scale=v=>35+(v-left+1)*290/(right-left+2);
  const chart=[hole,shaft].map(([lo,hi],i)=>'<line x1="'+scale(lo)+'" x2="'+scale(hi)+'" y1="'+(36+i*42)+'" y2="'+(36+i*42)+'" stroke="'+(i?"#5541b8":"#006e73")+'" stroke-width="12" stroke-linecap="round"/><circle cx="'+scale(gaps[i])+'" cy="'+(36+i*42)+'" r="5" fill="white" stroke="#27263f"/>').join("");
  const radius=23-Math.max(-10,Math.min(10,gap*0.9));
  const rows=[hole,shaft].map(([lo,hi],i)=>'<tr><th scope="row">'+names()[i]+(manual?"":" <bdi>"+(i?state.shaft:state.hole)+"</bdi>")+'</th><td><bdi>'+number(d+lo/1000)+'</bdi></td><td><bdi>'+number(d+hi/1000)+'</bdi></td><td><bdi>'+signed(lo)+' / '+signed(hi)+' µm</bdi></td></tr>').join("");
  const type=t[min>=0?16:max<=0?18:17];
  out.innerHTML='<h3>'+type+'</h3><p>'+t[19]+' <strong><bdi>'+signed(min)+' … '+signed(max)+' µm</bdi></strong></p>'+
   '<div style="overflow:auto"><table><caption>'+t[27]+'</caption><thead><tr>'+[9,13,14,15].map(i=>'<th scope="col">'+t[i]+'</th>').join("")+'</tr></thead><tbody>'+rows+'</tbody></table></div>'+
   '<div class="fit-grid"><figure><svg viewBox="0 0 360 104" role="img" aria-label="'+t[26]+'" direction="ltr"><line x1="'+scale(0)+'" x2="'+scale(0)+'" y1="8" y2="96" stroke="#27263f" stroke-dasharray="4 3"/>'+chart+'</svg><figcaption>'+t[26]+' · <span style="color:#006e73">'+names()[0]+'</span> · <span style="color:#5541b8">'+names()[1]+'</span></figcaption></figure>'+
   '<figure><svg viewBox="0 0 360 104" role="img" aria-label="'+t[21]+'"><path d="M150 11 H210 V29 H194 V25 H166 V29 H150 Z M150 75 H166 V79 H194 V75 H210 V93 H150 Z" fill="#b4e0df" stroke="#006e73"/><rect x="110" y="'+(52-radius)+'" width="140" height="'+radius*2+'" fill="#6752d1" fill-opacity=".7" stroke="'+(gap<0?"#a11c19":"#5541b8")+'"/><path d="M90 52 H270" stroke="#27263f" stroke-dasharray="8 4 2 4"/></svg><figcaption>'+t[21]+'<br><strong>'+t[gap>0?22:gap<0?23:24]+' <bdi>'+number(Math.abs(gap))+' µm</bdi></strong></figcaption></figure></div>';
 }
 function sliders() {
  root.querySelector("[data-fit-sliders]").innerHTML=names().map((name,i)=>{
   const key=i?"sp":"hp";
   return '<label>'+name+' · '+t[20]+' (%)<input type="range" data-fit="'+key+'" min="0" max="100" value="'+state[key]+'"><output data-fit-percent="'+key+'">'+state[key]+'%</output></label>';
  }).join("");
 }
 root.addEventListener("input",event=>{
  const key=event.target.dataset.fit;
  if(!key)return;
  state[key]=event.target.value;
  if(key==="system"){
   if(state.system==="0"&&!state.hole.startsWith("H"))state.hole="H7";
   if(state.system==="1"&&!state.shaft.startsWith("h"))state.shaft="h6";
  }
  if(key==="system"||key==="part")controls();
  if(key==="part")sliders();
  const percentage=root.querySelector('[data-fit-percent="'+key+'"]');
  if(percentage)percentage.textContent=state[key]+"%";
  update();
 });
 return lang=>{
  t=copy[lang];
  format=new Intl.NumberFormat(lang,{maximumFractionDigits:6});
  root.innerHTML='<style>#fit-calculator{padding:clamp(1rem,3vw,2rem);margin-block:1.5rem;background:var(--surface,#fff);border:1px solid var(--line);border-radius:.8rem}#fit-calculator .fit-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr));gap:.8rem;margin-block:.8rem}#fit-calculator label{display:grid;gap:.3rem}#fit-calculator input:not([type=range]),#fit-calculator select{width:100%;min-height:44px;padding:.4rem;background:var(--surface,#fff);color:var(--ink);border:1px solid var(--control-line);border-radius:.35rem}#fit-calculator input[type=range]{accent-color:var(--action)}#fit-calculator figure{margin:0;padding:.75rem;background:var(--soft);border-radius:.4rem}#fit-calculator table{width:100%;border-collapse:collapse}#fit-calculator td,#fit-calculator th{padding:.55rem;text-align:start;border-bottom:1px solid var(--line)}</style><h2>'+t[0]+'</h2>'+
   '<div class="fit-grid">'+field("size",t[1])+choose("part",t[9],options([t[7],t[8]]))+choose("system",t[2],options(t.slice(3,7)))+'</div><div class="fit-grid" data-fit-fields></div><div class="fit-grid" data-fit-sliders></div><div data-fit-output aria-live="polite"></div><p>'+t[29]+' <a href="https://www.iso.org/standard/54915.html">ISO 286-2</a> · 0 &lt; D ≤ 120 mm</p><a href="#assembly">'+t[28]+'</a>';
  controls();sliders();update();
 };
}
