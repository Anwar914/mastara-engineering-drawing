const labels={
 ar:["رسم عمود مدرّج بمجرى حلقة تثبيت","المصدر: رسم هندسي تعليمي أصلي من إعداد مسطرة. ترميز التفاوتات وفق","المسقط الجانبي","A–A","الأبعاد بالملليمتر, غير مقياسي"],
 de:["Stufenwelle mit Sicherungsringnut","Quelle: eigenständig erstellte Lehrzeichnung von Masṭara. Toleranznotation nach","Seitenansicht","A–A","Maße in mm, schematisch"],
 en:["Stepped shaft with retaining-ring groove","Source: original teaching drawing by Masṭara. Tolerance notation follows","Side view","A–A","Dimensions in mm, schematic"],
};
export function shaftSheet(lang,mode){
 const t=labels[lang];
 return `<figure class="shaft-sheet"><svg viewBox="0 0 500 250" role="img" aria-label="${t[0]}" direction="ltr">
 <defs><marker id="shaft-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 1L9 5L0 9Z" fill="#526979"/></marker><pattern id="shaft-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v6" stroke="#869aa5"/></pattern></defs>
 <rect x="1" y="1" width="498" height="248" rx="5" fill="white" stroke="#a4b6bf"/>
 <g fill="none" stroke="#162e40" stroke-width="1.7"><path d="M32 103l5-5h71V77h109v21h45v5h8v-5h60l5 5v48l-5 5h-60v-5h-8v5h-45v21H108v-21H37l-5-5Z"/><path d="M108 98v58m109-58v58m45-53v48m8-48v48"/><circle cx="412" cy="127" r="29" fill="url(#shaft-hatch)"/><path d="M17 127h341m16 0h76m-38-41v82" stroke="#526979" stroke-dasharray="10 4 2 4"/>
 <path d="M32 95V43m303 54V43m-227 31V59m109 15V59M24 98H37m-13 58h13" stroke="#526979" stroke-width="1"/>
 <path d="M32 48h303M108 64h109M25 98v58" stroke="#526979" stroke-width="1" marker-start="url(#shaft-arrow)" marker-end="url(#shaft-arrow)"/>
 <path d="M298 159v40h-28m-8-43v61m8-61v61m-8-6h8" stroke="#526979"/><path d="M65 156v33h27"/><path d="M61 161l4-5 4 5Z" fill="#155ba0"/><rect x="92" y="180" width="19" height="18"/>
 <path d="M291 90v74" stroke="#526979" stroke-dasharray="5 3"/><path d="M20 227H478"/></g>
 <path d="${["M111 77H214","M274 98H330","M37 98H105M37 156H105"][mode]}" stroke="#bf4600" stroke-width="3.5"/>
 ${mode===1?'<path d="M38 98H105M38 156H105" stroke="#155ba0" stroke-width="3"/>':""}
 <g font-size="11"><text x="179" y="43">100</text><text x="156" y="59">36</text><text x="15" y="136" transform="rotate(-90 15 136)">⌀28</text><text x="278" y="213">1.6</text><text x="99" y="193">A</text><text x="296" y="91">A</text><text x="296" y="171">A</text><text x="399" y="188">${t[3]}</text><text x="160" y="193" text-anchor="middle">${t[2]}</text><text x="30" y="242">MST-001</text><text x="470" y="242" text-anchor="end">${t[4]}</text></g></svg><figcaption>${t[1]} <a target="_blank" rel="noopener" href="https://www.iso.org/standard/66777.html">ISO 1101</a>.</figcaption></figure>`;
}
