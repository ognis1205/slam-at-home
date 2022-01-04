"""Download Module.
"""

import sys
import fire
import requests
from traceback import format_exc
from pathlib import Path
from tempfile import NamedTemporaryFile
from zipfile import ZipFile

def download(id, destination):
    """Downloads a content from Google drive specified by a given id.
    Args:
        id (str): The Google drive identifier.
        destination (str): The path to the output file.
    """
    URL = "https://docs.google.com/uc?export=download"
    session = requests.Session()
    response = session.get(URL, params = { 'id' : id }, stream = True)
    token = get_token(response)
    if token:
        params = { 'id' : id, 'confirm' : token }
        response = session.get(URL, params = params, stream = True)
    save(response, Path(destination))


def get_token(response):
    """Returns the confirmation token.
    Args:
        response (requests.Responce): GET response.
    Returns:
        str: A confirmation token string.
    """
    for key, value in response.cookies.items():
        if key.startswith('download_warning'):
            return value
    return None


def save(response, path):
    """Returns the confirmation token.
    Args:
        response (requests.Responce): GET response.
        path (pathlib.Path): The path to the output file.
    """
    CHUNK_SIZE = 32768
#    with path.open("wb") as f, NamedTemporaryFile() as tmp:
    with NamedTemporaryFile() as tmp:
        for chunk in response.iter_content(CHUNK_SIZE):
            if chunk:
                tmp.write(chunk)
        with ZipFile(Path(tmp.name), "r") as zipped:
            path.mkdir(parents=True, exist_ok=True)
            zipped.extractall(path)


def main():
    """A CLI entry point.
    """
    try:
        fire.Fire(download)
    except Exception:
        print(format_exc(), file=sys.stderr)
