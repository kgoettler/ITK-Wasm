import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    Mesh,
)

async def write_mesh_async(
    mesh: Mesh,
    serialized_mesh: str,
    information_only: bool = False,
    use_compression: bool = False,
) -> None:
    """Write an ITK-Wasm file format converted to a mesh file format.

    :param mesh: Input mesh
    :type  mesh: Mesh

    :param serialized_mesh: Output mesh serialized in the file format.
    :type  serialized_mesh: str

    :param information_only: Only write mesh metadata -- do not write pixel data.
    :type  information_only: bool

    :param use_compression: Use compression in the written file
    :type  use_compression: bool
    """
    func = environment_dispatch("itkwasm_mesh_io", "write_mesh_async")
    await func(mesh, serialized_mesh, information_only=information_only, use_compression=use_compression)
    return

async def meshwrite_async(
    mesh: Mesh,
    serialized_mesh: os.PathLike,
    information_only: bool = False,
    use_compression: bool = False,
) -> None:
    return await write_mesh_async(mesh, serialized_mesh, information_only=information_only, use_compression=use_compression)

meshwrite_async.__doc__ = f"""{write_mesh_async.__doc__}
    Alias for write_mesh.
    """