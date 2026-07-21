---
title: "KMP随笔 + 模板"
date: "2018-06-28 18:22:12"
tags: ["oi"]
excerpt: "KMP"
---

## 1. 前言

Update: 我这口胡的是什么啊=-=我都看不懂了 算了算了[给个链接](https://www.cnblogs.com/yjiyjige/p/3263858.html)这个讲的特好

2024.12.03 Upd: 首先观看[这个小视频](https://www.bilibili.com/video/av16828557/)，它除了匹配失败其他讲的都很好，看到六分钟差不多了。

KMP 其实最主要的就是如何求 `next` 数组

首先理解前缀、后缀、部分匹配值的概念后，我们应该已经知道了这个过程是从模式串 $T$ 的 从头开始的子串开始逐一增加长度以对应 `next` 数组的每一位的。

我们首先要想到，这个过程就和主串 $S$ 匹配模式串 $T$ 几乎一样，只不过这个时候的“主串”是 $T$，其“模式串”是从T开头逐渐拉长的 $T$ 的子串，相当于自己和自己的越来越大部分匹配。

如果能理解到这层面，那再做一点思考应该自己就能明白了。大部分人其实就是这部分没理清楚，具体来说就是：

- Q: 我知道有了 `next` 数组后就能进行那个什么什么 KMP 的主串里匹配模式串了，但是我的 `next` 数组怎么求？
- A: 你都知道怎么匹配了，你求 `next` 数组的时候你已经有 `next` 数组的 `next` 数组了，用 `next` 数组的 `next` 数组求出 `next` 数组你不就得到 `next` 数组了？（指求第 $i$ 位的时候 $i - 1$ 位 `next` 数组已经求出来了，这部分数组就是求 `next` 用到的，而且 `next[1] = 0` 迟早全都推得出）
- Q: ？神金

如果不明白就可以继续看。

如何利用前一个状态推导当前状态呢？我们很容易发现当前状态如果变长了，那就一定是上一位的部分匹配小串串的 $i$ 位后面一位匹配上了。

比如 `ABCAB` 已经匹配到了长度为 $2$ 的串 `AB`，那么 `ABCAB?` 的 `?` 对应前缀 `AB` 后的 `C` 时才会增加；除此之外就是匹配失败的部分匹配值如何倒退了——

匹配失败时，目前是有长为 `length` 的部分已经匹配上，由于不能继续往后接着匹配，所以匹配好的后缀已经没用了，我们关心的是前缀。

前缀由于匹配不上所以需要回退，回退的流程就和 $S, T$ 串匹配时一样。但此时我们仅需利用已经匹配好的 前面部分的 `next` 数组就能进行回退，让此时的部分匹配串变成部分匹配串内的部分匹配串，然后此时我们就可以通过新的这个小串重新与当前主串第 $i$ 位重复上一自然段中的那种对最新一位比较情况，就这样一直通过 `next` 数组找T后缀和此时T子串前缀的部分匹配串匹配，最后变成最小的空串与第i位比较仍然不成功，就触发大保底 `next[i] = 0` 了。

以下是很久以前写的，本人也看不懂，有需要直接看例题和代码即可。

-------------------------------------分割线-------------------------------------



## 2. 正文

来讲讲 KMP

First..读入两字符串后 将将被搜索的关键字 先进行自我配对

我们维护一个数组 下标从 `1` 到 `len - 1` 意为 字符串(长为 `len`)前 $x$个字符的 前缀与后缀相等 的最大长度

此处注意 前缀 和 后缀 各自的长度 似乎不能等于原串的样子=-=

每个长度都要保存下来 可存到某一数组里 通常用 `next` `fail` 等名称定义 依据是他的作用

- Q: 这个解释模模糊糊看起来怪怪的存长度的数组..有什么用
- A: 之后查找长度的时候会用到~ 作用是当两个字符串比着比着 突然对不上了的时候 它就可以挺♂身而出 给将被搜索的关键字跳回去 至于总串嘛它太懒了懒得改

那关键字怎么改呢？我们进入第二步

Second..说起来是改 实际上是跳:

- 首先 你可以通过存两个字符串正在比的地方(用 `int` 之类变量存下标 或者用指针)找到关键字比到哪儿了
- 比如以 `char[1]` 开始 设总串指针为 `i` 关键字指针为 `j`
- 关键字比到第 $666$ 位了 然后第 $667$ 位不一样 则 `i = 666`
- 先设该 $666$ 位字符是 `abcab......abcab[d]` 方框内的是第 $667$ 个
- 此时总串比到 $2333$ 位 是 `..abcab[c]abc` 方框内的是第 $2334$ 个 `j = 2333`
- 通过 `next[667] = 5` 你找到了关键字前 $666$ 位的前缀和后缀 正是 `abcab`
- 因此直接跳把关键字的指针 跳到 $2$ 此时 `i = 2`
- 此时比较关键字第 $3$ 位 `c` 和 总串第 $2334$ 位 `c` 相等
- lol 我们就可以开心地比下去啦
- 如果此时两字符还不同 通过 `next` 数组 找到` next[i]` 继续跳 直到跳到头 `i = 0` 就相当于重新匹配了=-= 从零开始的搜索......

Useless tips:

用 `string` 读的字符串 和 下标 `0` 开头的 `char` 类型的 KMP 部分几乎是一样的

然后 下标 `1` 开头 `1` 的 `char` 又 有所改变=-=

为防止思路混乱 在此将三篇都记下来(前两者转换只用改改 类型 和 串长求法 而已)

其中 `1` 下标 `char` 跑得非常非常慢，但是下标换成 `0` 就没事了 ~~偏移一位虽然更符合直觉 但实在是太毒瘤了~~



## 3. 代码

模板题 [洛谷P3375](https://www.luogu.org/problemnew/show/P3375)

Tip: 因为懒得一份代码打三个方法 直接堆一起啦~

使用~~邪恶的~~ `char[1]` 来写——

```cpp
#include <iostream>
#include <cstring>
#include <cstdio>
using namespace std;
const int MAX = 1 << 21;
char i[MAX],j[MAX];
int next[MAX];
int main()
{
    int b;
    scanf("%s%s",i + 1,j + 1);
    int li = strlen(i + 1);
    int lj = strlen(j + 1);
        for (int a = 2; a <= lj; a++)//建立next数组
        {
            while (b && j[a] != j[b + 1]) b = next[b];
            if (j[a] == j[b + 1]) ++b;
            next[a] = b;
        }
    b = 0;
        for (int a = 1; a <= li; a++)//开始匹配
        {
            while (b > 0 && i[a] != j[b + 1]) b = next[b];
            if (i[a] == j[b + 1]) ++b;
            if (b == lj) printf("%d\n",a - b + 1),b = next[b];
        }
        for (int a = 1; a <= strlen(j + 1); a++) printf("%d ",next[a]);//烦人的题目要求输出next数组=-=
    return 0;
}
```

总共 T 了三个点

使用普通的 `char[0]` 来写——

```cpp
#include <iostream>
#include <cstring>
#include <cstdio>
using namespace std;
const int MAX = 1 << 21;
char i[MAX],j[MAX];
int next[MAX];
int main()
{
    int b;
    scanf("%s%s",i,j);
    int li = strlen(i);
    int lj = strlen(j);
        for (int a = 1; a < lj; a++)//建立next数组
        {
            while (b && j[a] != j[b]) b = next[b];
            if (j[a] == j[b]) ++b;
            next[a + 1] = b;
        }
    b = 0;
        for (int a = 0; a < li; a++)//开始匹配
        {
            while (b && i[a] != j[b]) b = next[b];
            if (i[a] == j[b]) ++b;
            if (b == lj) printf("%d\n",a - b + 2),b = next[b];
        }
        for (int a = 1; a <= lj; a++) printf("%d ",next[a]);
    return 0;
}
```

300ms~挺好的

使用方便的 `string` 来写——

Tip: AC 自动机要用 `string` 哦 `char` 慢死=-=

好吧也可能是我自己的问题~~(就是你自己的问题不要推卸责任)~~

```cpp
#include <iostream>
#include <cstring>
#include <cstdio>
using namespace std;
int next[1 << 21];
int main()
{
    int b;
    string i,j;
    cin >> i;
    cin >> j;
    int li = i.size();
    int lj = j.size();
        for (int a = 1; a < lj; a++)//建立next数组
        {
            while (b && j[a] != j[b]) b = next[b];
            if (j[a] == j[b]) ++b;
            next[a + 1] = b;
        }
    b = 0;
        for (int a = 0; a < li; a++)//开始匹配
        {
            while (b && i[a] != j[b]) b = next[b];
            if (i[a] == j[b]) ++b;
            if (b == lj) printf("%d\n",a - b + 2),b = next[b];
        }
        for (int a = 1; a <= lj; a++) printf("%d ",next[a]);
    return 0;
}
```

共 616ms~慢了点
