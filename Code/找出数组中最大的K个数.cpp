// ConsoleApplication1.cpp : 定义控制台应用程序的入口点。
//

#include "stdafx.h"

#include <stdio.h>
#include <tchar.h>
#include <windows.h> 

#define N 10
#define K 5

int main()
{
	int oldArray[N] = { 4,8,9,5,1,2,4,5,6,19 };
	int sortArray[K] = {};

	for (int i = 0; i < N; ++i)
	{
		int first = 0;
		int last = K - 1;
		if (oldArray[i] > sortArray[last])
		{
			while (first < last)
			{
				int middle = (first + last) / 2;
				if (oldArray[i] > sortArray[middle])
				{
					last = middle;
				}
				else
				{
					first = middle+1;
				}
			}
			for (int j = K-1; j > last; --j)
			{
				sortArray[j] = sortArray[j - 1];
			}
			sortArray[last] = oldArray[i];
		}
	}

    return 0;
}

