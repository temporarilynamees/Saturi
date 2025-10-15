import cv2 as cv

img = cv.imread('soccer.jpg')
gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

canny1 = cv.Canny(gray, 50, 150)
canny2 = cv.Canny(gray, 100, 200)

gray_bgr = cv.cvtColor(gray, cv.COLOR_GRAY2BGR)
canny1_bar = cv.cvtColor(canny1, cv.COLOR_GRAY2BGR)
canny2_bar = cv.cvtColor(canny2, cv.COLOR_GRAY2BGR)

cv.putText(gray_bgr, "Original", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
cv.putText(canny1_bar, "Canny1", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
cv.putText(canny2_bar, "Canny2", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

bottom_row = cv.hconcat([gray_bgr, canny1_bar, canny2_bar])
final_image = cv.vconcat([bottom_row])

WINDOW_NAME = 'Sobel Filter Results'

cv.namedWindow(WINDOW_NAME, cv.WINDOW_NORMAL)

cv.resizeWindow(WINDOW_NAME, 1720, 720)

cv.imshow(WINDOW_NAME, final_image)

cv.waitKey()

cv.destroyAllWindows()#..................






