const net=require("net");
module.exports=ctx=>{
  let sock=null;
  const send=c=>sock&&sock.write(c+"\\r\\n");
  return {
    start(){ctx.send({type:"tor:status",status:"starting"});},
    stop(){ctx.send({type:"tor:status",status:"stopped"});},
    newIdentity(){send("SIGNAL NEWNYM");},
    connectControlPort(){
      sock=net.connect(9051,"127.0.0.1",()=>{
        ctx.send({type:"tor:status",status:"connected"});
        send("AUTHENTICATE \"\"");
        send("GETINFO circuit-status");
      });
      sock.on("data",d=>ctx.send({type:"tor:circuit",text:d.toString()}));
      sock.on("error",e=>ctx.send({type:"error",code:"TOR_ERROR",message:String(e)}));
    }
  };
};
