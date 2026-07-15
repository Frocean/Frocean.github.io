---
title: "[草稿] 矩形切割 || 二维线段树 USACO 3.1.4 Shaping Regions形成的区域"
date: "2018-07-13 20:32:40"
tags: ["oi"]
excerpt: "矩形切割"
---

如题..貌似能用矩形切割或二维线段树解决?



## 题目描述

$N$ 个不同的颜色的不透明的长方形 $(1 \leqslant N \leqslant 1000)$ 被放置在一张宽为 $A$, 长为 $B$ 的白纸上。

这些长方形被放置时，保证了它们的边于白纸的边缘平行。

所有的长方形都放置在白纸内，所以我们会看到不同形状的各种颜色。

坐标系统的原点 $(0,0)$ 设在这张白纸的左下角，而坐标轴则平行于边缘。


---

**INPUT FORMAT**

每行输入的是放置长方形的方法。

第一行输入的是那个放在底的长方形(即白纸)。


<table>
  <tr>
    <td><strong>第 $1$ 行:</strong></td>
    <td>$A$, $B$ 和 $N$, 由空格分开 $(1 \leqslant A, B \leqslant 10,000)$</td>
  </tr>
  <tr>
    <td><strong>第 $2$ 到 $N + 1$ 行:</strong></td>
    <td>为五个整数 llx, lly, urx, ury, color 这是一个长方形的左下角坐标，右上角坐标和颜色。颜色 1和底部白纸的颜色相同。</td>
  </tr>
</table>



**SAMPLE INPUT**


```
20 20 3
2 2 18 18 2
0 8 19 19 3
8 0 10 19 4
```



**OUTPUT FORMAT**

输出文件应该包含一个所有能被看到颜色连同该颜色的总面积的清单( 即使颜色的区域不是连续的)，按color的增序顺序。

不要显示没有区域的颜色。



**SAMPLE OUTPUT**

```
1 91
2 84
3 187
4 38
```



## 过程

大概就是从后往前 因为后面的矩形肯定在前面的矩形的上面


然后如果矩形被挡住 多出来的部分就分裂成多个矩形


但是代码具体还是不太懂 以后回来看看......


```cpp
#include <iostream>
#include <cstdio>
using namespace std;
struct square {
	int lx,ly,rx,ry,co;
}s[1 << 10];
int ans[1 << 12],n;
int found(int ix,int iy,int jx,int jy,int col)
{
	int tot = 0;
	if (col > n) return (jy - iy + 1) * (jx - ix + 1);
	if (s[col].lx > jx || s[col].ly > jy || s[col].rx < ix || s[col].ry < iy)
	return found(ix,iy,jx,jy,col + 1);
	if (s[col].ry < jy) tot += found(ix,s[col].ry + 1,jx,jy,col + 1);
	if (s[col].ly > iy) tot += found(ix,iy,jx,s[col].ly - 1,col + 1);
	jy = min(jy,s[col].ry);
	iy = max(iy,s[col].ly);
	if (s[col].lx > ix && s[col].lx <= jx) tot += found(ix,iy,s[col].lx - 1,jy,col + 1);
	if (s[col].rx < jx && s[col].rx >= ix) tot += found(s[col].rx + 1,iy,jx,jy,col + 1);
	return tot;
}
int main()
{
	int x,y;
	scanf("%d%d%d",&x,&y,&n);
	s[0].lx = 0,s[0].ly = 0,s[0].rx = x - 1,s[0].ry = y - 1,s[0].co = 1;
	for (int a = 1 ; a <= n ; -- s[a].rx,-- s[a].ry,a ++)
	scanf("%d%d%d%d%d",&s[a].lx,&s[a].ly,&s[a].rx,&s[a].ry,&s[a].co);
	for (int a = n ; a >= 0 ; -- a)
	ans[s[a].co] += found(s[a].lx,s[a].ly,s[a].rx,s[a].ry,a + 1);
	for (int a = 1 ; a <= 2500 ; a ++) if (ans[a]) printf("%d %d\n",a,ans[a]);
	return 0;
}
```
