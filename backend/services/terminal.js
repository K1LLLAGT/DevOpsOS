const pty=require("node-pty");
module.exports=ctx=>{
  const sessions={};
  return {
    start({id,cols,rows}){
      const shell=process.env.SHELL||"bash";
      const p=pty.spawn(shell,[],{
        name:"xterm-color",
        cols,rows,
        cwd:process.env.HOME,
        env:process.env
      });
      sessions[id]=p;
      p.onData(chunk=>ctx.send({type:"terminal:data",id,chunk}));
    },
    input({id,data}){sessions[id]?.write(data);},
    resize({id,cols,rows}){sessions[id]?.resize(cols,rows);},
    kill({id}){sessions[id]?.kill(); delete sessions[id];}
  };
};
