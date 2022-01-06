"""Memory Usage CLI.
"""

import math
import sys
import fire
import psutil
from traceback import format_exc


def mem_usage():
    """Snapshot of memory usage.
    """
    mem_info = psutil.virtual_memory()
    print("total: ", with_si_unit(mem_info.total))
    print("used: ", with_si_unit(mem_info.used))
    print("available: ", with_si_unit(mem_info.available))


def with_si_unit(bytes):
    """Converts a given `int` into a `str` with an appropriate SI unit.
    Args:
        bytes (int): An `int` to be converted.
    Returns:
        str: A formatted `str` representing memory usage.
    """
    if bytes == 0:
        return "0 B"
    units = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
    i = int(math.floor(math.log(bytes, 1024)))
    s = round(bytes / math.pow(1024, i), 2)
    return "{} {}".format(s, units[i])


if __name__ == "__main__":
    """A CLI entry point.
    """
    try:
        fire.Fire(mem_usage)
    except Exception:
        print(format_exc(), file=sys.stderr)
