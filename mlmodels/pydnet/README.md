pydnet
==============================

PydNet: Single inference using TensorFlow 2.7.0 and python 3.x.

* [Real-time single image depth perception in the wild with handheld devices, Arxiv](https://arxiv.org/pdf/2006.05724.pdf)
* [PyDNet paper](https://arxiv.org/pdf/1806.11430.pdf)
* [PyDNet code](https://github.com/mattpoggi/pydnet)

Installation
------------
 - You can install *pydnet* with *pip*, run the following command in the project root directory:

```bash
 $ make install
```

 - If you want to use the official pretrained model, you can download it by running the following command:

```bash
 $ make pretrained
```

 - If you want to test the model on the KITTI dataset, you can download it by running the following command.
   **This operation may take a long time, say, hours and eats up your storage (184 GB)**:

```bash
 $ make kitti
 $ make groundtruth
```

 - After installing the model and downloading the dataset, you can run evaluation scripts like [this notebook](./notebooks/Test%20KITTI%20Dataset.ipynb) and [this notebook](./notebooks/Test%20Pexel%20Images.ipynb).

Export Model
------------

Project Organization
------------

    ├── LICENSE
    ├── Makefile           <- Makefile with commands like `make install` or `make kitti`.
    ├── README.md          <- The top-level README.
    ├── data
    │   ├── checkpoint     <- Pretrained models' data.
    │   ├── kitti          <- KITTI/360 dataset file names.
    │   ├── mount          <- The mount position to download the dataset.
    │   └── slices         <- The slice indices for test.
    ├── models             <- Trained and serialized model.
    ├── notebooks          <- Jupyter notebooks. This directory includes test scripts.
    ├── references         <- PydNet thesis.
    ├── reports
    │   └── figures        <- Generated graphics and figures to be used in reporting.
    ├── requirements.txt   <- The requirements file for reproducing the analysis environment.
    ├── setup.py           <- Makes project pip installable (pip install -e .) so src can be imported.
    ├── src                <- Source code for use in this project.
    └── tox.ini            <- tox file with settings for running tox; see tox.readthedocs.io
