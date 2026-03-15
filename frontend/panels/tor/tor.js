import {emit,on} from "../../js/core/events.js";
export function init(){
  document.querySelector("#tor-start").onclick=()=>emit("ws:send",{type:"tor:start"});
  document.querySelector("#tor-stop").onclick=()=>emit("ws:send",{type:"tor:stop"});
  document.querySelector("#tor-newid").onclick=()=>emit("ws:send",{type:"tor:newid"});

  on("tor:status",s=>{
    const el=document.querySelector("#tor-status");
    if(el) el.textContent=s;
  });

  on("tor:circuit",m=>{
    const el=document.querySelector("#tor-circuit");
    if(el) el.textContent=m.text;
  });
}
export function unload(){}
