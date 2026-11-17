const entries={
 de:[
 ["⊥","Rechtwinkligkeit","0,05 mm · Bezug B und C","Die markierte Fläche muss zwischen zwei parallelen Ebenen im Abstand 0,05 mm liegen. Diese Ebenen stehen senkrecht zum Bezugssystem B–C.","Prüft, ob die Fläche zur festgelegten Auflage und Seitenführung rechtwinklig liegt."],
 ["▱","Ebenheit","0,05 mm · ohne Bezug","Die gesamte Fläche muss zwischen zwei parallelen Ebenen im Abstand 0,05 mm liegen. Ein Bezug ist für Ebenheit nicht erforderlich.","Prüft die Form einer Fläche, unabhängig von ihrer Ausrichtung."],
 ["⌖","Position","⌀0,2 mm · Bezug B und C","Die Achse der Bohrung muss in einer zylindrischen Zone mit Durchmesser 0,2 mm um ihre theoretisch genaue Position liegen. B und C legen die Ausrichtung und Lage fest.","Prüft, ob Bohrungen an der richtigen Stelle sitzen."],
 ["∥","Parallelität","0,05 mm · Bezug B","Die tolerierte Fläche muss zwischen zwei parallelen Ebenen im Abstand 0,05 mm liegen, die parallel zu Bezug B ausgerichtet sind.","Prüft die Richtung der Fläche relativ zu B."],
 ["⌒","Profil einer Linie","0,05 mm","Der dargestellte Linienquerschnitt der Kontur muss innerhalb zweier gleichmäßig versetzter Begrenzungslinien liegen.","Prüft die Kontur im Schnitt A–A."],
 ["⌓","Profil einer Fläche","0,05 mm","Die ganze tolerierte Oberfläche muss innerhalb zweier Begrenzungsflächen liegen, die der Sollkontur folgen.","Prüft die räumliche Kontur der Fräsfläche."],
 ],
 en:[
 ["⊥","Perpendicularity","0.05 mm · datums B and C","The indicated face must lie between two parallel planes 0.05 mm apart, perpendicular to datum system B–C.","Checks whether the face is square to the locating surfaces."],
 ["▱","Flatness","0.05 mm · no datum","The entire surface must lie between two parallel planes 0.05 mm apart. Flatness does not need a datum.","Checks surface form independently of orientation."],
 ["⌖","Position","⌀0.2 mm · datums B and C","The hole axis must lie inside a cylindrical zone of diameter 0.2 mm at its theoretically exact position. B and C establish orientation and location.","Checks whether holes are in the specified locations."],
 ["∥","Parallelism","0.05 mm · datum B","The controlled surface must lie between two parallel planes 0.05 mm apart, oriented parallel to datum B.","Checks surface direction relative to B."],
 ["⌒","Line profile","0.05 mm","The shown contour section must lie between two equally offset boundary lines.","Checks the contour in section A–A."],
 ["⌓","Surface profile","0.05 mm","The entire controlled surface must lie between two boundaries that follow the nominal shape.","Checks the three-dimensional milled contour."],
 ],
 ar:[
 ["⊥","التعامد","0.05 مم · المرجعان B وC","يجب أن يقع السطح المحدد بين مستويين متوازيين تفصل بينهما مسافة 0.05 مم ومتعامدين على نظام المرجعين B–C.","يفحص تعامد السطح مع أسطح الإسناد."],
 ["▱","الاستواء","0.05 مم · دون مرجع","يجب أن يقع السطح كله بين مستويين متوازيين تفصل بينهما مسافة 0.05 مم. لا يحتاج الاستواء إلى مرجع.","يفحص شكل السطح دون ارتباط باتجاهه."],
 ["⌖","الموضع","⌀0.2 مم · المرجعان B وC","يجب أن يقع محور الثقب داخل منطقة أسطوانية قطرها 0.2 مم حول موضعه النظري الدقيق. يحدّد المرجعان B وC الاتجاه والموقع.","يفحص وجود الثقوب في مواضعها المحددة."],
 ["∥","التوازي","0.05 مم · المرجع B","يجب أن يقع السطح بين مستويين متوازيين تفصل بينهما 0.05 مم، وموازيين للمرجع B.","يفحص اتجاه السطح بالنسبة إلى B."],
 ["⌒","تفاوت منحنى الخط","0.05 مم","يجب أن يقع المقطع الموضح للمحيط بين خطي حد متباعدين بالتساوي.","يفحص المحيط في المقطع A–A."],
 ["⌓","تفاوت شكل السطح","0.05 مم","يجب أن يقع السطح المحدد كله بين حدّين يتبعان الشكل الاسمي.","يفحص الشكل الفراغي لسطح التفريز."],
 ]
};
const headers={de:["Zeichnung lesen","G2A · Frästeil","Symbol wählen","Zeichnungsdetail, schematisch","Bezugssystem","B richtet das Werkstück aus. C legt die seitliche Lage fest. A ist die Auflagefläche.","Maße in mm. Abmaße sind Grenzabweichungen. Eckige Maße sind Bezugsmaße."],en:["Read the drawing","G2A · milled part","Choose a symbol","Original technical drawing G2A, part 01","Datum system","B orients the part. C locates it sideways. A is the seating face.","Dimensions in mm. Limit deviations are shown. Bracketed dimensions are reference dimensions."],ar:["قراءة الرسم","G2A · قطعة مفرزة","اختر رمزًا","الرسم الفني الأصلي G2A، الجزء 01","نظام المراجع","يحدد B اتجاه القطعة. يحدد C موضعها الجانبي. أما A فهو سطح الإسناد.","الأبعاد بالملليمتر. الأبعاد بين أقواس مربعة مرجعية."]};
export function renderDrawingLesson(root,lang){
 const t=headers[lang]||headers.de, rows=entries[lang]||entries.de;
 root.innerHTML='<h2>'+t[0]+'</h2><p>'+t[1]+' · '+t[2]+'</p><div class="drawing-lesson"><figure><img src="./g2a-drawing.svg" alt="'+t[3]+'" style="display:block;width:100%;height:auto;border:1px solid var(--line);border-radius:.4rem;background:#fff"/> <figcaption>'+t[3]+'</figcaption><p>'+t[5]+'</p><p>'+t[6]+'</p></figure><section><h3>'+t[2]+'</h3>'+rows.map((r,i)=>'<button type="button" data-drawing-symbol="'+i+'" aria-pressed="'+(i===0)+'"><bdi>'+r[0]+'</bdi> '+r[1]+' · <bdi>'+r[2]+'</bdi></button>').join("")+'<article data-drawing-explanation aria-live="polite"><h3><bdi>'+rows[0][0]+'</bdi> '+rows[0][1]+'</h3><p>'+rows[0][3]+'</p><p>'+rows[0][4]+'</p></article></section></div><p>G2A · Teil 01 · EN AW 5083 · <a href="https://www.iso.org/standard/66777.html" target="_blank" rel="noopener">ISO 1101</a></p>';
 root.onclick=event=>{const b=event.target.closest("[data-drawing-symbol]");if(!b)return;const row=rows[Number(b.dataset.drawingSymbol)];root.querySelectorAll("[data-drawing-symbol]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));root.querySelector("[data-drawing-explanation]").innerHTML='<h3><bdi>'+row[0]+'</bdi> '+row[1]+'</h3><p>'+row[3]+'</p><p>'+row[4]+'</p>';};
}
