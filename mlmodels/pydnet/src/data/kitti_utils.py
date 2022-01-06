"""KITTI-360 utility functions.
"""

import os
from pathlib import Path
import numpy as np
import numpy.typing as npt
from collections import Counter
from typing import IO, Union


def read_velodyne_points(path: Union[str, Path]) -> np.ndarray:
    """Reads 3D point cloud from KITTI file format.
    """
    points = np.fromfile(path, dtype=np.float32).reshape(-1, 4)
    points[:, 3] = 1.0
    return points


def read_calibration(path: Union[str, Path]) -> object:
    """Reads KITTI calibration file.
    """
    float_chars = set("0123456789.e+- ")
    calibration = {}
    with open(path, "r") as f:
        for line in f.readlines():
            k, v = line.split(':', 1)
            v = v.strip()
            calibration[k] = v
            if float_chars.issuperset(v):
                try:
                    calibration[k] = np.array(list(map(float, v.split(' '))))
                except ValueError:
                    pass
    return calibration


def sub2ind(shape: npt.ArrayLike, row: int, col: int) -> int:
    """Converts row, col matrix subscripts to linear indices.
    """
    m, n = shape
    return row * (n - 1) + col - 1


def generate_depth_map(
    calibration: Path,
    velodyne: Path,
    cam: int = 2,
    vel_depth: bool = False
) -> np.ndarray:
    """Generates a depth map from velodyne data.
    """
    # Read calibration files.
    cam2cam = read_calibration(calibration / "calib_cam_to_cam.txt")
    vel2cam = read_calibration(calibration / "calib_velo_to_cam.txt")
    vel2cam = np.hstack((vel2cam['R'].reshape(3, 3), vel2cam['T'][..., np.newaxis]))
    vel2cam = np.vstack((vel2cam, np.array([0, 0, 0, 1.0])))

    # Get image shape.
    im_shape = cam2cam["S_rect_02"][::-1].astype(np.int32)

    # Compute projection matrix velodyne->image plane.
    R_cam2rect = np.eye(4)
    R_cam2rect[:3, :3] = cam2cam['R_rect_00'].reshape(3, 3)
    P_rect = cam2cam['P_rect_0'+str(cam)].reshape(3, 4)
    P_vel2im = np.dot(np.dot(P_rect, R_cam2rect), vel2cam)

    # Load velodyne points and remove all behind image plane (approximation).
    # Each row of the velodyne data is forward, left, up, reflectance.
    velo = read_velodyne_points(velodyne)
    velo = velo[velo[:, 0] >= 0, :]

    # Project the points to the camera.
    velo_pts_im = np.dot(P_vel2im, velo.T).T
    velo_pts_im[:, :2] = velo_pts_im[:, :2] / velo_pts_im[:, 2][..., np.newaxis]
    if vel_depth:
        velo_pts_im[:, 2] = velo[:, 0]

    # Check if in bounds.
    # Use minus 1 to get the exact same value as KITTI matlab code.
    velo_pts_im[:, 0] = np.round(velo_pts_im[:, 0]) - 1
    velo_pts_im[:, 1] = np.round(velo_pts_im[:, 1]) - 1
    val_inds = (velo_pts_im[:, 0] >= 0) & (velo_pts_im[:, 1] >= 0)
    val_inds = val_inds & (velo_pts_im[:, 0] < im_shape[1]) & (velo_pts_im[:, 1] < im_shape[0])
    velo_pts_im = velo_pts_im[val_inds, :]

    # Project to image.
    depth = np.zeros((im_shape[:2]))
    depth[velo_pts_im[:, 1].astype(np.int), velo_pts_im[:, 0].astype(np.int)] = velo_pts_im[:, 2]

    # Find the duplicate points and choose the closest depth.
    inds = sub2ind(depth.shape, velo_pts_im[:, 1], velo_pts_im[:, 0])
    dupe_inds = [item for item, count in Counter(inds).items() if count > 1]
    for dd in dupe_inds:
        pts = np.where(inds == dd)[0]
        x_loc = int(velo_pts_im[pts[0], 0])
        y_loc = int(velo_pts_im[pts[0], 1])
        depth[y_loc, x_loc] = velo_pts_im[pts, 2].min()
    depth[depth < 0] = 0

    return depth
