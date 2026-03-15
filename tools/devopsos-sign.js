#!/usr/bin/env node
const fs=require("fs");
const crypto=require("crypto");
const path=require("path");

const ROOT=process.env.DEVOPSOS_ROOT || path.join(process.env.HOME,"DevOpsOS");
const cmd=process.argv[2];
const target=process.argv[3];

const KEYDIR=path.join(ROOT,".keys");
const PRIV=path.join(KEYDIR,"devopsos-private.pem");
const PUB=path.join(KEYDIR,"devopsos-public.pem");

function ensureKeys(){
  if(!fs.existsSync(KEYDIR)) fs.mkdirSync(KEYDIR,{recursive:true});
  if(!fs.existsSync(PRIV) || !fs.existsSync(PUB)){
    const {generateKeyPairSync}=require("crypto");
    const {privateKey,publicKey}=generateKeyPairSync("rsa",{modulusLength:2048});
    fs.writeFileSync(PRIV,privateKey.export({type:"pkcs1",format:"pem"}));
    fs.writeFileSync(PUB,publicKey.export({type:"pkcs1",format:"pem"}));
    console.log("Generated new DevOpsOS signing keypair.");
  }
}

function hashDir(dir){
  const files=[];
  function walk(d){
    for(const e of fs.readdirSync(d)){
      const full=path.join(d,e);
      const rel=path.relative(dir,full);
      if(rel.startsWith("signature")) continue;
      const st=fs.statSync(full);
      if(st.isDirectory()) walk(full);
      else files.push(rel);
    }
  }
  walk(dir);
  files.sort();
  const h=crypto.createHash("sha256");
  for(const f of files){
    h.update(f);
    h.update(fs.readFileSync(path.join(dir,f)));
  }
  return h.digest("hex");
}

function signPlugin(pdir){
  ensureKeys();
  const priv=fs.readFileSync(PRIV);
  const hash=hashDir(pdir);
  const sig=crypto.sign("sha256",Buffer.from(hash,"utf8"),priv).toString("base64");
  const out={
    hash,
    signature:sig,
    algorithm:"rsa-sha256",
    created:new Date().toISOString()
  };
  fs.writeFileSync(path.join(pdir,"signature.json"),JSON.stringify(out,null,2));
  console.log("Signed plugin:",pdir);
}

function verifyPlugin(pdir){
  if(!fs.existsSync(PUB)) return console.error("No public key found.");
  const pub=fs.readFileSync(PUB);
  const sigPath=path.join(pdir,"signature.json");
  if(!fs.existsSync(sigPath)) return console.error("No signature.json in",pdir);
  const data=JSON.parse(fs.readFileSync(sigPath,"utf8"));
  const hash=hashDir(pdir);
  if(hash!==data.hash) return console.error("Hash mismatch for",pdir);
  const ok=crypto.verify("sha256",Buffer.from(hash,"utf8"),pub,Buffer.from(data.signature,"base64"));
  console.log(ok?"OK: signature valid":"FAIL: invalid signature");
}

switch(cmd){
  case "keygen":
    ensureKeys();
    console.log("Keys ready in",KEYDIR);
    break;
  case "sign":
    if(!target) throw new Error("Usage: devopsos-sign.js sign plugins/<name>");
    signPlugin(path.resolve(target));
    break;
  case "verify":
    if(!target) throw new Error("Usage: devopsos-sign.js verify plugins/<name>");
    verifyPlugin(path.resolve(target));
    break;
  default:
    console.log("DevOpsOS Plugin Signing");
    console.log("Usage:");
    console.log("  devopsos-sign.js keygen");
    console.log("  devopsos-sign.js sign plugins/<name>");
    console.log("  devopsos-sign.js verify plugins/<name>");
}
