"""AWS S3 Download CLI.
"""

import sys
import fire
import requests
from traceback import format_exc
from pathlib import Path
from tqdm import tqdm
from tempfile import NamedTemporaryFile
from zipfile import ZipFile


def download_aws_s3(s3_region, s3_path, path):
    """Downloads a content from AWS S3 specified by a given path.
    Args:
        s3_region (str): The AWS S3 region.
        s3_path (str): The path to the target file.
        path (str): The path to the output file.
    """
    URL = f"https://{s3_region}/{s3_path}"
    session = requests.Session()
    response = session.get(
        URL,
        stream = True)
    save(response, Path(path))


def save(response, path):
    """Saves downloaded content.
    Args:
        response (requests.Responce): GET response.
        path (pathlib.Path): The path to the output file.
    """
    CHUNK_SIZE = 32768
    progress = tqdm(
        total=int(response.headers.get('content-length', 0)),
        unit="iB",
        unit_scale=True)
    with NamedTemporaryFile() as tmp:
        for chunk in response.iter_content(CHUNK_SIZE):
            if chunk:
                progress.update(len(chunk))
                tmp.write(chunk)
        tmp.flush()
        with ZipFile(Path(tmp.name), "r") as zipped:
            path.mkdir(parents=True, exist_ok=True)
            zipped.extractall(path)


if __name__ == "__main__":
    """A CLI entry point.
    """
    try:
        fire.Fire(download_aws_s3)
    except Exception:
        print(format_exc(), file=sys.stderr)
