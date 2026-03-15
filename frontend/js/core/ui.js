import {PANELS} from "./panels.js";
export async function loadPanel(id){
  const p=PANELS[id];
  const c=document.getElementById("main-panel");
  c.innerHTML=await (await fetch(p.html)).text();
  const link=document.createElement("link");
  link.rel="stylesheet"; link.href=p.css;
  document.head.appendChild(link);
  const mod=await import(p.js+"?v="+Date.now());
  mod.init&&mod.init();
}

// Register Marketplace as a valid panel
VALID_PANELS.push("marketplace");
