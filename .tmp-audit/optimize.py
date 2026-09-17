from PIL import Image
import os
import sys

BG = (243, 243, 243)

DIFF_BUDGET = 2.0  # rata-rata selisih per kanal pada ukuran tampil; di bawah ini tak terlihat


def flatten(im, bg=BG):
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        base = Image.new('RGB', im.size, bg)
        base.paste(im, mask=im.split()[-1])
        return base
    return im.convert('RGB')


def fit(bw, bh, w, h):
    s = min(bw / w, bh / h)
    return max(1, round(w * s)), max(1, round(h * s))


def diff_at(a, b, size):
    A = flatten(a).resize(size, Image.LANCZOS)
    B = flatten(b).resize(size, Image.LANCZOS)
    pa, pb = list(A.getdata()), list(B.getdata())
    return sum(abs(x - y) for p, q in zip(pa, pb) for x, y in zip(p, q)) / (len(pa) * 3)


def encode(im, quality):
    out = im.convert('RGBA') if im.mode in ('RGBA', 'LA', 'P') else im.convert('RGB')
    out.save('.tmp-audit/cand.webp', 'WEBP', quality=quality, method=6, alpha_quality=90)


def big_diff_ratio(a, b, size):
    """Persentase piksel yang berbeda cukup jauh (>60) pada ukuran tampil."""
    A = flatten(a).resize(size, Image.LANCZOS)
    B = flatten(b).resize(size, Image.LANCZOS)
    pa, pb = list(A.getdata()), list(B.getdata())
    big = sum(1 for p, q in zip(pa, pb) if max(abs(x - y) for x, y in zip(p, q)) > 60)
    return 100 * big / len(pa)


def best_candidate(orig_path, target_size, render_size, downsample_to=None):
    """Kembalikan (path_kandidat, quality, diff, bytes) terkecil dengan diff < budget."""
    original = Image.open(orig_path)
    work = original
    if downsample_to and max(work.size) > downsample_to:
        s = downsample_to / max(work.size)
        work = work.resize((max(1, round(work.size[0] * s)), max(1, round(work.size[1] * s))), Image.LANCZOS)

    best = None
    for q in range(60, 95, 5):
        encode(work, q)
        cand = Image.open('.tmp-audit/cand.webp')
        d = diff_at(original, cand, render_size)
        size = os.path.getsize('.tmp-audit/cand.webp')
        if d <= DIFF_BUDGET:
            best = (size, q, d)
            break
        best = (size, q, d)  # simpan sebagai fallback (kualitas tertinggi yang dicoba)

    size, q, d = best
    orig_size = os.path.getsize(orig_path)
    if orig_size < size:
        # versi lama sudah lebih ringan; jangan ganti (tampilan pasti sama)
        return orig_path, None, 0.0, orig_size, True

    encode(work, q)
    return '.tmp-audit/cand.webp', q, d, size, False


def run(items, label, quality=85, cap=None):
    print('== %s (q%d%s) ==' % (label, quality, ', cap %dpx' % cap if cap else ''))
    tot_b = tot_a = 0
    for orig_path, render_size in items:
        before = os.path.getsize(orig_path)
        original = Image.open(orig_path)
        work = original
        if cap and max(work.size) > cap:
            s = cap / max(work.size)
            work = work.resize((max(1, round(work.size[0] * s)), max(1, round(work.size[1] * s))), Image.LANCZOS)
        encode(work, quality)
        size = os.path.getsize('.tmp-audit/cand.webp')
        if size >= before:
            print('  %-30s %6.1f KB  (dibiarkan: hasil baru tidak lebih ringan)' % (os.path.basename(orig_path), before / 1024))
            tot_b += before; tot_a += before
            continue
        d = diff_at(original, Image.open('.tmp-audit/cand.webp'), render_size)
        big = big_diff_ratio(original, Image.open('.tmp-audit/cand.webp'), render_size)
        os.replace('.tmp-audit/cand.webp', orig_path)
        check = Image.open(orig_path)
        print('  %-30s %6.1f KB -> %6.1f KB  mean %.2f | beda>60: %.2f%%  mode=%s'
              % (os.path.basename(orig_path), before / 1024, size / 1024, d, big, check.mode))
        tot_b += before; tot_a += size
    print('  TOTAL %.0f KB -> %.0f KB' % (tot_b / 1024, tot_a / 1024))


if __name__ == '__main__':
    what = sys.argv[1]
    if what == 'logos':
        # kotak tampil 112x64 CSS px; diperiksa pada 3x DPR (336x192 device px)
        items = [('public/logo/logo%d.webp' % i, (336, 192)) for i in range(1, 11)]
        run(items, 'logo bar (kotak tampil 112x64)', quality=85, cap=896)
    elif what == 'toefl':
        # lightbox 340px x 80vh; kartu ~300x380 -> diperiksa pada ~600x760 (2x kartu)
        items = [('public/image/toefl%d.webp' % i, (600, 760)) for i in (1, 2, 3, 4, 5, 6, 7, 9)]
        run(items, 'screenshot skor TOEFL', quality=85)
    elif what == 'review':
        items = [('public/review/Riview (%d).webp' % i, (600, 760)) for i in (1, 2, 3, 4, 19)]
        run(items, 'foto review alumni', quality=85)
