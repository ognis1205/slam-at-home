""" Tensorflow Functions.
"""

import tensorflow.compat.v1 as tf1
import tensorflow as tf2
import numpy as np
import numpy.typing as npt


def leaky_relu(x: npt.ArrayLike, alpha: float = 0.2) -> np.ndarray:
    """Default valued `tf.nn.leaky_relu'.
    """
    return tf1.nn.leaky_relu(x, alpha=alpha)


def leaky_conv2d(
    input: tf1.Tensor,
    kernel_shape: npt.ArrayLike,
    bias_shape: npt.ArrayLike,
    strides: int = 1,
    with_relu: bool = True,
    padding: str = "SAME",
    dil: int = 1
) -> np.ndarray:
    """2-D convolution with a Leaky ReLU activation function.
    """
    weights = tf1.get_variable(
        "weights",
        kernel_shape,
        initializer=tf2.initializers.GlorotUniform(),
        dtype=tf1.float32)
    biases = tf1.get_variable(
        "biases",
        bias_shape,
        initializer=tf1.truncated_normal_initializer(),
        dtype=tf1.float32)
    output = tf1.nn.conv2d(
        input,
        weights,
        strides=[1, strides, strides, 1],
        padding=padding,
        dilations=[1, dil, dil, 1])
    output = tf1.nn.bias_add(output, biases)
    if not with_relu:
        return output
    output = leaky_relu(output, 0.2)
    return output


def leaky_deconv2d(
    input: tf1.Tensor,
    kernel_shape: npt.ArrayLike,
    bias_shape: npt.ArrayLike,
    output_shape: npt.ArrayLike,
    strides: int = 1,
    with_relu: bool = True,
    padding: str = "SAME"
) -> np.ndarray:
    """2-D deconvolution with a Leaky ReLU activation function.
    """
    weights = tf1.get_variable(
        "weights",
        kernel_shape,
        initializer=tf2.keras.initializers.GlorotNormal(),
        dtype=tf1.float32)
    biases = tf1.get_variable(
        "biases",
        bias_shape,
        initializer=tf1.truncated_normal_initializer(),
        dtype=tf1.float32)
    output = tf1.nn.conv2d_transpose(
        input,
        weights,
        output_shape=output_shape,
        strides=[1, strides, strides, 1],
        padding=padding)
    output = tf1.nn.bias_add(output, biases)
    if not with_relu:
        return output
    output = leaky_relu(output, 0.2)
    return output


def leaky_dilated_conv2d(
    input: tf1.Tensor,
    kernel_shape: npt.ArrayLike,
    bias_shape: npt.ArrayLike,
    scope_name: str,
    rate: int = 1,
    with_relu: bool = True,
    padding: str = "SAME"
) -> np.ndarray:
    """2-D dilated convolution with a Leaky ReLU activation function.
    """
    with tf1.variable_scope(scope_name):
        weights = tf1.get_variable(
            "weights",
            kernel_shape,
            initializer=tf2.keras.initializers.GlorotNormal())
        biases = tf1.get_variable(
            "biases",
            bias_shape,
            initializer=tf1.truncated_normal_initializer())
        output = tf1.nn.atrous_conv2d(
            input,
            weights,
            rate=rate,
            padding=padding)
        output = tf1.nn.bias_add(output, biases)
        if not with_relu:
            return output
        output = leaky_relu(output, 0.2)
        return output


def bilinear_upsampling_by_deconvolution(input: tf1.Tensor) -> np.ndarray:
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


def bilinear_upsampling_by_convolution(input: tf1.Tensor) -> np.ndarray:
    """ Bilinear upsampling with convolution.
    """
    with tf1.variable_scope("bilinear_upsampling_by_convolution"):
        shape = input.get_shape().as_list()
        h = shape[1] * 2
        w = shape[2] * 2
        channels = shape[3]
        output = tf1.image.resize(input, [h, w])
        return leaky_conv2d(
            output,
            [2, 2, channels, channels],
            [channels])
