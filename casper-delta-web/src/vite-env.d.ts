/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_MODE?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// Window global variable injected by server
declare global {
    interface Window {
        APP_MODE?: string;
    }
}

export { };
