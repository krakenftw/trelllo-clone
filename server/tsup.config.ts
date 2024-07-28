import { defineConfig } from 'tsup'

export default defineConfig({
    name: 'tsup',
    target: 'node20',
    dts: {
        resolve: true,
        entry: './src/server.ts',
    },
})