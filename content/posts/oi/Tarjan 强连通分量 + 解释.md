---
title: "Tarjan 强连通分量 + 解释"
date: "2018-09-23 12:04:10"
tags: ["oi"]
excerpt: "Tarjan"
---

日常补东西 这次是 Tarjan 算法 原理还是别翻我这里了..但其他的倒是挺详细的~~



## 题目

[题目](https://www.luogu.org/problemnew/show/P2863)大意:

$n(2 \leqslant n \leqslant 10000)$ 个点, $m(2 \leqslant m \leqslant 50000)$ 条边

求大于 $1$ 的强连通分量的个数

好了 Tarjan 算法走起

#### 思路

主要是遍历的思路

Tarjan 算法最主要的还是两个数组

`dfn` 用来表示当前点的 dfs 序编号 (同树剖那个 `id`) 就是记录当前点是第几个被遍历到的

`low` 则表示当前点所在强连通分量的"根" 就是该强连通分量的点中编号最小的那个 主要用途就是当 `dfn[p] == low[p]` 时说明该强连通分量搜完了 然后存下来

还有一个数组 (我个人叫他 `from`) 用来存某点所在的强连通分量的编号 但本题用不到 这个更新...放在弹出栈的循环里

说到遍历的话 这里用栈(stack 然而我嫌名字太长用 `que` 代替 虽然实际上队列和栈不是同一个东西) 每搜到一个点就丢进去 如何遍历呢

先把最重要的 `dfn` 和 `low` 的 值赋了 一开始 `low` 的值 等于遍历的这个点的 `dfn` 值

因为一个点的 `dfn` 值 等于其 `low` 值 的时候 说明这是一个强连通分量的根(开始的时候是一样的 就是把每个点都当成一个强连通分量 之后再去搜索 合并)

然后我们进行 dfs 等到搜到之前的点了 说明此时的点就可以更新到之前某处的点 于是回溯之后该点的上一个点 上两个点 上三个点......搜到那个点了 就都能连到一块了 这样一个大的强连通分量就出来了

如果搜到最后没点继续往下走了 都散了散了 这里没有大于一的强连通分量

但所有的点都要搜到 没搜到的点的话还要继续 Tarjan 在不一定完全连通的图里面也是要用到的

于是用一个日常的 `o` 数组 判断是否找过 没找过就从那个点开始 tarjan 即可

遍历完了怎么办? 开始弹出该强连通分量的所有点 当然别忘了弹出根 建议用 `do{} while()` 然而我是用 `while()` 外面再加一次的

2018.12.15 Update: 打仙人掌的时候发现无向图用 Tarjan 的时候要判父亲不能回去 有向图无向图区别就这个

之后根据题目所需自己瞎搞搞就好 本题代码放下来 [链接这里再放一个](https://www.luogu.org/problemnew/show/P2863)



## 代码

```cpp
#include <cstdio>
using namespace std;
const int MAXN = 10010;
const int MAXM = 100010;
struct edge {
	int to,next;
} e[MAXM];
int first[MAXN],dfn[MAXN],low[MAXN],que[MAXN],num[MAXN]/*,id[MAXN]*/;
int g,tot,t;
short o[MAXN];
int min(int x,int y) {return x < y ? x : y;}
void add(int x,int y)
{ //邻接存边哇
	e[++tot].next = first[x];
	e[tot].to = y;
	first[x] = tot;
}
void tarjan(int p)
{
	dfn[p] = ++tot; //存点遍历id
	low[p] = tot; //存点属于的强连通分量的根
	que[++t] = p; //栈 方便处理整个环
	o[p] = 1; //标记为访问过
	int b;
	for (int a = first[p] ; a ; a = e[a].next)
	{ //遍历
		b = e[a].to; //(下行)如果下面点没遍历过就dfs下去 然后low取最小看看是不是比自己的dfn小
		if (!dfn[b]) tarjan(b),low[p] = min(low[p],low[b]); else //如果小的话说明在一环中
		if (o[b]) low[p] = min(low[p],dfn[b]); //如果找到个环了直接更新成环顶 这个时候不要弹出来更新啊
	}
	if (dfn[p] == low[p]) //找到强连通分量的根了!然而有可能是单个点= =
	{ //通过上面的dfs可以保证绝对会转完一圈或者动都没动
		++g;//存强连通分量编号 有些dfn和low不等的点这里省去了
		while (que[t] != p) /*id[que[t]] = p,*/
		++num[g],o[que[t--]] = 0;//加p点为根的强连通分量的点数&弹出
		++num[g],o[que[t--]] = 0;//最后p点在里面没算就弹出来了要再弄一下
	}
}
int main()
{
	int n,m,x,y;
	scanf("%d%d",&n,&m); while (m--)
	scanf("%d%d",&x,&y),add(x,y);
	tot = 0; for (int a = 1 ; a <= n ; ++ a) if (!o[a]) tarjan(a); //万一图不连通= =
	tot = 0; for (int a = 1 ; a <= g ; ++ a) if (num[a] > 1) ++tot;
	printf("%d\n",tot);
	return 0;
}
```
