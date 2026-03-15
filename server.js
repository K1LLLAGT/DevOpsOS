const http=require("http");
const WebSocket=require("ws");
const route=require("./backend/ws/router");

const Terminal=require("./backend/services/terminal");
const Process=require("./backend/services/process");
const Files=require("./backend/services/files");
const Plugins=require("./backend/services/plugins");
const SSH=require("./backend/services/ssh");
const Tor=require("./backend/services/tor");

const server=http.createServer();
const wss=new WebSocket.Server({server});

wss.on("connection",ws=>{
  const ctx={
    send:o=>ws.send(JSON.stringify(o))
  };
  ctx.terminal=Terminal(ctx);
  ctx.process=Process(ctx);
  ctx.files=Files(ctx);
  ctx.plugins=Plugins(ctx);
  ctx.ssh=SSH(ctx);
  ctx.tor=Tor(ctx);

  ws.on("message",raw=>{
    let msg;
    try{msg=JSON.parse(raw);}catch{return;}
    route(msg,ctx);
  });
});

server.listen(8080,()=>console.log("DevOpsOS backend running on ws://127.0.0.1:8080"));
