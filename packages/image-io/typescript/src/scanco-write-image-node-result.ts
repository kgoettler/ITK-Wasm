// Generated file. To retain edits, remove this comment.

import { JsonCompatible } from 'itk-wasm'

interface ScancoWriteImageNodeResult {
  /** Whether the input could be written. If false, the output image is not valid. */
  couldWrite: JsonCompatible

  /** Output image serialized in the file format. */
  serializedImage: string

}

export default ScancoWriteImageNodeResult
