---
title: "树链剖分求LCA[模板] 超详细解释 + 代码"
date: "2018-04-10 13:50:45"
tags: ["oi"]
excerpt: "树链剖分求LCA"
---

(题外话)



虽然LCA最快不是树链剖分 但由于多掌握个算法也是好事 于是刻苦钻研了下



由于网上那些都是零零碎碎的 自己通过东拼西凑加理解终于懂了 然后以自己的理解再复述一遍



(正篇)



有关树链剖分的概念戳进[这一篇](https://www.cnblogs.com/George1994/p/7821357.html)~



原理具体解释于程序中~



模板仍然使用[洛谷模板](https://www.luogu.org/problemnew/show/P3379#sub) 戳进去即可



```cpp
#include <iostream>
#include <cstring>
#include <cstdio>
using namespace std;
const int MAX=500005;
struct Edge //邻接表
{
	int to,next;
}edge[MAX << 1];


int fa[MAX],     top[MAX],   deep[MAX], size[MAX],      son[MAX];
  //该点的父亲 点所在链顶点   点深度值  点子树节点个数 点的重儿子 (分别对应)
int first[MAX],tot;
void add(int i,int j)
{ //邻接表存无向图~
	edge[++tot].to = j;
	edge[tot].next = first[i];
	first[i] = tot;
}


void dfs1(int p) //p 当前节点
{ //第一次dfs,用以求出所有节点的父亲节点 & 深度 & 子节点个数 & 重节点
	size[p] = 1; //p子节点数量初始化 把自己算进去 因为到最后一层的时候用来返回 才能让其父亲得到准确的子节点个数
	deep[p] = deep[fa[p]]+1; //定义p点深度(其父亲+1)
	  for (int a = first[p]; a; a = edge[a].next)
	  { //遍历与p点相连的所有节点
	  	int b = edge[a].to; //p通过与其相连的某一条边所到的点(懒得打于是用一个变量代替)
	  	  if (b == fa[p]) continue; //如果不小心连到了p的父亲节点 不处理 继续下一个点
	  	fa[b] = p; //在要dfs前确定下个节点的父亲节点 如果放外面内存要翻上几番
		dfs1(b);
		size[p]+=size[b]; //统计当前节点的子节点个数
	  	  if (size[b] > size[son[p]]/* || !son[p](可省略 因为前一条已经包括了)*/) son[p] = b;
	  } //(上一行)如果 p的子节点b的子节点  大于  p的原来的重儿子 || 没有设置过重节点(可省略 见下行解释)
}           //因为没有设置时son[p]为0 size[0]初始定义为0 size[b]由于深搜出来肯定大于0 故


void dfs2(int p,int father) //p 当前节点 father 当前节点所在链的起点
{ //第二次dfs求出每个节点所在链的起点(见后面)
	top[p] = father; //将当前节点的链起点记作father
	  if (!son[p]) return; //如果p是当前重链的链尾了则跳出去 接到上一层循环里
	dfs2(son[p],father); //将同一重链上的点的起点father记好
	  for (int a = first[p]; a; a = edge[a].next)
	  { //遍历与p点相连的所有节点
	  	int b = edge[a].to; //p通过与其相连的某一条边所到的点(懒得打于是也用同一个变量代替)
	  	//(下行)如果b不是p的重子节点 & 不是p的父亲节点 则把其顶点设为自己 递归新的重链
	  	  if (b != son[p] && b != fa[p]) dfs2(b,b);
	  }    //(上行补充)新的重链就是在找到轻链以后从它的顶点继续找下去 一定全都能搜到
}


int main()
{
	int n,m,g,i,j;
	scanf("%d%d%d",&n,&m,&g);
	  for (int a = 1; a < n; a++)
	  { //此处输入连接两节点的边 邻接表存无向图 此处不用邻接多重表
	  	scanf("%d%d",&i,&j);
	  	add(i,j);
		add(j,i); //重点
	  }
	dfs1(g);    //第一次深搜
	dfs2(g,g); //第二次深搜
	  for (int a = 1; a <= m; a++)
	  { //此处查询 i 和 j 的 最近公共祖先
	  	scanf("%d%d",&i,&j);
	  	  while (top[i] != top[j]) //如果 i 和 j 各自链的起点不同 则
	  	  { //判断 i 和 j 各自链的起点深度 深度不同时先修改深的
	  	    if (deep[top[i]] < deep[top[j]]) j = fa[top[j]];
	  	    else i = fa[top[i]]; //把要修改的节点的顶点接到该点父亲节点的顶点上(可能意思不太对)
	  	  } //一次只能修改一个 不然两个一起修改两点可能擦肩而过
	  	  if (deep[i] > deep[j]) printf("%d\n",j);
	  	  else printf("%d\n",i);
	  } //两点此时都在同一链上 此时因为是找最近公共祖先 就把深度较小的点输出
	return 0; //(上行解释) 因为深度较大的点还要向上 才能和深度较小的点相遇
}
```



大概就是这样子 过模板题用了1344ms 还是比较慢的=-=

然后乱加优化 见下



```cpp
#define r register
#include <iostream>
#include <cstring>
#include <cstdio>
using namespace std;
const int MAX=1 << 19;
struct Edge
{
	int to,next;
}edge[MAX << 1];
int fa[MAX],top[MAX],deep[MAX],size[MAX],son[MAX],first[MAX],tot;
inline void read(int &x)
{
    char q = getchar();x = 0;
    	while (q < '0' || q > '9') q = getchar();
    	while (q <= '9' && q >= '0')
	x = (x << 1) + (x << 3) + q - (3 << 4), q = getchar();
}
void writeln(int x)  
{
    tot = 0; char q[8];
    	while (x) q[++tot] = (x%10) + (3 << 4), x /= 10;
    	while (tot) putchar(q[tot--]);
    putchar('\n'); 
}
void add(r int x,r int y)
{
    edge[++tot].to = y;
    edge[tot].next = first[x];
    first[x] = tot;
}
void dfs1(int p)
{
    ++size[p];deep[p] = deep[fa[p]]+1;
    	for (r int a = first[p]; a; a = edge[a].next)
    	{
      		r int b = edge[a].to;
      		if (b == fa[p]) continue;
      		fa[b] = p;dfs1(b);size[p]+=size[b];
      		if (size[b] > size[son[p]]) son[p] = b;
    	}
}
void dfs2(int p,int father)
{
    top[p] = father;
    	if (son[p]) dfs2(son[p],father);
    	for (r int a = first[p]; a; a = edge[a].next)
    	{
    		r int b = edge[a].to;
    		if (b != son[p] && b != fa[p]) dfs2(b,b);
    	}
}
int main()
{
    r int i,j,m;
    int n,g;
    read(n);read(m);read(g);
    	for (r int a = 1; a < n; a++)
    	{
    		read(i);read(j);
    		add(i,j);add(j,i);
    	}
    dfs1(g);
    dfs2(g,g);
      while (m--)
      {
      	read(i);read(j);
      		while (top[i] != top[j])
				if (deep[top[i]] < deep[top[j]]) j = fa[top[j]];
      			else i = fa[top[i]];
      		if (deep[i] > deep[j]) writeln(j);
      		else writeln(i);
      }
    return 0;
}
```



1140ms =-=
