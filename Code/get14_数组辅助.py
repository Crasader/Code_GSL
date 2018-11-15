# get 14
sumValue = 14
arr = [9,1,9,7,5,13,7,7]

arrAssist = []
for index in range(sumValue-1):
    arrAssist.append(0)
    pass

for item in arr:
    arrAssist[item-1] += 1
    pass

for index in range((sumValue-1)/2):
    if 0 < arrAssist[index] and 0 < arrAssist[12-index]:
        if arrAssist[index] > arrAssist[12-index] :
            arrAssist[index] -= arrAssist[12-index]
            arrAssist[12-index] = 0
            pass
        else:
            arrAssist[12-index] -= arrAssist[index]
            arrAssist[index] = 0
            pass  
    pass

if 0 == sumValue % 2:
    mediant = (sumValue) / 2
    while 1 < arrAssist[mediant-1]:
        arrAssist[mediant-1] -= 2
    pass

for index in range((sumValue-1)):
    while 0 < arrAssist[index]:
        print index + 1,
        arrAssist[index] -= 1
        pass
    pass