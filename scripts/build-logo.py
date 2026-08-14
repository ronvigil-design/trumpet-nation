#!/usr/bin/env python3
"""
Builds the Trumpet Nation emblem assets from the white master artwork.

    python3 scripts/build-logo.py assets/logo-source-white.png

The supplied white silhouette is clean — the alpha channel carries the
antialiasing and the artwork itself is neutral — so there is nothing to
repair. It only needs colour.

Rather than flood-fill a flat gold, the mark is tinted through a vertical
gradient so it reads as struck metal: bright across the upper third where
light would catch a raised die, mid gold through the middle, and darker at
the base. That is the same top-lit foil logic used for the wordmark and the
primary buttons in styles.css, so the emblem belongs to the same palette
rather than sitting next to it.

An earlier version of this script repaired a badly-keyed gold export whose
background cut had left red and yellow fringing. That path is gone: keying
from clean white artwork is exact, and the repair was always an
approximation.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pnglib  # noqa: E402

# Top-lit gold. Stops are (position 0-1, r, g, b) and match the --foil and
# --gilt tokens so the emblem and the interface agree on what gold is.
STOPS = [
    (0.00, 0xE0, 0xC0, 0x66),
    (0.20, 0xF6, 0xE8, 0xB4),   # highlight where the die catches light
    (0.44, 0xD4, 0xA8, 0x3C),
    (0.62, 0xC9, 0xA2, 0x27),   # --gilt
    (0.82, 0xA9, 0x7F, 0x1C),   # --gold-deep
    (1.00, 0x7A, 0x5A, 0x0F),   # --foil-lo
]


def gold_at(t):
    if t <= STOPS[0][0]:
        return STOPS[0][1:]
    for (p0, r0, g0, b0), (p1, r1, g1, b1) in zip(STOPS, STOPS[1:]):
        if t <= p1:
            f = (t - p0) / (p1 - p0)
            return (
                int(r0 + (r1 - r0) * f),
                int(g0 + (g1 - g0) * f),
                int(b0 + (b1 - b0) * f),
            )
    return STOPS[-1][1:]


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else None
    if not src:
        sys.exit("usage: build-logo.py <white-artwork.png>")

    w, h, c, px = pnglib.read(src)
    if c != 4:
        sys.exit(f"expected RGBA, got {c} channels")

    # Crop to the artwork so the mark fills its box instead of shrinking
    # inside transparent padding. Kept square so it never distorts.
    top, left, bottom, right = h, w, -1, -1
    for y in range(h):
        row = y * w * 4
        for x in range(w):
            if px[row + x * 4 + 3] > 8:
                if y < top: top = y
                if y > bottom: bottom = y
                if x < left: left = x
                if x > right: right = x
    cw, ch = right - left + 1, bottom - top + 1
    side = max(cw, ch)
    ox, oy = (side - cw) // 2, (side - ch) // 2

    out = bytearray(side * side * 4)
    for y in range(ch):
        s = ((top + y) * w + left) * 4
        d = ((oy + y) * side + ox) * 4
        out[d:d + cw * 4] = px[s:s + cw * 4]

    # Tint. Source luminance modulates the gradient, so any shading in the
    # artwork survives; flat white simply takes the gradient colour.
    for y in range(side):
        r, g, b = gold_at(y / (side - 1))
        row = y * side * 4
        for x in range(side):
            i = row + x * 4
            if out[i + 3] == 0:
                continue
            lum = max(out[i], out[i + 1], out[i + 2]) / 255.0
            out[i] = int(r * lum)
            out[i + 1] = int(g * lum)
            out[i + 2] = int(b * lum)

    assets = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets")
    dest = os.path.join(assets, "logo-master.png")
    pnglib.write(dest, side, side, 4, out)
    print(f"cropped {w}x{h} -> {side}x{side}, tinted gold")
    print(f"wrote {os.path.normpath(dest)}")


if __name__ == "__main__":
    main()
