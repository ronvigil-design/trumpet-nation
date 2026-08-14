"""
Minimal PNG read/write on zlib alone.

Pillow is not installed on this machine and the logo needed pixel surgery, so
this decodes 8-bit RGB/RGBA PNGs, un-filters the scanlines, and re-encodes.
It is deliberately small: no interlacing, no palettes, no 16-bit.
"""

import struct
import zlib


def _paeth(a, b, c):
    p = a + b - c
    pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
    if pa <= pb and pa <= pc:
        return a
    return b if pb <= pc else c


def read(path):
    """Return (width, height, channels, bytearray of pixel data)."""
    with open(path, "rb") as fh:
        data = fh.read()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("not a PNG")

    pos, idat, width, height, channels = 8, [], 0, 0, 0
    while pos < len(data):
        (length,) = struct.unpack(">I", data[pos:pos + 4])
        ctype = data[pos + 4:pos + 8]
        body = data[pos + 8:pos + 8 + length]
        pos += 12 + length

        if ctype == b"IHDR":
            width, height, depth, color = struct.unpack(">IIBB", body[:10])
            if depth != 8:
                raise ValueError(f"only 8-bit supported, got {depth}")
            channels = {0: 1, 2: 3, 4: 2, 6: 4}.get(color)
            if channels is None:
                raise ValueError(f"unsupported colour type {color}")
        elif ctype == b"IDAT":
            idat.append(body)
        elif ctype == b"IEND":
            break

    raw = zlib.decompress(b"".join(idat))
    stride = width * channels
    out = bytearray(height * stride)
    prev = bytearray(stride)
    pos = 0
    for y in range(height):
        ftype = raw[pos]
        pos += 1
        line = bytearray(raw[pos:pos + stride])
        pos += stride
        if ftype == 1:
            for i in range(channels, stride):
                line[i] = (line[i] + line[i - channels]) & 0xFF
        elif ftype == 2:
            for i in range(stride):
                line[i] = (line[i] + prev[i]) & 0xFF
        elif ftype == 3:
            for i in range(stride):
                left = line[i - channels] if i >= channels else 0
                line[i] = (line[i] + ((left + prev[i]) >> 1)) & 0xFF
        elif ftype == 4:
            for i in range(stride):
                left = line[i - channels] if i >= channels else 0
                upleft = prev[i - channels] if i >= channels else 0
                line[i] = (line[i] + _paeth(left, prev[i], upleft)) & 0xFF
        elif ftype != 0:
            raise ValueError(f"bad filter {ftype}")
        out[y * stride:(y + 1) * stride] = line
        prev = line
    return width, height, channels, out


def write(path, width, height, channels, pixels):
    color = {1: 0, 2: 4, 3: 2, 4: 6}[channels]
    stride = width * channels
    raw = bytearray()
    for y in range(height):
        raw.append(0)  # filter: None
        raw += pixels[y * stride:(y + 1) * stride]

    def chunk(tag, body):
        return (
            struct.pack(">I", len(body))
            + tag
            + body
            + struct.pack(">I", zlib.crc32(tag + body) & 0xFFFFFFFF)
        )

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, color, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(bytes(raw), 9))
    png += chunk(b"IEND", b"")
    with open(path, "wb") as fh:
        fh.write(png)
