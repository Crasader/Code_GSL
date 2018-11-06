// ConsoleApplication1.cpp : 定义控制台应用程序的入口点。
//

#include "stdafx.h"

#include<iostream>
#include<math.h>
#include<time.h>
#include<set>
using namespace std;
int nums[63];//num[i]表示2^i的个数，只有0,1,2三个取值
			 //回溯法
int IsOk(long long n, int *nums, int len)
{
	long long sum = 0;
	for (int i = 0; i < len; i++)
		sum += nums[i] * pow(2, i);
	if (sum == n)
		return 0;
	else if (sum > n)
		return -1;
	else
		return 1;
}
void solve(long long n, int index, int *nums, int len, int &count)
{
	if (index >= len)
		return;
	for (int i = 0; i <= 2; i++)
	{
		nums[index] = i;
		if (IsOk(n, nums, len) == 0)
			count++;
		else if (IsOk(n, nums, len) == 1)
			solve(n, index + 1, nums, len, count);
	}
	nums[index] = 0;//回溯法，要撤回上一步的假设
}


long long DP(long long n)//使用动态规划方法
{
	int len = log(n) / log(2) + 1;
	long long **dp = new long long*[n + 1];
	for (long long i = 0; i <= n; i++)
	{
		dp[i] = new long long[len];
	}
	//long long dp[5][3] = { 0 };
	for (int i = 0; i < len; i++)
		for (long long j = 0; j <= n; j++)
			dp[j][i] = 0;

	//dp[n][i]表示使用1，1，2，2，4，4，...，2^i可以组合出n的方案数
	for (int i = 0; i < len; i++)
		dp[0][i] = 1;
	if (n == 1 || n == 2)
		return n;
	dp[1][0] = 1;
	dp[2][0] = 1;
	for (int i = 3; i <= n; i++)
		dp[i][0] = 0;

	//dp[n][i]=
	//  cout << "len=" << len << endl;
	for (int i = 1; i < len; i++) 
	{
		for (long long j = 1; j <= n; j++)
		{
			for (int m = 0; m <= 2; m++)
				if (j - pow(2, i)*m >= 0)
				{
					dp[j][i] = dp[j][i] + dp[(long long)(j - pow(2, i)*m)][i - 1];
					//cout <<"j="<< j << " " << "i=" << i << " " << "m=" << m<<" "<< dp[j][i]<<endl;
				}
		}
	}
	return dp[n][len - 1];
}

int solve3(long long n)
{
	long long stop = n / 2;
	long long res = 0;
	set<int> myset;
	/*
	将硬币分为两份：1，2，4，8，16，.....和1，2，4，8，16....
	组成两个数值为a,b的两个数字，他们的和是a+b=n;
	a在每一份中只可能有一种组合方式（二进制的思想）
	*/
	for (int i = 1; i <= stop; i++)
	{
		res = i ^ (n - i);
		myset.insert(res);
	}
	//对于1,2,4,8结果再加1.
	int len = log(n) / log(2) + 1;
	if (pow(2, len - 1) == n)
		return myset.size() + 1;

	return myset.size();
}


int main()
{
	for (int i = 0; i < 63; i++)
		nums[i] = 0;
	long long n;
	clock_t start, finish;
	while (true)
	{
		cin >> n;
		if (n < 1)
		{
			return 0;
		}
		int len = log(n) / log(2) + 1;
		int count = 0;
		start = clock();
		solve(n, 0, nums, len, count);
		cout << count << endl;
		finish = clock();
		cout << "回溯法耗费时间为" << (double)(finish - start) / CLOCKS_PER_SEC << "秒" << endl;
		//
		//
		start = clock();
		long long res = DP(n);
		cout << res << endl;
		finish = clock();
		cout << "动态规划方法耗费时间为" << (double)(finish - start) / CLOCKS_PER_SEC << "秒" << endl;

		start = clock();
		res = solve3(n);
		cout << res << endl;
		finish = clock();
		cout << "第三种方法耗费时间为" << (double)(finish - start) / CLOCKS_PER_SEC << "秒" << endl;
	}

	return 0;
}