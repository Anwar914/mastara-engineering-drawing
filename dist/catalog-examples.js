const zoneKeys={
 ar:["حدود منطقة التفاوت","العنصر أو الأثر المُمثَّل"],
 de:["Grenzen der Toleranzzone","Dargestelltes Element oder Messprofil"],
 en:["Tolerance zone boundaries","Illustrated feature or trace"],
};
function zoneLegend(lang){
 return '<span class="zone-key"><span>'+zoneKeys[lang][0]+'</span><span>'+zoneKeys[lang][1]+'</span></span>';
}
const examples = [
  [
    "0.03",
    "",
    "0.021",
    "0.044",
    "Mantellinie einer Welle längs abtasten.",
    "Scan a line along a shaft.",
    "امسح خطاً طولياً على سطح العمود."
  ],
  [
    "0.05",
    "",
    "0.032",
    "0.071",
    "Auflagefläche eines Flanschs über die gesamte Fläche prüfen.",
    "Inspect the entire flange seating face.",
    "افحص سطح ارتكاز الفلنجة كاملاً."
  ],
  [
    "0.02",
    "",
    "0.012",
    "0.028",
    "Einen Querschnitt am Lagersitz auswerten.",
    "Evaluate one section of the bearing journal.",
    "افحص مقطعاً واحداً من مقعد المحمل."
  ],
  [
    "0.04",
    "",
    "0.033",
    "0.052",
    "Den ganzen zylindrischen Außensitz auswerten.",
    "Evaluate the entire cylindrical outer seat.",
    "افحص السطح الأسطواني الخارجي كاملاً."
  ],
  [
    "0.10",
    "",
    "0.075",
    "0.123",
    "Den Übergangsradius im Längsschnitt mit der Sollkontur vergleichen.",
    "Compare the shoulder blend in a longitudinal section with the nominal contour.",
    "قارن منحنى الانتقال في المقطع الطولي بالمنحنى النظري."
  ],
  [
    "0.20",
    "",
    "0.160",
    "0.240",
    "Die gewölbte Fläche eines Gehäusedeckels auswerten.",
    "Evaluate the curved face of a housing cover.",
    "افحص السطح المنحني لغطاء المبيت."
  ],
  [
    "0.04",
    "A",
    "0.027",
    "0.058",
    "Die Oberseite einer Distanzplatte parallel zur Auflagefläche A prüfen.",
    "Check a spacer plate’s top face relative to seating face A.",
    "افحص توازي السطح العلوي لصفيحة مباعدة مع سطح الارتكاز A."
  ],
  [
    "⌀0.08",
    "A",
    "0.060",
    "0.092",
    "Die Achse der Bolzenbohrung zur Stirnfläche A prüfen.",
    "Check the pin bore axis relative to end face A.",
    "افحص محور ثقب المسمار بالنسبة إلى الوجه المرجعي A."
  ],
  [
    "0.06",
    "A",
    "0.041",
    "0.074",
    "Eine 30°-Schrägfläche zur Grundfläche A prüfen.",
    "Check a 30° inclined face relative to base A.",
    "افحص سطحاً مائلاً بزاوية 30° بالنسبة إلى القاعدة A."
  ],
  [
    "⌀0.20",
    "A|B|C",
    "0.160",
    "0.240",
    "Eine Flanschbohrung liegt im Messschnitt 0,080 mm radial neben ihrer Sollposition. Diametral sind das 0,160 mm.",
    "In the measured section a flange hole is offset radially by 0.080 mm. The diametrical error is 0.160 mm.",
    "في مقطع القياس ينزاح ثقب الفلنجة شعاعياً بمقدار 0.080 مم، أي انحراف قطري قدره 0.160 مم."
  ],
  [
    "⌀0.05",
    "A",
    "0.038",
    "0.064",
    "Die Mittellinie des zweiten Wellensitzes zur Bezugsachse A prüfen. Im Querschnitt lassen sich die Mittelpunkte vergleichen.",
    "Check the second shaft journal’s median line relative to datum axis A. The centers can be compared in a cross-section.",
    "افحص الخط الوسطي للمقعد الثاني بالنسبة إلى محور المرجع A. يمكن مقارنة المركزين في المقطع."
  ],
  [
    "0.08",
    "A",
    "0.050",
    "0.110",
    "Die abgeleitete Mittelfläche einer Gabelnut zur Mittelebene A prüfen.",
    "Check the extracted median surface of a clevis slot relative to datum plane A.",
    "افحص السطح الوسطي المستخرج لمجرى الشوكة بالنسبة إلى المستوى المرجعي A."
  ],
  [
    "0.03",
    "A",
    "0.023",
    "0.037",
    "Bei einer Umdrehung an einer festen axialen Stelle radial messen. Beispiel: 0,028 − 0,005 = 0,023 mm. Beim Planlauf axial auf einem festen Messkreis messen.",
    "Probe radially at one axial station over a revolution. Example: 0.028 − 0.005 = 0.023 mm. For axial runout, probe one fixed circle.",
    "قِس شعاعياً عند موضع محوري ثابت خلال دورة. مثال: 0.028 − 0.005 = 0.023 مم. للخفقان المحوري قِس على دائرة ثابتة."
  ],
  [
    "0.06",
    "A",
    "0.048",
    "0.078",
    "Bei Drehung die Messuhr längs über den Mantel führen. Beim Gesamtplanlauf die Stirnfläche über alle Radien abfahren.",
    "Sweep the journal axially while it rotates. For total axial runout, sweep the face across all radii.",
    "أدر القطعة وحرّك المؤشر طولياً على السطح الأسطواني. للخفقان المحوري الكلي امسح الوجه عبر جميع أنصاف الأقطار."
  ]
];
const labels={de:["Beispiel aus der Werkstatt","Toleranzrahmen","Innerhalb","Außerhalb","Schematische Toleranzzone"],en:["Workshop example","Tolerance frame","Within","Outside","Schematic tolerance zone"],ar:["مثال من الورشة","إطار التفاوت","ضمن الحد","خارج الحد","مخطط منطقة التفاوت"]};
const boundaries=[
 "M27 35H185M27 65H185","M36 36h120l28-18H64zM36 65h120l28-18H64z",
 null,null,"M24 60Q105-23 186 60M24 77Q105-6 186 77","M26 53Q105-14 184 53L172 66Q105 2 38 66ZM26 73Q105 6 184 73",
 "M25 28H185M25 53H185M25 81H185","M25 81H185M88 25v50m35-50v50","M25 83H185M42 66l105-59M52 81l105-59",null,null,
 "M25 24H185M25 45H185M25 68H185",null,null
];
function zone(index,caption){
 let shape;
 if([2,9,10,12].includes(index)){
  shape='<circle cx="105" cy="46" r="32"/>'+([2,12].includes(index)?'<circle cx="105" cy="46" r="21"/>':'<path d="M65 46h80m-40-40v80" stroke-dasharray="4 3"/>')+
   ([2,12].includes(index)?'<path d="M105 19c18 0 29 15 27 29-2 16-13 25-27 25-15 0-27-13-27-27s12-27 27-27z" stroke="#b84200"/>':'<circle cx="118" cy="38" r="3" fill="#b84200"/>');
 }else if([3,13].includes(index)){
  shape='<ellipse cx="55" cy="47" rx="14" ry="32"/><ellipse cx="55" cy="47" rx="9" ry="23"/><path d="M55 15h100m-100 64h100m-100-55h100m-100 46h100"/><path d="M155 15a14 32 0 0 1 0 64M155 24a9 23 0 0 1 0 46" stroke="#b84200"/>';
 }else{
  const trace={0:"M30 50q25-12 50 0t55 1 48-2",1:"M47 52h104l17-10H64z",4:"M24 69Q103-16 186 68",5:"M35 60Q104-4 176 58",6:"M26 42q39-8 79-1t79 0",7:"M103 25l5 50",8:"M49 73l103-59",11:"M25 51q41-8 80-1t80 0"}[index];
  shape='<path d="'+boundaries[index]+'"/><path d="'+trace+'" stroke="#b84200"/>';
 }
 return '<svg viewBox="0 0 210 92" role="img" aria-label="'+caption+'"><g fill="none" stroke="#155ba0" stroke-width="2.4">'+shape+'</g></svg>';
}

