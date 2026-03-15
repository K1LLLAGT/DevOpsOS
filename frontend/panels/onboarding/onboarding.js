import {emit} from "../../js/core/events.js";

export function init(){
  const steps=[...document.querySelectorAll(".ob-step")];
  let idx=0;

  const show=()=>steps.forEach((s,i)=>s.style.display=i===idx?"block":"none");
  show();

  document.querySelectorAll(".ob-next").forEach(b=>{
    b.onclick=()=>{idx=Math.min(idx+1,steps.length-1);show();};
  });
  document.querySelectorAll(".ob-prev").forEach(b=>{
    b.onclick=()=>{idx=Math.max(idx-1,0);show();};
  });

  document.querySelector("#ob-finish").onclick=()=>{
    const panels=[];
    document.querySelectorAll("input[type=checkbox][data-panel]").forEach(cb=>{
      if(cb.checked) panels.push(cb.dataset.panel);
    });
    const theme=document.querySelector("#ob-theme").value;
    const autostart=document.querySelector("#ob-autostart").checked;
    const port=Number(document.querySelector("#ob-port").value)||8080;
    const security=document.querySelector("#ob-security").value;

    const cfg={panels,theme,backend:{autostart,port,security}};
    localStorage.setItem("devopsos.config",JSON.stringify(cfg));
    emit("onboarding:complete",cfg);
  };
}

export function unload(){}
