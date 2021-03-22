import path from 'path'
import { transformSync, Loader, TransformOptions } from 'esbuild'
import { addHook } from 'pirates'

const files = new Set<string>()

const map2Loader: Record<string, string> = {
  '.js': 'js',
  '.jsx': 'js',
  '.ts': 'ts',
  '.tsx': 'tsx',
  '.mjs': 'js',
  '.cjs': 'js'
}

let override = {}

function compile(code: string, filename: string) {
  const match = new RegExp(`(${[...files].join('|')})`)
  if (!match.test(filename)) {
    return code
  }

  const { code: js, warnings } = transformSync(code, {
    sourcefile: filename,
    sourcemap: false,
    target: 'node12',
    format: 'cjs',
    loader: map2Loader[path.extname(filename)] as Loader,
    ...override
  })
  if (warnings && warnings.length > 0) {
    for (const warning of warnings) {
      console.log(warning.location)
      console.log(warning.text)
    }
  }
  return js
}

let revert: any

type IExts = '.js' | '.jsx' | '.ts' | '.tsx' | '.mjs' | '.cjs'

export function register(
  file: string[],
  exts: IExts[] = ['.js', '.jsx', '.ts', '.tsx'],
  _override: TransformOptions = {}
) {
  file.forEach((f) => files.add(f))
  override = {
    ...override,
    ..._override
  }
  if (!revert) {
    revert = addHook(compile, {
      exts,
      ignoreNodeModules: false
    })
  }
}
