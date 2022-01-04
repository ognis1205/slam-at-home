"""PyDNet Module.
"""

import tensorflow.compat.v1 as tf1
import tensorflow as tf2
from functions import leaky_conv2d, bilinear_upsampling_by_convolution


class Pydnet(object):
    """Tensorflow PyDNet model.

    SEE: https://arxiv.org/abs/1806.11430
    """

    def __init__(self, params):
        """Inits `Pydnet` with `params`.
        """
        self.params = params
        self.height = params["height"]
        self.width = params["width"]
        self.is_training = params["is_training"]
        self.output_nodes = None
        if self.is_training:
            self.scales = params["scales"]

    def forward(self, image):
        """Single forward of the network.
        """
        feat = self.encoder(image)
        pred = self.decoder(feat)
        if not self.is_training:
            self.output_nodes = [self.make_visual(pred)]
        return pred

    def make_visual(self, pred):
        """Makes visual ouput nodes of the model.
        """
        pred = tf1.nn.relu(pred)
        min_depth = tf1.reduce_min(pred)
        max_depth = tf1.reduce_max(pred)
        pred = (pred - min_depth) / (max_depth - min_depth)
        return pred

    def encoder(self, image):
        """Creates PyDNet feature extractor.
        """
        with tf1.variable_scope("encoder"):
            feat = []
            feat.append(image)

            with tf1.variable_scope("conv1a"):
                conv1a = leaky_conv2d(image, [3, 3, 3, 16], [16], 2, True)
            with tf1.variable_scope("conv1b"):
                conv1b = leaky_conv2d(conv1a, [3, 3, 16, 16], [16], 1, True)
            feat.append(conv1b)

            with tf1.variable_scope("conv2a"):
                conv2a = leaky_conv2d(conv1b, [3, 3, 16, 32], [32], 2, True)
            with tf1.variable_scope("conv2b"):
                conv2b = leaky_conv2d(conv2a, [3, 3, 32, 32], [32], 1, True)
            feat.append(conv2b)

            with tf1.variable_scope("conv3a"):
                conv3a = leaky_conv2d(conv2b, [3, 3, 32, 64], [64], 2, True)
            with tf1.variable_scope("conv3b"):
                conv3b = leaky_conv2d(conv3a, [3, 3, 64, 64], [64], 1, True)
            feat.append(conv3b)

            with tf1.variable_scope("conv4a"):
                conv4a = leaky_conv2d(conv3b, [3, 3, 64, 96], [96], 2, True)
            with tf1.variable_scope("conv4b"):
                conv4b = leaky_conv2d(conv4a, [3, 3, 96, 96], [96], 1, True)
            feat.append(conv4b)

            with tf1.variable_scope("conv5a"):
                conv5a = leaky_conv2d(conv4b, [3, 3, 96, 128], [128], 2, True)
            with tf1.variable_scope("conv5b"):
                conv5b = leaky_conv2d(conv5a, [3, 3, 128, 128], [128], 1, True)
            feat.append(conv5b)

            with tf1.variable_scope("conv6a"):
                conv6a = leaky_conv2d(conv5b, [3, 3, 128, 192], [192], 2, True)
            with tf1.variable_scope("conv6b"):
                conv6b = leaky_conv2d(conv6a, [3, 3, 192, 192], [192], 1, True)
            feat.append(conv6b)

            return feat

    def decoder(self, feat):
        """Creates PyDNet decoder.
        """
        with tf1.variable_scope("decoder"):
            with tf1.variable_scope("L6") as scope:
                with tf1.variable_scope("estimator") as scope:
                    conv6 = self.build_estimator(feat[6])
                    pred6 = self.get_disp(conv6)
                with tf1.variable_scope("upsampler") as scope:
                    upconv6 = bilinear_upsampling_by_convolution(conv6)

            with tf1.variable_scope("L5") as scope:
                with tf1.variable_scope("estimator") as scope:
                    conv5 = self.build_estimator(feat[5], upconv6)
                    pred5 = self.get_disp(conv5)
                with tf1.variable_scope("upsampler") as scope:
                    upconv5 = bilinear_upsampling_by_convolution(conv5)

            with tf1.variable_scope("L4") as scope:
                with tf1.variable_scope("estimator") as scope:
                    conv4 = self.build_estimator(feat[4], upconv5)
                    pred4 = self.get_disp(conv4)
                with tf1.variable_scope("upsampler") as scope:
                    upconv4 = bilinear_upsampling_by_convolution(conv4)

            with tf1.variable_scope("L3") as scope:
                with tf1.variable_scope("estimator") as scope:
                    conv3 = self.build_estimator(feat[3], upconv4)
                    pred3 = self.get_disp(conv3)
                with tf1.variable_scope("upsampler") as scope:
                    upconv3 = bilinear_upsampling_by_convolution(conv3)

            with tf1.variable_scope("L2") as scope:
                with tf1.variable_scope("estimator") as scope:
                    conv2 = self.build_estimator(feat[2], upconv3)
                    pred2 = self.get_disp(conv2)
                with tf1.variable_scope("upsampler") as scope:
                    upconv2 = bilinear_upsampling_by_convolution(conv2)

            with tf1.variable_scope("L1") as scope:
                with tf1.variable_scope("estimator") as scope:
                    conv1 = self.build_estimator(feat[1], upconv2)
                    pred1 = self.get_disp(conv1)

            size = [self.height, self.width]

            if not self.is_training:
                with tf1.variable_scope("half"):
                    pred1 = tf1.image.resize_images(pred1, size)
                return pred1

            pred1 = tf1.image.resize_images(pred1, size)
            pred2 = tf1.image.resize_images(pred2, size)
            pred3 = tf1.image.resize_images(pred3, size)

            return [pred1, pred2, pred3]

    def get_disp(self, x):
        """Returns disparity.
        """
        with tf1.variable_scope("get_disp"):
            return leaky_conv2d(x, [3, 3, x.shape[3], 1], [1], 1, False)

    def build_estimator(self, feat, upsampled_disp=None):
        """Creates single scale estimator.
        """
        with tf1.variable_scope("build_estimator"):
            if upsampled_disp is not None:
                disp2 = tf1.concat([feat, upsampled_disp], -1)
            else:
                disp2 = feat
            with tf1.variable_scope("disp-3") as scope:
                disp3 = leaky_conv2d(disp2, [3, 3, disp2.shape[3], 96], [96], 1, True)
            with tf1.variable_scope("disp-4") as scope:
                disp4 = leaky_conv2d(disp3, [3, 3, disp3.shape[3], 64], [64], 1, True)
            with tf1.variable_scope("disp-5") as scope:
                disp5 = leaky_conv2d(disp4, [3, 3, disp4.shape[3], 32], [32], 1, True)
            with tf1.variable_scope("disp-6") as scope:
                disp6 = leaky_conv2d(disp5, [3, 3, disp5.shape[3], 8], [8], 1, True)
            return disp6
