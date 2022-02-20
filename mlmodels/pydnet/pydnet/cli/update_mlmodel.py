"""MLModel Updater CLI.
"""

import sys
import fire
import coremltools as ct
import coremltools.proto.FeatureTypes_pb2 as ft
from traceback import format_exc
from pathlib import Path

def update_mlmodel(name, h, w, path_to_mlmodel, path_to_output):
    """Updates the PyDnet model.
    Args:
        name(str): The name of the architecture.
        h (int): The image height.
        w (int): The image wodth.
        path_to_mlmodel (str): The path to the mlmodel file.
        path_to_output (str): The path to the output directory.
    """
    spec = ct.utils.load_spec(path_to_mlmodel)
    for input in spec.description.input:
        input.type.imageType.colorSpace = ft.ImageFeatureType.RGB
        input.type.imageType.height = int(h)
        input.type.imageType.width  = int(w)
    for output in spec.description.output:
#        shape = tuple(output.type.multiArrayType.shape)
#        c, h, w = shape
        output.type.imageType.colorSpace = ft.ImageFeatureType.ColorSpace.Value(
            "GRAYSCALE"
        )
        output.type.imageType.width  = int(w)
        output.type.imageType.height = int(h)
    updated = ct.models.MLModel(spec)
    updated.author  = "Filippo Aleotti"
    updated.license = "Apache v2"
    updated.short_description = name
    updated.save(path_to_output)


def main():
    """A CLI entry point.
    """
    try:
        fire.Fire(update_mlmodel)
    except Exception:
        print(format_exc(), file=sys.stderr)
