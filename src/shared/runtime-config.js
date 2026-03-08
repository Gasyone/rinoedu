(function () {
    const defaults = {
        API_BASE: "https://apirinoai.gasy.io/api",
        AI_CHAT_BASE: "https://apirinoai.gasy.io",
        UPLOAD_BASE: "https://cdn.apirinoai.gasy.io/uploads",
    };

    const overrides = window.__RINO_RUNTIME__ || {};

    window.RinoRuntimeConfig = Object.freeze({
        ...defaults,
        ...overrides,
    });
})();
