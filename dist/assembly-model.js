export const fits = {
 g6: [-20,-7], h6: [-13,0], k6: [2,15], p6: [22,35],
};
export const stations = Array.from({length:6}, (_,i) => [Math.cos(i*Math.PI/3), Math.sin(i*Math.PI/3)]);
export function evaluate(s) {
 const bore = 30 + 0.021*s.bore/100;
 const shaft = 30 + (fits[s.fit][0]+(fits[s.fit][1]-fits[s.fit][0])*s.shaft/100)/1000;
 const clearance = (bore-shaft)*1000;
 const minClearance = -fits[s.fit][1];
 const maxClearance = 21-fits[s.fit][0];
 // Two-lobe section with its major radius aligned with the offset.
 const radialGap = clearance/2-s.offset-s.form/2;
 const holes = stations.map(([ux,uy],i)=>{
   const a = Math.atan2(uy,ux)+s.angle/1000;
   const dx = 35e3*(Math.cos(a)-ux)+s.groupX+(i===0?s.local:0)*ux;
   const dy = 35e3*(Math.sin(a)-uy)+(i===0?s.local:0)*uy;
   return {dx,dy,error:2*Math.hypot(dx,dy),gap:(s.hole-s.pin)*500-Math.hypot(dx-s.float,dy)};
 });
 const eps=1e-7;
 return {bore,shaft,clearance,minClearance,maxClearance,radialGap,holes,
  geometry: s.form <= s.formLimit, position: holes.every(h=>h.error<=s.position+eps),
  slide: radialGap>=-eps, bolts: holes.every(h=>h.gap>=-eps),
  clearanceAfterShift: clearance/2-Math.abs(s.offset-s.float)-s.form/2,
  assembly: clearance/2-Math.abs(s.offset-s.float)-s.form/2>=-eps && holes.every(h=>h.gap>=-eps),
 };
}
