// ConsoleApplication1.cpp : 定义控制台应用程序的入口点。
//

#include "stdafx.h"
#include <algorithm>
using namespace std;

int people[5] = { 5,5,3,4,3 };
int gold[5] = { 400,500,200,300,350 };

int array2d[5][10] = { 0 };

int GetMaxProfit(int goldNum, int peopleNum)
{
	int maxProfit = 0;
	if (-1 < array2d[goldNum - 1][peopleNum - 1])
	{
		return array2d[goldNum - 1][peopleNum - 1];
	}

	if (1 < goldNum && peopleNum >= people[goldNum - 1])
	{
		maxProfit = max(GetMaxProfit(goldNum-1, peopleNum), GetMaxProfit(goldNum - 1, peopleNum-people[goldNum - 1])+gold[goldNum - 1]);
	}
	else if (1 < goldNum && peopleNum < people[goldNum - 1])
	{
		maxProfit = GetMaxProfit(goldNum - 1, peopleNum);
	}
	else if (1 == goldNum && peopleNum >= people[0])
	{
		maxProfit = gold[0];
	}
	else
	{
		maxProfit = 0;
	}

	array2d[goldNum - 1][peopleNum - 1] = maxProfit;
	return maxProfit;
}

int main()
{
	for (int i=1;i<=5;++i)
	{
		for (int j =1;j<=10;++j)
		{
			for (int g = 0;g < 5; ++g)
			{
				for (int p = 0; p < 10; ++p)
				{
					array2d[g][p] = -1;
				}
			}
			printf("%d\t", GetMaxProfit(i, j));
		}
		printf("\n");
	}

	getchar();

	return 0;
}
