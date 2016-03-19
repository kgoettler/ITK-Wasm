/*=========================================================================
 *
 *  Copyright Insight Software Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/

if(process.argv.length < 4) {
  console.error("itkJSImageIO example, set random pixels to the image.");
  console.error("Use mode: .nrrd or .nii files");
  console.error(process.argv[0], process.argv[1], " moduleDir inputImage outputImage");
  process.exit(1);
}
var moduleDir = process.argv[2]
var inputImage = process.argv[3];
var outputImage = process.argv[4];
console.log("Input image: ", inputImage);
console.log("Output image: ", outputImage);

var path = require("path");
var Module = require(path.join(moduleDir, "itkJSImageIO.js"));
var imagejs = new Module.itkJSImageIO();

console.log("Reading image...");
imagejs.MountDirectory(inputImage);
imagejs.ReadImage(inputImage);

var dim = imagejs.GetDimensions();
var dimensions = Module.HEAP32.subarray(dim, dim + 3);

console.log("Random pixels every 2 slices...");
for(var i = 0; i < dimensions[0]; i+=2) {
  for(var j = 0; j < dimensions[1]; j++) {
    for(var k = 0; k < dimensions[2]; k++) {
      imagejs.SetPixel(i, j, k, Math.random()*255);
    }
  }
}
console.log("Writing image...");
imagejs.MountDirectory(outputImage);
imagejs.WriteImage(outputImage);
