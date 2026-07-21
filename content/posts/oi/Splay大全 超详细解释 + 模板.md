---
title: "Splay大全 超详细解释 + 模板"
date: "2018-08-12 21:03:18"
tags: ["oi"]
excerpt: "Splay"
sticky: true
---

## 前言

上个月开始打算手搓 Splay 然后被老师看见拉去做 USACO 题库..

然后这个月继续对着标的思路打 打完放上去.. 92 分? 改了很多次.. 92 分? 干脆直接把标程放上去.. 92 分? 气急败坏了

然后换了标程重复上续步骤..92分? 更坏了

重复多次步骤 然后跑了 57 遍 OK 过了 心力交瘁 少说码了 3w 字了

然而打的过程中我已经完全掌握了 Splay.. ~~(那你怎么只有92??)~~

好了不扯那么多 现在进入

## 1. Splay 基础

先翻翻概念了解一下 Splay 自行百度 或 [戳这里](https://blog.csdn.net/ric_shooter/article/details/20636487)

Splay 是什么呢 嗯..就是能让节点比较均匀地分布在树上的二叉搜索树 ~~又慢 代码又长 如果不是区间翻转常用和 LCT 要用到我才不学~~

在这里再略讲一下操作

先来看看核心的操作



### 1.1 旋转(Rotate)

请先打开给的概念的链接 (就是上面的那个[戳这里](https://blog.csdn.net/ric_shooter/article/details/20636487)) 翻到那个图的地方 看看两种旋转(配图真的超麻烦啊 这个后面常用到别关了啊)

首先要知道为什么要旋转

我们得到的树不一定是随机数据的 如果遇到毒瘤出题人给你几条长为 $1e5$ 的链 然后让你查询最底下的点 这当然会 T 的了

所以就要通过旋转 把下面一大段的东西掰到上面去

---

好了那我们说一下旋转 ~~旋转只有一种 那就是上旋~~ 旋转只有两种 那就是左旋和右旋

但是旋转要根据当前点的状态(是其父亲的哪个儿子)和当前点父亲的状态(有无父亲 是其父亲的哪个儿子)来判断

举个栗子 如果当前点是他父亲的左儿子 然后你让他左旋 不就断了么=-= ~~这是离间他们的亲子关系！~~

因此要根据其父和其祖父任意两代之间的相对位置判断左右旋

还是一个栗子 如果其父是其祖父的左儿子 右旋其父:

  关于旋转带来的点的元素改变..首先考虑先改变哪个点的关系 这里先定义当前点 $x$ 及其父亲 $y$ 还有其祖父 $z$ 以及方便左右旋设置的 $mode$ ($0$ 为右旋 $1$ 为左旋)

  祖父的点肯定是不变的啦 但 $x$ 和 $y$ 是会变的 因此 $z$ 的 父子关系会变更 先改这个..哒哒哒 改完啦

  然后就是 $x$ 和 $y$ 的 除子节点外的其他改变了的信息了 包括儿子从属 相对父子关系 这里要先判断一下是左旋还是右旋 更新一下 $mode$ Tip: 更新儿子从属关系可用异或 (想换成 `if` 也不是不行) 然后信息更改顺序可以随心换 但别漏了 =-=

  最后更新子节点数量 为什么呢? 因为 $x$ 的 儿子 和 $y$ 的 另一个儿子 是 不变的 然后更新完 $x$ 和 $y$ 后 就可以用两点的新的儿子轻易地改变其子节点数量 这里记得先更新 $y$ 的 因为 $y$ 更新后 变成了 $x$ 的 儿子 但是 其子节点数量还没变 最后更新 $x$ 的 子节点数量

下放代码片段

```cpp
void rotate(int x)
{
	int y = e[x].fa, z = e[y].fa,mode = 0;
	if (e[z].son[0] == y) e[z].son[0] = x;
	else e[z].son[1] = x;
	e[x].fa = z;
	//更新 z 的 有关元素
	if (e[y].son[0] == x) ++mode;
	e[y].son[mode ^ 1] = e[x].son[mode];
	e[e[x].son[mode]].fa = y;
	e[x].son[mode] = y;
	e[y].fa = x;
	//更新 x 和 y 的 关系 (互换)
	e[y].siz = e[e[y].son[0]].siz + e[e[y].son[1]].siz + e[y].tie;
	e[x].siz = e[e[x].son[0]].siz + e[e[x].son[1]].siz + e[x].tie;
	//最后更新子节点数量
}
```



### 1.2 展开 (Splay)

我的天呐不小心退了编辑界面又要重打 =-=

其实这个子程序就是 让一个点旋转到根 没旋转到继续旋 用的是一个 `while` (当前点还有父亲时) {Blabblab}

然后记一下当前点 $x$ 的父亲和祖父 分别为 $y$ 和 $z$

首先 如果当前点没有祖父 就只用旋转一次 就能到根 直接 `rotate` 他自己 Tip: 判断左旋右旋 在 `rotate` 子程序里

如果有祖父的话 就有四种情况了 这个时候 就先翻回上面的那个[戳这里](https://blog.csdn.net/ric_shooter/article/details/20636487) 然后翻一下那个图吧

看到了吗 如果相邻两代的从属关系是一样的(都是左儿子 或 都是右儿子) 就要先旋转当前点父亲 再旋转他自己

如果从属关系不一样 就直接旋转他自己 那个网站里讲的比较复杂 我翻了其他 dalao 的程序 居然可以用 异或

所以判断两从属关系一样时 `==` 就得 `1` 然后 `1 ^ 1 = 0` 或者 `0 ^ 0 = 0` 的时候 旋转其父

否则得到 `1` 就旋转他自己 妙哉！

当然如果这样的话 $mode$ 的赋值要丢到 `rotate` 里去了 (放外面我居然 TLE 八个点 还错了一个)

最后别忘了树根(root)也要更新 改成当前点

一次 `splay` 后 最坏情况(链)当前点插的地方的深度 居然可以减少一半！

所以**有事没事都要 `splay` 一下** 这是重点！

总之有时 `splay` 是为了方便处理问题 有时却是为了调整平衡

然后下放代码片段

```cpp
void splay(int x)
{
	while (e[x].fa)
	{
		int y = e[x].fa, z = e[y].fa;
		if (z) {
			if ((e[z].son[0] == y) ^ (e[y].son[0] == x)) rotate(x);
			else rotate(y);
		}
		rotate(x);
	}
	root = x;
}
```



### 1.3 删除 (delete)

这个理解比较麻烦 也分四种情况

**1.** 删除的值不存在

- 直接退掉啦

**2.** 删除的值大于一个

- 直接删掉一个出现次数就好啦

如果删除的值只有一个就麻烦了 Tip: 下面两种最后都要清空原根的各个元素 新根的父亲变为0

**3.** 删除的值只有一个 且 没有左儿子

- 这个的话..直接把当前根的右儿子变成根就好啦

**4.** 删除的值只有一个 且 有左儿子

- 这个我们要先切断左儿子和根的关系(只用先改左儿子的父亲元素 然后其父亲的修改可以和 3. 一起放判断外面改)
- 然后在左儿子处开始推 找到原根的左子树里最大的值
- 之后 把该左子树里最大的值旋转上来 并把他当成根
- 因为他没右儿子 (他是原根的左字数里最大的) 于是就可以把原根的右儿子接到新根上 更新关系
- 最后清空原根的各个元素 就行了

下放代码片段

```js
void del(int p)
{
	int pos = find(root, p);
	if (e[pos].v != p) return;
	splay(pos);
	if (e[pos].tie > 1) {
		--e[pos].tie;
		--e[pos].siz;
		return;
	}
	if (!e[pos].son[0]) {
		e[e[pos].son[1]].fa = 0;
		root = e[pos].son[1];
		if (!root) tot = 0;
	} else {
		e[e[pos].son[0]].fa = 0;
		int lax = find(e[pos].son[0],MAX);
		splay(lax);
		e[root].siz += e[e[pos].son[1]].siz;
		e[root].son[1] = e[pos].son[1];
		e[e[pos].son[1]].fa = root;
	}
	e[pos].v = 0;
	e[pos].tie = 0;
	e[pos].siz = 0;
	e[pos].fa = 0;
	e[pos].son[0] = 0;
	e[pos].son[1] = 0;
}
```

好啦 其他的操作就在代码里标一下吧 可以翻回上面的那个[戳这里](https://blog.csdn.net/ric_shooter/article/details/20636487)再仔细完整过一遍 我可能有一些地方没仔细讲（雾



### 1.4. 代码(详细注释)

下面是认真缩减但没怎么压行的代码 然后例题仍旧是[洛谷的模板](https://www.luogu.org/problemnew/show/P3369)哈

```cpp
#include <cstdio>
#define MAX 0x7fffffff //2147483647
#define MIN 0x80000000 //-2147483648
using namespace std;
const int MAXN = 100010;
struct Node_attribute {
	int fa,son[2],v,tie,siz;
} e[MAXN];
int root,tot;
void rotate(int x) //见上详解 懒得打了
{
	int y = e[x].fa, z = e[y].fa,mode = 0;
	if (e[z].son[0] == y) e[z].son[0] = x;
	else e[z].son[1] = x;
	e[x].fa = z;
	if (e[y].son[0] == x) ++mode;
	e[y].son[mode ^ 1] = e[x].son[mode];
	e[e[x].son[mode]].fa = y;
	e[x].son[mode] = y;
	e[y].fa = x;
	e[y].siz = e[e[y].son[0]].siz + e[e[y].son[1]].siz + e[y].tie;
	e[x].siz = e[e[x].son[0]].siz + e[e[x].son[1]].siz + e[x].tie;
}
void splay(int x) //见上详解 懒得打了
{
	while (e[x].fa)
	{
		int y = e[x].fa, z = e[y].fa;
		if (z) {
			if ((e[z].son[0] == y) ^ (e[y].son[0] == x)) rotate(x);
			else rotate(y);
		}
		rotate(x);
	}
	root = x;
}
int find(int now,int w) //查找函数是基于二叉搜索树的有序性(节点值按中序遍历从小到大)
{ //然后这个如果查找不到 就会返回与他相差最小的点
	while (e[now].v != w)
		if (w < e[now].v) { //比较值
			if (e[now].son[0]) now = e[now].son[0]; //值小则往左儿子走
			else break; //找不到 退出
		} else {
			if (e[now].son[1]) now = e[now].son[1]; //值大则往右儿子走
			else break; //找不到 退出
		}
	return now; //返回数值
}
void add(int f,int w)
{ //为了方便添加节点弄的子程序 把两种情况合在一起 可以不用 =-=
	e[++tot].fa = f;
	e[tot].tie = 1;
	e[tot].siz = 1;
	e[tot].v = w;
}
void ins(int p)
{
	if (!tot) { //空树
		add(0,p);
		root = 1;
		return;
	}
	int pos = find(root,p); //寻找点的位置 如果不存在 则为匹配加入点的父亲
	if (e[pos].v == p) e[pos].tie++; else { //如果当前值存在 其出现次数 + 1 否则...
		add(pos,p); //新增节点
		if (p < e[pos].v) e[pos].son[0] = tot; //家庭分配儿子承包责任制
		else e[pos].son[1] = tot;
	} //这两句并不会覆盖原有的点哦 因为..原本这地方不会有点呀 或者只有一个 但不是他的位置
	for (int now = pos ; now ; ++e[now].siz,now = e[now].fa); //当前点及其所有祖先的子节点个数要 + 1
	if (e[pos].v == p) splay(pos); //如果点存在 旋转他到根
	else splay(tot); //否则新加的点旋转到根
}
void del(int p)
{
	int pos = find(root, p);
	if (e[pos].v != p) return;
	splay(pos); //旋转到根方便最后两种情况处理
	if (e[pos].tie > 1) {
		--e[pos].tie;
		--e[pos].siz;
		return;
	}
	if (!e[pos].son[0]) {
		e[e[pos].son[1]].fa = 0;
		root = e[pos].son[1];
		if (!root) tot = 0;
	} else {
		e[e[pos].son[0]].fa = 0;
		int lax = find(e[pos].son[0],MAX);
		splay(lax);
		e[root].siz += e[e[pos].son[1]].siz;
		e[root].son[1] = e[pos].son[1];
		e[e[pos].son[1]].fa = root;
	}
	e[pos].v = 0; //清空原来的点的相关数据
	e[pos].tie = 0;
	e[pos].siz = 0;
	e[pos].fa = 0;
	e[pos].son[0] = 0;
	e[pos].son[1] = 0;
}
int rank(int p) //查找当前数排名
{
	int pos = find(root, p);
	splay(pos);
	return e[e[pos].son[0]].siz + 1;
} //根据他的某个孩子节点数推断他的排名 这里从小排所以是左儿子 当然别忘了 + 1
int k_th(int p) //查找排名第p的数
{
	int now = root; //从根找起 bot bottle 因为某东西实在太长 为了缩减 用该变量代替
	for (int bot = e[e[now].son[0]].siz ; p <= bot ||
		 p > bot + e[now].tie ; bot = e[e[now].son[0]].siz)
		if (p > bot + e[now].tie) {
			p = p - bot - e[now].tie;
			now = e[now].son[1];
		} else now = e[now].son[0];
	/*------------------------------------------------------
	首先now是根 如果他左儿子个数大于p 则说明第p名在左儿子里面
	如果左儿子个数加上他本身出现的个数 那就说明第p名在右儿子里面
	但这里要注意 p要相应地减去now点的左儿子个数和now点的出现次数 因为之后判断是根据新的儿子
	但之前的节点及那个节点的左儿子对他还有影响
	最后更新一下now 然后作为容器的bot也要随之更新
	------------------------------------------------------*/
	return e[now].v; //返回排名第p的点的值
}
int pred(int p) //找前驱 最接近他且严格小于他的点
{
	int pos = find(root,p); //先找到p的位置
	if (e[pos].v < p) return e[pos].v; //如果找到的不是p点 判断一下找到的点的大小 符合就输出
	splay(pos); //随时旋转
	return e[find(e[pos].son[0],MAX)].v;
} //从p的位置的左儿子找里面最大的 就是最接近p的 然后输出其值
int succ(int p) //找后继 最接近他且严格大于他的点
{
	int pos = find(root,p); //先找到p的位置
	if (e[pos].v > p) return e[pos].v; //如果找到的不是p点 判断一下找到的点的大小 符合就输出
	splay(pos); //随时旋转
	return e[find(e[pos].son[1],MIN)].v;
} //从p的位置的右儿子找里面最小的 就是最接近p的 然后输出其值
int main()
{
	int m,mode,x;
	scanf("%d",&m);
	while (m--)
	{
		scanf("%d%d",&mode,&x);
		switch (mode)
		{
			case 1:ins(x);break;
			case 2:del(x);break;
			case 3:printf("%d\n",rank(x));break;
			case 4:printf("%d\n",k_th(x));break;
			case 5:printf("%d\n",pred(x));break;
			case 6:printf("%d\n",succ(x));break;
		}
	}
}
```



### 1.5 代码(纯净版)

然后存一下自己略微简化的代码 **区间翻转在下面在下面**~

```cpp
#include <cstdio>
using namespace std;
const int MAXN = 100010;
const int MAX = 0x7fffffff;
const int MIN = -0x7fffffff;
struct splay {
	int fa,son[2],siz,tie,v;
} e[MAXN];
int root,tot;
inline int r()
{
	char q = getchar(); int x = 0,y = 0;
	while (q < '0' && q != '-' || q > '9') q = getchar();
	if (q == '-') ++ y,q = getchar();
	while ('0' <= q && q <= '9')
		x = (x << 3) + (x << 1) + q - (3 << 4),q = getchar();
	return y ? -x : x;
}
inline void rotate(int x)
{
	int y = e[x].fa,z = e[y].fa,mode = e[y].son[0] == x;
	e[z].son[e[z].son[1] == y] = x;
	e[x].fa = z;
	e[y].son[mode ^ 1] = e[x].son[mode];
	e[e[x].son[mode]].fa = y;
	e[x].son[mode] = y;
	e[y].fa = x;
	e[y].siz = e[e[y].son[0]].siz + e[e[y].son[1]].siz + e[y].tie;
	e[x].siz = e[e[x].son[0]].siz + e[e[x].son[1]].siz + e[x].tie;
}
inline void splay(int x)
{
	while (e[x].fa)
	{
		int y = e[x].fa,z = e[y].fa;
		if (z) {
			if ((e[y].son[0] == x) ^ e[z].son[0] == y) rotate(x);
			else rotate(y);
		} rotate(x);
	}
	root = x;
}
inline int find(int now,int w)
{
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
inline void add(int f,int w)
{
	e[++tot].fa = f;
	e[tot].siz = 1;
	e[tot].tie = 1;
	e[tot].v = w;
}
inline void ins(int p)
{
	if (!tot) {add(0,p),root = 1; return;}
	int pos = find(root,p);
	if (e[pos].v == p) ++e[pos].tie; else
	add(pos,p),e[pos].son[p > e[pos].v] = tot;
	for (int now = pos ; now ; ++e[now].siz,now = e[now].fa);
	splay(e[pos].v == p ? pos : tot);
}
inline void del(int p)
{
	int pos = find(root,p);
	if (e[pos].v != p) return;
	splay(pos);
	if (e[pos].tie > 1) {--e[pos].tie,--e[pos].siz; return;}
	if (!e[pos].son[0])
	{
		e[e[pos].son[1]].fa = 0;
		root = e[pos].son[1];
		if (!root) tot = 0;
	} else {
		e[e[pos].son[0]].fa = 0;
		int lax = find(e[pos].son[0],MAX);
		splay(lax);
		e[root].siz += e[e[pos].son[1]].siz;
		e[root].son[1] = e[pos].son[1];
		e[e[pos].son[1]].fa = root;
	}
	e[pos].son[0] = 0;
	e[pos].son[1] = 0;
	e[pos].siz = 0;
	e[pos].tie = 0;
	e[pos].fa = 0;
	e[pos].v = 0;
}
inline int rnk(int p)
{
	int pos = find(root,p); splay(pos);
	return e[e[pos].son[0]].siz + 1;
}
inline int kth(int ex)
{
	int now = root;
	for (int bot = e[e[now].son[0]].siz ; ex <= bot ||
		ex > bot + e[now].tie ; bot = e[e[now].son[0]].siz)
		if (ex > bot + e[now].tie) {
			ex -= bot + e[now].tie;
			now = e[now].son[1];
		} else now = e[now].son[0];
	return e[now].v;
}
inline int pre(int p)
{
	int pos = find(root,p); splay(pos);
	return e[pos].v < p ? e[pos].v : e[find(e[pos].son[0],MAX)].v;
}
inline int suc(int p)
{
	int pos = find(root,p); splay(pos);
	return e[pos].v > p ? e[pos].v : e[find(e[pos].son[1],MIN)].v;
}
int main()
{
	int m = r(),mode,x;
	while (m--) {
		mode = r(),x = r();
		switch (mode)
		{
			case 1:ins(x);break;
			case 2:del(x);break;
			case 3:printf("%d\n",rnk(x));break;
			case 4:printf("%d\n",kth(x));break;
			case 5:printf("%d\n",pre(x));break;
			case 6:printf("%d\n",suc(x));break;
		}
	}
	return 0;
}
```



## 2. 带区间翻转的 Splay

2018.10.29 好了好了区间翻转搞定了 之前翻成固定的位置了..



### 2.1 区间翻转(reverse)

话说区间翻转真是个神奇的东西 这里放[一个模板题](https://www.luogu.org/problemnew/show/P3391) 然后接下来的讨论围绕该题展开

在区间翻转里面呢 我们就要撇开二叉搜索树的性质了 因为翻转后权值显然会错乱 所以我们要维护的是点的位置

然后因为旋转区间的问题..我们要在区间最左和最右各多加一个点 然后最后处理询问..等会看代码吧别忘了

这里直接引入线段树中 lazy tag 的概念 一个点打懒标记表示其左右子树交换 下面会讲到

我们区间(此处区间是按相对位置排的)翻转为什么要交换左右子树？这里直接按套路丢假设了

设我们要查区间 $[l, r]$ 把 $l - 1$ 转到 `root` 处 然后把 $r + 1$ 转到 `root` 的右儿子处 (因为 $r$ 相对位置大啊)

当然把 $r + 1$ 旋到 `root` 处 然后把 $l - 1$ 转到 `root` 的左儿子处 也可以过 因为原理相同 我也试着打了下~~也就改了几行~~

我们就不分类讨论了 用第一种举例 **看 $[l, r]$ 点所在的位置！** 此时——

![](/images/content/oi/2018_08_12_1.png)

$l$ 和 $r$ 是连在一块的！

然后我们逐层交换 然后不画图了 我解释一下为什么

比如区间 $[1, 8]$ 设左边为 $[1, 3]$ 右边为 $[4, 8]$ 第一次旋转 $[4, 8]$ 到左边了 $[1, 3]$ 到右边了

然后区间 $[4, 8]$ 设左边为 $[4, 5]$ 右边为 $[6, 8]$ 第二次旋转 $[6, 8]$ 到左边了 $[4, 5]$ 到右边了

最后区间 $[4, 5]$ 设一边一个 翻转后就是 $5$ 和 $4$

其他区间也这样并上去 就能得到 $[8, 1]$ 递减的区间

当然我们不必每次区间翻都更新一下 那样超麻烦 打个 lazy 标记 然后就行了

交换时 只用交换该点儿子就可以了 当然其他一些东西还是要变变 该点 lazy 要清空 像这样

```cpp
inline void swap(int x)
{
	int bot = e[x].son[0];
	e[x].son[0] = e[x].son[1];
	e[x].son[1] = bot;
	//(上面)交换儿子位置
	e[e[x].son[0]].laz ^= 1; //这里是有标记变成没的 没标记变成有的
	e[e[x].son[1]].laz ^= 1; //之前讲2.splay中有 ^ 的有关讲解
	e[x].laz = 0; //为什么标记有没有可以换?因为旋转两次等于没旋转啊
}
```

接下来说说什么时候要更新 lazy 标记

肯定是 `splay` 的时候啦 **但是**

因为维护区间时找第 $k$ 个点不是直接找 $[k]$ 的点 而是 `siz` 第 $k$ 大的点

所以我们从上往下找 `kth` 的时候就需要更新 lazy 标记 因此在 `splay` 之前需要下放的 lazy 标记就放好了

这里的 `kth` 和 上面的 `kth` 差不多 不过因为按 `siz` 存 判断是 `k` 和 `左子树 + 1` 的大小情况:

```cpp
inline int kth(int now,int ex) //now当前点 ex第k大
{
	if (e[now].laz) swap(now);
	int bot = e[e[now].son[0]].siz + 1;
	if (ex == bot) return now;
	if (ex <  bot) return kth(e[now].son[0],ex);
	return kth(e[now].son[1],ex - bot);
}
```

而且因为按 `siz` 存 `rotate` 那块地方的代码也要改改 其中两行变成这样

```cpp
//	e[y].siz = e[e[y].son[0]].siz + e[e[y].son[1]].siz + e[y].tie;
//	e[x].siz = e[e[x].son[0]].siz + e[e[x].son[1]].siz + e[x].tie;
	e[y].siz = e[e[y].son[0]].siz + e[e[y].son[1]].siz + 1;
	e[x].siz = e[e[x].son[0]].siz + e[e[x].son[1]].siz + 1;
//看得出区别吧= =
```

最后讨论一下初始建树 初始建树有两种

- 第一种是 `insert` 自行上翻
- 第二种直接用类似线段树的初始化 `build` 为保持平衡 取总的 `mid` 为 `root` 然后再建 `[1,mid - 1]` 和 `[mid + 1,n]` 记得 `mid` 不会递归下去！

然后更新各种东西 进去的时候别忘了每个点 `size` 初始为 `1` 哈

往下 `build` 后当前点的肯定有个父亲 关系也要更新 所以 `build` 传进去的变量要加一个 `f`

当前点所在的当前层主要就顺便更新自己(因为更新当前点儿子放当前层要算左右两边的 `mid` 很麻烦)

然后最后等儿子们都更新完了 那当前点 `size` 就加上两子树的 `size`

Tip1: 当 $l = r$ 的时候 不用往下 `build` 了 所以这前面加个判定

Tip2: 因为 `build(l , mid - 1)` 的情况 $l$ 有可能大于 $r$ 这个要在开头就 `return` 不然..

Tip3: 其实这样的话 `[0]` 的 `son` 会更新到 `mid` 但我发现并不影响就没管了= =

`build` 部分代码放下面

```cpp
inline void build(int l,int r,int f)
{
	if (l > r) return;
	int mid = (l + r) >> 1;
	e[f].son[mid > f] = mid;
	e[mid].fa = f;
	++e[mid].siz;
	if (l == r) return;
	build(l,mid - 1,mid);
	build(mid + 1,r,mid);
	e[mid].siz += e[e[mid].son[0]].siz + e[e[mid].son[1]].siz;
}
```

最后[模板题](https://www.luogu.org/problemnew/show/P3391)这里再放一个 代码放下面



### 2.2 代码

```cpp
#include <cstdio>
using namespace std;
const int MAXN = 100010;
struct splay {
	int son[2],fa,siz,laz;
} e[MAXN];
int ans[MAXN],root,tot;
inline int re()
{
	char q = getchar(); int x = 0;
	while (q < '0' || q > '9') q = getchar();
	while ('0' <= q && q <= '9')
		x = (x << 3) + (x << 1) + q - (3 << 4),q = getchar();
	return x;
}
inline void build(int l,int r,int f)
{
	if (l > r) return;
	int mid = (l + r) >> 1;
	e[f].son[mid > f] = mid;
	e[mid].fa = f;
	++e[mid].siz;
	if (l == r) return;
	build(l,mid - 1,mid);
	build(mid + 1,r,mid);
	e[mid].siz += e[e[mid].son[0]].siz + e[e[mid].son[1]].siz;
}
inline void swap(int x)
{
	int bot = e[x].son[0];
	e[x].son[0] = e[x].son[1];
	e[x].son[1] = bot;
	e[e[x].son[0]].laz ^= 1;
	e[e[x].son[1]].laz ^= 1;
	e[x].laz = 0;
}
inline void rotate(int x)
{
	int y = e[x].fa,z = e[y].fa,mode = e[y].son[0] == x;
	e[z].son[e[z].son[1] == y] = x;
	e[x].fa = z;
	e[y].son[mode ^ 1] = e[x].son[mode];
	e[e[x].son[mode]].fa = y;
	e[x].son[mode] = y;
	e[y].fa = x;
	e[y].siz = e[e[y].son[0]].siz + e[e[y].son[1]].siz + 1;
	e[x].siz = e[e[x].son[0]].siz + e[e[x].son[1]].siz + 1;
}
inline void splay(int x,int top)
{
	while (e[x].fa != top)
	{
		int y = e[x].fa,z = e[y].fa;
		if (z != top) {
			if ((e[y].son[0] == x) ^ (e[z].son[0] == y)) rotate(x);
			else rotate(y);
		}
		rotate(x);
	}
}
inline int kth(int now,int ex)
{
	if (e[now].laz) swap(now);
	int bot = e[e[now].son[0]].siz + 1;
	if (ex == bot) return now;
	if (ex <  bot) return kth(e[now].son[0],ex);
	return kth(e[now].son[1],ex - bot);
}
int main()
{
	int n = re(),m = re();
	root = (n + 3) >> 1;
	build(1,n + 2,0);
	while (m--)
	{
		int i = kth(root,re()),j = kth(root,re() + 2);
		splay(i,0),root = i;
		splay(j,root);
		e[e[e[root].son[1]].son[0]].laz ^= 1;
	}
	for (int a = 2 ; a <= n + 1 ; ++ a) printf("%d ",kth(root,a) - 1);
	return 0;
}
```
