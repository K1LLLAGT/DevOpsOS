async function loadRootConsole() {
  const res = await fetch("/arg/root_epilogue");
  const data = await res.json();

  document.getElementById("root-output").textContent = data.text;
}

document.addEventListener("DOMContentLoaded", loadRootConsole);
