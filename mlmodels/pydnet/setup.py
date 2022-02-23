from setuptools import setup, find_packages
from pkg_resources import parse_requirements


with open('requirements.txt') as f:
    required = f.read().splitlines()
    print(required)


setup(
    name="pydnet",
    version="0.1.0",
    description="PydNet: Single inference using TensorFlow-1.15 and python 3.7.",
    author="Shingo OKAWA",
    python_requires="==3.7.*",
    install_requires=required,
    entry_points={
        "console_scripts": [
            "pydnet_kitti_ground_truth = pydnet.cli.generate_kitti_ground_truth:main",
            "pydnet_mlmodel = pydnet.cli.export_mlmodel:main",
            "pydnet_update_mlmodel = pydnet.cli.update_mlmodel:main",
        ],
    },
    packages=find_packages(exclude=["test", "test.*"]))
