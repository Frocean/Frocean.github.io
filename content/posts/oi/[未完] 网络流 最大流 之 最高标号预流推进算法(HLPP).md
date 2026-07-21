---
title: "[未完] 网络流 最大流 之 最高标号预流推进算法(HLPP)"
date: "2018-07-05 22:23:30"
tags: ["oi"]
excerpt: "网络流 最高标号预流推进算法"
---

## 前言

2018.7.5 学完 ISAP 后 刚好洛谷有加强版题 便交上去 RE 了 找不出原因 该拓的拓了 该加的加了

2018.7.20 原来要用预流推进=-= 然而我没加高标的 TLE 了五个点 共 6 个

2018.8.8 HLPP终于弄出来了~~普通模板过得了 又发现那题原来是爆 int 然后我把 long long 和 int 一起用了 非常混乱 最后[RE了四个点](https://www.luogu.org/record/show?rid=9467883) 还是没 AC 这题..这里干脆用回普通模板

2018.8.22 [第三个点过了](https://www.luogu.org/recordnew/show/10042770) 继续尝试中

2018.9.4 发现自己写的貌似和 预流推进 还是有很大差别的 翻了自个学校的 dalao 代码 和下面那差不多 =-= 待补


等等我的貌似是一般版的=-=跑的不快 可能之后还是得重新补一下

---

HLPP 从[入门](https://www.luogu.org/problemnew/show/P3376)到[入土](https://www.luogu.org/problemnew/show/P4722) 两道题目

前提知识大概有 网络流 + 一般预流推进算法 && 堆 掌握概念即可 (好吧其实之后也有提到一些)

以前学的东西 发的博客的代码 都有参考各种 dalao 的思路然后修改成个人使用的 因此本人从中受益匪浅 但下面那程序我实在不想改这次直接用了=-=发的博客注释十分仔细

---

从上午 10 点在机房到晚上 到处翻 HLPP 资料 心力交瘁 =-=

首先借用一个 dalao 的高标推进程序

取自[https://blog.csdn.net/QiaoRuoZhuo/article/details/73291778](https://blog.csdn.net/QiaoRuoZhuo/article/details/73291778)

```cpp
/*
Description: 改进的预流推进算法，有如下优化：
进行了预先逆序BFS分层，
利用结点链表，每次都是从高度最大的结点开始处理.
利用指向各顶点的边表结点的指针，记录已经访问到该顶点的第几条边了，
下次推进时可直接从该条边操作，不用从第一条边开始一路找过来。

Frocean:子程序放在开头方便浏览(好吧其实是懒得删原文) 

int MaxFlow_relabel_to_front(int src, int des, int n) ;
bool BFS(int src, int des, int n); //广度优先搜索构造分层网络
void Check(int u); //对顶点u进行预流推进或重新标号操作，直到其剩余流量为0
void AddFlow(int u, int v, int w); //增加残流网络边<u,v>的容量
*/
 
#include <iostream>
#include <fstream>
using namespace std;
typedef struct EdgeNode //边表结点
{
	int adjvex; //邻接点域，存储该顶点对应的下标
	int weight; //权值，对于非网图可以不需要
	struct EdgeNode *next; //链域，指向下一个邻接点
}EdgeNode;
typedef struct VertexNode //顶点表结点
{
	int data; //顶点域，存储顶点信息
	EdgeNode *firstEdge; //边表头指针
}VertexNode;
typedef struct VertexNodeLink //结点链表
{
	int num; //存储该顶点对应的下标
	struct VertexNodeLink *next; //链域，指向下一个结点
}VertexNodeLink;
const int MAXV = 2000; //最大顶点数量
const int MAXE = 2000; //最大边数量
const int INFINITY = 0x7fffffff; //无穷大
VertexNode GL[MAXV]; //存储顶点表结点信息
EdgeNode * EdgeNodePoint[MAXV]; //存储指向各顶点的边表结点的指针
int flow[MAXV];  //标记当前节点的剩余流量
int dis[MAXV]; //标记节点所在的层次
VertexNodeLink *head; //结点链表头结点
bool BFS(int src, int des, int n)
{ //逆向广度优先搜索构造分层网络，若不存在增广路，则返回false
	EdgeNode *e;
	int Queue[MAXV]; //求最短增广路算法需要用到的队列
	int v, front = 0, rear = 0; //清空队列
	for(int i = 0; i < n; ++ i) //初始化列表
	{
		dis[i] = 0;
		EdgeNodePoint[i] = GL[i].firstEdge; //初始化指向各顶点的边表结点的指针
	}
	Queue[rear++] = des; //汇点加入队列
	while (front < rear) //队列非空
	{
		v = Queue[front++];
		for(e = GL[v].firstEdge; e != NULL; e = e->next) //寻找逆向边，并设置层数
			if (e->weight == 0 && dis[e->adjvex] == 0)
			{ //是一条逆向边
				dis[e->adjvex] = dis[v] + 1;
				Queue[rear++] = e->adjvex;
			}
	}
	if (dis[src] == 0) return false;//未找到源点，说明不存在流
	VertexNodeLink *s;
	head = new VertexNodeLink;
	head->next = NULL;
	for (front = 1; front < rear; front ++) //使用头插法将结点按高度顺序插入链表
		if (Queue[front] != src)
		{
			s = new VertexNodeLink;
			s->num = Queue[front];
			s->next = head->next;
			head->next = s;
		}
	return true;
}
void AddFlow(int u, int v, int w) //增加残流网络边<u,v>的容量
{
	EdgeNode *e;
	for (e = GL[u].firstEdge; e != NULL; e = e->next) //将源点的流量推进到邻接点
		if (e->adjvex == v)
		{
			e->weight += w;
			break;
		}
}
void Check(int u) //对顶点u进行预流推进或重新标号操作，直到其剩余流量为0
{
	int minFlow, minLevel, v;
	EdgeNode *e;
	while (flow[u] > 0)
	{
		e = EdgeNodePoint[u];
		if (e == NULL) //没有可以push的顶点,执行relabel
		{
			minLevel = INFINITY;
			for (e = GL[u].firstEdge; e != NULL; e = e->next)
			if (e->weight > 0 && minLevel > dis[e->adjvex]) //寻找下一层节点
				minLevel = dis[e->adjvex];
			dis[u] = minLevel + 1;
			EdgeNodePoint[u] = GL[u].firstEdge;
		}
		else
		if (dis[u] == dis[e->adjvex]+1 && e->weight > 0)
		{ //寻找可行弧，并预流推进
			minFlow = (flow[u] < e->weight) ? flow[u] : e->weight;
			flow[u] -= minFlow;
			flow[e->adjvex] += minFlow;
			e->weight -= minFlow;
			AddFlow(e->adjvex, u, minFlow);
		}
		else EdgeNodePoint[u] = e->next; //处理下一条边
	}
}
int MaxFlow_relabel_to_front(int src, int des, int n)
{
	int u, v, oldLevel, minFlow;
	VertexNodeLink *p = head;
	EdgeNode *e;
	if (BFS(src, des, n)) //先逆向构造分层网络
	{
		dis[src] = n;  //直接设置源点的高度为n
		for (e = GL[src].firstEdge; e != NULL; e = e->next)
		 //将源点的流量推进到邻接点
			if (e->weight > 0) //更新结点剩余流量和残流网络
			{
				flow[src] -= e->weight;
				flow[e->adjvex] = e->weight;
				AddFlow(e->adjvex, src, e->weight);
				e->weight = 0;
			}
	VertexNodeLink *pre = head;
		while (pre->next)
		{
			u = pre->next->num;
			oldLevel = dis[u];
			Check(u);
			if (oldLevel < dis[u]) //层高增加了，插入到链表首部
			{
				p = pre->next;
				pre->next = p->next; //删除结点p
				p->next = head->next;//将结点p插入到头结点后面
				head->next = p;
				pre = head;
			}
			pre = pre->next; //查看下一个结点
		}
	}
	p = head->next;
	while (p)
	{
		delete head;
		head = p;
		p = head->next;
	}
	return flow[des];
}
int main()
{
	int  m, n, u, v, w;
	for (int i = 0; i < MAXV; i ++) //初始化图
	{
		GL[i].data = i;
		GL[i].firstEdge = NULL;
	}
	cin >> n >> m;
	EdgeNode *e;
	for(int i=0; i<m; ++i)
	{
		cin >> u >> v >> w;
		e = new EdgeNode;; //采用头插法插入边表结点
		if (!e) exit(1);
		e->adjvex = v;
		e->weight = w;
		e->next = GL[u].firstEdge;
		GL[u].firstEdge = e;
		//为了构造残流网络，还要生成一条逆向边，根据weight的值确定该边是否存在
		e = new EdgeNode;; //采用头插法插入边表结点
		if (!e) exit(1);
		e->adjvex = u;
		e->weight = 0;
		e->next = GL[v].firstEdge;
		GL[v].firstEdge = e;
	}
	cout << MaxFlow_relabel_to_front(0, n-1, n) << endl;
	system("pause");
	return 0;
}
```



## 正文

2018.8.8 通过拼凑和各种理解优化代码 高标推进应该成功地弄出来了~~

然而普通模板那题的高标推进比 ISAP 要慢了 5 倍 刚好 5 倍..貌似是常数大的缘故? 不过随机数据 ISAP 的确快得多 =-=

来随便说说高标推进的概念 (不是很专业 在意的话就去搜其他的文章吧..)

我们首先给源点一大堆流 大概有 INF 那么多(通常是 0x7fffffff 等于 2147483647) 不过那毒瘤模板里这个还小了..

当然根据理论 要把每个点的流推完 这里可以设他能流到其他点的所有流量 会慢点应该正常吧

最高标号是把点高度用优先队列存起来的 每次取出队列里最高的点 然后这里用手打大根堆来实现 (完全不想用 stl)


### 定义

`e[MAXM]` 和 `st[MAXN]` 邻接表存边

`h[MAXN]` 某节点高度

`heap[MAXN]` 同字面意思 (大根) 堆

`o[MAXN]` 判断某节点是否在堆里面 `0` 即没有 `1` 即有

`gap[MAXN]` 网上的 dalao 们说 HLPP 可以用 gap 优化 ~不过gap这里不是找断层而是找断的高度~

`ans[MAXN]` 流到某节点时的最大流



### 步骤

**1.** 首先把源点丢进去

源点高度要最高 俗话说水往低处流 源点高度低怎么流嘛

因为有 $n$ 个节点 因此源点高度设为 $n$ 或 $n - 1$ 如图 (借了下 杭州学军中学 的课件的说 然而是从我们学校课件里找到的2333)

![](/images/content/oi/2018_07_05_1.png)

---

**2.** 有了点肯定要处理吧

直接找出来处理~ 利用大根堆 找到 `heap[1]` 就是堆里最大的数 (Tip: 堆存的虽然是节点编号 但是要根据节点的深度来排序)

堆的寻常操作——pop~ (自带音效) 弹出 `heap[1]` 当然别忘了弹出之前把该节点编号存下来 在这次更新要用到
 
**2.5** 在更新之前 我们要从 `ans` 数组里面看看该点有没有流量呀=w= 没有肯定就流不了了 当然要初始化源点的流量

如果没有 就直接 continue 当然这步不要也可以 不过会慢那么一点

---

**3.** 开始更新 由邻接表把当前节点能到的点都遍历一遍 但要根据高度和两点间剩余流量来判断(开始流量是满的)

之前说了水往低处流嘛......于是要判断高度 源点要特判一下 如果能把流推走 就把当前点流量减去相应数值 (不一定是边流量 可能只剩下其中的一部分 因此要 min 判断余流) 当然反向边要相应地加上

---

**4.** 之后别忘了要把推到的点加入堆里 当然堆里如果有了就不用加了 至此 一次循环完毕

---

**5.** 最后还要判断 如果当前点流量还有剩余 就要把他的高度提高 让他的流能到一些原本到不了的高度的点

举个例子 如图 此处的 $y$ 点的流 把 $8$ 单位的流推给 $z$ 后 还有剩余
 
![](/images/content/oi/2018_07_05_2.png)

因此要把 $y$ 抬高一点 通过 $y$ 到 $x$ 的弧把盈余推给 $x$ (这里是通过反向弧推 看箭头) 如图

![](/images/content/oi/2018_07_05_3.png)

引用原文 : **"一次必须把赢余全部推光.所以y被重标号,当前弧指针从头开始查找,找到 $(y,x)$ 这条可行弧之后进行推进.实际上是把多推的赢余还给了 $x$.因为 $h(u) \leqslant h(v) + 1$的保证,它没有把赢余错推给 $S$"**

然而它还是有盈余 =-=

因此我们再把他抬高 (因为中间断层 这里有个 gap 优化 直接跳到 $S$ 上 某高度没点就直接跳上去 可加可不加 不加会慢些) 如图

![](/images/content/oi/2018_07_05_4.png)

推到 $S$ 或者 $t$ 还有盈余的话 就可以不推了 $t$ 就不说了 $S$ 的话 概念里 $S$ 流量都是 INF 多的流量都剩在这里 因此...... 

就这么愉快地推完了 然后处理到堆里面没数了 (就是没有能增广的流了) 就退出 输出 `ans[t]` 即可

---

就这么多？就这么多！

下放不正常的代码 + [例题 (洛谷的普通模板)](https://www.luogu.org/problemnew/show/P3376)~

Tip:前文有标注这里就不详细标注啦 然后之前那个[洛谷的毒瘤模板](https://www.luogu.org/problemnew/show/P4722)这里也放个链接



## 代码

```cpp
#include <algorithm>
#include <cstdio>
using namespace std;
const int MAXN = 10010;
const int MAXM = 200010;
struct Edge {
	int next,to,w;
} e[MAXM];
int st[MAXN],h[MAXN],heap[MAXN],gap[MAXN],ans[MAXN],n,s,t,tot = 1;
short o[MAXN];
void add(int x,int y,int z)
{ //邻接表存边 懒得标了 想了解请移步
	e[++tot].next = st[x],st[x] = tot,e[tot].to = y,e[tot].w = z;
	e[++tot].next = st[y],st[y] = tot,e[tot].to = x;
}
void push(int p)
{ //压入堆里
	heap[++tot] = p;
	o[p] = 1;
	int now = tot;
	while (now > 1 && h[heap[now]] > h[heap[now / 2]])
	{ //常规大根堆操作
		swap(heap[now],heap[now / 2]);
		now /= 2;
	}
}
void pop() //弹出堆首
{
	o[heap[1]] = 0; //堆首元素不在堆里了 设为0
	heap[1] = heap[tot--];
	int now = 1,nxt;
	while ((now * 2 <= tot && h[heap[now]] < h[heap[now * 2]])
	|| (now * 2 + 1 <= tot && h[heap[now]] < h[heap[now * 2 + 1]]))
	{ //常规大根堆操作
		nxt = now * 2;
		if (nxt + 1 <= tot && h[heap[nxt]] < h[heap[nxt + 1]]) ++ nxt;
		swap(heap[now],heap[nxt]);
		now = nxt;
	}
}
int preflow()
{
	h[s] = n;
	for (int a = st[s] ; a ; a = e[a].next) ans[s] += e[a].w; //初始化源点流量 可改为ans[s] = INF
	heap[++tot] = s;//源点压入堆里
	//o[s] = 1; //打标记 事实上这里不用
	while (tot > 0)
	 {
		int p = heap[1];
		pop();
		if (!ans[p]) continue;
			for (int a = st[p],b = e[a].to ; a ; a = e[a].next,b = e[a].to) //搜能推到的点
			if ((h[p] == h[b] + 1 || p == s) && e[a].w) //高度 流量及特判
			{
				int flow = min(ans[p],e[a].w); //取余流 然后下面更新
				ans[b] += flow;
				ans[p] -= flow;
				e[a].w -= flow;
				e[a ^ 1].w += flow;
				if (!o[b] && b != s && b != t) push(b); //若推到的点不在堆里 压进去
			}
		if (ans[p] > 0 && p != s && p != t) //遍历完了 能推的点都推了还有盈余 加特判
		{ //gap优化融合高度修改 搞得我都改不回去了=-=
			if (!--gap[h[p]]) for (int a = 1 ; a <= n ; ++ a)
			if (a != s && a != t && h[p] < h[a] && h[a] <= n)
			h[a] = n + 1;
			++gap[++h[p]];
			push(p);
		}
	}
	return ans[t]; //返回答案
}
int main()
{
	int m,x,y,z;
	scanf("%d%d%d%d",&n,&m,&s,&t); while (m--)
	scanf("%d%d%d",&x,&y,&z),add(x,y,z);
	tot = 0; //重复利用 上面用来存边的编号 下面用来记录堆里的元素数量
	printf("%d\n",preflow());
	return 0;
}
```

然后下面存一下优化代码

```cpp
#include <algorithm>
#include <cstring>
#include <cstdio>
#define ten(a) ((a<<(1<<1|1))+(a<<1))
#define asc ((1<<1|1)<<(1<<(1<<1)))
#define re register
using namespace std;
const int MAXN=10010;
struct Edge {
	int next,to,w;
} e[200010];
int st[MAXN],dep[MAXN],heap[MAXN],gap[MAXN],ans[MAXN],n,s,t,tot=1;
short o[MAXN];
inline void r(re int &x)
{
	re char q=getchar(); x=0;
	while(q<'0'||q>'9')q=getchar();
	while(q>='0'&&q<='9')x=ten(x)+q-asc,q=getchar();
}
void add(re int x,re int y,re int z) {
	e[++tot].next=st[x],st[x]=tot,e[tot].to=y,e[tot].w=z;
	e[++tot].next=st[y],st[y]=tot,e[tot].to=x;
}
void push(re int p) {
	heap[++tot]=p;
	o[p]=1;
	re int now=tot;
	while(now>1&&dep[heap[now]]>dep[heap[now>>1]]) {
		swap(heap[now],heap[now>>1]);
		now>>=1;
	}
}
void pop()
{
	o[heap[1]]=0;
	heap[1]=heap[tot--];
	re int now=1,nxt;
	while((now<<1<=tot&&dep[heap[now]]<dep[heap[now<<1]])
	||((now<<1|1)<=tot&&dep[heap[now]]<dep[heap[now<<1|1]])) {
		nxt=now<<1;
		if(nxt+1<=tot&&dep[heap[nxt]]<dep[heap[nxt+1]])++nxt;
		swap(heap[now],heap[nxt]);
		now=nxt;
	}
}
int preflow() {
	dep[s]=n;
	for(re int a=st[s];a;a=e[a].next)ans[s]+=e[a].w;
	heap[++tot]=s;
	o[s]=1;
	while(tot>0) {
		re int p=heap[1];
		pop();
		if (!ans[p]) continue;
			for(re int a=st[p],b=e[a].to;a;a=e[a].next,b=e[a].to)
			if((dep[p]==dep[b]+1||p==s)&&e[a].w) {
				int flow=min(ans[p],e[a].w);
				ans[b]+=flow;
				ans[p]-=flow;
				e[a].w-=flow;
				e[a^1].w+=flow;
				if(!o[b]&&b!=s&&b!=t)push(b);
			}
		if(ans[p]>0&&p!=s&&p!=t) {
			if(!--gap[dep[p]])for(int a=1;a<=n;++a)
			if(a!=s&&a!=t&&dep[p]<dep[a]&&dep[a]<=n)
			dep[a]=n+1;
			++gap[++dep[p]];
			push(p);
		}
	}
	return ans[t];
}
int main() {
	int m,x,y,z;
	r(n),r(m),r(s),r(t); while(m--)
	r(x),r(y),r(z),add(x,y,z);
	tot=0;
	printf("%d",preflow());
	return 0;
}
```
