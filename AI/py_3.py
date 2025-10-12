import cv2 as cv
import numpy as np

img = cv.imread('soccer.jpg')

gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
canny = cv.Canny(gray, 100, 200)

contour, hierarchy = cv.findContours(canny, cv.RETR_LIST, cv.CHAIN_APPROX_NONE)

lcontour = []
for i in range(len(contour)):
    if contour[i].shape[0] > 100:  # 100개 이상의 점으로 구성된 윤곽선만 필터링
        lcontour.append(contour[i])

# 원본 컬러 이미지에 초록색으로 윤곽선을 그립니다.
cv.drawContours(img, lcontour, -1, (0, 255, 0), 3)

# 1. Canny 이미지를 결합을 위해 3채널(BGR)로 변환
#    (img는 3채널, canny는 1채널이므로 채널 수를 맞춰야 함)
canny_bgr = cv.cvtColor(canny, cv.COLOR_GRAY2BGR)

# 2. 각 이미지에 텍스트 라벨 추가
cv.putText(img, "Original with Contours", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
cv.putText(canny_bgr, "Canny Edges", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

# 3. 두 이미지를 수평으로 결합
final_image = cv.hconcat([img, canny_bgr])

# 4. 창 크기 조절이 가능하도록 설정 후 표시............
WINDOW_NAME = 'Contour Detection Results'
cv.namedWindow(WINDOW_NAME, cv.WINDOW_NORMAL)
cv.resizeWindow(WINDOW_NAME, 1280, 720) # 창의 초기 크기 설정 (가로 1280, 세로 720)
cv.imshow(WINDOW_NAME, final_image)

cv.waitKey()

cv.destroyAllWindows()



