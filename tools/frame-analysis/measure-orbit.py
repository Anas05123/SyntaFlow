import cv2, numpy as np, math
src = r"C:\Users\Anas\.dsh\attachments\v1\files\20\206d09da94842d6f48ab35040da005b7749407936db496c80835fe4fe88eb263\Screen Recording 2026-09-11 041721.mp4"
cap = cv2.VideoCapture(src)
n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)); fps = cap.get(cv2.CAP_PROP_FPS)
w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)); h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fr = []
for fi in range(n):
    ok, f = cap.read()
    if not ok: break
    fr.append(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY).astype(np.float32))
cap.release()

cx, cy = 456.0, 244.0
mx = np.maximum.reduce([np.abs(fr[i]-fr[i-1]) for i in range(1, n)])
# weight per angle, averaged across the ring band
print(f"{'frame':>5} {'t(s)':>6} {'peak angle (deg, cw from top)':>30} {'energy':>8}")
prev=None; unwrapped=[]
for fi in range(1, n):
    d = np.abs(fr[fi]-fr[fi-1])
    best=(0,None)
    for k in range(720):
        a = k*math.pi/360.0
        v=0.0
        for R in (206, 214, 222, 230, 238):
            x=int(round(cx+R*math.cos(a))); y=int(round(cy+R*math.sin(a)))
            if 0<=x<w and 0<=y<h: v += d[y,x]
        if v>best[0]: best=(v,a)
    v,a = best
    # convert to clockwise-from-top
    deg = (math.degrees(a) + 90.0) % 360.0
    unwrapped.append(deg)
    if fi<=12 or fi%8==0:
        print(f"{fi:>5} {fi/fps:>6.2f} {deg:>30.1f} {v:>8.1f}")

un=[unwrapped[0]]
for a in unwrapped[1:]:
    p=un[-1]
    while a<p-180: a+=360
    while a>p+180: a-=360
    un.append(a)
rate=(un[-1]-un[0])/((n-1)/fps)
print(f"\nnet rotation over {(n-1)/fps:.2f}s: {un[-1]-un[0]:.1f} deg")
print(f"rate: {rate:.1f} deg/s  =>  full orbit in {360/abs(rate):.2f}s" if abs(rate)>1 else "essentially static")
