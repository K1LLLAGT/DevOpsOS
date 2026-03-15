const fs=require("fs");
const path=require("path");
const DIR=path.join(process.env.HOME,".devopsos/plugins");
const REG=path.join(DIR,"registry.json");
module.exports=ctx=>{
  if(!fs.existsSync(DIR)) fs.mkdirSync(DIR,{recursive:true});
  if(!fs.existsSync(REG)) fs.writeFileSync(REG,"[]");
  const load=()=>JSON.parse(fs.readFileSync(REG,"utf8"));
  const save=l=>fs.writeFileSync(REG,JSON.stringify(l,null,2));
  return {
    refresh(){ctx.send({type:"plugins:list",plugins:load()});},
    install(id){
      const list=load();
      if(!list.find(p=>p.id===id))
        list.push({id,name:id,version:"1.0.0",description:"",trust:"trusted"});
      save(list); this.refresh();
    },
    remove(id){
      save(load().filter(p=>p.id!==id));
      this.refresh();
    }
  };
};
