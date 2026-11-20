import numpy as np, glob, os
from PIL import Image
SRC='/mnt/user-data/outputs/synchronicity_v12/assets/portraits_v63/'
PAD=26
GREY=('neutral','afraid','stressed')
def halftone(h,w,cov,x0):
  # a 45-degree dot screen, period 4px, dot size from coverage (0..1)
  yy,xx=np.mgrid[0:h,0:w].astype(float); xx+=x0
  u=(xx+yy)/np.sqrt(2); v=(xx-yy)/np.sqrt(2); P=3.2
  du=(u%P)-P/2; dv=(v%P)-P/2; d=np.sqrt(du*du+dv*dv)
  return d < np.sqrt(np.clip(cov,0,1))*P*.6
def rgb2hsv(a):
  r,g,b=a[...,0]/255,a[...,1]/255,a[...,2]/255; mx=np.max(a/255,2); mn=np.min(a/255,2); s=np.where(mx>0,(mx-mn)/np.maximum(mx,1e-6),0)
  d=np.maximum(mx-mn,1e-6); hh=np.where(mx==r,((g-b)/d)%6,np.where(mx==g,(b-r)/d+2,(r-g)/d+4))/6
  return hh,s,mx
def widen(path):
  a=np.array(Image.open(path).convert('RGB')).astype(float); h,w,_=a.shape; emo=path.split('_')[-1][:-4]
  W=np.zeros((h,w+2*PAD,3)); W[:,PAD:PAD+w]=a
  yy=np.arange(h)
  if emo in GREY:
    lum=a.mean(2)
    for side,cs,x0 in [(0,slice(0,14),0),(1,slice(w-14,w),PAD+w)]:
      c=lum[:40,cs]; base=np.percentile(c,92); cov=float(np.clip((base-c.mean())/max(base,1),0,.9))
      cov=np.full((h,PAD),cov)*np.linspace(1.15,1,PAD)[None,:] if side==0 else np.full((h,PAD),cov)*np.linspace(1,1.15,PAD)[None,:]
      dots=halftone(h,PAD,cov,x0); strip=np.where(dots[...,None],18,base)*np.ones(3)
      W[:,x0:x0+PAD]=strip
  else:
    hh,s,v=rgb2hsv(a)
    bg=(s>.5)&(v>.45)
    # the cell's own background hue family (so red bows don't count as background in a blue cell)
    hm=hh[bg]; ang=np.angle(np.mean(np.exp(2j*np.pi*hm))); h0=(ang/(2*np.pi))%1
    dh=np.abs(((hh-h0)+.5)%1-.5); bg&=dh<(.2 if emo in ('happy','ecstatic','manic') else .1)
    if emo in ('happy','ecstatic','manic'): bg&=~((np.minimum(hh,1-hh)<.045)&(v<.9))   # the red bows aren't background
    for side,x0 in [(0,0),(1,PAD+w)]:
      half=bg.copy(); half[:, w//2:]=False if side==0 else half[:, w//2:]
      if side==1: half[:, :w//2]=False
      col=np.full((h,3),np.nan)
      for y in range(h):
        m=half[y]
        if m.sum()>=3: col[y]=np.median(a[y][m],0)
      ok=~np.isnan(col[:,0])
      if ok.sum()<3:   # hardly any background on this side: use the other side's rows
        m2=bg; ok2=[m2[y].sum()>=3 for y in range(h)]
        for y in range(h):
          if ok2[y]: col[y]=np.median(a[y][m2[y]],0)
        ok=~np.isnan(col[:,0])
      idx=np.arange(h)
      for c in range(3): col[:,c]=np.interp(idx,idx[ok],col[ok,c])   # holds the end values: no running off
      from scipy.ndimage import uniform_filter1d
      col=uniform_filter1d(col,31,axis=0,mode='nearest')
      out=np.repeat(col[:,None,:],PAD,1)
      dots=halftone(h,PAD,np.full((h,PAD),.35),x0)
      out=out*np.where(dots[...,None],.82,1.0)
      W[:,x0:x0+PAD]=out
  Image.fromarray(W.clip(0,255).astype(np.uint8)).save(SRC+'wide_'+os.path.basename(path))
for p in sorted(glob.glob(SRC+'color_*.png')): widen(p)
print('ok')
