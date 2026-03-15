/* js/core/oracle.js */

export function initOracleLayer() {
    const panel = document.getElementById("oracle-panel");
    const closeBtn = document.getElementById("oracle-close");

    closeBtn.addEventListener("click", () => {
        panel.style.display = "none";
    });

    window.handleOracleEvent = (payload) => {
        if (payload.show) {
            panel.style.display = "flex";
        }
        if (payload.metrics) {
            updateMetrics(payload.metrics);
        }
    };
}

export function initOracleSigilFlicker() {
    const sigil = document.getElementById("oracle-sigil");

    setInterval(() => {
        sigil.style.display = sigil.style.display === "none" ? "block" : "none";
    }, 3000);
}

function updateMetrics(m) {
    document.getElementById("oracle-entropy").textContent = m.entropy;
    document.getElementById("oracle-depth").textContent = m.depth;
    document.getElementById("oracle-silence-level").textContent = m.silence;
    document.getElementById("oracle-frag").textContent = m.frag;
}
