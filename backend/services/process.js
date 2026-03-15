const fs=require("fs");
module.exports=ctx=>({
  refresh(){
    const list=[];
    fs.readdirSync("/proc").forEach(d=>{
      if(!/^[0-9]+$/.test(d)) return;
      try{
        const stat=fs.readFileSync(`/proc/${d}/stat`,"utf8").split(" ");
        const cmd=fs.readFileSync(`/proc/${d}/cmdline`,"utf8").replace(/\\0/g," ")||"[unknown]";
        list.push({pid:+d,ppid:+stat[3],cmd,cpu:"0",mem:"0"});
      }catch{}
    });
    ctx.send({type:"process:list",list});
  },
  kill(pid){
    try{process.kill(pid,"SIGKILL");}catch{}
    this.refresh();
  }
});
