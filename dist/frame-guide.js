const copy = {
 ar:["قراءة إطار التفاوت","الرمز","القيمة","المرجع","يحدد الخاصية الهندسية التي يُفحص لها العنصر.","الحد المسموح بالملليمتر. الرمز ⌀ يعني أن القيمة قطر منطقة التفاوت.","تحدد عناصر الإسناد موضع منطقة التفاوت أو اتجاهها وفق ترتيب الحروف في الإطار.","هذا الإطار لا يستدعي مرجعًا. تُقيَّم الخاصية من هندسة العنصر نفسه."],
 de:["Toleranzrahmen lesen","Symbol","Wert","Bezug","Das Symbol bestimmt, welche geometrische Eigenschaft geprüft wird.","Der Grenzwert steht in Millimetern. ⌀ kennzeichnet den Durchmesser der Toleranzzone.","Die Bezüge richten die Zone aus oder legen ihre Lage fest. Ihre Reihenfolge im Rahmen bestimmt die Rangfolge.","Der Rahmen gibt keinen Bezug vor. Die Eigenschaft wird am Element selbst ausgewertet."],
 en:["Read the tolerance frame","Symbol","Value","Datum","The symbol identifies the geometric characteristic being checked.","The limit is in millimetres. ⌀ identifies the diameter of the tolerance zone.","Datums orient or locate the tolerance zone, in the order shown in the frame.","This frame specifies no datum. The characteristic is evaluated from the feature itself."],
};
export function frameGuide(lang, symbol, value, datum, title, active){
 const t=copy[lang];
 const entries=[[symbol,t[4]+" "+title],[value,t[5]],[datum,t[datum?6:7]]];
 return '<section class="frame-guide"><h3>'+t[0]+'</h3>'+entries.map(([code,body],i)=>
 '<details data-guide="'+i+'" '+(active===i?'open':'')+'><summary>'+t[i+1]+(code?' <bdi>'+code+'</bdi>':'')+'</summary><p>'+body+'</p></details>').join("")+'</section>';
}
