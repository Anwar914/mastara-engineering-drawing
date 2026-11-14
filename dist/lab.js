import { shaftSheet } from "./shaft-sheet.js";
const copy = {
 de: ["Prüflabor · Welle mit Sicherungsringnut","Ändere die Vorgabe auf der Zeichnung und die gemessene Abweichung unabhängig voneinander.","Prüfmerkmal","Geradheit","Radialer Rundlauf","Durchmesser","Toleranz t (mm)","Gemessene Abweichung (mm)","Unteres Abmaß (mm)","Oberes Abmaß (mm)","Gemessener Durchmesser (mm)","Innerhalb der Vorgabe","Außerhalb der Vorgabe","Prüfung ungültig","Die Abweichung ist kleiner als oder gleich der Toleranz.","Die Abweichung überschreitet die Toleranz. Eine größere Toleranz ändert die Vorgabe, nicht das Bauteil.","Für Rundlauf muss die Welle um die Bezugsachse A drehen. Eine falsche Aufspannung kann einen falschen Messwert liefern.","Aufspannung auf Bezugsachse A","Kleine Abweichung","Grenzfall","Zu große Abweichung","Messwert","Zulässiger Bereich","Das Istmaß liegt zwischen den Grenzmaßen.","Das Istmaß liegt außerhalb der Grenzmaße. Größe und geometrische Abweichung werden getrennt geprüft.","Gib gültige Zahlen ein. Die untere Grenze darf nicht größer als die obere sein.","Beim Rundlauf ist die Abweichung die Differenz zwischen größter und kleinster Messuhranzeige an einer festen axialen Stelle.","Bei der Geradheit entspricht der Messwert der Breite der engsten Zone aus zwei parallelen Geraden, die das Linienprofil einschließt."],
 en: ["Inspection lab · Grooved shaft","Change the drawing requirement and the measured deviation independently.","Characteristic","Straightness","Radial runout","Diameter","Tolerance t (mm)","Measured deviation (mm)","Lower deviation (mm)","Upper deviation (mm)","Measured diameter (mm)","Within requirement","Outside requirement","Invalid inspection","The deviation is less than or equal to the tolerance.","The deviation exceeds the tolerance. Increasing the tolerance changes the requirement, not the part.","For runout, rotate about datum axis A. Incorrect setup can produce a misleading reading.","Setup aligned to datum axis A","Small deviation","At the limit","Excess deviation","Measurement","Permitted interval","The measured diameter is within the size limits.","The measured diameter is outside the size limits. Size and geometrical deviation are checked separately.","Enter valid numbers with the lower limit no greater than the upper limit.","For runout, use the maximum minus the minimum indicator reading at one fixed axial location.","For straightness, use the width of the narrowest zone between two parallel lines enclosing the profile."],
 ar: ["مختبر القياس · عمود بمجرى حلقة تثبيت","غيّر قيمة التفاوت على الرسم والقياس الفعلي بصورة مستقلة.","الخاصية","الاستقامة","الخفقان الشعاعي","القطر","التفاوت t (مم)","الانحراف المقاس (مم)","الانحراف الأدنى (مم)","الانحراف الأعلى (مم)","القطر المقاس (مم)","ضمن الحد المسموح","خارج الحد المسموح","التحقق غير صالح","الانحراف أصغر من التفاوت أو يساويه.","الانحراف يتجاوز التفاوت. زيادة التفاوت تغيّر المتطلب ولا تغيّر القطعة.","يتطلب فحص الخفقان التدوير حول محور المرجع A. التثبيت الخاطئ قد يؤدي إلى قراءة مضللة.","التثبيت على محور المرجع A","انحراف صغير","على الحد","انحراف زائد","القياس","المجال المسموح","القطر المقاس داخل حدود المقاس.","القطر خارج حدود المقاس. يُفحص المقاس والانحراف الهندسي كلّ على حدة.","أدخل أرقاماً صالحة بحيث لا يتجاوز الحد الأدنى الحد الأعلى.","في فحص الخفقان استخدم الفرق بين أعلى وأدنى قراءة للمؤشر عند موضع محوري ثابت.","في فحص الاستقامة استخدم عرض أضيق منطقة بين مستقيمين متوازيين تحيط بالمنحنى."],
};
const inputs = { tolerance:"0.040", measured:"0.025", low:"-0.020", high:"0.000", size:"27.990" };
let mode = 0, datum = true;
const parse = (s) => {
 const value = s.trim().replace(/[٠-٩۰-۹]/g,c=>String(c.charCodeAt(0)%16)).replace(/[٫,]/g,".").replace(/−/g,"-");
 return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value) ? Number(value) : NaN;
};
const quantize = (value) => Math.round(value * 1e6) / 1e6;

