import json, colorsys, os
from PIL import Image
from pathlib import Path

ROOT = Path(r"D:\Coding\markasauthor")
covers = ROOT / "covers"
books = json.loads((ROOT / "majarani-books.json").read_text(encoding="utf-8-sig"))
rich = json.loads(Path(r"C:\Users\bimap\AppData\Local\Temp\opencode\majarani-books-rich.json").read_text(encoding="utf-8-sig"))
rich_map = {b["Title"]: b for b in rich}

def analyze(img_path):
    im = Image.open(img_path).convert("RGB").resize((60, 90))
    px = list(im.getdata())
    n = len(px)
    # avg color (muted by mixing toward gray 15%)
    ar = sum(p[0] for p in px) / n
    ag = sum(p[1] for p in px) / n
    ab = sum(p[2] for p in px) / n
    avg = (ar / 255, ag / 255, 0)
    # dominant saturated color: bucket hue, pick most common non-extreme-light/dark
    sat_buckets = {}
    for (r, g, b) in px:
        h, l, s = colorsys.rgb_to_hls(r/255, g/255, b/255)
        if s < 0.18 or l < 0.08 or l > 0.92:
            continue
        key = int(h * 36)  # 10-degree buckets
        sat_buckets.setdefault(key := key if False else key, []) if False else None
        sat_buckets.setdefault(key, []).append((r, g, b))
    dom = None
    if sat_buckets:
        best = max(sat_buckets.items(), key=lambda kv: len(kv[1]))
        pts = best[1]
        dom = tuple(sum(p[i] for p in pts) / len(pts) / 255 for i in range(3))
    return avg, dom

def hexc(rgb):
    # rgb in 0-1 floats -> clamp + scale to 0-255 hex
    return "#%02x%02x%02x" % tuple(max(0, min(255, int(round(c * 255)))) for c in rgb)

def darken(rgb, f):
    return (rgb[0] * f, rgb[1] * f, rgb[2] * f)

def lighten(rgb, f):
    return (rgb[0] + (1 - rgb[0]) * f, rgb[1] + (1 - rgb[1]) * f, rgb[2] + (1 - rgb[2]) * f)

def sat_boost(rgb, s_min):
    h, l, s = colorsys.rgb_to_hls(*rgb)
    return colorsys.hls_to_rgb(h, l, max(s, s_min))

def mix(a, b, t):
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))

out = []
for i, b in enumerate(books):
    title = b["Title"]
    num = f"{i+1:02d}"
    cover_file = None
    for ext in ("webp", "jpg", "jpeg", "png"):
        p = covers / f"cover-{num}.{ext}"
        if p.exists():
            cover_file = p
            break
    if cover_file is None:
        print(f"NO COVER: {title}")
        continue
    avg, dom = analyze(cover_file)
    # rgb 0-1 tuples; PIL avg was 0-255 for first two -> fix: normalize
    # recompute avg normalized properly
    im = Image.open(cover_file).convert("RGB").resize((60, 90))
    px = list(im.getdata())
    n = len(px)
    avg = (sum(p[0] for p in px)/n/255, sum(p[1] for p in px)/n/255, sum(p[2] for p in px)/n/255)
    base = dom if dom else avg
    # book cloth color: darkened dominant, lifted chroma so cloth reads saturated on the shelf
    book_color = darken(sat_boost(dom if dom else avg, 0.45), 0.62)
    # foil: homebase gold E4B87E, tinted by dominant hue
    foil_ref = (0xe4/255, 0xb8/255, 0x7e/255)
    dom_h, dom_l, dom_s = colorsys.rgb_to_hls(*(dom if dom else avg))
    ref_h, ref_l, ref_s = colorsys.rgb_to_hls(*foil_ref)
    foil = colorsys.hls_to_rgb(dom_h, min(0.62, max(0.42, ref_l * 0.5 + dom_l * 0.5 + 0.08)), max(0.30, ref_s * 0.75 + dom_s * 0.25))
    # room palette: anchor to the author-homebase rose/cream/maroon theme, tinted by dominant hue
    wall = colorsys.hls_to_rgb(dom_h, 0.93, 0.10)
    paper = colorsys.hls_to_rgb(dom_h, 0.965, 0.05)
    paper_deep = colorsys.hls_to_rgb(dom_h, 0.90, 0.10)
    paper_pale = colorsys.hls_to_rgb(dom_h, 0.99, 0.02)
    ink = colorsys.hls_to_rgb(dom_h, 0.20, 0.12)
    ink_soft = colorsys.hls_to_rgb(dom_h, 0.38, 0.10)
    shelf = colorsys.hls_to_rgb(0.99, 0.22, 0.30)
    shelf_dark = colorsys.hls_to_rgb(0.99, 0.13, 0.32)
    light = colorsys.hls_to_rgb(0.09, 0.96, 0.22)
    fill = colorsys.hls_to_rgb(dom_h, 0.82, 0.12)
    r = {
        "id": f"maj-{num}",
        "title": title,
        "roman": str(i+1),
        "discipline": "Novel",
        "note": "",
        "deck": "",
        "binding": "",
        "format": "",
        "theme": "",
        "motif": "",
        "motifKey": ["brackets","paths","caret","orbits","modules","frames","compass"][i % 7],
        "paletteLabel": "",
        "color": hexc(book_color),
        "foil": hexc(foil),
        "palette": {
            "paper": hexc(paper), "paperDeep": hexc(paper_deep), "paperPale": hexc(paper_pale),
            "ink": hexc(ink), "inkSoft": hexc(ink_soft := lighten(avg, 0.55)),
            "wall": hexc(wall), "shelf": hexc(shelf), "shelfDark": hexc(shelf_dark),
            "light": hexc(light), "fill": hexc(fill)
        },
        "coverPath": f"./covers/cover-{num}.{cover_file.suffix[1:]}",
        "width": 1.02, "height": 1.55, "depth": 0.26,
        "chapters": ["Bab", "Alur", "Epilog"],
        "seed": (i + 1) * 7,
        "synopsis": rich_map.get(title, {}).get("Synopsis", ""),
        "chaptersCount": rich_map.get(title, {}).get("Chapters", 0),
        "link": b["Link"],
    }
    out.append(r)

(ROOT / "majarani-generated-books.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"generated {len(out)} book entries with cover-derived palettes")
