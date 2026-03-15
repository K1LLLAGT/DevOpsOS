const {Client}=require("ssh2");
module.exports=ctx=>{
  let conn=null,stream=null;
  return {
    connect({host,user,port}){
      if(conn) conn.end();
      conn=new Client();
      ctx.send({type:"ssh:status",status:"connecting"});
      conn.on("ready",()=>{
        ctx.send({type:"ssh:connected"});
        ctx.send({type:"ssh:status",status:"connected"});
        conn.shell((err,s)=>{
          if(err) return ctx.send({type:"error",code:"SSH_SHELL_FAILED",message:String(err)});
          stream=s;
          s.on("data",d=>ctx.send({type:"ssh:output",data:d.toString()}));
        });
      }).on("close",()=>{
        ctx.send({type:"ssh:closed"});
      }).on("error",e=>{
        ctx.send({type:"error",code:"SSH_ERROR",message:String(e)});
      }).connect({host,username:user,port,tryKeyboard:true});
    },
    disconnect(){conn?.end(); conn=null;},
    input(d){stream?.write(d);}
  };
};
