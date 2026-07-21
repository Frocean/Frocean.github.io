---
title: "JZOJ 1029【NOIP动态规划专题】电子眼"
date: "2018-10-19 21:05:31"
tags: ["oi"]
excerpt: "中山市有 $N$ 条马路和 $N$ 个路口，每条马路连接两个路口，每两个路口之间最多只有一条马路。作为一条交通网络，显然每两个路口之间都是可达的。为了更好地管理中山市的交通，市长决定在一些路口加装电子眼，用来随时监视路面情况。这些装在路口的电子眼能够监视所有连接到这个路口的马路。现在市长想知道最少需要在多少个路口安装电子眼才能监视所有的马路。"
---

最近又来搞搞  虽然初赛应该过不了 ~~(心态不好写得眼瞎了气死人)~~ 但还是要准备一下复赛

先放题目



## 题目

**Description**

中山市是一个环境优美、气候宜人的小城市。因为城市的交通并不繁忙，市内的很稀疏。

准确地说，中山市有 $N$ 条马路和 $N$ 个路口，每条马路连接两个路口，每两个路口之间最多只有一条马路。作为一条交通网络，显然每两个路口之间都是可达的。

为了更好地管理中山市的交通，市长决定在一些路口加装电子眼，用来随时监视路面情况。这些装在路口的电子眼能够监视所有连接到这个路口的马路。

现在市长想知道最少需要在多少个路口安装电子眼才能监视所有的马路。市长已经把所有的路口都编上了 $1 \to N$ 的号码。 给你中山市的地图，你能帮忙吗？

---

**Input**

输入文件第 $1$ 行包括一个数字 $N(1 \leqslant N \leqslant 100000)$，表示中山市的路口数。接下来 $N$ 行，第 $i + 1$ 行的第一个数字 $k_{i}$ 表示有 $k_{i}$ 条马路与路口 $i$ 相连，后面紧跟着 $k_{i}$ 个数字，表示与路口 $i$ 直接相连的路口。

**Output**

输出最少需要安装电子眼的数量。

---

**Sample Input**

```html
3
2 2 3
2 1 3
2 1 2
 
```

**Sample Output**

```html
2
```

**Data Constraint**

$1 \leqslant N \leqslant 100000$



## 思路

首先这题和[POJ1463](http://poj.org/problem?id=1463)很像啊 ~~(去做了下 结果 RE 了)~~ 多了条边的问题

但是其实我发现忽略掉都可以过 就是过不了样例 我 cpy 了别人的这种程序上去都过了 我自己写的也过了..

但是怎么能止步于 AC 呢 肯定要打出真·正解出来 于是就有了这篇题解 好吧不废话了 开始解释

按照尿性 考虑 `dp[x][0]` 表示该点不选 `dp[x][1]` 表示选

因为一个点选了的话 那他的子节点都不用选 同样 如果不选 那他子节点必选

他的父节点呢？说不定！比如样例这种 因为有环 所以......

我们这里要稍微变通一下 遍历到重点的时候 我们要加上该点的结果

但这样边遍历边更新的话会有重复 为了保证不会影响结果 我们考虑用两个数来代替 dp 

遍历到最后再把值加进 dp 数组里 就好了

下放代码 (这次缩行有点严重)



## 代码

```cpp
#include <cstring>
#include <cstdio>
using namespace std;
const int MAXN = 100010;
struct edge {
	int next,to;
} e[MAXN << 4];
int first[MAXN],dp[MAXN][2],tot;
short o[MAXN];
inline int min(int x,int y) {return x < y ? x : y;}
inline int r() {
	char q = getchar();
	int x = 0;
	while (q < '0' || q > '9') q = getchar();
	while ('0' <= q && q <= '9')
		x = (x << 3) + (x << 1) + q - (3 << 4),q = getchar();
	return x;
}
inline void add(int x,int y)
{
	e[++tot].next = first[x];
	e[tot].to = y;
	first[x] = tot;
}
inline void dfs(int p)
{
	o[p] = 1;
	int x = 1,y = 0;
	for (int a = first[p],b = e[a].to ; a ; y += dp[b][1],a = e[a].next,b = e[a].to)
		if (o[b]) continue; else dfs(b),x += min(dp[b][0],dp[b][1]);
	dp[p][1] = x;
	dp[p][0] = y;
}
int main()
{
	int n = r();
	for (int x = 1 ; x <= n ; ++ x)
	for (int m = r() ; m > 0 ; -- m) add(x,r());
	dfs(1);
	printf("%d\n",min(dp[1][0],dp[1][1]));
	return 0;
}
```
