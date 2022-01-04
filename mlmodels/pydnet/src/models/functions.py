""" Tensorflow Functions.
"""

from __future__ import division
import tensorflow as tf
import numpy as np
import numpy.typing as npt
import math


@tf.function
def leaky_relu(x: npt.ArrayLike, alpha: float = 0.2) -> np.ndarray:
    """ Default valued `tf.nn.leaky_relu'.
    """
    return tf.nn.leaky_relu(x, alpha=alpha)


@tf.function
def leaky_conv2d(
    input: tf.Tensor,
    kernel_shape: npt.ArrayLike,
    bias_shape: npt.ArrayLike,
    strides: int = 1,
    relu: bool = True,
    padding: str = "SAME",
    dil: int = 1
) -> np.ndarray:
    """
    """
    weights = tf.get_variable(
        "weights",
        kernel_shape,
        initializer=tf.keras.initializers.GlorotNormal(),
        dtype=tf.float32,
    )
    biases = tf.get_variable(
        "biases",
        bias_shape,
        initializer=tf.keras.initializers.TruncatedNormal(),
        dtype=tf.float32,
    )
    output = tf.nn.conv2d(
        input,
        weights,
        strides=[1, strides, strides, 1],
        padding=padding,
        dilations=[1, dil, dil, 1],
    )
    output = tf.nn.bias_add(output, biases)
    if relu == False:
        return output
    output = leaky_relu(output, 0.2)
    return output


def deconv2d_leaky(
    input, kernel_shape, bias_shape, outputShape, strides=1, relu=True, padding="SAME"
):

    # Conv2D
    weights = tf.get_variable(
        "weights",
        kernel_shape,
        initializer=tf.contrib.layers.xavier_initializer(),
        dtype=tf.float32,
    )
    biases = tf.get_variable(
        "biases",
        bias_shape,
        initializer=tf.truncated_normal_initializer(),
        dtype=tf.float32,
    )
    output = tf.nn.conv2d_transpose(
        input,
        weights,
        output_shape=outputShape,
        strides=[1, strides, strides, 1],
        padding=padding,
    )
    output = tf.nn.bias_add(output, biases)

    # ReLU (if required)
    if relu == False:
        print("WARNING: reLU disabled")
    else:
        output = leaky_relu(output, 0.2)
    return output
