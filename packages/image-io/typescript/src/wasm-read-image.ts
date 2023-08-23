// Generated file. To retain edits, remove this comment.

import {
  BinaryFile,
  JsonCompatible,
  Image,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import WasmReadImageOptions from './wasm-read-image-options.js'
import WasmReadImageResult from './wasm-read-image-result.js'


import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

/**
 * Read an image file format and convert it to the itk-wasm file format
 *
 * @param {File | BinaryFile} serializedImage - Input image serialized in the file format
 * @param {WasmReadImageOptions} options - options object
 *
 * @returns {Promise<WasmReadImageResult>} - result object
 */
async function wasmReadImage(
  webWorker: null | Worker,
  serializedImage: File | BinaryFile,
  options: WasmReadImageOptions = {}
) : Promise<WasmReadImageResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
    { type: InterfaceTypes.Image },
  ]

  let serializedImageFile = serializedImage
  if (serializedImage instanceof File) {
    const serializedImageBuffer = await serializedImage.arrayBuffer()
    serializedImageFile = { path: serializedImage.name, data: new Uint8Array(serializedImageBuffer) }
  }
  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.BinaryFile, data: serializedImageFile as BinaryFile },
  ]

  const args = []
  // Inputs
  const serializedImageName = (serializedImageFile as BinaryFile).path
  args.push(serializedImageName as string)

  // Outputs
  const couldReadName = '0'
  args.push(couldReadName)

  const imageName = '1'
  args.push(imageName)

  // Options
  args.push('--memory-io')
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push('--information-only')
  }

  const pipelinePath = 'wasm-read-image'

  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl() })
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    couldRead: outputs[0].data as JsonCompatible,
    image: outputs[1].data as Image,
  }
  return result
}

export default wasmReadImage
