---
title: "Yumesute 自动配队器"
date: 2026-07-15
tags: ["ymst"]
excerpt: "plug-and-play 的优质配队生成器 for 世界大明星"
sticky: true
---

# YumesuteAutoTeamUp

Auto team-up script for Yumesute

项目地址: [github.com/Frocean/YumesuteAutoTeamUp](https://github.com/Frocean/YumesuteAutoTeamUp)



## 功能

- **队伍状态生成**: 根据用户游戏数据及编队条件, 输出可能的队伍最高分组合.
- **筛选并保存 k 优解的集合**: 根据初次队伍分数的计算结果, 按分数维护一定数量的不同角色/海报状态的队伍, 送入包含相册/非功能性饰品优化的完整计算获取最终结果.



## 项目特点

- **角色过滤**: 对用户未持有角色进行过滤, 角色状态生成前对重复角色进行去重处理.
- **海报过滤**: 对用户未持有海报进行过滤, 根据用户所持有的每个角色的约束条件, 以及海报之间的限制/无效词条过滤, 为每个角色维护一个用户所有海报的可持久化 pareto 最优解集, 通过海报之间的上/下位关系维护一个 DAG 以实现解集版本的切换, 减少约 99.961% 的状态数量; 随着游戏更新只会剪得更多!
- **饰品过滤**: 对用户未持有饰品进行过滤, 并仅处理影响轴的功能性饰品, 减少了巨量的饰品状态.
- **二次状态过滤**: 将初次计算结果存入小根堆, 通过字典映射按分数为相同角色/海报的队伍维护限制数量的高分结果, 防止同一个状态的不同排列与不同饰品占满整个结果堆, 同时防止真正的最优解在初次计算时作为次优解被滤除.



## 相关项目

- [yumesute_master_db_diff](https://github.com/esterTion/yumesute_master_db_diff), Yumesute 数据的差异对比仓库.
- [yumesute-calc](https://github.com/esterTion/yumesute-calc), 网页版 Yumesute 算分器.
- [ymst_est_calc_expand](https://github.com/yanyuanSagiri/ymst_est_calc_expand), 将大明星算分与本模块整合的扩展计算器.



## 联系我们

- Bilibili: [WorldDaiStar观星部](https://space.bilibili.com/79157636)
- QQ 群: [659635013](https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=bZsbzLGzjhFI9Req4WmTng06Bf_HYU7z&authKey=O19jEcjFA6mBkYkUUreNNlQzUoPDsk5imPly%2Bh1Z8C%2BWSQgS4gezHVa66jZmQM5E&noverify=0&group_code=659635013)
- QQ 群(备用): [599487337](https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=1KsVJpUdR7HsCUB1phnphb3M2Z68Mmz3&authKey=YELLSy4Lb4WySbYNRDhJrujJ4q%2Ba%2BR3ZZw6AVIsVNRuRoqYMEcLKH1Dz8cDuUbyR&noverify=0&group_code=599487337)