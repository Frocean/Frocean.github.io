---
title: "网络流 最大流 ISAP 模板"
date: "2018-07-04 21:20:52"
tags: ["oi"]
excerpt: "网络流 ISAP"
---

作为一个刚学网络流的蒟蒻 感觉这网络流真是个玄学的东西=-=

先跟着标打模板 0 分 0 分 0 分.. 然后发现建图建反向边权值要为 0

然后 90 分 90 分 90 分.. 一直 TLE 一个点 于是打上了读入优化

依旧 90 分 90 分 90 分.. 经过多模板融合推敲 求同存异 最后改动了一些 提交成功 得 68ms/4.5MB

然后直接开心庆祝 ~~就差拉车载个体面的先生去东安市场 然后去那儿最好的饭摊上 吃热烧饼夹爆羊肉了~~

之后小细节磨了一下 开 O2 得 48ms/4.5MB



## 前言

首先安利一个神奇的网站 貌似是 国立台湾师范大学的[网址](http://www.csie.ntnu.edu.tw/~u91029/Flow.html) 除了这个讲网络流的 里面其他东西也挺有用 至于怎么找到的呢 ~~是因为当初搜网络流一个个都不理解然后翻到十几页点进去看到的~~ (这学校是不是这个名=-=繁体我不会认啊好尴尬)

建议对着标程慢慢看 多看几次就理解了 而且网上那些 dalao 们都说这类题目重在建图 不过理解一下还是比较好

概念什么的麻烦不想搬 网上的概念还是比较正规的

个人认为 网络流的概念 只是跟你介绍构图之类的而已 我认真地看来看去还是不会打(应该是我悟性问题吧) 还有些地方还是不太清楚=-= (但为什么不清楚的地方都是关键的地方啊啊啊 NG)

代码—— 题目依然是[洛谷的模板](https://www.luogu.org/problemnew/show/P3376) 比较正常的代码见下



## 正文

```cpp
#include <iostream>
#include <cstdio>
using namespace std;
const int MAX = 100005;
struct Edge { //(下行) w 会因为寻找增广路时改变权值 因此存的是边权 但更形象地说存的是剩下的流量
	int to,next,w;//存边是一条边一条反向边 使用时没有区别 但更新流的时候要改变剩余流量w
	查询可以是 a 和 a+1 或者 a 和 a^1 当然后者更快
} edge[MAX << 1];//(下行) gap[x]=y 意为 此时第 x 层的节点有 y 个
//cur相当于first数组 只是取next里的数作新的first 从路中间开始走而不是头
int first[MAX],gap[MAX],dep[MAX],cur[MAX];//first邻接表机制
//gap和cur分别是断层优化和当前弧优化 dep存点深度
int n,m,i,j,tot = 1;//本模板为了用异或修改反向边权值 tot从1开始 即第一条边存在edge[2]里
//如果用+1找反向边不用初始定义 但找边会慢一些
void add(int x,int y,int z)//邻接表备注打太多遍了不想打
{
	edge[++tot].next = first[x];
	edge[tot].to = y;
	edge[tot].w = z;
	first[x] = tot;
	edge[++tot].next = first[y];
	edge[tot].to = x;/*
	edge[tot].w = 0;*///本行可略 可爱的C++已经帮你初始定义为0了 但如果你为了缩行美观
//		(两行 一行四句) 还是加上比较好 当然换下顺序不加也美观
	first[y] = tot;
}
int dfs(int p,int mx)
{
	if (p == j) return mx;//当前点的流量流到汇点了 返回流量
//	(网上说是流完 应该是流完路径 即流到尾的意思吧)
	int mxflow = 0;//记录某增广路的最大流 第一次进入该子程序则就是记录答案的最大流 先赋值为0
	for (int a = cur[p] ; a ; a = edge[a].next)//遍历与p点相连的边 除去了部分无用的边
//	如果不优化只用改成a=first[p] 再把其他cur行去掉
		if (edge[a].w && dep[edge[a].to] + 1 == dep[p])
		//(第一个判断) 当第a条边还能流 即(可能)有增广路
		{//(上句 第二个判断) 边的两端的点深度只相差1 即该边不是跨层的 则执行命令
			cur[p] = a;//当前弧优化 去除前面用过/无用的边
			int flow = dfs(edge[a].to,min(mx - mxflow,edge[a].w));
			//深搜 找该边连下去的边 直到汇点
			mxflow += flow;//上句flow记录某一增广路最大值
			//flow相当于子程序中的mxflow 此处累计增广路值
			edge[a].w -= flow;//当前边减去流量 剩下的用在别的增广路上 继续搜
			edge[a ^ 1].w += flow;//当前边反向弧增加流量
			//用在找别的增广路上的流时 挪当前流的流向
			if (mxflow == mx) return mxflow;
			//当前深度的流全部流完了 直接闪退返回最大流
		}
	cur[p] = first[p];//还原边(这子程序不是一个for就完了的 没看见子程序名字叫dfs么
	//for里还有深搜呢) 防止退出某层程序后有些有用的边没搜到
		if (!--gap[dep[p]]) dep[i] = n;//减去1单位的当前层数节点数量并判断是否搜完
		//因为下句(Tip:本句和下句顺序不能换 亲测100分和0分)
	++gap[++dep[p]];//(gap里面)增加当前节点深度 方便其他更长的增广路经过他
	//(gap外面)增加当前节点所在的层数的点的数量 因为上句
	return mxflow;//返回当前增广路的最大流
}
int main()
{
	int x,y,z;//里应外合的定义
	scanf("%d%d%d%d",&n,&m,&i,&j);//安步当车的输入
	for (int a = 1 ; a <= m ; a++)//循规蹈矩的循环
	{
		scanf("%d%d%d",&x,&y,&z);
		add(x,y,z);//邻接表存边 注意反向边初值为0
	}
	tot = 0;//懒得定义新变量直接用tot  ↓(这是箭头)<---tot是用来存每次找到增广路的值的
	gap[0] = n;//所有节点的深度初始为0 ↓(箭头是上行的)<----(这个箭头是本行的)n表示节点个数
		for ( ; dep[i] < n ; tot += dfs(i,1 << 30));
		/*此处可不取1<<30 只要取比最大流大的数就好 但99%的时候你不知道最大流是多少
		while (dep[i] < n) tot += dfs(i,1 << 30);*///本行与上行等价
		//用来找深(长)度一样的增广路 然后长度递增
	printf("%d\n",tot);//当机立断的输出
	return 0;//逢考必备的结尾
}
```

其实 SAP 挺短的=w= 就是要记的细节多



## 另一道题

好了说了这么多模板那我们来做一道[普通的ISAP](https://www.luogu.org/problemnew/show/P3701) 有乱评分的嫌疑..

其实就多加了个最基础的建边而已 然后直接 ISAP 爆算即可

图太稠了搞得ISAP速度都提不上来=-= 代码见下



```cpp
#include <cstdio>
#define N 205
struct edge {
	int ne,to,fl;
} e[N * N];
int first[N],gap[N],cur[N],dep[N],tot = 1;
int kind1[N],kind2[N],hp1[N],hp2[N],more1,more2;
inline int min(int x,int y) {return x < y ? x : y;}
inline int r()
{
	int x = 0 ; char q = getchar();
	while (q < '0' || q > '9') q = getchar();
	while ('0' <= q && q <= '9')
		x = (x << 3) + (x << 1) + q - (3 << 4),q = getchar();
	return x;
}
int n = r(),m = r(),s = n << 1 | 1,t = s + 1;
inline int re()
{
	char w,q = getchar();
	while (q < 'A' || q > 'Z') q = getchar();
	while ('A' <= q && q <= 'Z') w = q,q = getchar();
	switch (w) {
		case 'J':return 1;
		case 'E':return 2;
		case 'Y':return 3;
		case 'K':return 4;
		case 'W':return 5;
	}
}
inline void add(int x,int y,int z)
{
	e[++tot].ne = first[x],e[tot].to = y,e[tot].fl = z,first[x] = tot;
	e[++tot].ne = first[y],e[tot].to = x,first[y] = tot;
}
int dfs(int p,int mx)
{
	if (p == t) return mx;
	int mxflow = 0;
	for (int a = cur[p] ; a ; a = e[a].ne)
	if (e[a].fl && dep[e[a].to] + 1 == dep[p]) {
		cur[p] = a;
		int flow = dfs(e[a].to,min(mx - mxflow,e[a].fl));
		mxflow += flow;
		e[a].fl -= flow;
		e[a ^ 1].fl += flow;
		if (mxflow == mx) return mxflow;
	}
	cur[p] = first[p];
	if (!--gap[dep[p]]) dep[s] = (n + 1) << 1;
	++gap[++dep[p]];
	return mxflow;
}
int main() {
	for (int a = 1 ; a <= n ; ++ a) kind1[a] = re(),more1 += kind1[a] == 3;
	for (int a = 1 ; a <= n ; ++ a) kind2[a] = re(),more2 += kind2[a] == 3;
	for (int a = 1 ; a <= n ; ++ a) hp1[a] = r() + (kind1[a] == 1 ? more1 : 0);
	for (int a = 1 ; a <= n ; ++ a) hp2[a] = r() + (kind2[a] == 1 ? more2 : 0);
	for (int a = 1 ; a <= n ; ++ a) add(s,a,hp1[a]),add(a + n,t,hp2[a]);
	for (int a = 1 ; a <= n ; ++ a)
	for (int b = 1 ; b <= n ; ++ b)
	switch (kind1[a]) {
		case 1:if (kind2[b] == 4 || kind2[b] == 5) add(a,b + n,1);break;
		case 2:if (kind2[b] == 1 || kind2[b] == 3) add(a,b + n,1);break;
		case 3:if (kind2[b] == 1 || kind2[b] == 4) add(a,b + n,1);break;
		case 4:if (kind2[b] == 2 || kind2[b] == 5) add(a,b + n,1);break;
		case 5:if (kind2[b] == 2 || kind2[b] == 3) add(a,b + n,1);break;
	}
	tot = 0,gap[0] = (n + 1) << 1;
	for ( ; dep[s] < (n + 1) << 1 ; tot += dfs(s,1 << 30));
	printf("%d\n",tot < m ? tot : m);
	return 0;
}
```
