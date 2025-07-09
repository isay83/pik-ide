import { runPik } from './pyodideRunner'

export class PikInterpreter {
    async execute(code: string): Promise<string> {
        try {
            const output = await runPik(code)
            return output || '✅ Ejecución sin errores, pero sin salida.'
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : String(error)
            throw new Error(msg)

        }
    }
}