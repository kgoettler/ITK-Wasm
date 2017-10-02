import test from 'ava'
import path from 'path'

const loadModule = require(path.resolve(__dirname, '..', 'dist', 'loadEmscriptenModule.js'))
const itkConfig = require(path.resolve(__dirname, '..', 'dist', 'itkConfig.js'))

test('load a module', t => {
  const modulePath = path.join(itkConfig.imageIOsPath, 'itkPNGImageIOJSBinding.js')
  const loaded = loadModule(modulePath)
  t.truthy(loaded)
})