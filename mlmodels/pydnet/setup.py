from setuptools import setup, find_packages
from pkg_resources import parse_requirements


with open('requirements.txt') as f:
    required = f.read().splitlines()
    print(required)


setup(
    name="pydnet",
    version="1.0.0",
    description="PydNet: Single inference using TensorFlow 2 and python 3.x.",
    author="Shingo OKAWA",
    python_requires=">=3.8",
    install_requires=required,
    extras_require = {
        "test": [
            "pytest",
            "notebook"
        ]
    },
    packages=find_packages(exclude=["test", "test.*"]),
    test_suite="test")
