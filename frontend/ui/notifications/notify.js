export function notify(type, message) {
  const container = document.getElementById("notify-container");
  const div = document.createElement("div");
  div.className = "notify " + type;
  div.innerText = message;

  container.appendChild(div);

  setTimeout(() => {
    div.style.opacity = 0;
    setTimeout(() => div.remove(), 300);
  }, 2000);
}
