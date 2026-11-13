from PIL import Image
import numpy as np
from scipy import ndimage as nd
im=Image.open('/root/.claude/uploads/51aa0b76-2aa6-527d-9216-a3ff39044976/f5d30430-image.png')
a=np.array(im).copy()
def keep_main(a):
    A=a[...,3]>20;lab,n=nd.label(A);s=nd.sum(A,lab,range(1,n+1));m=lab==(np.argmax(s)+1)
    a[...,3]=np.where(m,a[...,3],0)
keep_main(a)
mx=a[...,:3].max(axis=2)
Y,X=np.mgrid[0:a.shape[0],0:a.shape[1]]
rows=(Y>=350)&(Y<=560)
a[...,3][rows&(mx<70)&((X<508)|(X>772))]=0
a[...,3][rows&(mx<160)&((X<500)|(X>780))&(Y<520)]=0
a[...,3][(Y>=420)&(Y<=480)&(X>752)&(mx<90)]=0
a[...,3][(Y>=476)&(Y<=502)&(X>762)&(mx<110)]=0
keep_main(a)
o=Image.fromarray(a);o.crop(o.getchannel('A').getbbox()).save('build/angel.png')
c=a[340:540,730:810].copy();img=Image.fromarray(c);bg=Image.new('RGBA',img.size,(255,0,255,255));bg.alpha_composite(img)
bg.resize((320,800),Image.NEAREST).convert('RGB').save('zr2.png')
