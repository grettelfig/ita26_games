from PIL import Image
import numpy as np
from scipy import ndimage
EM=['happy','ecstatic','manic','sad','depressed','miserable','angry','enraged','furious','neutral','afraid','stressed']
WHO=['caroline','steven','hitori','hikari','uku']
cols=[(165,270),(272,380),(382,482),(484,575),(577,670),(672,767),(768,864),(865,961),(963,1055),(1058,1148),(1150,1241),(1243,1337)]
rows=[(117,267),(282,436),(453,584),(598,730),(745,884)]
im=np.array(Image.open('/mnt/user-data/attachments/ab824e4c-c29d-578b-a419-5b6f48115e30/59656cd2-image.png').convert('RGB')).astype(float)
O='/mnt/user-data/outputs/synchronicity_v12/assets/portraits_v63/'
def hsv(a):
  mx=a.max(2)/255; mn=a.min(2)/255; s=np.where(mx>0,(mx-mn)/np.maximum(mx,1e-6),0); d=np.maximum(mx-mn,1e-6)
  r,g,b=[a[...,i]/255 for i in range(3)]
  h=np.where(mx==r,((g-b)/d)%6,np.where(mx==g,(b-r)/d+2,(r-g)/d+4))/6
  return h,s,mx
def colour_bg(c,ci):
  h,s,v=hsv(c); bgm=(s>.45)&(v>.55); hm=h[bgm]; h0=(np.angle(np.mean(np.exp(2j*np.pi*hm)))/(2*np.pi))%1
  dh=np.abs(((h-h0)+.5)%1-.5); ok=(s>.28)&(v>.3)&(dh<.12)
  if ci<3: ok=(s>.28)&(v>.3)&(h>.07)&(h<.945)   # yellow through pink (the red bows stay)
  okc=ndimage.binary_closing(ok,iterations=1)|ok
  seed=np.zeros_like(ok); seed[:2,:]=seed[-2:,:]=seed[:,:2]=seed[:,-2:]=True
  lab,_=ndimage.label(okc); ids=set(np.unique(lab[seed&okc]))-{0}; bg=np.isin(lab,list(ids))
  bg=ndimage.binary_closing(bg,iterations=2)
  holes=ndimage.binary_fill_holes(bg)&~bg; hl,n=ndimage.label(holes)
  if n: sz=ndimage.sum(holes,hl,range(1,n+1)); bg|=np.isin(hl,[i+1 for i,z in enumerate(sz) if z<40])
  # the halftone dots between the coloured ones (dark specks) count too: close once more inside the bg region
  return bg
S=Image.new('RGB',(12*140,5*140),(60,0,0))
for ri,(y0,y1) in enumerate(rows):
  cells=[im[y0+4:y1-3, x0+4:x1-3].copy() for (x0,x1) in cols]
  masks={}
  for ci in range(9): masks[ci]=colour_bg(cells[ci],ci)
  # the row's typical figure: where most colour cells say "figure"
  T=(96,128); figs=np.mean([np.array(Image.fromarray((~masks[ci]).astype(np.uint8)*255).resize(T[::-1],Image.BILINEAR))/255 for ci in range(9)],0)
  for ci in range(12):
    c=cells[ci]; H,Wd,_=c.shape; lum=c.mean(2)
    if ci<9:
      bg=masks[ci].copy(); h,sat,v=hsv(c); bgm=(sat>.45)&(v>.55); h0=(np.angle(np.mean(np.exp(2j*np.pi*h[bgm])))/(2*np.pi))%1
      dh=np.abs(((h-h0)+.5)%1-.5); stray=(sat>.25)&(v>.28)&((h>.07)&(h<.945) if ci<3 else (dh<.1))
      stray&=~ndimage.binary_erosion(~bg,iterations=5)   # leftover background colour near the outline (not inside the face)
      bg|=ndimage.binary_dilation(stray,iterations=1)&(c.mean(2)>60)|stray
      # enclosed patches of background (between hair and shoulders): strongly coloured pixels anywhere, and the dots among them
      strong=(sat>.5)&(v>.5)&((h>.07)&(h<.945) if ci<3 else (dh<.1)); dens=ndimage.uniform_filter(strong.astype(float),5)
      bg|=strong|((dens>.3)&(c.mean(2)<235))
      # pink-red dot screen at the bottom of the happy cells: pinkish pixels that aren't surrounded by skin (blush is)
      if ci<3:
        skin=((c.mean(2)>200)&(sat<.2)).astype(float); near=ndimage.uniform_filter(skin,11)
        pink=(sat>.2)&(v>.35)&((h>.8)|(h<.06))
        if WHO[ri] in ('hitori','hikari'): pink&=(h>.8)&(h<.95)   # their red bows stay
        if WHO[ri] == 'uku': pink&=(sat>.42)&(v>.62)&(h>.85)   # his hair is pinkish brown
        bg|=pink&(near<.3)
      # specks of dot screen left between removed pixels
      for _ in range(2): bg|=ndimage.binary_closing(bg,iterations=1)&~ndimage.binary_erosion(~bg,iterations=6)
    else:
      F=np.array(Image.fromarray((figs*255).astype(np.uint8)).resize((Wd,H),Image.BILINEAR))/255
      core=F>.75; band=(F>.2)&~core
      tex=ndimage.uniform_filter((lum>200).astype(float),3); mid=(lum<205)&(lum>40)
      # outside the figure: background. In the edge band: grey dot-screen pixels go too
      bg=(F<=.2)|(band&mid&(ndimage.generic_filter(lum,np.std,size=3)>30))
      bg=ndimage.binary_opening(bg,iterations=1)|(F<=.2)
    bg[:3,:]=bg[-3:,:]=bg[:,:3]=bg[:,-3:]=True
    out=c.copy(); out[bg]=0
    # square: a little black added at the sides, a little of the shoulders trimmed, so the face fills the frame
    side=int(round((H+Wd)/2)); sq=np.zeros((side,side,3)); ox=(side-Wd)//2; oy=int((H-side)*.2); sq[:,ox:ox+Wd]=out[oy:oy+side]
    img=Image.fromarray(sq.astype(np.uint8)).resize((128,128),Image.LANCZOS)
    img.save(O+f'blk_{WHO[ri]}_{EM[ci]}.png'); S.paste(img,(ci*140,ri*140))
S.save('blk_sheet.png')
