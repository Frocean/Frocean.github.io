---
title: "动态树 之 Link-Cut Tree (LCT)"
date: "2018-11-01 22:52:47"
tags: ["oi"]
excerpt: "动态树问题与 数据结构 Link-Cut Tree(LCT)"
sticky: true
---

## 前言

原理啥的实在不想写(加上原理要写的也太多了) 主要讲各个操作的代码实现

感谢 [@Harry_bh](https://www.luogu.com.cn/user/19951) 钦自为本人写了篇题解 于是本人就学会了

现在想想为了个 LCT 我学的东西还挺多的



## 1. Link-Cut Tree

前置知识 {{< relref-blank "Splay大全 超详细解释 + 模板" >}}Splay{{< /relref-blank >}}(力推我的) + [树链剖分](https://www.cnblogs.com/George1994/p/7821357.html)(最好理解) 我当各位对这些都很熟练了啊QAQ

原理概念之类的戳[这里](https://blog.csdn.net/attack666/article/details/80854225) 他讲的挺不错的 然后本篇主要记记操作和程序上的细节

话说 LCT 里相关操作的子程序好多 讲起来比较乱 首先我们选定一个[模板题](https://www.luogu.org/problemnew/show/P3690) 然后相关基础操作围绕此题展开

先把核心操作丢上面 然后分询问要求放相关操作 建议浏览顺序: Link $\to$ delete $\to$ change(date) $\to$ query(get) 然后多翻几遍核心操作就会啦

注: 个人习惯原因 有些子程序名字会相替换 括号内的是个人习惯名称



### 1.1 isroot(pdroot)

这个就是判断当前点是不是它所在的 splay 的根了啦 ~~其实我也不想放前面但后面常常用到~~

如果一个点是根 那它父亲就和它没什么关系了 在树上一大把 splay 的 LCT 上 连接它们的只是各个根的父亲丢到上面的 splay 里

所以一个根的父亲的儿子不会指向它！我们可以利用这个性质判断一个点是不是它所在 splay 的根

代码只有一行 见下~~(说四行的我不打你)~~

```cpp
inline short pdroot(int x)
{
	return (e[e[x].fa].son[0] != x) && (e[e[x].fa].son[1] != x);
}
```

然后我先把 `splay` 相关的内容(方法)放出来好了 这样看着 LCT 亲切点



### 1.2 pushup(update)

这个地方除了 `rotate` 其他时候也要用到哦 因为不止这地方换了父子从属关系

所以码成了个方法调用= = 本题里就是维护路径的异或和

下放相应代码

```cpp
inline void update(int x)
{
	e[x].ans = e[e[x].son[0]].ans ^ e[e[x].son[1]].ans ^ e[x].v;
}
```



## 1.3 pushdown

就是下放旋转的 lazy 标记

和 splay 区间翻的完全一样啦 ~~(什么？不会？快去看我的{{< relref-blank "Splay大全 超详细解释 + 模板" >}}Splay{{< /relref-blank >}}~~

下放相应代码

```cpp
inline void pushdown(int x)
{
	if (!e[x].laz) return;
	int bot = e[x].son[0];
	e[x].son[0] = e[x].son[1];
	e[x].son[1] = bot;
	e[e[x].son[0]].laz ^= 1;
	e[e[x].son[1]].laz ^= 1;
	e[x].laz = 0;
}
```



### 1.4 relax(change)

这个就是在换父子关系前同一将涉及到的点的 lazy 标记下放

因为某些原因我们只能从底下那个点找起 但是标记更新要从最上面啊

所以递归 然后从最上面更新 这里利用 `pushdown`

其实 `pushdown` 和 `relax` 只有 `splay` 里面涉及到= =其他代码块不用 ~~(直接调用整个 `splay`)~~

下放相应代码

```cpp
inline void change(int x)
{
	if (!pdroot(x)) change(e[x].fa);
	pushdown(x);
}
```

### 1.5 splay

许多人的 `splay`(包括我)的循环判断都是 父节点不为 $0$ 的时候往下跑

但 LCT 里面很多 splay 而且判断父节点是不是出去了很麻烦

于是判断当前点是不是根就好啦 往上翻 1. 的 `isroot` 其他照常 `splay`

下放相应代码

```cpp
inline void splay(int x)
{
	change(x);
	while (!pdroot(x))
	{
		int y = e[x].fa,z = e[y].fa;
		if (!pdroot(y)) {
			if ((e[z].son[0] == y) ^ (e[y].son[0] == x)) rotate(x);
			else rotate(y);
		} rotate(x);
	}
}
```



### 1.6 rotate

对了就是熟悉的 `rotate` 但是有不同的地方 ($x$ 是当前点 $y$ 是父亲 $z$ 是祖父)

这里关于 $z$ 的话 如上 1. `isroot` 中所说 如果 $z$ 和 $x$ 不是同一 `splay` 中的话 $z$ 的孩子就不用更新成 $x$

所以这里丢个判定就好了啦 然后..这类题目不用维护 size 喜大普奔 但是求答案还是要维护下

下放代码(关于求答案 到时候 `access` 从根连起来直接找根的答案数组就可以输出了)

```cpp
inline void rotate(int x)
{
	int y = e[x].fa,z = e[y].fa,mode = e[y].son[0] == x;
	if (!pdroot(y)) e[z].son[e[z].son[1] == y] = x;
	e[x].fa = z;
	e[y].son[mode ^ 1] = e[x].son[mode];
	e[e[x].son[mode]].fa = y;
	e[x].son[mode] = y;
	e[y].fa = x;
	update(y); //update先后关系注意 和splay一样先子后父
	update(x);
}
```

好了 splay 相关讲完了 下面就是 LCT 的核心部分了(上面也包括了的哈)



### 1.7 access

这个大有用处了 作用是把某点和原树的根所在路径变成重边

然后因为性质之类的 需要把原重边 (如果不一样) 换成轻边

这个用处= =之后会提到的 就是方便处理问题(因为要处理的两个数会是打通的重边的两个最外面的点)

然后怎么更新呢 首先断掉要通到的点的儿子

然后我们要 `splay` 一下 因为这样可使连着当前点的重边在点的右儿子处

然后更新当前点儿子 这里和首先断点可以连起来 设个变量一开始为 `0` 然后第一次更新的点重儿子通向 `0` 就是无重儿子了

很巧妙 然后后面把当前点记录 之后推到它父亲的时候把它父亲的重儿子记录到它上面 再更新它

`splay` 之后的更新也会使当前点的儿子变化 所以要 `update` 当前点的异或和的答案

下放代码

```cpp
inline void access(int x)
{
	for (int y = 0 ; x ; y = x,x = e[x].fa)
	{
		splay(x);
		e[x].son[1] = y;
		update(x);
	}
}
```



### 1.8 makeroot

就是把某个点变成它所在的 splay 的根啦

首先打通它到原树根的路径 使得它为全树深度最大 然后把它弄到根 根据 splay 的性质 这时候它是没有右儿子的

然后为了处理该点和另外一个点的相对关系 (对 `makeroot` 就是让这两点产生更亲♂密的关系的)

我们用 `access` 和 `splay` 把当前点通到根 然后还要预翻转一下 设当前点为 $x$ 另一点为 $y$

这样使得处理 $y$ 点时 因为处理 $y$ 点时必有 `access` 使得之后的 `splay` 变成两点中的唯一简单路径

然后 `splay `把 $x + 1$ 到 $y$ 翻转 $y$ 就是 $x + 1$(在那个地方) 于是可以通过父子关系处理操作

绝妙！ 不说了丢代码

```cpp
inline void makeroot(int x)
{
	access(x);
	splay(x);
	e[x].laz ^= 1;
}
```

好了好了接下来依次处理本题的询问 首先是 `link` 的两个



### 1.9 findroot(f)

就是找当前点所在的 splay 的 root 啦

首先打通 然后当前点旋到根 然后..

显然是深度往上跳嘛 那就找左儿子啦 深度减小嘛

直到找到某点儿子不是它 说明它儿子和它是属于不同的树了的 返回它即可

下放代码

```cpp
inline int f(int p)
{
	access(p),splay(p);
	while (e[p].son[0]) p = e[p].son[0];
	return p;
}
```



### 1.10 link

就是连接两点嘛 首先先判两点是否联通 ~~如果联通还连边那这种题是不能用 LCT 做的了qwq~~

然后让其中一个点旋到根 那它是没父亲的了

把它父亲变成另外一个点 那就连起来了啦

另外一个点的儿子不用更新 不然原本的就乱了 这个等之后处理其他操作的时候整理就好

下放代码

```cpp
inline void link(int x,int y)
{
	if (f(x) != f(y)) makeroot(x),e[x].fa = y;
}
```



### 1.11 delete(dele)

删边 同 `link` 一样要先 `makeroot` 其中一个点 但删边对两点的相对关系要求更多 我们要把两点弄到一块

对了 `makeroot` 里面翻转使得两点丢到一块了

设两点为 $x$ 点和 $y$ 点

于是 此时 $x$ 变成根了 然后 $y$ 的深度就是 $x + 1$

但是这样很可能 $y$ 在 $x$ 的右儿子的左子树里面

所以 $y$ 旋上去 然后比 $y$ 小的 只有 $x$ 于是 $x$ 必定是其左儿子

先判定一下是不是 $x$ 嘛 如果不是说明 $(x,y)$ 这条边不存在

然后父子关系都清零就好了

下放代码

```cpp
inline void dele(int x,int y)
{
	makeroot(x);
	access(y);
	splay(y);
	if (e[y].son[0] == x) e[y].son[0] = 0,e[x].fa = 0;
}
```



### 1.12 modify(date)

原本想用update的但是重名了= =

就是更新点权 超简单的

当前点权直接换掉 旋到根

splay经典操作不多讲了

下放代码

```cpp
inline void date(int x,int y)
{
	e[x].v = y;
	splay(x);
}
```



### 1.13 query(get)

好了 最后的查询

一个点丢到根上面 `makeroot` 大法好

`access` 打通到另一个点 然后两点间简单路径的异或和就是答案~~

但是！这两操作是把链提取出来了 但我们要得到整棵 splay 的答案 就需要 `splay` 另一个点 然后再返回根节点的值

所以还要把另一个点旋上来 输出这个点的答案

下放代码

```cpp
inline int get(int x,int y)
{
	makeroot(x);
	access(y);
	splay(y);
	return e[y].ans;
}
```



### 1.14 完整代码

好了好了总算完了=-= 下面塞个总的代码

[模板的链接](https://www.luogu.org/problemnew/show/P3690)这里再丢一个

```cpp
#include <cstdio>
#define I inline
#define like int
#define love void
using namespace std;
const int MAXN = 300010;
struct lct {
	int fa,son[2],ans,laz,v;
} e[MAXN];
I like r()
{
	char q = getchar(); int x = 0,y = 0;
	while (q < '0' && q != '-' || q > '9') q = getchar();
	if (q == '-') ++ y,q = getchar();
	while ('0' <= q && q <= '9')
		x = (x << 3) + (x << 1) + q - (3 << 4),q = getchar();
	return y ? -x : x;
}
I like pdroot(int x)
{
	return e[e[x].fa].son[0] != x && e[e[x].fa].son[1] != x;
}
I love pushdown(int x)
{
	if (!e[x].laz) return;
	int bot = e[x].son[0];
	e[x].son[0] = e[x].son[1];
	e[x].son[1] = bot;
	e[e[x].son[0]].laz ^= 1;
	e[e[x].son[1]].laz ^= 1;
	e[x].laz = 0;
}
I love change(int x)
{
	if (!pdroot(x)) change(e[x].fa);
	pushdown(x);
}
I love update(int x)
{
	e[x].ans = e[e[x].son[0]].ans ^ e[e[x].son[1]].ans ^ e[x].v;
}
I love rotate(int x)
{
	int y = e[x].fa,z = e[y].fa,mode = e[y].son[0] == x;
	if (!pdroot(y)) e[z].son[e[z].son[1] == y] = x;
	e[x].fa = z;
	e[y].son[mode ^ 1] = e[x].son[mode];
	e[e[x].son[mode]].fa = y;
	e[x].son[mode] = y;
	e[y].fa = x;
	update(y);
	update(x);
}
I love splay(int x)
{
	change(x);
	while (!pdroot(x))
	{
		int y = e[x].fa,z = e[y].fa;
		if (!pdroot(y)) {
			if ((e[z].son[0] == y) ^ (e[y].son[0] == x)) rotate(x);
			else rotate(y);
		} rotate(x);
	}
}
I love access(int x)
{
	for (int y = 0 ; x ; y = x,x = e[x].fa)
	{
		splay(x);
		e[x].son[1] = y;
		update(x);
	}
}
I like f(int p)
{
	access(p),splay(p);
	while (e[p].son[0]) p = e[p].son[0];
	return p;
}
I love makeroot(int x)
{
	access(x);
	splay(x);
	e[x].laz ^= 1;
}
I like get(int x,int y)
{
	makeroot(x);
	access(y);
	splay(y);
	return e[y].ans;
}
I love link(int x,int y)
{
	if (f(x) != f(y)) makeroot(x),e[x].fa = y;
}
I love dele(int x,int y)
{
	makeroot(x);
	access(y);
	splay(y);
	if (e[y].son[0] == x) e[y].son[0] = 0,e[x].fa = 0;
}
I love date(int x,int y)
{
	e[x].v = y;
	splay(x);
}
int main()
{
	int n = r(),m = r();
	for (int a = 1 ; a <= n ; ++ a) e[a].ans = e[a].v = r();
	while (m--)
	{
		int mode = r(),x = r(),y = r();
		switch (mode)
		{
			case 0:printf("%d\n",get(x,y));break;
			case 1:link(x,y);break;
			case 2:dele(x,y);break;
			case 3:date(x,y);break;
		}
	}
	return 0;
}
```



## 2. 扩展

2018.11.4 update: 万般借鉴然后瞎搞一天半终于搞出 [LCT模板2](https://www.luogu.org/problemnew/show/P1501) (lazy 加法乘法下放) 了

这题..就是多了两个 lazy 标记

这里标记和 `siz` 差不多维护就好了呀 对于操作就是放到那个点上 更新那个点值 然后标记放放

因此换父子关系的时候就要处理两子节点 然后更新两子节点的值

其他照常 对了建图用 `link` 就好了啦

下放代码

```cpp
#include <cstdio>
#define mod 51061
#define MAXN 100010
#define ll long long
using namespace std;
struct splay {
	int fa,son[2],siz,rot;
	ll ans,v,laz1,laz2;
} e[MAXN];
inline int r()
{
	char q = getchar(); int x = 0,y = 0;
	while (q < '0' && q != '-' || q > '9') q = getchar();
	if (q == '-') ++ y,q = getchar();
	while ('0' <= q && q <= '9')
		x = (x << 3) + (x << 1) + q - (3 << 4),q = getchar();
	return y ? -x : x;
}
inline short pdroot(int x)
{
	return e[e[x].fa].son[0] != x && e[e[x].fa].son[1] != x;
}
inline void update(int x)
{
	e[x].siz = e[e[x].son[0]].siz + e[e[x].son[1]].siz + 1;
	e[x].ans = (e[e[x].son[0]].ans + e[e[x].son[1]].ans + e[x].v) % mod;
}
inline void muldown(int x,ll k)
{
	e[x].laz1 = e[x].laz1 * k % mod;
	e[x].laz2 = e[x].laz2 * k % mod;
	e[x].ans = e[x].ans * k % mod;
	e[x].v = e[x].v * k % mod;
}
inline void adddown(int x,ll k)
{
	e[x].ans = (e[x].ans + e[x].siz * k) % mod;
	e[x].laz1 = (e[x].laz1 + k) % mod;
	e[x].v = (e[x].v + k) % mod;
}
inline void rotdown(int x)
{
	int bot = e[x].son[0];
	e[x].son[0] = e[x].son[1];
	e[x].son[1] = bot;
	e[x].rot ^= 1;
}
inline void pushdown(int x)
{
	if (e[x].laz2 != 1)
	{
		muldown(e[x].son[0],e[x].laz2);
		muldown(e[x].son[1],e[x].laz2);
		e[x].laz2 = 1;
	}
	if (e[x].laz1)
	{
		adddown(e[x].son[0],e[x].laz1);
		adddown(e[x].son[1],e[x].laz1);
		e[x].laz1 = 0;
	}
	if (!e[x].rot) return;
	rotdown(e[x].son[0]);
	rotdown(e[x].son[1]);
	e[x].rot = 0;
}
inline void rotate(int x)
{
	int y = e[x].fa,z = e[y].fa,mode = e[y].son[0] == x;
	if (!pdroot(y)) e[z].son[e[z].son[1] == y] = x;
	e[x].fa = z;
	e[y].son[mode ^ 1] = e[x].son[mode];
	e[e[x].son[mode]].fa = y;
	e[x].son[mode] = y;
	e[y].fa = x;
	update(y);
	update(x);
}
inline void change(int x)
{
	if (!pdroot(x)) change(e[x].fa);
	pushdown(x);
}
inline void splay(int x)
{
	change(x);
	while (!pdroot(x))
	{
		int y = e[x].fa,z = e[y].fa;
		if (!pdroot(y)) {
			if ((e[z].son[0] == y) ^ (e[y].son[0] == x)) rotate(x);
			else rotate(y);
		} rotate(x);
	}
}
inline void access(int x)
{
	for (int y = 0 ; x ; y = x,x = e[x].fa)
	{
		splay(x);
		e[x].son[1] = y;
		update(x);
	}
}
inline void makeroot(int x)
{
	access(x);
	splay(x);
	rotdown(x);
}
inline void link()
{
	int x = r(),y = r();
	makeroot(x);
	e[x].fa = y;
}
inline void delink()
{
	int x = r(),y = r();
	makeroot(x);
	access(y);
	splay(y);
	e[x].fa = 0;
	e[y].son[0] = 0;
	update(y);
	link();
}
inline void add()
{
	int x = r(),y = r();
	makeroot(x);
	access(y);
	splay(y);
	ll k = r();
	adddown(y,k);
}
inline void mul()
{
	int x = r(),y = r();
	makeroot(x);
	access(y);
	splay(y);
	ll k = r();
	muldown(y,k);
}
inline void get()
{
	int x = r(),y = r();
	makeroot(x);
	access(y);
	splay(y);
	printf("%d\n",e[y].ans);
}
int main()
{
	int n = r(),q = r(),x,y;
	for (int a = 1 ; a <= n ; ++ a)
	{
		e[a].v = 1;
		e[a].siz = 1;
		e[a].laz2 = 1;
	}
	for (int a = 1 ; a < n ; ++ a) link();
	char w[1 << 2];
	while (q--)
	{
		scanf("%s",w);
		switch (w[0])
		{
			case '-':delink();break;
			case '+':add();break;
			case '*':mul();break;
			case '/':get();break;
		}
	}
	return 0;
}
```

收工！学其他东西去惹~
