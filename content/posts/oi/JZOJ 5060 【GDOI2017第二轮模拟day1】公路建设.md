---
title: "JZOJ 5060 【GDOI2017第二轮模拟day1】公路建设"
date: "2018-10-09 21:12:40"
tags: ["oi"]
excerpt: "在 Byteland 一共有 $n$ 个城市，编号依次为 $1$ 到 $n$，它们之间计划修建 $m$ 条双向道路，其中修建第 $i$ 条道路的费用为 $c_{i}$。Byteasar 作为 Byteland 公路建设项目的总工程师，他决定选定一个区间 $[l, r]$，仅使用编号在该区间内的道路。他希望选择一些道路去修建，使得连通块的个数尽量少，同时，他不喜欢修建多余的道路，因此每个连通块都可以看成一棵树的结构。为了选出最佳的区间，Byteasar 会不断选择 $q$ 个区间，请写一个程序，帮助 Byteasar 计算每个区间内修建公路的最小总费用。"
---

一道有趣的图论题 下面题目



## 题目

**Description**

在 Byteland 一共有 $n$ 个城市，编号依次为 $1$ 到 $n$，它们之间计划修建 $m$ 条双向道路，其中修建第 $i$ 条道路的费用为 $c_{i}$。

Byteasar 作为 Byteland 公路建设项目的总工程师，他决定选定一个区间 $[l, r]$，仅使用编号在该区间内的道路。他希望选择一些道路去修建，使得连通块的个数尽量少，同时，他不喜欢修建多余的道路，因此每个连通块都可以看成一棵树的结构。

为了选出最佳的区间，Byteasar 会不断选择 $q$ 个区间，请写一个程序，帮助 Byteasar 计算每个区间内修建公路的最小总费用。

---

**Input**

第一行包含三个正整数 $n, m, q$，表示城市数、道路数和询问数。

接下来 $m$ 行，每行三个正整数 $u_{i}, v_{i}, c_{i}$，表示一条连接城市 $u_{i}$ 和 $v_{i}$ 的双向道路，费用为 $c_{i}$。

接下来 $q$ 行，每行两个正整数 $l_{i}, r_{i}$，表示一个询问。

**Output**

输出 $q$ 行，每行一个整数，即最小总费用。

---

 **Sample Input**

```
3 5 2
1 3 2
2 3 1
2 1 6
3 1 7
2 3 7
2 5
3 4
```

Sample Output

```
7
13
```

**Data Constraint**

![](/images/content/oi/2018_10_09_1.png)



## 思路

30分做法：对于每次询问暴力用最小生成树解出

60分做法：考虑到边权递增 东搞搞西搞搞就可以了 (具体就自己思考吧其实是我懒得解释了)

100分做法：线段树 + 最小生成树 + 并查集！

因为总共最多只有 $n = 100$ 个点 那每个区间又只有 $n - 1$ 条有用边

那我们对边开一棵线段树 维护区间内有用的边 要预处理一下

具体来说就是 从下往上每次仅保留当前区间 $[l, r]$ 内的最优边 而且它不会超过 $n$ 所以每次往上更新的时间复杂度是可以接受的

查询的时候通过搜索区间合并有用边 (就是只取更有用的边) 然后边权加起来即可

下放代码



## 代码



```cpp
#include <algorithm>
#include <cstdio>
using namespace std;
const int MAXN = 105;
const int MAXM = 100010;
struct edge {
	int u,v,w;
} e[MAXM];
struct tree {
	int edg[MAXN],siz;
} tr[MAXM << 2];
int s[MAXN],bot[MAXM],n,tot;
inline int f(int p) {return s[p] == p ? p : s[p] = f(s[p]);}
inline short cmp(int x,int y) {return e[x].w < e[y].w;}
inline void kruskal()
{
	for (int a = 1 ; a <= n ; ++ a) s[a] = a;
	sort(bot + 1,bot + tot + 1,cmp);
	int len = 0;
	for (int a = 1 ; a <= tot ; ++ a)
	{
		int i = f(e[bot[a]].u);
		int j = f(e[bot[a]].v);
		if (s[i] == s[j]) continue;
		s[j] = i;
		bot[++len] = bot[a];
	}
	tot = len;
}
void build(int l,int r,int len)
{
	if (l == r)
	{
		tr[len].edg[1] = l;
		tr[len].siz = 1;
		return;
	}
	int mid = (l + r) >> 1,ls = len << 1,rs = ls | 1;
	build(l,mid,ls),build(++mid,r,rs),tot = 0;
	for (int a = 1 ; a <= tr[ls].siz ; ++ a) bot[++tot] = tr[ls].edg[a];
	for (int a = 1 ; a <= tr[rs].siz ; ++ a) bot[++tot] = tr[rs].edg[a];
	kruskal(),tr[len].siz = tot;
	for (int a = 1 ; a <= tot ; ++ a) tr[len].edg[a] = bot[a];
}
void get(int l,int r,int len,int i,int j)
{
	if (i <= l && r <= j)
	{
		for (int a = 1 ; a <= tr[len].siz ; ++ a)
			bot[++tot] = tr[len].edg[a];
		return;
	}
	int mid = (l + r) >> 1;
	if (i <= mid) get(l,mid,len << 1,i,j);
	if (mid < j) get(++mid,r,len << 1 | 1,i,j);
}
int main()
{
	freopen("highway.in", "r", stdin);
	freopen("highway.out", "w", stdout);
	int m,q,x,y;
	scanf("%d%d%d",&n,&m,&q); for (int a = 1 ; a <= m ; ++ a)
	scanf("%d%d%d",&e[a].u,&e[a].v,&e[a].w);
	build(1,m,1);
	while (q--)
	{
		scanf("%d%d",&x,&y);
		tot = 0;
		get(1,m,1,x,y);
		kruskal();
		int ans = 0;
		for (int a = 1 ; a <= tot ; ++ a) ans += e[bot[a]].w;
		printf("%d\n",ans);
	}
	fclose(stdin);
	fclose(stdout);
	return 0;
}
```
