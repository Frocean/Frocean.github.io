---
title: "差分约束系统 【USACO DEC05 GOLD】设计"
date: "2018-07-12 16:25:13"
tags: ["oi"]
excerpt: "差分约束系统"
---

最近几天考试这个知识点出现挺多次啊=-=(也就两次哪里多了)

于是心血来潮补了一下这个叫 差分约束系统 的知识点......诶 这不就是最短路吗

必备知识: 了解最短路求法和其中的本质——三角不等式 不懂的戳下面的传送门

先安利一波十分详细的 讲差分约束系统博客 [http://www.cppblog.com/menjitianya/archive/2015/11/19/212292.html](http://www.cppblog.com/menjitianya/archive/2015/11/19/212292.html)

此处只讲题目和分析~



## 题目

**Description**

和人一样，牛也喜欢站得离朋友较近的位置。

FJ 有 $N (2 \leqslant N \leqslant 1000)$ 头牛，编号为 $1 \dots N$, 现在要设计一个顺序让他们站成一排给他们喂食。

奶牛们按照编号顺序依次站立，允许有多只牛站在同一位置（也就是说，牛 $i$ 和牛 $j$ $i < j$ 的站立位置 $s_{i}$, $s_{j}$ 一定满足 $s_{i} \leqslant s_{j}$, 如果 $s_{i} = s_{j}$,那么编号为 $i$ 到 $j$ 之间的牛也一定站在 $s_{i}$ 处）。

有一些牛相互喜欢，希望两牛的距离在某个范围内，同样也有一些牛相互不喜欢，希望两牛的距离大于等于某个距离，题目中给出 $ML(1 \leqslant ML \leqslant 10,000)$ 个限制描述相互喜欢的情况，给出 $MD(1 \leqslant MD \leqslant 10,000)$ 个限制描述相互不喜欢的情况。

你的任务是计算，如果存在某种方案满足上述要求，输出 $1$ 号牛和 $N$ 号牛之间的最大距离。

---

**Input**

第 $1$ 行, $3$ 个空格隔开的整数 $N$, $ML$, $MD$。

第 $2$ 到 $ML + 1$ 行, 每行包含 $3$ 个空格隔开的整数 $A$, $B$ 和 $D$, 满足 $1 \leqslant A \leqslant B \leqslant N$,表示牛 $A$ 和牛 $B$ 之间的距离不得超过 $D(1 \leqslant D \leqslant 1,000,000)$。

第 $ML + 2$ 到 $ML + MD + 1$ 行: 每行包含 $3$ 个空格隔开的整数 $A$, $B$ 和 $D$, 满足 $1 \leqslant A \leqslant B \leqslant N$,表示牛 $A$ 和牛 $B$ 之间的距离至少为$D(1 \leqslant D \leqslant 1,000,000)$。

---

**Output**

如果不存在这样的方案，输出 $-1$;

如果牛 $1$ 和牛 $N$ 之间的距离可以任意，输出 $-2$;

否则输出最大距离。

---

**Sample Input**

```
4 2 1
1 3 10
2 4 20
2 3 3
```

**Sample Output**

```
27
```

---

Hint

【样例说明】

最佳方案是 $1$ 到 $4$ 号牛依次放置于位置 $0, 7, 10, 27$。



## 思路

很明显的差分约束系统=-=(虽然考试时我知道大概是什么东西可是没学就是写不出来)

因为 $A < B$, 输入的 $u$ 必定小于 $v$ (这个 $u$ 和 $v$..就是变量啦 主要我的程序里是用这两个的 后面的 $w$ 也是)

我们把两种式子先列出来——

- 喜欢: 从 $u$ 到 $v$ 小于等于 $w$ 即 $v - u \leqslant w$

- 不喜欢: 从 $u$ 到 $v$ 大于等于 $w$ 即 $v - u \geqslant w$

好了 现在怎么处理呢

个人认为 因为要满足的约束条件绝对是比较小那个 那我们更新的时候要取最小的价值 则

将 不喜欢 的式子略作改动 取相反数 得 $u - v \leqslant -w$

看起来怪怪的 权值为负?? 没错 但因为什么blab不变定理(不等式式两边同时取反 改符号才满足条件)

具体到题目中就是 本题 $u$ 绝对小于等于 $v$ 则 $u - v \leqslant 0$ 说明原本的等式两边都不是正数 这样想想就正常了吧

然后邻接表存修改过的边 SPFA 一下就好(开始我还在怕判负环复杂度接近 $O(mn)$ 结果 3ms 过了...)

下放代码



## 代码



```cpp
#include <iostream>
#include <cstring>
#include <cstdio>
using namespace std;
const int MAX = 1 << 10;
struct Edge {
	int next,to,v;
}e[20010];
int first[MAX],dis[MAX],vis[MAX],pd[MAX],pre[MAX << 13],h,t;
void add(int x,int y,int z)
{
	e[++t].to = y;
	e[t].next = first[x];
	e[t].v = z;
	first[x] = t;
}
void reset()
{
	memset(dis,0x7f,sizeof(dis));
	dis[1] = 0;
	pre[1] = 1;
	vis[1] = 1;
	t = 1;
}
int main()
{
	int n,like,disl;
	scanf("%d%d%d",&n,&like,&disl);
	int u,v,w;
	for (int a=1;a<=like;++a) scanf("%d%d%d",&u,&v,&w),add(u,v,w);//存like的边
	for (int a=1;a<=disl;++a) scanf("%d%d%d",&u,&v,&w),add(v,u,-w);//存修改后的dislike的边
	reset();//为了在水题上显得更加高大上 初始化ban♂到子程序里
	while (h < t)//SPFA
	{
		int p = pre[++h];
		pd[p] = 0;
		for (int a = first[p],b = e[a].to ; a ; a = e[a].next,b = e[a].to)//典型的SPFA 不想注释=-=
			if (dis[b] > dis[p] + e[a].v)
			{
				dis[b] = dis[p] + e[a].v;
				if (++vis[b] >= n) {printf("-1\n"); return 0;}//判断负环:如果一个点被更新n次 就说明有负环
				if (!pd[b]) pd[b] = 1,pre[++t] = b;
			}
	}
	if (dis[n] == dis[0]) printf("-2\n"); else printf("%d\n",dis[n]);//如果dis[n]的数值没被改变 则图不连通 其间可以隔无限距离 输出-2
	return 0;
}
```

这题就这样啦 这题目注意存边的推导就好......



## 扩展

恶意评分(？)的[加强版戳这道题目](https://www.luogu.org/problemnew/show/P4878) 其中 hack 数据卡的是图的连通性 下放代码

另附关于hack数据的有关信息[点这里进去](https://www.luogu.org/discuss/show/64236?page=1)



```cpp
#include <cstring>
#include <cstdlib>
#include <cstdio>
using namespace std;
const int MAXN = 1010;
const int MAXM = 23333;
struct edge {
	int next,to,v;
} e[MAXM];
int first[MAXN],dis[MAXN],o[MAXN],apt[MAXN],pre[1 << 20],tot,n;
void add(int x,int y,int z)
{
	e[++tot].next = first[x];
	e[tot].to = y;
	e[tot].v = z;
	first[x] = tot;
}
void spfa(int st)
{
	memset(dis,0x7f,sizeof(dis));
	memset(apt,0,sizeof(apt));
	memset(pre,0,sizeof(pre));
	int h = 1,t = 1;
	pre[1] = st;
	dis[st] = 0;
	for (int p = pre[h] ; h <= t ; p = pre[++h],o[p] = 0)
	for (int a = first[p],b = e[a].to ; a ; a = e[a].next,b = e[a].to)
	if (dis[b] > dis[p] + e[a].v)
	{
		dis[b] = dis[p] + e[a].v;
		if (!o[b]) pre[++t] = b,o[b] = 1;
		if (++apt[b] > n) printf("-1\n"),exit(0);
	}//exit用到cstdlib 相当于退出整个程序并返回0
}
int main()
{
	int i,j,x,y,z;
	scanf("%d%d%d",&n,&i,&j);
	for (int a = 1 ; a <= n ; ++ a) add(0,a,0);
	for (int a = 1 ; a <= i ; ++ a) scanf("%d%d%d",&x,&y,&z),add(x,y,z);
	for (int a = 1 ; a <= j ; ++ a) scanf("%d%d%d",&x,&y,&z),add(y,x,-z);
	spfa(0),spfa(1);
	printf("%d\n",dis[n] == dis[0] ? -2 : dis[n]);
	return 0;
}
```
