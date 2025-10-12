import cv2 as cv
import numpy as np

img = cv.imread('baduk_stones.jpg')
img_lines = img.copy()
img_linesP = img.copy()

gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

edges = cv.Canny(gray, 50, 150, apertureSize=3)

lines = cv.HoughLines(edges, 1, np.pi / 180, 180)

if lines is not None:
    for line in lines:
        rho, theta = line[0]
        a = np.cos(theta)
        b = np.sin(theta)
        x0 = a * rho
        y0 = b * rho

        x1 = int(x0 + 1000 * (-b))
        y1 = int(y0 + 1000 * (a))
        x2 = int(x0 - 1000 * (-b))
        y2 = int(y0 - 1000 * (a))

        cv.line(img_lines, (x1, y1), (x2, y2), (255, 0, 0), 2)

linesP = cv.HoughLinesP(edges, 1, np.pi / 180, threshold=100, minLineLength=100, maxLineGap=10)

if linesP is not None:
    for line in linesP:
        x1, y1, x2, y2 = line[0]
        cv.line(img_linesP, (x1, y1), (x2, y2), (0,255,0), 2)



edges_bar = cv.cvtColor(edges, cv.COLOR_GRAY2BGR)

img_lines_bar = img_lines
img_linesP_bar = img_linesP

cv.putText(edges_bar, "Canny", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
cv.putText(img_lines_bar, "HoughLines", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
cv.putText(img_linesP_bar, "HoughLinesP", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

bottom_row = cv.hconcat([edges_bar, img_lines_bar, img_linesP_bar])
final_image = cv.vconcat([bottom_row])

WINDOW_NAME = 'Sobel Filter Results'

cv.namedWindow(WINDOW_NAME, cv.WINDOW_NORMAL)

cv.resizeWindow(WINDOW_NAME, 1720, 720)

cv.imshow(WINDOW_NAME, final_image)

cv.waitKey()

cv.destroyAllWindows()#............



