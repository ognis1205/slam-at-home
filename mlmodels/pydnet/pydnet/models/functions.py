""" Tensorflow Functions.
"""

import tensorflow as tf
import numpy as np
from typing import Sequence


def leaky_relu(x: Sequence, alpha: float = 0.2) -> np.ndarray:
    """Default valued `tf.nn.leaky_relu'.
    """
    return tf.nn.leaky_relu(x, alpha=alpha)


def leaky_conv2d(
    input: tf.Tensor,
    kernel_shape: Sequence,
    bias_shape: Sequence,
    strides: int = 1,
    with_relu: bool = True,
    padding: str = "SAME",
    dil: int = 1
) -> np.ndarray:
    """2-D convolution with a Leaky ReLU activation function.
    """
    weights = tf.get_variable(
        "weights",
        kernel_shape,
        initializer=tf.contrib.layers.xavier_initializer(),
        dtype=tf.float32)
    biases = tf.get_variable(
        "biases",
        bias_shape,
        initializer=tf.truncated_normal_initializer(),
        dtype=tf.float32)
    output = tf.nn.conv2d(
        input,
        weights,
        strides=[1, strides, strides, 1],
        padding=padding,
        dilations=[1, dil, dil, 1])
    output = tf.nn.bias_add(output, biases)
    if not with_relu:
        return output
    output = leaky_relu(output, 0.2)
    return output


def leaky_deconv2d(
    input: tf.Tensor,
    kernel_shape: Sequence,
    bias_shape: Sequence,
    output_shape: Sequence,
    strides: int = 1,
    with_relu: bool = True,
    padding: str = "SAME"
) -> np.ndarray:
    """2-D deconvolution with a Leaky ReLU activation function.
    """
    weights = tf.get_variable(
        "weights",
        kernel_shape,
        initializer=tf.contrib.layers.xavier_initializer(),
        dtype=tf.float32)
    biases = tf.get_variable(
        "biases",
        bias_shape,
        initializer=tf.truncated_normal_initializer(),
        dtype=tf.float32)
    output = tf.nn.conv2d_transpose(
        input,
        weights,
        output_shape=output_shape,
        strides=[1, strides, strides, 1],
        padding=padding)
    output = tf.nn.bias_add(output, biases)
    if not with_relu:
        return output
    output = leaky_relu(output, 0.2)
    return output


def leaky_dilated_conv2d(
    input: tf.Tensor,
    kernel_shape: Sequence,
    bias_shape: Sequence,
    scope_name: str,
    rate: int = 1,
    with_relu: bool = True,
    padding: str = "SAME"
) -> np.ndarray:
    """2-D dilated convolution with a Leaky ReLU activation function.
    """
    with tf.variable_scope(scope_name):
        weights = tf.get_variable(
            "weights",
            kernel_shape,
            initializer=tf.contrib.layers.xavier_initializer())
        biases = tf.get_variable(
            "biases",
            bias_shape,
            initializer=tf.truncated_normal_initializer())
        output = tf.nn.atrous_conv2d(
            input,
            weights,
            rate=rate,
            padding=padding)
        output = tf.nn.bias_add(output, biases)
        if not with_relu:
            return output
        output = leaky_relu(output, 0.2)
        return output


def bilinear_upsampling_by_deconvolution(input: tf.Tensor) -> np.ndarray:
    """ Bilinear upsampling with deconvolution.
    """
    shape = input.get_shape().as_list()
    h = shape[1] * 2
    w = shape[2] * 2
    return leaky_deconv2d(
        input,
        [2, 2, shape[3], shape[3]],
        shape[3],
        [shape[0], h, w, shape[3]],
        2,
        True)


def bilinear_upsampling_by_convolution(input: tf.Tensor) -> np.ndarray:
    """ Bilinear upsampling with convolution.
    """
    with tf.variable_scope("bilinear_upsampling_by_convolution"):
        shape = input.get_shape().as_list()
        h = shape[1] * 2
        w = shape[2] * 2
        channels = shape[3]
        output = tf.image.resize(input, [h, w])
        return leaky_conv2d(
            output,
            [2, 2, channels, channels],
            [channels])
