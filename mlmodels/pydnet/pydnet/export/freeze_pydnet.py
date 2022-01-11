"""PyDnet Model Freezer.
"""

import tensorflow.compat.v1 as tf1
from pathlib import Path
from typing import Any, Dict
from pydnet.models import Pydnet
from tensorflow.python.tools import freeze_graph


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
    params = {
        "name": name,
        "input_saver_def_path": "",
        "input_binary": False,
        "restore_op": "save/restore_all",
        "saving_op": "save/Const:0",
        "clear_devices": True,
        "output": output,
        "pbtxt": name + ".pbtxt",
        "ckpt": name + ".ckpt",
        "frozen": "frozen_" + name + ".pb"
    }

    with tf1.Graph().as_default():
        placeholder = tf1.placeholder(
            tf1.float32,
            [1, h, w, 3],
            name="im0",
        )
        network = Pydnet({
            "h": h,
            "w": w,
            "is_training": False,
        })
        network.forward(placeholder)

        params["output_nodes_port"] = [
            x.name for x in network.output_nodes]
        params["output_nodes"] = [
            x.name.replace(":0", "") for x in network.output_nodes]
        params["input_nodes"] = [
            placeholder.name]

        save = tf1.train.Saver()
        with tf1.Session() as sess:
            save.restore(sess, str(checkpoint))
            tf1.train.write_graph(
                sess.graph_def,
                params["output"],
                params["pbtxt"])
            pbtxt = str((params["output"] / params["pbtxt"]).resolve())
            check = str((params["output"] / params["ckpt"]).resolve())
            froze = str((params["output"] / params["frozen"]).resolve())
            save.save(sess, check)

            freeze_graph.freeze_graph(
                pbtxt,
                params["input_saver_def_path"],
                params["input_binary"],
                check,
                ','.join(params["output_nodes"]),
                params["restore_op"],
                params["saving_op"],
                froze,
                params["clear_devices"],
                "")

        return params
