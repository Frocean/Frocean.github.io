---
title: "树套树(线段树套Splay) 模板 + 详解"
date: "2019-04-18 17:45:12"
tags: ["oi"]
excerpt: "树套树之线段树套 Splay "
sticky: true
---

## 1. 前言

~~（退役的我又诈尸了）~~

又是一个毒瘤东西 =-=

当初看不懂概念于是没管 上个月看见某日报上讲了下发现莫名其妙地看明白了

于是就照着概念自己又摸了下来 于是差不多成型了

然后通过 [@千年之狐_天才](https://www.luogu.com.cn/user/54113) 的帮助 调了调细节(改权值空树 ins 时炸掉了然后改成先 ins 再 del 这个一定要记得啊)

好了开讲



## 2. 正文

前置知识 {{< relref-blank "Splay大全 超详细解释 + 模板" >}}Splay{{< /relref-blank >}}~~(对是我的)~~ + 线段树 + 由于询问和主席树差不多 最好了解一下？~~(我的主席树要看好久为了不浪费 dalao 们的时间还是不放了)~~

有一些方法是延续自我的 Splay 中的 比如 `ins` 和 `del` 之类的 当然下面也有纯净代码 但如果需要详细了解对应操作记得戳进我的文章 ~~总之知道意思就行~~

概念？这个[日报](https://qiu.blog.luogu.org/qian-tan-shu-tao-shu-xian-duan-shu-tao-ping-heng-shu-post)还是不错的 有配图 请先点开看看 然后我再来口胡一通

首先我们需要设定一个情境先 如何维护[这道题目的五个操作](https://www.luogu.org/problemnew/show/P3380)呢？

第 $k$ 大 改权值 前驱后继 随便来个平衡树就可以了嘛 然而 "区间" 二字..

于是线段树就出来了 想想看 你一个个枚举不如用线段树部分部分记是不是？

再然后线段树貌似存不了平衡树要求的大部分信息啊..怎么办？

于是线段树每个节点糊个平衡树上去 平衡树我只会 Splay 那我们就用 Splay 吧~~(喂喂好不负责啊)~~

为什么这样是可以的呢？因为原来的平衡树上的操作是可以通过合并区间得到的 详细实现见上面[日报](https://qiu.blog.luogu.org/qian-tan-shu-tao-shu-xian-duan-shu-tao-ping-heng-shu-post)..

哦不 操作我要讲的 别抢了我饭碗



### 2.1 建树

好 我们先开始建树

话说我们有了序列 $[1,n]$ 后 我们像线段树一样 `build` 一个线段树出来 然后我们就得考虑怎么弄 Splay 进去了

所以我们线段树大概是这样建的

```cpp
inline void build(int l,int r,int len) {
	if (l == r) {
		seg[len].sum = v[l];
		seg[len].mx = v[l];
		seg[len].v = v[l];
		return;
	}
	int mid = (l + r) >> 1;
	build(l,mid,len << 1);
	build(mid + 1,r,len << 1 | 1);
	seg[len].sum = seg[len << 1].sum + seg[len << 1 | 1].sum;
	seg[len].mx = max(seg[len << 1].mx,seg[len << 1 | 1].mx);
}
```

在树套树里面我们主要是用各个 Splay 的 于是线段树上不用存什么东西 但是每个节点要保证连接到该节点的 Splay 上

主要是因为 Splay 大小都不一样 为了省空间只能邻接 像主席树里面存各个 edition 一样

于是我们就..把上面求和求 max 存权什么的都咔擦掉就好啦 当然要加个 `ins`

原本大概是这样子的(`root` 数组就是所谓存每个线段树上挂的 Splay 的根的位置)

```cpp
inline void build(int l,int r,int len) {
	root[len] = ++tot;
	for (int p = l ; p <= r ; ++ p) ins(len,v[p]);
	if (l == r) return;
	int mid = (l + r) >> 1;
	build(l,mid,len << 1);
	build(mid + 1,r,len << 1 | 1);
}
```

但是为了让 `ins` 里面不判断没根情况 于是我改成了这个毒瘤东西

```cpp
inline void build(int l,int r,int len) {
	root[len] = ++tot;
	e[tot].siz = 1;
	e[tot].tie = 1;
	e[tot].v = v[r]; //这个单个点也算进去了 顺便处理了无根情况
	if (l == r) return;
	int mid = (l + r) >> 1;
	build(l,mid,len << 1);
	build(mid + 1,r,len << 1 | 1);
	for (int p = l ; p < r ; ++ p) ins(len,v[p]); //这里少个r就好啦
}
```

~~于是这就是我在修改权值先 `del` 后树空然后 `ins` 进空树炸掉的原因 改到崩溃~~

然后 `ins` 和 `del` 顺便也放出来了吧 这里 `ins` 少了无根情况 `del` 也少了无根情况

既然这两个都放了 里面用到的 `splay`, `rotate`, `find` 也放出来吧 我丢下面了

这些都是{{< relref-blank "Splay大全 超详细解释 + 模板" >}}Splay{{< /relref-blank >}}的基本操作 就不多加阐述了

~~不会？戳进去看包教不包会~~

然后因为各个不同的 Splay 查值都要用同一个 `find` 函数 于是原来的 `root` 换成 `root[len]`

还有 `splay` 函数里面因为有换根操作 所以在外面不能像 `find` 一样代个 `root[len]` 进去

这些细节一定要非常清楚啊 代错了要找好久的

`rotate` 里面帮我纠错的 dalao 说更新 $x$ 可以放 `splay` 函数里面 快上许多 想想还真是的

~~`add` 函数是我为了代码能压行自己加的 如果不想用可以 `ins` 函数里面自己糊上~~

```cpp
inline void rotate(int x) {
	int y = e[x].fa,z = e[y].fa,mode = e[y].son[0] == x;
	e[z].son[e[z].son[1] == y] = x;
	e[x].fa = z;
	e[y].son[mode ^ 1] = e[x].son[mode];
	e[e[x].son[mode]].fa = y;
	e[x].son[mode] = y;
	e[y].fa = x;
	e[y].siz = e[e[y].son[0]].siz + e[e[y].son[1]].siz + e[y].tie;
}
inline void splay(int rt,int x) {
	while (e[x].fa) {
		int y = e[x].fa,z = e[y].fa;
		if (z) {
			(e[y].son[1]==x)^(e[z].son[1]==y)?rotate(x):rotate(y);
		} rotate(x);
	} root[rt] = x;
	e[x].siz = e[e[x].son[0]].siz + e[e[x].son[1]].siz + e[x].tie;
}
inline int find(int now,int w) {
	while (e[now].v != w)
		if (e[now].v > w) {
			if (e[now].son[0]) now = e[now].son[0];
			else break;
		} else {
			if (e[now].son[1]) now = e[now].son[1];
			else break;
		}
	return now;
}
inline void add(int f,int w) {
	e[++tot].fa = f;
	e[tot].siz = 1;
	e[tot].tie = 1;
	e[tot].v = w;
}
inline void ins(int rt,int p) {
	int pos = find(root[rt],p);
	if (e[pos].v == p) ++e[pos].tie; else
	add(pos,p),e[pos].son[e[pos].v < p] = tot;
	for (int now = pos ; now ; ++e[now].siz,now = e[now].fa);
	splay(rt,e[pos].v == p ? pos : tot);
}
inline void del(int len,int p) {
	int pos = find(root[len],p); splay(len,pos);
	if (e[pos].tie > 1) {--e[pos].tie,--e[pos].siz; return;}
	if (!e[pos].son[0])
		e[e[pos].son[1]].fa = 0,
		root[len] = e[pos].son[1];
    else {
		e[e[pos].son[0]].fa = 0;
		int lax = find(e[pos].son[0],INF);
		splay(len,lax);
		int rt = root[len];
		e[rt].siz += e[e[pos].son[1]].siz;
		e[rt].son[1] = e[pos].son[1];
		e[e[pos].son[1]].fa = rt;
	}
	e[pos].son[0] = 0;
	e[pos].son[1] = 0;
	e[pos].siz = 0;
	e[pos].tie = 0;
	e[pos].v = 0;
}
```

于是建树差不多完了 顺便修改操作的板子也打好了 那么我们先看一下修改操作：



### 2.2 修改某一位置上的数值(Case 3)

因为是单点修改 而且涉及到多个线段树上的点 所以很干脆的不用懒标记 并且沿树下去一个个修改

你想想嘛 你要修改第 $2$ 个 序列总长是 $[1,8]$ 那除了它 $[1,4]$, $[1,2]$, $[2,2]$ 你也要修改嘛 很多个 Splay 挂在线段树上的诶

于是下面直接搬代码了

主程序中: 有个改权值 然后 `lim` 是什么在 case 2 里会讲到

```cpp
case 3:update(1,n,1,i,j),v[i] = j,lim = max(lim,v[i]);break;
```

因为可能有无根情况 在 `update` 的时候 先 `ins` 再 `del` ~~就是这个坑 丢了90分(好押韵a)~~

```cpp
inline void update(int l,int r,int len,int i,int w) {
	ins(len,w),del(len,v[i]);
	if (l == r) return;
	int mid = (l + r) >> 1;
	if (i <= mid) update(l,mid,len << 1,i,w);
	else update(mid + 1,r,len << 1 | 1,i,w);
}
```

和当初建树差不多有木有 所以不用多讲了

好了接下来按操作顺序解决



### 2.3 查询 $k$ 在区间内的排名 (Case 1)

主程序内:

```cpp
case 1:k = re(),printf("%d\n",rank(1,n,1,i,j,k) + 1);break;
```

`+ 1` 是因为找排名的时候是找比他小的 然后 `+ 1` 就到它了

主要是查 case 1 的时候数可能不在当前区间内(甚至总区间都没有) 于是就成这样了

话说这里面因为是找区间的 所以在 $[1,n]$ 的大树上找显然不行 于是就往下找到完全符合的区间再合并

所以函数 `rank` 是跑线段树 然后再根据遍历到的线段树的点的 `root[len]` 代进 `rnk` 函数里面

`rnk` 函数就是 `splay` 里面的找当前权值排位的啦 不多说了

对了 case 1 和 case 2 的 `rank` 和 `rnk` 函数都是共用的 因为我太懒了......

好了 下面放代码了

```cpp
inline int rnk(int rt,int p) {
	int pos = find(root[rt],p); splay(rt,pos);
	return e[e[pos].son[0]].siz+(e[pos].v<p?e[pos].tie:0);
}
inline int rank(int l,int r,int len,int i,int j,int k) {
	if (i <= l && r <= j) return rnk(len,k);
	int mid = (l + r) >> 1,ans = 0;
	if (i <= mid) ans = rank(l,mid,len << 1,i,j,k);
	if (mid < j) ans += rank(mid + 1,r,len << 1 | 1,i,j,k);
	return ans;
}
```



### 2.4 查询区间内排名为 $k$ 的值(Case 2)

这个操作特别恶心 我们那么多个区间并上去 怎么找嘛

dalao 们提供了一种十分优秀的方法——二分序列最大值每次都判当前 $l$ 和 $r$ 的 平均数的排名

如果大于等于了 说明满足条件 $r$ 就掉到 $mid$

如果小于了 说明不满足条件 $l$ 就变成 $mid + 1$

这样还能确保找到的数最小 就是不会出现返回的数不在序列里面的情况

因为答案更新必定是因为区间内有的数嘛 然后更新时我们跳到 $mid$ 那 $mid$ 肯定在区间内

所以大于等于直接跳到 $mid$ 小于就跨过 $mid$

很清楚了 再补充一点 序列最大值是 $[1,n]$ 的最大值 这个可以在读入的时候处理出来

然后 case 3 的时候改权值顺便更新一下~~(然而我没更新交上去还是过了 刚刚才想起来)~~

那么下放代码

```cpp
inline int tkth(int i,int j,int k) {
	int mx = lim;
	for (int rk,mn=0,mi=(mn+mx)>>1;mn!=mx;mi=(mn+mx)>>1)
	rk=rank(1,n,1,i,j,mi+1),rk<k?mn=mi+1:mx=mi;
	return mx;
}
```



### 2.5 查询 $k$ 在区间内的前驱/后继(Case 4 & 5)

(前驱定义为严格小于 $x$ 且最大的数，若不存在输出 $-2147483647$)

(后继定义为严格大于 $x$ 且最小的数，若不存在输出 $2147483647$)

主程序内:

```cpp
case 4:k = re(),printf("%d\n",fpre(1,n,1,i,j,k));break;
case 5:k = re(),printf("%d\n",fsuc(1,n,1,i,j,k));break;
```

查前驱后继也是分两部分 先跑进线段树的 然后再进入 Splay 的

线段树 的里面就放一个变量 `bottle` 存 然后左右两儿子的答案取最值再并上去

`bottle` 一开始是 `0x7fffffff` 或者 `-0x7fffffff` 的 因为题目要求没前驱/后继就输出这个 而且没前驱/后继的时候返回答案也不怕被更新

注意找前驱不能大于等于那个数 所以有两个 `if` 判断

Splay 的里面就直接是 Splay 的 找前驱后继了 ~~(不会？记得看我的{{< relref-blank "Splay大全 超详细解释 + 模板" >}}Splay{{< /relref-blank >}})~~

所以下放代码

```cpp
inline int pre(int rt,int p) {
	int pos = find(root[rt],p); splay(rt,pos);
	return e[pos].v<p?e[pos].v:e[pos].son[0]?e[find(e[pos].son[0],INF)].v:-INF;
}
inline int fpre(int l,int r,int len,int i,int j,int k) {
	if (i <= l && r <= j) return pre(len,k);
	int mid = (l + r) >> 1,ans = -INF,bot = -INF;
	if (i <= mid) bot = fpre(l,mid,len << 1,i,j,k);
	if (bot > ans && bot < k) ans = bot;
	if (mid < j) bot = fpre(mid + 1,r,len << 1 | 1,i,j,k);
	if (bot > ans && bot < k) ans = bot;
	return ans;
}
inline int suc(int rt,int p) {
	int pos = find(root[rt],p); splay(rt,pos);
	return e[pos].v>p?e[pos].v:e[pos].son[1]?e[find(e[pos].son[1],0)].v:INF;
}
inline int fsuc(int l,int r,int len,int i,int j,int k) {
	if (i <= l && r <= j) return suc(len,k);
	int mid = (l + r) >> 1,ans = INF,bot=INF;
	if (i <= mid) bot = fsuc(l,mid,len << 1,i,j,k);
	if (bot < ans && bot > k) ans = bot;
	if (mid < j) bot = fsuc(mid + 1,r,len << 1 | 1,i,j,k);
	if (bot < ans && bot > k) ans = bot;
	return ans;
}
```



## 3. 代码

好了下面是总代码 然后[题目链接](https://www.luogu.org/problemnew/show/P3380)这里再放一个吧

挺长的呢 不过已经完了 ~~(哎为了打这个多留了半小时 今天饭堂都差不多没菜了 所以如果不懂别怪我啦QvQ 不懂的地方说出来我继续教嘛)~~

```cpp
#include <algorithm>
#include <cstring>
#include <cstdio>
#define N 50010
#define INF 0x7fffffff
inline int re() {
	int x = 0,y = 0; char q = getchar();
	while (q < '0' && q != '-' || q > '9') q = getchar();
	if (q == '-') ++ y,q = getchar();
	while ('0' <= q && q <= '9') x = x * 10 + q - 48,q = getchar();
	return y ? -x : x;
}
struct splay{int fa,son[2],siz,tie,v;}e[N << 6];
int tr[N << 2],root[N << 2],v[N],tot,lim,n = re(),m = re();
inline int max(int x,int y) {return x > y ? x : y;}
inline void rotate(int x) {
	int y = e[x].fa,z = e[y].fa,mode = e[y].son[0] == x;
	e[z].son[e[z].son[1] == y] = x;
	e[x].fa = z;
	e[y].son[mode ^ 1] = e[x].son[mode];
	e[e[x].son[mode]].fa = y;
	e[x].son[mode] = y;
	e[y].fa = x;
	e[y].siz = e[e[y].son[0]].siz + e[e[y].son[1]].siz + e[y].tie;
}
inline void splay(int rt,int x) {
	while (e[x].fa) {
		int y = e[x].fa,z = e[y].fa;
		if (z) {
			(e[y].son[1]==x)^(e[z].son[1]==y)?rotate(x):rotate(y);
		} rotate(x);
	} root[rt] = x;
	e[x].siz = e[e[x].son[0]].siz + e[e[x].son[1]].siz + e[x].tie;
}
inline int find(int now,int w) {
	while (e[now].v != w)
		if (e[now].v > w) {
			if (e[now].son[0]) now = e[now].son[0];
			else break;
		} else {
			if (e[now].son[1]) now = e[now].son[1];
			else break;
		}
	return now;
}
inline void add(int f,int w) {
	e[++tot].fa = f;
	e[tot].siz = 1;
	e[tot].tie = 1;
	e[tot].v = w;
}
inline void ins(int rt,int p) {
	int pos = find(root[rt],p);
	if (e[pos].v == p) ++e[pos].tie; else
	add(pos,p),e[pos].son[e[pos].v < p] = tot;
	for (int now = pos ; now ; ++e[now].siz,now = e[now].fa);
	splay(rt,e[pos].v == p ? pos : tot);
}
inline void del(int len,int p) {
	int pos = find(root[len],p); splay(len,pos);
	if (e[pos].tie > 1) {--e[pos].tie,--e[pos].siz; return;}
	if (!e[pos].son[0])
		e[e[pos].son[1]].fa = 0,
		root[len] = e[pos].son[1];
    else {
		e[e[pos].son[0]].fa = 0;
		int lax = find(e[pos].son[0],INF);
		splay(len,lax);
		int rt = root[len];
		e[rt].siz += e[e[pos].son[1]].siz;
		e[rt].son[1] = e[pos].son[1];
		e[e[pos].son[1]].fa = rt;
	}
	e[pos].son[0] = 0;
	e[pos].son[1] = 0;
	e[pos].siz = 0;
	e[pos].tie = 0;
	e[pos].v = 0;
}
inline void build(int l,int r,int len) {
	root[len] = ++tot;
	e[tot].siz = 1;
	e[tot].tie = 1;
	e[tot].v = v[r];
	if (l == r) return;
	int mid = (l + r) >> 1;
	build(l,mid,len << 1);
	build(mid + 1,r,len << 1 | 1);
	for (int p = l ; p < r ; ++ p) ins(len,v[p]);
}
inline int rnk(int rt,int p) {
	int pos = find(root[rt],p); splay(rt,pos);
	return e[e[pos].son[0]].siz+(e[pos].v<p?e[pos].tie:0);
}
inline int rank(int l,int r,int len,int i,int j,int k) {
	if (i <= l && r <= j) return rnk(len,k);
	int mid = (l + r) >> 1,ans = 0;
	if (i <= mid) ans = rank(l,mid,len << 1,i,j,k);
	if (mid < j) ans += rank(mid + 1,r,len << 1 | 1,i,j,k);
	return ans;
}
inline int tkth(int i,int j,int k) {
	int mx = lim;
	for (int rk,mn=0,mi=(mn+mx)>>1;mn!=mx;mi=(mn+mx)>>1)
	rk=rank(1,n,1,i,j,mi+1),rk<k?mn=mi+1:mx=mi;
	return mx;
}
inline void update(int l,int r,int len,int i,int w) {
	ins(len,w),del(len,v[i]);
	if (l == r) return;
	int mid = (l + r) >> 1;
	if (i <= mid) update(l,mid,len << 1,i,w);
	else update(mid + 1,r,len << 1 | 1,i,w);
}
inline int pre(int rt,int p) {
	int pos = find(root[rt],p); splay(rt,pos);
	return e[pos].v<p?e[pos].v:e[pos].son[0]?e[find(e[pos].son[0],INF)].v:-INF;
}
inline int fpre(int l,int r,int len,int i,int j,int k) {
	if (i <= l && r <= j) return pre(len,k);
	int mid = (l + r) >> 1,ans = -INF,bot = -INF;
	if (i <= mid) bot = fpre(l,mid,len << 1,i,j,k);
	if (bot > ans && bot < k) ans = bot;
	if (mid < j) bot = fpre(mid + 1,r,len << 1 | 1,i,j,k);
	if (bot > ans && bot < k) ans = bot;
	return ans;
}
inline int suc(int rt,int p) {
	int pos = find(root[rt],p); splay(rt,pos);
	return e[pos].v>p?e[pos].v:e[pos].son[1]?e[find(e[pos].son[1],0)].v:INF;
}
inline int fsuc(int l,int r,int len,int i,int j,int k) {
	if (i <= l && r <= j) return suc(len,k);
	int mid = (l + r) >> 1,ans = INF,bot=INF;
	if (i <= mid) bot = fsuc(l,mid,len << 1,i,j,k);
	if (bot < ans && bot > k) ans = bot;
	if (mid < j) bot = fsuc(mid + 1,r,len << 1 | 1,i,j,k);
	if (bot < ans && bot > k) ans = bot;
	return ans;
}
int main() {
	for (int a = 1 ; a <= n ; ++ a) lim = max(lim,v[a] = re());
	build(1,n,1);
	for (int op,i,j,k ; m ; -- m) {
		op = re(),i = re(),j = re();
		switch (op) {
			case 1:k = re(),printf("%d\n",rank(1,n,1,i,j,k) + 1);break;
			case 2:k = re(),printf("%d\n",tkth(i,j,k));break;
			case 3:update(1,n,1,i,j),v[i] = j,lim = max(lim,v[i]);break;
			case 4:k = re(),printf("%d\n",fpre(1,n,1,i,j,k));break;
			case 5:k = re(),printf("%d\n",fsuc(1,n,1,i,j,k));break;
		}
	}
	return 0;
}
```
