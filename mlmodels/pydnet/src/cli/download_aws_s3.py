"""AWS S3 Download Module.
"""

import sys
import fire
import requests
from traceback import format_exc
from pathlib import Path
from tqdm import tqdm
from tempfile import NamedTemporaryFile
from zipfile import ZipFile

def download_aws_s3(region, path, destination):
    """Downloads a content from AWS S3 specified by a given path.
    Args:
        region (str): AWS S3 region.
        path (str): path to the target file.
        destination (str): The path to the output file.
    """
    URL = f"https://{region}/{path}"
    session = requests.Session()
    response = session.get(
        URL,
        stream = True)
    save(response, Path(destination))


def save(response, path):
    """Saves downloaded content.
    Args:
        response (requests.Responce): GET response.
        path (pathlib.Path): The path to the output file.
    """
    CHUNK_SIZE = 32768
    total_size = int(response.headers.get('content-length', 0))
    progress = tqdm(total=total_size, unit="iB", unit_scale=True)
    with NamedTemporaryFile() as tmp:
        for chunk in response.iter_content(CHUNK_SIZE):
            if chunk:
                progress.update(len(chunk))
                tmp.write(chunk)
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