// Teaching sketches: orange identifies the controlled feature, blue the datum feature.
const partViews = [["M35 110h34V91h115v19h36v42h-36v19H69v-19H35Z","M84 91h84",126,91],["M38 106l47-27h137l-45 27zm0 0v31h139l45-27V79m-45 27v31","M38 106l47-27h137l-45 27Z",136,92],["M151 130m-41 0a41 41 0 1 0 82 0 41 41 0 1 0-82 0Z","M151 89a41 41 0 0 1 41 41",177,98],["M76 105h108a17 27 0 0 1 0 54H76m0-54a17 27 0 1 0 0 54 17 27 0 1 0 0-54","M84 105h100m-100 54h100",150,105],["M41 149h61q23 0 23-23V87h85v77H41Z","M102 149q23 0 23-23",121,141],["M42 152Q126 54 209 152l-23 15H64Z M64 167Q126 90 186 167","M42 152Q126 54 209 152",126,103],["M42 98h168v57H42Z","M42 98h168",126,98,"M42 155h168"],["M43 83h167v83H43Z M110 83v83m30-83v83","M110 83h30",126,83,"M43 166h167"],["M44 160v-26l95-55h70v81Z","M44 134l95-55",111,95,"M44 160h165"],["M28 81h218v94H28Z M86 124m-14 0a14 14 0 1 0 28 0 14 14 0 1 0-28 0 M189 124m-14 0a14 14 0 1 0 28 0 14 14 0 1 0-28 0","M189 110a14 14 0 1 1 0 28 14 14 0 1 1 0-28Z",183,111,"M28 175h218M28 81v94M246 81v94"],["M34 106h75V91h102v72H109v-15H34Z","M111 91h99m-99 72h99",152,91,"M34 106h75m-75 42h75"],["M39 94h58v36h44V94h58v70H39Z","M97 94v36h44V94",140,112,"M39 164h160"],["M35 106h73V90h101v74H108v-16H35Z","M157 90h15",165,90,"M35 106h73m-73 42h73"],["M35 106h73V90h101v74H108v-16H35Z","M109 90h100m-100 74h100",165,90,"M35 106h73m-73 42h73"]];
const viewLabels = {
 de: ["Bauteilzeichnung", "Toleriertes Element", "Bezugselement"],
 en: ["Part drawing", "Controlled feature", "Datum feature"],
 ar: ["رسم القطعة", "العنصر الخاضع للتفاوت", "عنصر إسناد المرجع"],
};
function partDrawing(index, symbol, value, datums, lang) {
 const [body, feature, x, y, reference] = partViews[index];
 const [caption, featureLabel, datumLabel] = viewLabels[lang];
 const letters = datums.split("|").filter(Boolean);
 const cells = [symbol, value, ...letters];
 const widths = [32, 60, 23, 23, 23];
 let cursor = 24;
 const frame = cells.map((cell, i) => {
  const width = widths[i];
  const drawing = '<rect x="'+cursor+'" y="14" width="'+width+'" height="25" fill="white" stroke="#27263f"/><text x="'+(cursor+width/2)+'" y="32" text-anchor="middle">'+cell+'</text>';
  cursor += width;
  return drawing;
 }).join("");
 return '<figure class="part-example"><svg viewBox="0 0 275 190" role="img" aria-label="'+caption+'" direction="ltr"><g fill="none" stroke-linejoin="round"><path d="'+body+'" stroke="#27263f" stroke-width="2"/>'+
 (reference?'<path d="'+reference+'" stroke="#155ba0" stroke-width="3" stroke-dasharray="7 3"/>':'')+
 '<path d="'+feature+'" stroke="#b84200" stroke-width="4"/><path d="M59 39V53H'+x+'L'+x+' '+y+'" stroke="#b84200"/><circle cx="'+x+'" cy="'+y+'" r="3" fill="#b84200"/></g>'+frame+'</svg><figcaption>'+caption+' · <span style="color:#903700">'+featureLabel+'</span>'+(reference?' · <span style="color:#064f98">'+datumLabel+'</span>':'')+'</figcaption></figure>';
}

export function renderCatalogExample(index,symbol,lang){
 const [value,datums,pass,fail,...contexts]=examples[index],t=labels[lang];
 const number=new Intl.NumberFormat(lang,{minimumFractionDigits:3,maximumFractionDigits:3});
 const cell=(text)=>'<span>'+text+'</span>';
 return '<div class="worked-example"><div><h4>'+t[0]+'</h4><p>'+contexts[{de:0,en:1,ar:2}[lang]]+'</p><div class="sample-frame" dir="ltr" aria-label="'+t[1]+'">'+[symbol,value,...datums.split("|").filter(Boolean)].map(cell).join("")+'</div><div class="example-values"><span class="example-pass">'+t[2]+' <bdi>'+number.format(Number(pass))+' mm</bdi></span><span class="example-fail">'+t[3]+' <bdi>'+number.format(Number(fail))+' mm</bdi></span></div></div><figure>'+zone(index,t[4])+'<figcaption>'+t[4]+zoneLegend(lang)+'</figcaption></figure></div>'+partDrawing(index,symbol,value,datums,lang);
}
