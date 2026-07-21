---
title: "AC自动机 详解 + 模板"
date: "2018-06-30 16:18:36"
tags: ["oi"]
excerpt: "AC自动机"
---

## 正文

KMP 大多是用来解决 单串单串匹配 的问题的~

AC 自动机则是在 KMP 的基础上 用来解决一大串里面的许多小串 出现次数出现位置 出现个数 等问题的

总之就是 Tried 树 + KMP + 融合贯通 = AC自动机

首先 AC 自动机的建立需要一个 Tried 树 然后转化成 Tried 图

Tried 图就是在每个 tired 树上的每个节点的所有分支(不论存不存在) 连上一条接向树上其他节点的边 接向的位置要连到该前缀上一次匹配的点找最优

Tried 树的部分在这里码一下 注释见代码里面

首先我们定义 Tried 图为一个结构体——

```
// 大小之类的看情况吧 最多和全部被查询字符串长度总和一样 根据空间大小适当合理地调整减他一大半
struct tree {
	int to[26];  // 该位字母 连向的下一位字母节点 (此处 26 是标号 'a'~'z'的 需根据题目比如有大小写就改成 52 之类的)
	int ed,f;  // ed: 该位字母是否是一个字符串的结尾(是多少个字符串的结尾) f 见下
} tr[1 << 20];  // f: 如果匹配到该位字母正好失配 应该跳向哪个字符串的哪个位置 继续匹配
```

Tip1: 这里 `to[26]` 是 `0` 下标开始 即 `a, b, .., z` 通向 `to[0], to[1], .., to[25]`

Tip2: 感觉 `char` 比 string 慢一点？ 要用 `char` 也是可以的 但别用 `1` 下标 即 `scanf("%s",i + 1);` 超慢 应该是频繁计算 `+1` 导致的

Tip3: 本题是有相同字串的 因此在下面代码最后一行是 `++` 这个要根据题目要求灵活变化

```cpp
string i;
cin >> i;//读入要搜索的字符串
pos = 0;//以0为总结点 即第0位字母(不存在)
	for (int b = 0 ; b < i.size() ; b ++)//一位一位加入字符串里的字符 注意string类型0下标
 	{
 		int c = i[b] - 'a';//找到该位字符应接到哪里
 			if (!tr[pos].to[c]) tr[pos].to[c] = ++tot;//如果树里没有这个串 该字母加入到树末
 		pos = tr[pos].to[c];//以该字母在树中的位置继续寻找
	}
++tr[pos].ed;//此时读完一串了 此时pos是该字符串末尾在树中的位置 因此在此打标记 作为字符串的结尾
```

于是 Tried 树建好了 之后自然是 Tried 图啦 但是怎么建呢？

我之前貌似说过什么.."在每个 tired 树上的每个节点的所有分支(不论存不存在) 连上一条接向树上其他节点的边"

Right~这里我们引入队列 `que` 我这里用 `pre` 代替 ~~(天知道我为什么要用 `pre` 这个奇怪的名字)~~

队列头和尾都设为 `0`(为 `1` 也没问题 随便改改即可) 队列长度嘛 也要根据空间大小适当合理地调整减他一大半

队列开始空的 我们如果直接查询 还要在开始移动队首时判断 程序太麻烦 NG

于是我们预处理一下第一层

```cpp
for (int a = 0 ; a < 26 ; a++)  // 此处是查询是否存在以a到z开头的字符串
	if (tr[0].to[a]) pre[++t] = tr[0].to[a];  // 如果有就把该字符所在字典的位置记录
```

这样 队列里就有数了对不对

Tip: 其实该句 `if` 后面应该加上 `else tr[0].f = 0` 的 但是数组初始化已经被赋为 `0` 了 理解概念时要记住

然后开始拓展查询 对于存在的拓展的点 需使他的失配节点 匹配到他父亲的 通向他那个字母的 失配节点

因为此处队列的查询类似 bfs 他父亲通向他的失配节点会比他的失配节点早搜寻到

关于这样为什么是最优的 你想想你现在匹配了 $a$ 个字符了 然后下一个匹配不过去 就跳回匹配了 $a - 1$ 个字符的状态 从那里的 $26$ 个分支继续拓展 如果都不行就再退回..这样就能充分利用公共前缀了

对于存在的拓展的点 还需扩展队尾 加入该节点

总之这样就能建图了 代码就不注释了 看上面几行

```cpp
while (h != t)
{
	int p = pre[++h];
	for (int a = 0 ; a < 26 ; a ++)
		if (tr[p].to[a])
		{
			tr[tr[p].to[a]].f = tr[tr[p].f].to[a];
			pre[++t] = tr[p].to[a];
		}
		else tr[p].to[a] = tr[tr[p].f].to[a];
}
```

自此 Tried 树建立完毕 可以开始搜索啦~

根据题目的不同 搜索这个部分的灵活性很大 本题的需求就见后面的题目链接吧(显然是洛谷模板 我差不多全部博客用的都是洛谷的模板)

Tip: `pos` 和 `tot` 此处初始化为 `0`

```cpp
for (int a = 0 ; a < i.size() ; a ++)  // 此处 i 是总串
{
	// pos 是指当前节点所代表的字符串加上 i[a] 的字符后存在的位置 如果不存在就是 0 啦
	pos = tr[pos].to[i[a] - 'a'];
		/*
		如果 pos 不存在 或者 继续匹配着突然不存在了 就直接跳出去 此时 b = 0
		否则当 tr[pos].ed 不为 0 时 就说明总串里存在某一字串 本题不重复计算 便将该 .ed 设为 0
		如果再次搜到这里 便跳出去 还有 本题有重复子串 因此 tot 是统加
		*/
		for (int b = pos; b && tr[pos].ed ; b = tr[b].f)
		tot += tr[b].ed,tr[b].ed = 0;
}
```



## 代码

接下来是[模板题的传送门](https://www.luogu.org/problemnew/show/P3808)

以及贴总代码(前面代码都是从这里截的 因此不贴注释啦)

```cpp
#include <iostream>
#include <cstring>
#include <cstdio>
using namespace std;
struct tree {
	int to[26];
	int ed,f;
}tr[1 << 20];
string i;
int pre[1 << 20];
int n,pos,tot = 0;
int main()
{
 	scanf("%d",&n);
 	for (int a = 1 ; a <= n ; a ++)
 	{
 		cin >> i;
 		pos = 0;
 			for (int b = 0 ; b < i.size() ; b ++)
 			{
 				int c = i[b] - 'a';
 				 if (!tr[pos].to[c])
					  tr[pos].to[c] = ++tot;
 				pos = tr[pos].to[c];
			}
		++tr[pos].ed;
	}
	int h = 0,t = 0;
	for (int a = 0 ; a < 26 ; a ++)
		if (tr[0].to[a])
			pre[++t] = tr[0].to[a];
	while (h != t)
	{
		int p = pre[++h];
			for (int a = 0 ; a < 26 ; a ++)
				if (tr[p].to[a])
				{
						tr[tr[p].to[a]].f = tr[tr[p].f].to[a];
						pre[++t] = tr[p].to[a];
				}
				else tr[p].to[a] = tr[tr[p].f].to[a];
	}
	cin >> i;
	pos = tot = 0; 
	for (int a = 0 ; a < i.size() ; a ++)
	{
		pos = tr[pos].to[i[a] - 'a'];
			for (int b = pos; b; b = tr[b].f) {
				tot += tr[b].ed;
				tr[b].ed = 0;
			}
	}
	printf("%d\n",tot);
	return 0;
}
```

其实也挺短的=-= 但是信息密度高啊~
