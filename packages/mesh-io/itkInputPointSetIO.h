/*=========================================================================
 *
 *  Copyright NumFOCUS
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         https://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/
#ifndef itkInputPointSetIO_h
#define itkInputPointSetIO_h

#include "itkPipeline.h"
#include "itkWasmMeshIOBase.h"
#include "itkWasmMeshIO.h"
#include "itkWasmIOCommon.h"

#ifndef ITK_WASM_NO_MEMORY_IO
#include "itkWasmExports.h"
#endif
#ifndef ITK_WASM_NO_FILESYSTEM_IO
#endif

namespace itk
{
namespace wasm
{

/**
 *\class InputPointSetIO
 * \brief Input point set for an itk::wasm::Pipeline from an itk::MeshIOBase
 *
 * This point set is read from the filesystem or memory when ITK_WASM_PARSE_ARGS is called.
 *
 * This class is for the write-point-set itk-wasm pipeline. Most pipelines will use itk::wasm::InputPointSet.
 *
 * \ingroup WebAssemblyInterface
 */
class InputPointSetIO
{
public:
  void Set(const WasmMeshIOBase * meshIO) {
    this->m_WasmMeshIOBase = meshIO;
  }

  const WasmMeshIOBase * Get() const {
    return this->m_WasmMeshIOBase.GetPointer();
  }

  InputPointSetIO() = default;
  ~InputPointSetIO() = default;
protected:
  typename WasmMeshIOBase::ConstPointer m_WasmMeshIOBase;
};


bool lexical_cast(const std::string &input, InputPointSetIO &inputMeshIO)
{
  if (input.empty())
  {
    return false;
  }

  if (wasm::Pipeline::get_use_memory_io())
  {
#ifndef ITK_WASM_NO_MEMORY_IO
    const unsigned int index = std::stoi(input);
    auto json = getMemoryStoreInputJSON(0, index);
    auto        deserializedAttempt = glz::read_json<itk::MeshJSON>(json);
    if (!deserializedAttempt)
    {
      const std::string descriptiveError = glz::format_error(deserializedAttempt, json);
      throw std::runtime_error("Failed to deserialize MeshJSON: " + descriptiveError);
    }
    auto meshJSON = deserializedAttempt.value();

    auto wasmMeshIO = itk::WasmMeshIO::New();
    wasmMeshIO->SetJSON(meshJSON);

    const unsigned int dimension = wasmMeshIO->GetPointDimension();

    auto wasmMeshIOBase = itk::WasmMeshIOBase::New();

    const std::string & pointsString = meshJSON.points;
    const char * pointsPtr = reinterpret_cast< char * >( std::strtoull(pointsString.substr(35).c_str(), nullptr, 10) );
    WasmMeshIOBase::DataContainerType * pointsContainer = wasmMeshIOBase->GetPointsContainer();
    SizeValueType numberOfBytes = wasmMeshIO->GetNumberOfPoints() * wasmMeshIO->GetPointDimension() * ITKComponentSize( wasmMeshIO->GetPointComponentType() );
    pointsContainer->resize(numberOfBytes);
    pointsContainer->assign(pointsPtr, pointsPtr + numberOfBytes);

    const std::string & pointDataString = meshJSON.pointData;
    const char * pointDataPtr = reinterpret_cast< char * >( std::strtoull(pointDataString.substr(35).c_str(), nullptr, 10) );
    WasmMeshIOBase::DataContainerType * pointDataContainer = wasmMeshIOBase->GetPointDataContainer();
    numberOfBytes =
      static_cast< SizeValueType >(
          wasmMeshIO->GetNumberOfPointPixels() * wasmMeshIO->GetNumberOfPointPixelComponents() * ITKComponentSize( wasmMeshIO->GetPointPixelComponentType() )
          );
    pointDataContainer->resize(numberOfBytes);
    pointDataContainer->assign(pointDataPtr, pointDataPtr + numberOfBytes);

    wasmMeshIOBase->SetMeshIO(wasmMeshIO, false);
    wasmMeshIOBase->SetJSON(json);

    inputMeshIO.Set(wasmMeshIOBase);
#else
    return false;
#endif
  }
  else
  {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
    auto wasmMeshIO = itk::WasmMeshIO::New();
    wasmMeshIO->SetFileName(input);

    auto wasmMeshIOBase = itk::WasmMeshIOBase::New();
    wasmMeshIOBase->SetMeshIO(wasmMeshIO);

    inputMeshIO.Set(wasmMeshIOBase);
#else
    return false;
#endif
  }
  return true;
}

} // end namespace wasm
} // end namespace itk

#endif
