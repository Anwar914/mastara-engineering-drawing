const datumPaths = [
 {A:"M332 78V139M332 181V242",B:'<circle cx="138" cy="160" r="35"/><path d="M332 139H405M332 181H405"/>',C:"M77 78H200"},
 {A:"M399 129h38m-38 62h38"},
 {A:"M52 219H233",B:"M52 179H233"},
 {A:"M209 146H390M209 174H390"},
 {A:"M50 119h102m-102 82h102"},
 {A:"M300 131H425M300 171H425"},
 {A:"M281 135H420M281 175H420"},
];
const labels = {
 ar:["العنصر الخاضع للتفاوت","عناصر إسناد المراجع"],
 en:["Controlled feature","Datum features"],
 de:["Toleriertes Element","Bezugselemente"],
};
export function drawDatums(part, datum) {
 return datum.split(" ").filter(Boolean).map(ref=>{
   const shape=datumPaths[part]?.[ref];
   if(!shape)return "";
   return '<g class="datum-glow" data-datum="'+ref+'">'+(shape.startsWith("<")?shape:'<path d="'+shape+'"/>')+'</g>';
 }).join("");
}
export function drawingLegend(lang,datum) {
 const [feature,reference]=labels[lang];
 return '<div class="drawing-legend"><span class="legend-feature">'+feature+'</span>'+
   (datum?'<span class="legend-datum">'+reference+' <bdi>'+datum+'</bdi></span>':"")+'</div>';
}
