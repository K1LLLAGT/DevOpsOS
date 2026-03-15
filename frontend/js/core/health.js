/* js/core/health.js */

export const health = {
    start() {
        setInterval(() => {
            console.debug("[health] heartbeat");
        }, 5000);
    }
};
