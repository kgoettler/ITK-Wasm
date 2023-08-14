// Generated file. To retain edits, remove this comment.

import * as compressStringify from '../../../dist/bundles/compress-stringify.js'
import compressStringifyLoadSampleInputs from "./compress-stringify-load-sample-inputs.js"

class CompressStringifyModel {

  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
  }


class CompressStringifyController  {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new CompressStringifyModel()
    const model = this.model

    this.webWorker = null

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#compressStringifyInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const inputElement = document.querySelector('#compressStringifyInputs input[name=input-file]')
    inputElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const arrayBuffer = await files[0].arrayBuffer()
        model.inputs.set("input", new Uint8Array(arrayBuffer))
        const details = document.getElementById("compressStringify-input-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(model.inputs.get("input").subarray(0, 50).toString() + ' ...')}</pre>`
        details.disabled = false
    })

    // ----------------------------------------------
    // Options
    const stringifyElement = document.querySelector('#compressStringifyInputs sl-checkbox[name=stringify]')
    stringifyElement.addEventListener('sl-change', (event) => {
        model.options.set("stringify", stringifyElement.checked)
    })

    const compressionLevelElement = document.querySelector('#compressStringifyInputs sl-input[name=compression-level]')
    compressionLevelElement.addEventListener('sl-change', (event) => {
        model.options.set("compressionLevel", parseInt(compressionLevelElement.value))
    })

    const dataUrlPrefixElement = document.querySelector('#compressStringifyInputs sl-input[name=data-url-prefix]')
    dataUrlPrefixElement.addEventListener('sl-change', (event) => {
        model.options.set("dataUrlPrefix", dataUrlPrefixElement.value)
    })

    // ----------------------------------------------
    // Outputs
    const outputOutputDownload = document.querySelector('#compressStringifyOutputs sl-button[name=output-download]')
    outputOutputDownload.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("output")) {
            globalThis.downloadFile(model.outputs.get("output"), "output.bin")
        }
    })

    const runButton = document.querySelector('#compressStringifyInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('input')) {
        globalThis.notify("Required input not provided", "input", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true
        const t0 = performance.now()

        const { webWorker, output, } = await compressStringify.compressStringify(this.webWorker,
          model.inputs.get('input').slice(),
          Object.fromEntries(model.options.entries())
        )

        const t1 = performance.now()
        globalThis.notify("compressStringify successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")
        this.webWorker = webWorker

        model.outputs.set("output", output)
        outputOutputDownload.variant = "success"
        outputOutputDownload.disabled = false
        const outputOutput = document.getElementById("compressStringify-output-details")
        outputOutput.innerHTML = `<pre>${globalThis.escapeHtml(output.subarray(0, 1024).toString() + ' ...')}</pre>`
        outputOutput.disabled = false
      } catch (error) {
        globalThis.notify("Error while running pipeline", error.toString(), "danger", "exclamation-octagon")
        throw error
      } finally {
        runButton.loading = false
      }
    })
  }
}

const compressStringifyController = new CompressStringifyController(compressStringifyLoadSampleInputs)
