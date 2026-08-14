#!/usr/bin/env python3
"""
Builds the Scripture-manuscript background texture.

    python3 scripts/build-texture.py assets/texture-scripture-source.png

The source is white handwriting on transparency, but it is not sparse: about
99% of pixels carry *some* alpha, most of it a faint haze below 64, with the
actual pen strokes above it. Recolouring that as-is would wash the whole page
in flat ink rather than showing handwriting.

So the alpha is curved instead of copied: everything under the floor is
discarded, and what remains is rescaled into a narrow band. The result reads
as writing pressed into the page — a watermark you notice on the second look,
not a pattern competing with the text sitting on top of it.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pnglib  # noqa: E402

INK = (0x2E, 0x1C, 0x10)   # warm manuscript ink, not black
FLOOR = 42                 # below this the source is haze, not stroke
CEILING = 40               # peak opacity of the finished watermark


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else None
    if not src:
        sys.exit("usage: build-texture.py <white-script.png>")

    w, h, c, px = pnglib.read(src)
    if c != 4:
        sys.exit(f"expected RGBA, got {c} channels")

    span = 255 - FLOOR
    kept = 0
    for i in range(0, len(px), 4):
        a = px[i + 3]
        if a <= FLOOR:
            px[i + 3] = 0
            continue
        # Curve the survivors into the watermark band. The exponent leans on
        # the darker strokes so the writing keeps its shape as it fades.
        t = (a - FLOOR) / span
        px[i + 3] = int((t ** 0.75) * CEILING)
        px[i], px[i + 1], px[i + 2] = INK
        kept += 1

    dest = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "texture-scripture.png")
    pnglib.write(dest, w, h, 4, px)
    print(f"kept {kept} stroke px ({100 * kept / (w * h):.1f}%), inked and curved")
    print(f"wrote {os.path.normpath(dest)}")


if __name__ == "__main__":
    main()
