import {emit} from "./events.js";
let ws=null;
export function connect(url){
  ws=new WebSocket(url);
  ws.onopen=()=>emit("ws:open");
  ws.onclose=()=>emit("ws:close");
  ws.onerror=e=>emit("ws:error",e);
  ws.onmessage=e=>{
    try{emit("ws:message",JSON.parse(e.data));}catch{}
  };
}
export function send(o){
  if(ws&&ws.readyState===1) ws.send(JSON.stringify(o));
}
