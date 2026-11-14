const labels = {
 de:["Drehbares 3D-Bauteil","Geprüftes Element","Bezugselement","Nach links","Nach rechts","Nach oben","Nach unten","Ansicht zurücksetzen"],
 en:["Rotatable 3D part","Controlled feature","Datum feature","Rotate left","Rotate right","Tilt up","Tilt down","Reset view"],
 ar:["نموذج ثلاثي الأبعاد قابل للدوران","العنصر الخاضع للتفاوت","عنصر إسناد المرجع","أدر يسارًا","أدر يمينًا","أمل لأعلى","أمل لأسفل","استعد المنظور"],
};
const kinds = ["shaft","plate","shaft","shaft","slope","dome","plate","square","slope","bore","shaft","slot","shaft","shaft"];

function mesh(index) {
 const faces = [], marks = [];
 const face = (points, role="body") => faces.push({points,role});
 const mark = (points,role="feature") => marks.push({points,role});
 const kind = kinds[index];
 if (kind === "shaft" || kind === "bore" || kind === "dome") {
  const sections = kind==="shaft"?[[-71,18],[-24,18],[-24,31],[30,31],[30,23],[70,23]]:
   kind==="bore"?[[-24,50],[24,50]]:[[-30,49],[-8,49],[7,45],[19,38],[30,25],[36,9],[37,0]];
  const point = (x,r,i) => [x,r*Math.cos(i*Math.PI/16),r*Math.sin(i*Math.PI/16)];
  for(let i=0;i<32;i++){
   for(let n=0;n<sections.length-1;n++){
    const [a,r]=sections[n], [b,q]=sections[n+1];
    const role = kind==="dome"&&n>0 || kind==="shaft"&&[3,10,13].includes(index)&&n===2 ? "feature" :
      kind==="shaft"&&[10,12,13].includes(index)&&n===0 ? "datum":"body";
    face([point(a,r,i),point(a,r,i+1),point(b,q,i+1),point(b,q,i)],role);
   }
   const [lo,lr]=sections[0], [hi,hr]=sections.at(-1);
   const hole = kind==="bore"?17:0;
   for (const [x,r,role] of [[lo,lr,kind==="bore"?"datum":"body"],[hi,hr,"body"]]){
    face([point(x,r,i),point(x,r,i+1),point(x,hole,i+1),point(x,hole,i)],role);
   }
   if(hole)face([point(lo,hole,i),point(lo,hole,i+1),point(hi,hole,i+1),point(hi,hole,i)],"feature");
  }
  if(index===0)mark([[-20,0,-31],[26,0,-31]]);
  if(index===2||index===12)mark(Array.from({length:33},(_,i)=>point(8,31.4,i)));
  if([9,10].includes(index))mark([[-79,0,0],[79,0,0]]);
 } else {
  const box=(x0,x1,y0,y1,z0,z1,top,base="body")=>{
   const a=[x0,y0,z0],b=[x1,y0,z0],c=[x1,y1,z0],d=[x0,y1,z0];
   const e=[x0,y0,z1],f=[x1,y0,z1],g=[x1,y1,z1],h=[x0,y1,z1];
   face([a,b,c,d],base);face([e,f,g,h],top);
   face([a,b,f,e]);face([b,c,g,f]);face([c,d,h,g]);face([d,a,e,h]);
  };
  if(kind==="plate")box(-70,70,-44,44,-13,13,"feature",index===6?"datum":"body");
  else if(kind==="square"){
   box(-65,65,-39,39,-24,24,"body","datum");
   face([[65,-39,-24],[65,39,-24],[65,39,24],[65,-39,24]],"feature");
  } else if(kind==="slot"){
   box(-65,65,-43,43,-23,-5,"body","datum");
   box(-65,65,-43,-14,-5,24,"body");
   box(-65,65,14,43,-5,24,"body");
   face([[-65,-14,-5],[65,-14,-5],[65,-14,24],[-65,-14,24]],"feature");
   face([[-65,14,-5],[65,14,-5],[65,14,24],[-65,14,24]],"feature");
  } else {
   const a=[-65,-39,-22],b=[65,-39,-22],c=[65,39,-22],d=[-65,39,-22];
   const e=[-65,-39,1],f=[65,-39,41],g=[65,39,41],h=[-65,39,1];
   face([a,b,c,d],index===8?"datum":"body");face([a,b,f,e]);face([b,c,g,f]);face([c,d,h,g]);face([d,a,e,h]);
   face([e,f,g,h],index===8?"feature":"body");
   if(index===4)mark(Array.from({length:17},(_,i)=>[-65+i*130/16,-39,1+i*40/16+8*Math.sin(i*Math.PI/16)]));
  }
 }
 return {faces,marks};
}

