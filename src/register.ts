import { register } from './index'

register(['.'], ['.js', '.ts', '.jsx', '.tsx', '.mjs'], {
  target: `node${process.version.slice(1)}`
})
