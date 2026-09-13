import cv2, os, sys
src = r"C:\Users\Anas\.dsh\attachments\v1\files\20\206d09da94842d6f48ab35040da005b7749407936db496c80835fe4fe88eb263\Screen Recording 2026-09-11 041721.mp4"
out = r"C:\Users\Anas\Desktop\CoreDesk\.video-frames"
os.makedirs(out, exist_ok=True)
cap = cv2.VideoCapture(src)
n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
fps = cap.get(cv2.CAP_PROP_FPS)
w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)); h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
print(f"frames={n} fps={fps:.2f} size={w}x{h} duration={n/max(fps,1):.2f}s")
# sample 12 evenly spaced frames
idxs = [int(i*(n-1)/11) for i in range(12)] if n > 1 else [0]
for k, fi in enumerate(idxs):
    cap.set(cv2.CAP_PROP_POS_FRAMES, fi)
    ok, frame = cap.read()
    if not ok: continue
    p = os.path.join(out, f"f{k:02d}_{fi:04d}.png")
    cv2.imwrite(p, frame)
    print("wrote", os.path.basename(p))
cap.release()
