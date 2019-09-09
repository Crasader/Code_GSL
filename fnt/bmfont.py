# coding: utf-8
import os
import sys


def main():
    name = "numberCoin"
    size = 30    # 字体大小
    width = 220  # 图片宽度
    height = 30  # 图片高度
    # 字符集
    chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    chars_count = len(chars)

    content = ("info face=\"Arial\" size=%d bold=1 italic=0 charset=\"\" unicode=1 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=1,1 outline=0\n" \
        + "common lineHeight=%d base=%d scaleW=%d scaleH=%d pages=1 packed=0 alphaChnl=0 redChnl=0 greenChnl=0 blueChnl=0\n" \
        + "page id=0 file=\"%s.png\"\n" \
        + "chars count=%d\n") % (size, height, size, width, height, name, chars_count)

    w = width / chars_count
    for i in range(0, chars_count):
        line = "char id=%d   x=%d    y=%d     width=%d    height=%d    xoffset=0     yoffset=0     xadvance=%d    page=0  chnl=15\n" \
            % (ord(chars[i]), w * i, 0, w, height, w)
        content += line

    f = file("E:\\2_Git_Self\\Code_GSL\\fnt\\"+name+".fnt", "w+")
    f.write(content)
    f.close()


if __name__ == "__main__":
    main()
