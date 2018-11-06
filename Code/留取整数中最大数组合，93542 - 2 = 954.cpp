// ConsoleApplication1.cpp : 定义控制台应用程序的入口点。
//

#include "stdafx.h"

#include <stdio.h>
#include <tchar.h>


int main()
{
	int k_oldNumber = 73542;
	int k_removeCount = 2;

	int	k_oldNumberArray[10];
	int k_oldNumberCount = 0;

	int tempNumber = k_oldNumber;
	while (0 < tempNumber)
	{
		k_oldNumberArray[k_oldNumberCount++] = tempNumber % 10;
		tempNumber /= 10;
	}
 	for (int i = 0; i < k_oldNumberCount / 2; ++i)
	{
		tempNumber = k_oldNumberArray[i];
		k_oldNumberArray[i] = k_oldNumberArray[k_oldNumberCount - 1 - i];
		k_oldNumberArray[k_oldNumberCount - 1 - i] = tempNumber;
	}

	for (int i = 0; i < k_removeCount; ++i)
	{
		for (int j = 0; j < k_oldNumberCount-1; ++j)
		{
			if (k_oldNumberArray[j] < k_oldNumberArray[j + 1])
			{
				for (int k = j; k < k_oldNumberCount - 1; ++k)
				{
					k_oldNumberArray[k] = k_oldNumberArray[k + 1];
				}
				break;
			}
		}
		--k_oldNumberCount;
	}

	int k_newNumber = 0;
	for (int i = 0; i < k_oldNumberCount; ++i)
	{
		k_newNumber *= 10;
		k_newNumber += k_oldNumberArray[i];
	}
	printf("%d",k_newNumber);

	getchar();

    return 0;
}

//#include <iostream>
//#include <string>
//#include <algorithm>
//#include <cstring>
//using namespace std;
//int main()
//{
//	string N;
//	while (cin >> N)
//	{
//		int cnt;
//		cin >> cnt;
//		int len = N.size();
//		for (int i = 0; i < cnt; ++i)
//		{
//			int j = 0;
//			for (j = 0; j < len - 1; ++j)
//			{
//				if (N[j] < N[j + 1])
//				{
//					N.erase(N.begin() + j);
//					break;
//				}
//			}
//			if (j == len - 1)
//			{
//				N.erase(N.end() - 1);
//			}
//			--len;
//		}
//		cout << N;
//	}
//	return 0;
//}

