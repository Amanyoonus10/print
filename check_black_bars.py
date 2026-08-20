from PIL import Image
import os

for path in ['/Users/amanyoonus/Desktop/print/public/videos/frame_check.png']:
    if os.path.exists(path):
        im = Image.open(path)
        w, h = im.size
        print(f"Size: {w}x{h}")
        # Find first non-black pixel from left and right
        mid_y = h // 2
        left_black_width = 0
        for x in range(w):
            r, g, b = im.getpixel((x, mid_y))[:3]
            if r > 20 or g > 20 or b > 20:
                left_black_width = x
                break
        
        right_black_width = 0
        for x in range(w-1, -1, -1):
            r, g, b = im.getpixel((x, mid_y))[:3]
            if r > 20 or g > 20 or b > 20:
                right_black_width = w - 1 - x
                break
                
        print(f"Left black width: {left_black_width}px, Right black width: {right_black_width}px")
