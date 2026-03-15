const fs=require("fs");
const path=require("path");
module.exports=ctx=>({
  list(dir){
    try{
      const list=fs.readdirSync(dir).map(n=>{
        const full=path.join(dir,n);
        const s=fs.statSync(full);
        return {name:n,type:s.isDirectory()?"dir":"file"};
      });
      ctx.send({type:"file:list",path:dir,list});
    }catch(e){
      ctx.send({type:"error",code:"FILE_LIST_FAILED",message:String(e)});
    }
  },
  read(file){
    try{
      const content=fs.readFileSync(file,"utf8");
      ctx.send({type:"file:read",path:file,content});
    }catch(e){
      ctx.send({type:"error",code:"FILE_READ_FAILED",message:String(e)});
    }
  },
  write({path:fp,content}){
    try{
      fs.writeFileSync(fp,content,"utf8");
      ctx.send({type:"file:write:ok",path:fp});
    }catch(e){
      ctx.send({type:"error",code:"FILE_WRITE_FAILED",message:String(e)});
    }
  }
});
