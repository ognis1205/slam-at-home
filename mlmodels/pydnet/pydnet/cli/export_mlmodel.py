"""MLModel Exporter CLI.
"""

import sys
import fire
import coremltools as ct
from traceback import format_exc
from pathlib import Path
from pydnet.models import freeze_pydnet


def export_mlmodel(name, h, w, path_to_checkpoint, path_to_output):
    """Freezes the PyDnet model.
    Args:
        name(str): The name of the architecture.
        h (int): The image height.
        w (int): The image wodth.
        path_to_checkpoint (str): The path to the checkpoint file.
        path_to_output (str): The path to the output directory.
    """
    path_to_pb = freeze_pydnet(
        name,
        int(h),
        int(w),
        Path(path_to_checkpoint),
        Path(path_to_output))
    model = ct.convert(str(path_to_pb), inputs=[ct.ImageType()])
    model.save(str(path_to_pb).replace("pb", "mlmodel"))


def main():
    """A CLI entry point.
    """
    try:
        fire.Fire(export_mlmodel)
    except Exception:
        print(format_exc(), file=sys.stderr)
