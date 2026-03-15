module.exports=function(msg,ctx){
  switch(msg.type){
    case "terminal:start": return ctx.terminal.start(msg);
    case "terminal:input": return ctx.terminal.input(msg);
    case "terminal:resize": return ctx.terminal.resize(msg);
    case "terminal:kill": return ctx.terminal.kill(msg);

    case "process:refresh": return ctx.process.refresh();
    case "process:kill": return ctx.process.kill(msg.pid);

    case "file:list": return ctx.files.list(msg.path);
    case "file:read": return ctx.files.read(msg.path);
    case "file:write": return ctx.files.write(msg);

    case "plugins:refresh": return ctx.plugins.refresh();
    case "plugins:install": return ctx.plugins.install(msg.id);
    case "plugins:remove": return ctx.plugins.remove(msg.id);

    case "ssh:connect": return ctx.ssh.connect(msg);
    case "ssh:disconnect": return ctx.ssh.disconnect();
    case "ssh:input": return ctx.ssh.input(msg.data);

    case "tor:start": return ctx.tor.start();
    case "tor:stop": return ctx.tor.stop();
    case "tor:newid": return ctx.tor.newIdentity();

    default:
      return ctx.send({type:"error",code:"UNKNOWN_TYPE",message:msg.type});
  }
};
