"""Heap Module.
"""

import tensorflow.compat.v1 as tf1
import numpy as np


class KITTI(object):
    """KITTI-360 dataset loader.
    """

    def __init__(self, params: dict):
        """Inits `KITTI` with `params`.
        """
        self.workers = 4
        self.h = params["h"]
        self.w = params["w"]
        self.path = params["path"]
        self.slice = np.loadtxt(params["slice"], dtype=bytes).astype(np.str)
        self._build()

    def _build(self) -> None:
        """Builds KITTI dataset from a given `params`.
        """
        dataset = tf1.data.Dataset.from_tensor_slices(
            tf1.convert_to_tensor(self.slice, dtype=tf1.string))
        dataset = dataset.map(
            self._reshape,
            num_parallel_calls=self.workers)
        dataset = dataset.batch(1)
        dataset = dataset.repeat()
        iterator = tf1.data.make_initializable_iterator(dataset)
        self.initializer = iterator.initializer
        self.batch = iterator.get_next()

    def _imread(self, filename: str) -> np.ndarray:
        """Read png file from file system.
        """
        image = tf1.image.decode_png(
            tf1.io.read_file(
                tf1.strings.join([
                    str(self.path.resolve()),
                    "/",
                    filename,
                    ".png"])),
            channels=3)
        image = tf1.cast(image, tf1.float32)
        return image

    def _reshape(self, filename: str) -> np.ndarray:
        """Prepare single image at testing time.
        """
        image = self._imread(filename)
        image = tf1.image.resize_images(
            image,
            [self.h, self.w],
            tf1.image.ResizeMethod.AREA)
        image.set_shape([self.h, self.w, 3])
        image = image / 255.0
        return image
