"""KITTI-360 Ground Truth Generater CLI.
"""

import sys
import fire
import numpy as np
from traceback import format_exc
from pathlib import Path
from tqdm import tqdm
from pydnet.data import generate_depth_map


def generate_kitti_ground_truth(path_to_kitti, path_to_split):
    """Generates ground truth depth maps from KITTI-360 dataset.
    Args:
        path_to_kitti (str): The path to the KITTI dataset.
        path_to_split (str): The path to the split index.
    """
    path_to_kitti = Path(path_to_kitti)
    path_to_split = Path(path_to_split)
    ground = []
    for line in tqdm(readlines(path_to_split / "test_files.txt")):
        date, drive_id, image_id, _, frame_id = line.split("/")
        frame_id = int(frame_id)
        calibration = path_to_kitti / date
        velodyne = path_to_kitti\
            / date\
            / drive_id\
            / "velodyne_points"\
            / "data"\
            / "{:010d}.bin".format(frame_id)
        ground.append(
            generate_depth_map(
                calibration,
                velodyne,
                2,
                True).astype(np.float32))
    np.savez_compressed(
        path_to_split / "depths.npz",
        data=np.array(ground, dtype=object))


def readlines(path):
    """Read all the lines in a text file and return as a list.
    Args:
        path (pathlib.Path): The path to the input file.
    """
    with open(path, "r") as f:
        lines = f.read().splitlines()
    return lines


def main():
    """A CLI entry point.
    """
    try:
        fire.Fire(generate_kitti_ground_truth)
    except Exception:
        print(format_exc(), file=sys.stderr)
