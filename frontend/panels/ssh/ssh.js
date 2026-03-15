import {emit,on} from "../../js/core/events.js";
let connected=false;
export function init(){
  const host=document.querySelector("#ssh-host");
  const user=document.querySelector("#ssh-user");
  const port=document.querySelector("#ssh-port");
  const out=document.querySelector("#ssh-output");
  const input=document.querySelector("#ssh-input");

  document.querySelector("#ssh-connect").onclick=()=>{
    out.textContent="";
    emit("ws:send",{type:"ssh:connect",host:host.value,user:user.value,port:Number(port.value)});
  };

  document.querySelector("#ssh-disconnect").onclick=()=>{
    emit("ws:send",{type:"ssh:disconnect"});
  };

  input.onkeydown=e=>{
    if(e.key==="Enter"&&connected){
      emit("ws:send",{type:"ssh:input",data:input.value+"\\n"});
      input.value="";
    }
  };

  on("ssh:status",s=>{
    const el=document.querySelector("#ssh-status");
    if(el) el.textContent=s;
  });

  on("ssh:output",d=>{
    out.textContent+=d;
    out.scrollTop=out.scrollHeight;
  });

  on("ssh:connected",()=>{
    connected=true;
    const el=document.querySelector("#ssh-status");
    if(el) el.textContent="connected";
  });

  on("ssh:closed",()=>{
    connected=false;
    const el=document.querySelector("#ssh-status");
    if(el) el.textContent="closed";
  });
}

export function unload(){
  emit("ws:send",{type:"ssh:disconnect"});
};
