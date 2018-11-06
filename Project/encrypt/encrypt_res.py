import os
import sys
import random
import time

dir_to_encrypt = u'./assets'

encrypt_key = random.randint(1, 255)
have_encrypt_first_flag = 0x70
have_encrypt_second_flag = 0x80
have_encrypt_third_flag = 0x90

def encrypt(images_path):
    f = open(images_path, 'rb')
    filedata = f.read()
    filesize = f.tell()
    f.close()

    file_byte_array = bytearray(filedata)

    if(have_encrypt_first_flag == file_byte_array[0]
        and have_encrypt_second_flag == file_byte_array[1]
        and have_encrypt_third_flag == file_byte_array[2]):
        print('this png has encrypt before!')
    else:
        encrypt_file_byte_array = bytearray(0)
        encrypt_file_byte_array.append(have_encrypt_first_flag)
        encrypt_file_byte_array.append(have_encrypt_second_flag)
        encrypt_file_byte_array.append(have_encrypt_third_flag)
        encrypt_file_byte_array.append(encrypt_key)

        for byte in file_byte_array:
            encrypt_bype = byte ^ encrypt_key
            encrypt_file_byte_array.append(encrypt_bype)

        workdir = os.path.split(images_path)[0]

        os.remove(images_path)
        f2 = open(images_path,'wb')
        f2.write(encrypt_file_byte_array)
        f2.close()

def judge_is_png_or_jpg(file_name):
    suffix = os.path.splitext(file_name)[1]
    if  suffix== '.png' or suffix == '.jpg' or suffix == '.PNG' or suffix == '.JPG':
        return True
    else:
        return False

copyFileCounts = 0 

def encrypt_files(resource_dir):  
    global copyFileCounts  
    print resource_dir  
    print u"%s dir %s process" %(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())), resource_dir)  
    for f in os.listdir(resource_dir):
        filepath = os.path.join(resource_dir, f)  
        print filepath
        if os.path.isfile(filepath):
            if judge_is_png_or_jpg(filepath):
                encrypt(filepath)
                print u"%s %s encrypted" %(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())), filepath)  
            
        if os.path.isdir(filepath):  
            encrypt_files(filepath)

if __name__ == "__main__":  
    try:  
        import psyco  
        psyco.profile()  
    except ImportError:  
        pass

	encrypt_files(dir_to_encrypt)