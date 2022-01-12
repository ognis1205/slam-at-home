"""PyDnet Model Freezer.
"""

import os
import tensorflow as tf
import coremltools as ct
from pathlib import Path
from typing import Any, Dict
from tensorflow.python.tools import freeze_graph
from tensorflow.compat.v1.graph_util import convert_variables_to_constants
from .pydnet import Pydnet


def freeze_pydnet(
    name: str,
    h: int,
    w: int,
    checkpoint: Path,
    output: Path
) -> Dict[str, Any]:
    """Freezes the PyDnet model.
    Args:
        name(str): The name of the architecture.
        h (int): The image height.
        w (int): The image wodth.
        checkpoint (pathlib.Paht): The path to the checkpoint file.
        output (pathlib.Paht): The path to the output directory.
    """
    with tf.Graph().as_default() as graph:
        placeholder = tf.placeholder(
            tf.float32,
            [1, h, w, 3],
            name="im0",
        )
        network = Pydnet({
            "h": h,
            "w": w,
            "is_training": False,
        })
        network.forward(placeholder)
        save = tf.train.Saver()
        with tf.Session() as sess:
            save.restore(sess, str(checkpoint))
            # NOTE: This is a workaround to prevent using the `freeze_graph` function.
            # `freeze_graph` may cause an `IndexError.`
            graph_def = convert_variables_to_constants(
                sess,
                graph.as_graph_def(),
                [x.name.replace(":0", "") for x in network.output_nodes])
            tf.train.write_graph(
                graph_def,
                str(output),
                f"{name}.pb",
                as_text=False)
    return (output / f"{name}.pb").resolve()
