"""Memory Usage Module.
"""

import math
import sys
import fire
import psutil
from traceback import format_exc


class MemUsage(object):
    """Snapshot of memory usage.

    This class provides the following memory usage information:
        * total    : The size of total memory in bytes.
        * used     : The size of used memory in bytes.
        * available: The size of available memory in bytes.
    """

    def __init__(self):
        """Inits `MemUsgae` by providing a `psutil.virtual_memory` instance.
        """
        self._mem_info = psutil.virtual_memory()

    def total(self):
        """Displays a total memory size in bytes.
        """
        print(self._with_si_unit(self._mem_info.total))

    def used(self):
        """Displays a used memory size in bytes.
        """
        print(self._with_si_unit(self._mem_info.used))

    def available(self):
        """Displays an available memory size in bytes.
        """
        print(self._with_si_unit(self._mem_info.available))

    def _with_si_unit(self, bytes):
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


def main():
    """A CLI entry point.
    """
    try:
        fire.Fire(MemUsage)
    except Exception:
        print(format_exc(), file=sys.stderr)
