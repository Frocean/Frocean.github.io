---
title: "【USACO题库】4.2.2 The Perfect Stall 完美的牛栏 || 匈牙利算法 && 二分图最大匹配"
date: "2018-08-07 07:53:24"
tags: ["oi"]
excerpt: "匈牙利算法与二分图最大匹配"
---

总是听说这个东西，今天总算见识到了..~~Upd: 学了以后我还是喜欢打网络流~~

概念什么的戳[这篇文章](https://blog.csdn.net/dark_scope/article/details/8880547) 通俗易懂 老少皆宜 童叟无欺 **里面是重点！下面没有讲解！**



## 题目

农夫约翰上个星期刚刚建好了他的新牛棚，他使用了最新的挤奶技术。

不幸的是，由于工程问题，每个牛栏都不一样。第一个星期，农夫约翰随便地让奶牛们进入牛栏，但是问题很快地显露出来：每头奶牛都只愿意在她们喜欢的那些牛栏中产奶。

上个星期，农夫约翰刚刚收集到了奶牛们的爱好的信息（每头奶牛喜欢在哪些牛栏产奶）。一个牛栏只能容纳一头奶牛，当然，一头奶牛只能在一个牛栏中产奶。

给出奶牛们的爱好的信息，计算最大分配方案。

---

**INPUT FORMAT**

<table>
  <tr>
    <td style="white-space: nowrap;"><strong>第一行</strong></td>
    <td>
	  两个整数, $N(0 \leqslant N \leqslant 200)$ 和 $M(0 \leqslant M \leqslant 200)$。<br>
	  $N$ 是农夫约翰的奶牛数量，$M$ 是新牛棚的牛栏数量。
	</td>
  </tr>
  <tr>
    <td style="white-space: nowrap;"><strong>第二行到<br>第 $N + 1$ 行</strong></td>
    <td>
	  一共 $N$ 行，每行对应一只奶牛。<br>
	  第一个数字($S_{i}$)是这头奶牛愿意在其中产奶的牛栏的数目 $(0 \leqslant S_{i} \leqslant M$。后面的 $S_{i}$ 个数表示这些牛栏的编号。<br>
	  牛栏的编号限定在区间 $(1 \dots M)$ 中，在同一行，一个牛栏不会被列出两次。
	</td>
  </tr>
</table>

**SAMPLE INPUT**

```
5 5
2 2 5
3 2 3 4
2 1 5
3 1 2 5
1 2 
```

**OUTPUT FORMAT**

只有一行。输出一个整数，表示最多能分配到的牛栏的数量。

**SAMPLE OUTPUT**

```
4
```



## 思路

很经典的二分图匹配有木有~

牛栏放一边 牛放一边 然后匈牙利算法直接套上即可

下放代码



## 代码

```cpp
#include <cstring>
#include <cstdio>
using namespace std;
const int MAX = 205;
struct Edge {
	int next,to;
} e[MAX * MAX];
int first[MAX],vis[MAX],mat[MAX];
int n,m,tot;
void add(int x,int y)
{ //邻接表存边
	e[++tot].next = first[x];
	e[tot].to = y;
	first[x] = tot;
}
bool dfs(int p)
{
	for (int b = first[p],c = e[b].to ; b ; b = e[b].next,c = e[b].to)
	if (!vis[c]) //没访问过
	{
		vis[c] = 1; //标记
		if (!mat[c] || dfs(mat[c])) //已经匹配 或 能转移把该点空着
		{ //更新答案 返回true
			mat[c] = p;
			return 1;
		}
	}
	return 0; //返回false
}
int main()
{
	scanf("%d%d",&n,&m);
	for (int x,a = 1 ; a <= n ; ++ a)
	{
		scanf("%d",&x);
		for (int y,b = 1 ; b <= x ; ++ b)
		{
			scanf("%d",&y);
			add(a,y);
		}
	}
	tot = 0;
	for (int a = 1 ; a <= n ; ++ a)
	{
		memset(vis,0,sizeof(vis)); //每轮匹配都要清空访问标记
		if (dfs(a)) ++tot; //匹配成功则更新答案
	}
	printf("%d\n",tot);
	return 0;
}
```
