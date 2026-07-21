---
title: "分层图最短路(SPFA)"
date: "2018-12-01 08:20:11"
tags: ["oi"]
excerpt: "分层图最短路"
---

上周考了道这个因为段考到现在才改完这个 = =



## 正文

这类问题嘛..总之先放[题目](https://www.luogu.org/problemnew/show/P2939)

很显然问题都是最短路 然后中间可以跳边走的那种

然后考场上我愣是想到了 dp..

好吧后来我也是在这个基础上改的 不过这个就是叫分层图最短路....

做法一：拆点 能免费几条路就把一个点拆成多少个点 当然还要加 $1$ (原始的) 连的话就是 $x$ 和 $y + n$ 连一个费用为 $0$ 的边 $x$ 和 $y$ 连一个费用为费用的边 如果无向图别忘了反过来

做法二：就像 dp 一样 $dis[p][k]$ 为 到达 $p$ 号点 使用 $k$ 条免费路时最小的 $dis$ 值 然后设 $p$ 点到达 $b$ 点 推导就是这样个东西

$dis[b][k] = min(dis[b][k],min(dis[p][k] + v, dis[p][k - 1]))$ 这个应该分两个 但我懒得打了于是就合并了

当然遇到最短路 卡 SPFA 加个堆就好啦 = =



## 代码

其实原本我写的这个堆超丑的 如下

```cpp
inline void push(int p,int k)
{
	++tot;
	heap[tot][0] = p;
	heap[tot][1] = k;
	o[p][k] = 1;
	int now = tot;
	while (now > 1 && dis[heap[now][0]][heap[now][1]] < dis[heap[now >> 1][0]][heap[now >> 1][1]])
	swap(heap[now],heap[now >> 1]),now >>= 1;
}
inline void pop(int &p,int &k)
{
	p = heap[1][0];
	k = heap[1][1];
	o[p][k] = 0;
	heap[1][0] = heap[tot][0];
	heap[1][1] = heap[tot][1];
	--tot;
	int now = 1;
	while (now << 1 <= tot && dis[heap[now][0]][heap[now][1]] > dis[heap[now << 1][0]][heap[now << 1][1]] ||
		now << 1 < tot && dis[heap[now][0]][heap[now][1]] > dis[heap[now << 1 | 1][0]][heap[now << 1 | 1][1]])
	{
		int nxt = now << 1;
		if (nxt < tot && dis[heap[nxt | 1][0]][heap[nxt | 1][1]] < dis[heap[nxt][0]][heap[nxt][1]]) ++nxt;
		swap(heap[now],heap[nxt]);
	}
}
```

然后中间判断距离的就放 `judge` 里面了 看起来好多了 下放代码

```cpp
#include <algorithm>
#include <cstring>
#include <cstdio>
#define MAXN 10010
#define MAXM 100010
using namespace std;
struct edge {
	int ne,to,v;
} e[MAXM];
struct queue {
	int nod,ed;
} heap[MAXM];
int first[MAXN],dis[MAXN][22];
int tot;
short o[MAXN][22];
inline short judge(queue x,queue y) {return dis[x.nod][x.ed] > dis[y.nod][y.ed];}
inline int r()
{
	char q = getchar(); int x = 0,y = 0;
	while (q < '0' && q != '-' || q > '9') q = getchar();
	if (q == '-') ++ y,q = getchar();
	while ('0' <= q && q <= '9')
		x = (x << 3) + (x << 1) + q - (3 << 4),q = getchar();
	return y ? -x : x;
}
inline void add(int x,int y,int z)
{
	e[++tot].ne = first[x];
	e[tot].to = y;
	e[tot].v = z;
	first[x] = tot;
}
inline void push(int p,int k)
{
	heap[++tot].ed = k;
	heap[tot].nod = p;
	o[p][k] = 1;
	int now = tot;
	while (now > 1 && judge(heap[now >> 1],heap[now]))
		swap(heap[now],heap[now >> 1]),now >>= 1;
}
inline void pop(int &p,int &k)
{
	p = heap[1].nod;
	k = heap[1].ed;
	o[p][k] = 0;
	heap[1] = heap[tot--];
	int now = 1;
	while (now << 1 <= tot && judge(heap[now],heap[now << 1]) ||
			now << 1 < tot && judge(heap[now],heap[now << 1 | 1]))
	{
		int nxt = now << 1;
		if (nxt < tot && judge(heap[nxt],heap[nxt | 1])) ++nxt;
		swap(heap[now],heap[nxt]),now = nxt;
	}
}
int main()
{
	int n = r(),m = r(),k = r(),s = 1,t = n,x,y,z;
	while (m--) x = r(),y = r(),z = r(),add(x,y,z),add(y,x,z);
	memset(dis,0x7f,sizeof(dis));
	tot = 0;
	dis[s][0] = 0;
	push(s,0);
	while (tot)
	{
		int p,ed;
		pop(p,ed);
		for (int a = first[p],b = e[a].to ; a ; a = e[a].ne,b = e[a].to)
		{
			if (dis[p][ed] + e[a].v < dis[b][ed])
			{
				dis[b][ed] = dis[p][ed] + e[a].v;
				if (!o[b][ed]) push(b,ed);
			}
			if (ed == k) continue;
			if (dis[b][ed + 1] > dis[p][ed])
			{
				dis[b][ed + 1] = dis[p][ed];
				if (!o[b][ed + 1]) push(b,ed + 1);
			}
		}
	}
	printf("%d\n",dis[t][k]);
	return 0;
}
```



## 扩展

双倍经验 [这题](https://www.luogu.org/problemnew/show/P4568)

三倍经验 [JZOJ 5172](https://jzoj.net/senior/#main/show/5172) ~~开通我校会员尊享~~

