pydnet
==============================

PydNet: Single inference using TensorFlow 2.7.0 and python 3.x.

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

 - If you want to test the solution on the KITTI dataset, you can download it by running the following command:

```bash
 $ make kitti
 $ make groundtruth
```


some useful utility commands are installed
along with the package. [This notebook](./notebook/large_file_test.ipynb) illustrates how to use them.

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
