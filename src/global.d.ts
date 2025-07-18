// src/types/global.d.ts
export { };

declare global {
    interface Window {
        customInputHandler: (msg: string) => Promise<string>;
    }
}