export function setupLab(root) {
 let lang = "de";
 function update() {
  const t = copy[lang];
  const dimension = mode === 2;
  const lower = dimension ? quantize(28 + parse(inputs.low)) : 0;
  const upper = dimension ? quantize(28 + parse(inputs.high)) : parse(inputs.tolerance);
  const measured = parse(dimension ? inputs.size : inputs.measured);
  const numeric = [lower,upper,measured].every(Number.isFinite) && lower <= upper && (dimension ? lower > 0 && measured > 0 : measured >= 0);
  const valid = numeric && (mode !== 1 || datum);
  const pass = measured >= lower && measured <= upper;
  root.querySelector(".lab-callout").textContent = dimension ? "⌀28 "+inputs.high+" / "+inputs.low : (mode===0?"—":"↗")+"  |  "+inputs.tolerance+(mode===1?"  |  A":"");
  const out = root.querySelector(".lab-result");
  out.dataset.status = valid ? pass ? "pass" : "fail" : "invalid";
  out.querySelector("strong").textContent = t[valid ? pass ? 11 : 12 : 13];
  out.querySelector("p").textContent = t[!numeric ? 25 : !valid ? 16 : dimension ? pass ? 23 : 24 : pass ? 14 : 15];
  const fmt = new Intl.NumberFormat(lang,{minimumFractionDigits:3,maximumFractionDigits:6,useGrouping:false});
  const svg = root.querySelector(".lab-chart");
  svg.hidden = !valid;
  svg.style.display = valid ? "" : "none";
  if (!valid) return;
  const min = Math.min(lower, measured);
  const max = Math.max(upper, measured);
  const pad = Math.max((max-min)*0.15, 0.005);
  const x = (value) => 24 + (value-min+pad)/(max-min+2*pad)*332;
  svg.innerHTML = '<line x1="24" x2="356" y1="51" y2="51" stroke="#78909c"/><rect x="'+x(lower)+'" y="39" width="'+Math.max(1,x(upper)-x(lower))+'" height="24" rx="3" fill="#a8d9d6"/><line x1="'+x(measured)+'" x2="'+x(measured)+'" y1="28" y2="71" stroke="'+(pass?'#00636a':'#b33337')+'" stroke-width="3"/><text x="190" y="20" text-anchor="middle">'+fmt.format(measured)+' mm</text><text x="190" y="89" text-anchor="middle">'+fmt.format(lower)+' – '+fmt.format(upper)+' mm</text>';
  svg.setAttribute("aria-label",t[21]+" "+fmt.format(measured)+" mm. "+t[22]+" "+fmt.format(lower)+" – "+fmt.format(upper)+" mm.");
 }
 function render(nextLang) {
  lang = nextLang;
  const t=copy[lang];
  const fields=mode===2?[["low",8],["high",9],["size",10]]:[["tolerance",6],["measured",7]];
  root.innerHTML = '<h2>'+t[0]+'</h2><p>'+t[1]+'</p><div class="lab-grid"><div><label>'+t[2]+'<select class="lab-mode">'+[3,4,5].map((n,i)=>'<option value="'+i+'" '+(mode===i?'selected':'')+'>'+t[n]+'</option>').join("")+'</select></label>'+fields.map(([key,n])=>'<label>'+t[n]+'<input dir="ltr" inputmode="decimal" data-input="'+key+'"></label>').join("")+(mode===1?'<label class="lab-check"><input type="checkbox" '+(datum?'checked':'')+'>'+t[17]+'</label>':'')+'<div class="lab-presets">'+[18,19,20].map((n,i)=>'<button data-preset="'+i+'">'+t[n]+'</button>').join("")+'</div></div><div>'+shaftSheet(lang,mode)+'<div class="lab-callout" dir="ltr"></div><div class="lab-result" role="status"><strong></strong><p></p></div><svg class="lab-chart" dir="ltr" viewBox="0 0 380 98" role="img"></svg>'+(mode<2?'<p class="lab-hint">'+t[mode===0?27:26]+'</p>':'')+'</div></div>';
  for (const [key] of fields) root.querySelector('[data-input="'+key+'"]').value=inputs[key];
  update();
 }
 root.addEventListener("input",(event)=>{
  const {target}=event;
  if (target.dataset.input) inputs[target.dataset.input]=target.value;
  else if (target.type==="checkbox") datum=target.checked;
  else return;
  update();
 });
 root.addEventListener("change",(event)=>{
  if (!event.target.matches(".lab-mode")) return;
  mode=Number(event.target.value);
  render(lang);
  root.querySelector(".lab-mode").focus();
 });
 root.addEventListener("click",(event)=>{
  const preset=event.target.closest("[data-preset]");
  if (!preset) return;
  const n=Number(preset.dataset.preset);
  const upper=mode===2?quantize(28+parse(inputs.high)):parse(inputs.tolerance);
  const lower=mode===2?quantize(28+parse(inputs.low)):0;
  if (!Number.isFinite(upper) || !Number.isFinite(lower) || lower>upper) return;
  const key=mode===2?"size":"measured";
  inputs[key]=String(quantize(n===0?(upper+lower)/2:n===1?upper:upper+0.02));
  root.querySelector('[data-input="'+key+'"]').value=inputs[key];
  update();
 });
 return render;
}
