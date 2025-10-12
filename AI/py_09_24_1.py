import cv2 as cv

img=cv.imread('rose.png')
patch=img[250:350,170:270,:]

img=cv.rectangle(img,(170,250),(270,350),(255,0,0),3)
patch1=cv.resize(patch,dsize=(0,0),fx=5,fy=5,interpolation=cv.INTER_NEAREST) #근접 보간법............
patch2=cv.resize(patch,dsize=(0,0),fx=5,fy=5,interpolation=cv.INTER_LINEAR)  #양선형 보간법
patch3=cv.resize(patch,dsize=(0,0),fx=5,fy=5,interpolation=cv.INTER_CUBIC)   #3차원 보간법

cv.imshow('Original',img)
cv.imshow('Patch 1 - Nearest',patch1)
cv.imshow('Patch 2 - Linear',patch2)
cv.imshow('Patch 3 - Cubic',patch3)

cv.waitKey()
cv.destroyAllWindows()





