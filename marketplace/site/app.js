async function load(){
  const res=await fetch("../plugins.json");
  const data=await res.json();
  const list=document.getElementById("plugin-list");
  list.innerHTML="";
  data.plugins.forEach(p=>{
    const div=document.createElement("div");
    div.className="plugin-card";
    const badgeSrc={
      trusted:"../../assets/branding/badges/trusted.svg",
      verified:"../../assets/branding/badges/verified.svg",
      community:"../../assets/branding/badges/community.svg",
      sandboxed:"../../assets/branding/badges/sandboxed.svg"
    }[p.trust] || "";
    div.innerHTML=`
      <h2>${p.name}</h2>
      <div class="plugin-meta">
        <span>${p.id}</span> &mdash;
        <span>v${p.version}</span>
      </div>
      <p>${p.description}</p>
      <div>
        <span class="badge">${badgeSrc ? `<img src="${badgeSrc}" alt="${p.trust}">` : ""}</span>
        <span>${p.trust.toUpperCase()}</span>
      </div>
    `;
    list.appendChild(div);
  });
}
load();
