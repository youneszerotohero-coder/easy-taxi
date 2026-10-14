"""
Builds the responsive photo set in public/images from Unsplash originals.

For every photo it writes:
  <name>-640.webp, <name>-1080.webp  — for phones / cards
  <name>.webp                         — the full version (1600px wide, 2000px for full-screen photos)
and src/data/images.json with the widths available for each photo (read by src/lib/img.js for srcset).

Run:  python scripts/images.py
"""
import io
import json
import os
import urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'images')
MANIFEST = os.path.join(ROOT, 'src', 'data', 'images.json')

# name -> Unsplash photo id
PHOTOS = {
    'hero-luxury-car': '1485291571150-772bcfc10da5',
    'driver-hands': '1449965408869-eaa3f722e40d',
    'woman-exit-car': '1698840059740-ba83e510733b',
    'airport-traveller': '1530521954074-e64f6810b32d',
    'airport-silhouettes': '1561131668-f63504fc549d',
    'airport-plane': '1542296332-2e4473faf563',
    'airport-sunset': '1570114581742-586696237de1',
    'hospital-building': '1586773860418-d37222d8fce3',
    'hospital-lobby': '1519494026892-80bbd2d6fd0d',
    'care-walker': '1584797802294-190bd128cc83',
    'care-nurse': '1765896387387-0538bc9f997e',
    'care-caregiver': '1773227055624-07b515ba87c5',
    'disneyland-paris': '1605443790760-18c6121939d3',
    'highway-night': '1516319915504-015b432d407c',
    'city-trails': '1504908575118-28cceb8134c0',
    'highway-dusk': '1741122433084-002301210c13',
    'rear-seats': '1770290405640-5daf7593c92a',
    'luggage-chauffeur': '1772468237159-674f05233185',
    'luggage-couple': '1772466669620-310c35f9deb2',
    'paris-champs': '1641503855609-5e28a1ed35a9',
    'paris-street': '1605911567439-4e01223fcb23',
    'station': '1585585828599-461a0419b788',
    'mercedes-grille': '1660108373105-4ebb16096b29',
    'mercedes-front': '1592309905620-e5b59f6dcb98',
    'taxi-signs': '1638366174129-e83938733381',
}

# Photos shown edge to edge (hero, banners, page heads) get a larger top size
FULL_BLEED = {'hero-luxury-car', 'highway-dusk', 'highway-night', 'city-trails'}
SMALL = (640, 1080)
# Dark, blurry, covered by gradients — compresses hard without visible loss
LOW_QUALITY = {'hero-luxury-car': 70, 'city-trails': 64, 'highway-dusk': 66, 'highway-night': 66}


def fetch(photo_id, width):
    url = f'https://images.unsplash.com/photo-{photo_id}?w={width}&q=85&fm=jpg&fit=max'
    with urllib.request.urlopen(url) as r:
        return Image.open(io.BytesIO(r.read())).convert('RGB')


def save(im, path, width, quality):
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(path, 'WEBP', quality=quality, method=6)
    return im.width


def main():
    manifest = {}
    total = 0
    for name, photo_id in PHOTOS.items():
        top = 2000 if name in FULL_BLEED else 1600
        src = fetch(photo_id, top)
        q = LOW_QUALITY.get(name, 74)
        steps = SMALL + ((1600,) if name in FULL_BLEED else ())
        widths = []
        for w in steps:
            if w < src.width:
                widths.append(save(src, os.path.join(OUT, f'{name}-{w}.webp'), w, min(q, 72)))
        widths.append(save(src, os.path.join(OUT, f'{name}.webp'), top, q))
        manifest[name] = widths
        size = sum(os.path.getsize(os.path.join(OUT, f'{name}-{w}.webp')) for w in widths[:-1]) + os.path.getsize(os.path.join(OUT, f'{name}.webp'))
        total += size
        print(f'{name:22s} {widths}')
    with open(MANIFEST, 'w', encoding='utf8') as f:
        json.dump(manifest, f, indent=2)
    print('done,', total // 1024, 'KB for all sizes')


if __name__ == '__main__':
    main()
