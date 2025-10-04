import cv2 as cv
import numpy as np

img = cv.imread('soccer.jpg')

gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

grad_x = cv.Sobel(gray, cv.CV_32F, 1, 0, ksize=3)
grad_y = cv.Sobel(gray, cv.CV_32F, 0, 1, ksize=3)

sobel_x = cv.convertScaleAbs(grad_x)
sobel_y = cv.convertScaleAbs(grad_y)

edge_strength = cv.addWeighted(sobel_x, 0.5, sobel_y, 0.5, 0)

gray_bgr = cv.cvtColor(gray, cv.COLOR_GRAY2BGR)
sobel_x_bgr = cv.cvtColor(sobel_x, cv.COLOR_GRAY2BGR)
sobel_y_bgr = cv.cvtColor(sobel_y, cv.COLOR_GRAY2BGR)
edge_strength_bgr = cv.cvtColor(edge_strength, cv.COLOR_GRAY2BGR)

cv.putText(gray_bgr, "Original", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
cv.putText(sobel_x_bgr, "Sobel X", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
cv.putText(sobel_y_bgr, "Sobel Y", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
cv.putText(edge_strength_bgr, "Edge Strength", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

top_row = cv.hconcat([gray_bgr, sobel_x_bgr])
bottom_row = cv.hconcat([sobel_y_bgr, edge_strength_bgr])
final_image = cv.vconcat([top_row, bottom_row])

WINDOW_NAME = 'Sobel Filter Results'

cv.namedWindow(WINDOW_NAME, cv.WINDOW_NORMAL)

cv.resizeWindow(WINDOW_NAME, 1280, 720)

cv.imshow(WINDOW_NAME, final_image)

cv.waitKey()
cv.destroyAllWindows()#..
