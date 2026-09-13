import cv2, os
src = r"C:\Users\Anas\.dsh\attachments\v1\files\a3\a36c645203b2ffff2476e699a8210fc9cf05c297bd3f84e3f5f2b6ce1867c1a6\20260910-2039-32.5690553.mp4"
out = r"C:\Users\Anas\Desktop\CoreDesk\.video-frames2"
os.makedirs(out, exist_ok=True)
cap = cv2.VideoCapture(src)
n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)); fps = cap.get(cv2.CAP_PROP_FPS)
w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)); h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
print(f"frames={n} fps={fps:.2f} size={w}x{h} duration={n/max(fps,1):.2f}s")
idxs = [int(i*(n-1)/9) for i in range(10)] if n>1 else [0]
for k, fi in enumerate(idxs):
    cap.set(cv2.CAP_PROP_POS_FRAMES, fi)
    ok, f = cap.read()
    if not ok: continue
    cv2.imwrite(os.path.join(out, f"f{k:02d}_{fi:04d}.png"), f)
    print("wrote", f"f{k:02d}_{fi:04d}.png")
cap.release()
