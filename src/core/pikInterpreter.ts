// src/core/pikInterpreter.ts
import { runPik } from './pyodideRunner'

export class PikInterpreter {
    private inputHandler: ((prompt: string) => Promise<string>) | undefined = undefined;


    setInputHandler(handler: (prompt: string) => Promise<string>) {
        this.inputHandler = handler;
    }

    async execute(code: string): Promise<string> {
        try {
            const output = await runPik(code, this.inputHandler);
            return output || '✅ Ejecución sin errores, pero sin salida.';
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : String(error);
            throw new Error(msg);
        }
    }
}