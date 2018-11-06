# -*- coding: UTF-8 -*-

# # 1
# sum =   1 + \
#         2 + \
#         3
# print sum


# # 2
# import sys; x = 'runoob'; sys.stdout.write(x + x + '\n')


# # 3
# x="a"
# # 换行输出
# print x
# print x
# # 不换行输出
# print x,
# print x


# # 4
# a = b = c = 1
# a, b, c= 1, 2, "john"
# # 删除对象引用
# del a


# # 5 字符串
# name = "0123456"        # 字符串
# print name[2:5]         # 输出字符串中第三个至第五个之间的字符串
# print name[2:]          # 输出从第三个字符开始的字符串
# print name * 2          # 输出字符串两次
# print name + "TEST"     # 输出连接的字符串


# # 6 list
# list = [ 'runoob', 786 , 2.23, 'john', 70.2 ]
# print list              # 输出完整列表
# print list + list       # 打印组合的列表
# print list * 3          # 输出列表两次
# print list[0] * 3       # 字符串*3      >>> runoobrunoobrunoob
# print list[1] * 3       # 整数*3        >>> 2358


# # 7 元组
# tuple = ( 'runoob', 786 , 2.23, 'john', 70.2 )
# print tuple             # 输出完整元组
# # tuple[2] = 1000    # 元组不允许更新，列表允许


# # 8 字典
# tinydict = {'name': 'john','code':6734, 'dept': 'sales'}
# tinydict['one'] = "This is one"
# tinydict[2] = "This is two"
 
# print tinydict['one']       # 输出键为'one' 的值
# print tinydict[2]           # 输出键为 2 的值
# print tinydict              # 输出完整的字典
# print tinydict.keys()       # 输出所有键
# print tinydict.values()     # 输出所有值

# x = {"name":"aa","ege":20}
# print eval("12+134")
# print complex(1+2/3)

# x = set('123  '+'9')
# y = set('345')
# print  x
# print  y
# print  x & y         # 交集
# print  x | y         # 并集
# print  x - y         # 差集

	
# # 创建字典
# print dict(a='a', b='b', t='t')
# print dict(zip(['one', 'two', 'three'], [1, 2, 3])) 
# print dict([('one', 1), ('two', 2), ('three', 3)]) 

# print frozenset('runoob')   # 冻结集合

# print unichr(2555)
# print chr(255)
# print ord('2')
# print hex(123)
# print oct(12)


# a = 10
# b = 20
# list = [1, 2, 3, 4, 5 ]

# if True:
#     print "1 11"
#     print "222"
#     pass
# else:
#     print "3333"
#     print "4444"
#     pass


# var = 100 
 
# if ( var  == 1001 ) : 
#     print "变量 var 的值为100" 
 
# print "Good bye!"


# #* queen problem with recurison
# BOARD_SIZE = 8

# def under_attack(col, queens):
#    left = right = col
#    for r, c in reversed(queens):
#  #左右有冲突的位置的列号
#        left, right = left - 1, right + 1

#        if c in (left, col, right):
#            return True
#    return False

# def solve(n):
#    if n == 0:
#        return [[]]

#    smaller_solutions = solve(n - 1)

#    return [solution+[(n,i+1)]
#        for i in xrange(BOARD_SIZE)
#            for solution in smaller_solutions
#                if not under_attack(i+1, solution)]

# for answer in solve(BOARD_SIZE):
#    print answer


# # 通过字典设置参数
# site = {"name": "菜鸟教程", "url": "www.runoob.com"}
# print("网站名：{name}, 地址 {url}".format(**site))

# # 三单引号(''')
# print('''i
# love
# you''') #特殊功能,可以直接打印多行内容,而前面两种情况需要显示输入\n才能换行


# import time
# # 格式化成2016-03-20 11:45:39形式
# print time.localtime()
# print time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) 


# import calendar
# cal = calendar.month(2018, 10)
# print cal


# # 可写函数说明
# sum = lambda arg1, arg2: arg1 + arg2;
# print "相加后的值为 : ", sum( 10, 20 )
# print "相加后的值为 : ", sum( 20, 20 )


# global VarName 的表达式会告诉 Python， VarName 是一个全局变量，这样 Python 就不会在局部命名空间里寻找这个变量了。4+5


# import math
# content = dir(math)
# print locals()


# str = input("shuru:")
# print str

# fo = open("foo.txt", "w")
# print "name: ", fo.name
# print "closed : ", fo.closed
# print "mode : ", fo.mode
# print "softspace : ", fo.softspace
# fo.write("asdasdas12")
# 查找当前位置
# position = fo.tell()
# print "当前文件位置 : ", position
# # 把指针再次重新定位到文件开头
# position = fo.seek(0, 0)
# str = fo.read(10)
# print "重新读取字符串 : ", str


# try:
#     if 0 < 1:
#         raise Exception,"Invalid level!"
#         # 触发异常后，后面的代码就不会再执行
# except Exception,err:
#     print 1,err
# else:
#     print 2


# import re
# line = "Cats are smarter than dogs"
# matchObj = re.match( r'(.*) are (.*?) .*', line, re.M|re.I)
# if matchObj:
#    print "matchObj.group() : ", matchObj.group()
#    print "matchObj.group(1) : ", matchObj.group(1)
#    print "matchObj.group(2) : ", matchObj.group(2)
# else:
#    print "No match!!"



 
# import thread
# import time
 
# # 为线程定义一个函数
# def print_time( threadName, delay):
#    count = 0
#    while count < 5:
#       time.sleep(delay)
#       count += 1
#       print "%s: %s" % ( threadName, time.ctime(time.time()) )
 
# # 创建两个线程
# try:
#    thread.start_new_thread( print_time, ("Thread-1", 1, ) )
#    thread.start_new_thread( print_time, ("Thread-2", 1, ) )
# except:
#    print "Error: unable to start thread"
 
# while 1:
#    pass



# from Tkinter import *           # 导入 Tkinter 库
# root = Tk()                     # 创建窗口对象的背景色
#                                 # 创建两个列表
# li     = ['C','python','php','html','SQL','java']
# movie  = ['CSS','jQuery','Bootstrap']
# listb  = Listbox(root)          #  创建两个列表组件
# listb2 = Listbox(root)
# for item in li:                 # 第一个小部件插入数据
#     listb.insert(0,item)
 
# for item in movie:              # 第二个小部件插入数据
#     listb2.insert(0,item)
 
# listb.pack()                    # 将小部件放置到主窗口中
# listb2.pack()
# root.mainloop()                 # 进入消息循环


# import json
# jsonData = '{"a":1,"b":2,"c":3,"d":4,"e":5}';
# text = json.loads(jsonData)
# print text


# 加密
# def get_crc(data):
#     s = 65535
#     size = len(data)
#     for i in range(size):
#         d = ord(data[i])
#         s ^= d
#         if s & 1 == 0:
#             s /= 2
#         else:
#             s = int(s / 2) ^ 0x70B1
#     return s

# str1 = ' '
# str1 = get_crc(str1)
# print(str1)


# import socket
# print(socket.gethostname())


# import pickle
# print(dir(pickle))

arr=[]
for i in range(5):
    x=int(raw_input())
    arr.append(x)
    pass

print arr

arr.sort()

print arr