export function mountPartModel(host,index,lang) {
 const t=labels[lang] ?? labels.de, {faces,marks}=mesh(index);
 const note = index===9 ? {de:"Das Modell hebt eine Bohrung und eine Bezugsfläche hervor. Das vollständige Bezugssystem steht in der Zeichnung.",en:"The model highlights one bore and one datum face. See the drawing for the complete datum system.",ar:"يبرز النموذج ثقبًا واحدًا وسطحًا مرجعيًا واحدًا. يظهر نظام المراجع الكامل في الرسم."}[lang] : index>=12 ? {de:"Am Modell gezeigt: radiale Prüfung.",en:"Model view: radial inspection.",ar:"يعرض النموذج الفحص الشعاعي."}[lang] : "";
 host.innerHTML='<figure style="margin-block:1rem"><h4>'+t[0]+'</h4><svg viewBox="0 0 330 210" role="img" aria-label="'+t[0]+'" direction="ltr" style="touch-action:none;cursor:grab;background:#f7f7fc;border-radius:6px"></svg><figcaption><span style="color:#903700">● '+t[1]+'</span>'+([6,7,8,9,10,11,12,13].includes(index)?' · <span style="color:#064f98">● '+t[2]+'</span>':'')+(note?'<p>'+note+'</p>':'')+'</figcaption><div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.5rem">'+["←","→","↑","↓","↺"].map((icon,i)=>'<button type="button" data-turn="'+i+'" aria-label="'+t[i+3]+'">'+icon+'</button>').join("")+'</div></figure>';
 const svg = host.querySelector("svg");
 let yaw=.65, pitch=-.55, drag;
 const fill = {body:"#cbd4e3",feature:"#ffb269",datum:"#88bfff"};
 const stroke = {body:"#52647b",feature:"#a94100",datum:"#145a9e"};
 function draw(){
  const project = ([x,y,z])=>{
   const horizontal = x*Math.cos(yaw)-y*Math.sin(yaw);
   const depth = x*Math.sin(yaw)+y*Math.cos(yaw);
   return [165+horizontal*1.25,105+(depth*Math.sin(pitch)-z*Math.cos(pitch))*1.25,depth*Math.cos(pitch)+z*Math.sin(pitch)];
  };
  const points = (p)=>p.map(([x,y])=>x.toFixed(1)+","+y.toFixed(1)).join(" ");
  svg.innerHTML=faces.map(({points,role})=>{
   const p=points.map(project);
   return {p,role,depth:p.reduce((sum,v)=>sum+v[2],0)/p.length};
  }).sort((a,b)=>b.depth-a.depth).map(({p,role})=>'<polygon points="'+points(p)+'" fill="'+fill[role]+'" stroke="'+stroke[role]+'" stroke-width=".65"/>').join("")+
  marks.map(({points:p,role})=>'<polyline points="'+points(p.map(project))+'" fill="none" stroke="'+stroke[role]+'" stroke-width="2.6" stroke-dasharray="'+([7,9,10].includes(index)?"5 3":"none")+'"/>').join("");
 }
 const rotate=(x,y)=>{yaw+=x;pitch=Math.max(-1.5,Math.min(1.5,pitch+y));draw();};
 host.querySelectorAll("[data-turn]").forEach((button,i)=>button.addEventListener("click",()=>{
  if(i===4){yaw=.65;pitch=-.55;draw();}
  else rotate(...[[-.22,0],[.22,0],[0,-.2],[0,.2]][i]);
 }));
 svg.addEventListener("pointerdown",e=>{if(e.button!==0)return;drag=[e.clientX,e.clientY];svg.setPointerCapture?.(e.pointerId);});
 svg.addEventListener("pointermove",e=>{if(!drag)return;rotate((e.clientX-drag[0])*.012,(e.clientY-drag[1])*.012);drag=[e.clientX,e.clientY];});
 for(const type of ["pointerup","pointercancel","lostpointercapture"])svg.addEventListener(type,()=>{drag=undefined;});
 draw();
}