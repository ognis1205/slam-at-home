"""Google Drive Download CLI.
"""

import sys
import fire
import requests
from traceback import format_exc
from pathlib import Path
from tqdm import tqdm
from tempfile import NamedTemporaryFile
from zipfile import ZipFile


def download_google_drive(drive_id, path):
    """Downloads a content from Google drive specified by a given id.
    Args:
        drive_id (str): The Google drive identifier.
        path (str): The path to the output file.
    """
    URL = "https://docs.google.com/uc?export=download"
    session = requests.Session()
    response = session.get(
        URL,
        params = { "id" : drive_id },
        stream = True)
    token = get_token(response)
    if token:
        response = session.get(
            URL, 
            params = { "id" : drive_id, 'confirm' : token },
            stream = True)
    save(response, Path(path))


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
        with ZipFile(Path(tmp.name), "r") as zipped:
            path.mkdir(parents=True, exist_ok=True)
            zipped.extractall(path)


if __name__ == "__main__":
    """A CLI entry point.
    """
    try:
        fire.Fire(download_google_drive)
    except Exception:
        print(format_exc(), file=sys.stderr)
