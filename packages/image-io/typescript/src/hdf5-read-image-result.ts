// Generated file. To retain edits, remove this comment.

import { JsonCompatible, Image, WorkerPoolFunctionResult } from 'itk-wasm'

interface Hdf5ReadImageResult extends WorkerPoolFunctionResult {
  /** Whether the input could be read. If false, the output image is not valid. */
  couldRead: JsonCompatible

  /** Output image */
  image: Image

}

export default Hdf5ReadImageResult
