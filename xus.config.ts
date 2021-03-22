import { defineConfig } from '@xus/cli'

export default defineConfig({
  libBuild: {
    target: 'node12',
    formats: ['esm', 'cjs'],
    minify: false,
    sourcemap: false,
    alwaysEmptyDistDir: true,
    rollupChain(rc) {
      rc.input({
        index: './src/index.ts',
        register: './src/register.ts'
      })
      return rc
    }
  },
  lint: {
    eslint: {
      include: './src/**/*',
      ext: ['.ts']
    },
    stylelint: false
  },
  release: {
    branch: 'main'
  }
})
