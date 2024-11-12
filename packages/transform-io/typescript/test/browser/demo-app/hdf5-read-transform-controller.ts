// Generated file. To retain edits, remove this comment.

import { writeTransform } from '../../../dist/index.js'
import * as transformIo from '../../../dist/index.js'
import hdf5ReadTransformLoadSampleInputs, { usePreRun } from "./hdf5-read-transform-load-sample-inputs.js"

class Hdf5ReadTransformModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class Hdf5ReadTransformController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new Hdf5ReadTransformModel()
    const model = this.model

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#hdf5ReadTransformInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const serializedTransformElement = document.querySelector('#hdf5ReadTransformInputs input[name=serialized-transform-file]')
    serializedTransformElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const arrayBuffer = await files[0].arrayBuffer()
        model.inputs.set("serializedTransform", { data: new Uint8Array(arrayBuffer), path: files[0].name })
        const details = document.getElementById("hdf5ReadTransform-serialized-transform-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(model.inputs.get("serializedTransform").data.subarray(0, 50).toString() + ' ...')}</pre>`
        details.disabled = false
    })

    // ----------------------------------------------
    // Options
    const floatParametersElement = document.querySelector('#hdf5ReadTransformInputs sl-checkbox[name=float-parameters]')
    floatParametersElement.addEventListener('sl-change', (event) => {
        model.options.set("floatParameters", floatParametersElement.checked)
    })

    // ----------------------------------------------
    // Outputs
    const couldReadOutputDownload = document.querySelector('#hdf5ReadTransformOutputs sl-button[name=could-read-download]')
    couldReadOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("couldRead")) {
            const fileName = `couldRead.json`
            globalThis.downloadFile(new TextEncoder().encode(JSON.stringify(model.outputs.get("couldRead"))), fileName)
        }
    })

    const transformOutputDownload = document.querySelector('#hdf5ReadTransformOutputs sl-button[name=transform-download]')
    transformOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("transform")) {
            const transformDownloadFormat = document.getElementById('hdf5ReadTransform-transform-output-format')
            const downloadFormat = transformDownloadFormat.value || 'h5'
            const fileName = `transform.${downloadFormat}`
            const { webWorker, serializedTransform } = await writeTransform(model.outputs.get("transform"), fileName)

            webWorker.terminate()
            globalThis.downloadFile(serializedTransform.data, fileName)
        }
    })

    const preRun = async () => {
      if (loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true)
        await this.run()
      }
    }

    const onSelectTab = async (event) => {
      if (event.detail.name === 'hdf5ReadTransform-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'hdf5ReadTransform') {
          params.set('functionName', 'hdf5ReadTransform')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'hdf5ReadTransform' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'hdf5ReadTransform') {
        tabGroup.show('hdf5ReadTransform-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#hdf5ReadTransformInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('serializedTransform')) {
        globalThis.notify("Required input not provided", "serializedTransform", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true

        const t0 = performance.now()
        const { couldRead, transform, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("hdf5ReadTransform successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("couldRead", couldRead)
        couldReadOutputDownload.variant = "success"
        couldReadOutputDownload.disabled = false
        const couldReadDetails = document.getElementById("hdf5ReadTransform-could-read-details")
        couldReadDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(couldRead, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        couldReadDetails.disabled = false
        const couldReadOutput = document.getElementById("hdf5ReadTransform-could-read-details")

        model.outputs.set("transform", transform)
        transformOutputDownload.variant = "success"
        transformOutputDownload.disabled = false
        const transformDetails = document.getElementById("hdf5ReadTransform-transform-details")
        transformDetails.disabled = false
        transformDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(transform, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
      } catch (error) {
        globalThis.notify("Error while running pipeline", error.toString(), "danger", "exclamation-octagon")
        throw error
      } finally {
        runButton.loading = false
      }
    })
  }

  async run() {
    const options = Object.fromEntries(this.model.options.entries())
    const { couldRead, transform, } = await transformIo.hdf5ReadTransform(      { data: this.model.inputs.get('serializedTransform').data.slice(), path: this.model.inputs.get('serializedTransform').path },
      Object.fromEntries(this.model.options.entries())
    )

    return { couldRead, transform, }
  }
}

const hdf5ReadTransformController = new Hdf5ReadTransformController(hdf5ReadTransformLoadSampleInputs)
