# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

微信小程序项目，基于微信云开发。功能是一个「潮流词条浏览器」—— 用户上下滑动浏览随机潮流词条（类似短视频的交互方式），每个词条包含中英释义和例句。

## 技术架构

- **前端**：微信小程序原生开发（WXML + WXSS + JS），无框架，无构建工具
- **后端**：微信云开发（云函数 + 云数据库）
- **云环境 ID**：`cloud1-6g2p61z9ded5f6ed`
- **导航栏**：`"navigationStyle": "custom"` 自定义导航栏，全屏沉浸式

## 核心数据流

1. `miniprogram/utils/api.js` — 前端 API 封装层，通过 `wx.cloud.callFunction` 调用云函数
2. `cloudfunctions/quickstartFunctions/index.js` — 唯一的云函数入口，通过 `event.type` 路由到不同处理函数
3. 数据库集合：`trending_items`，每条文档包含 keyword、definitions（数组）、pinyin 等字段

## 页面交互模式

explore 页面使用 3 槽位循环 swiper（`circular` + `vertical`）实现无限上下滑动：
- `slots[3]` 数组轮转，当前页 ± 1 预加载
- `seenIds` 记录已看词条避免重复
- `scroll-view` 嵌套在 `swiper-item` 内，支持长内容滚动

## 设计规范

### 视觉风格
整体采用毛玻璃（glassmorphism）+ 新拟态（neumorphism）设计：
- 背景：`linear-gradient(135deg, #fcf8fe 0%, #e2e0f9 50%, #f5cdf9 100%)`
- 卡片：半透明白色 + `backdrop-filter: blur` + 大圆角（64rpx）
- 主题色系：primary `#595b8c`，tertiary `#745479`，surface `#5f5e68`

### 3D 新拟态质感（必须遵守）
**所有可交互元素**（按钮、可点击区域、切换控件等）必须使用新拟态 3D 凸起效果：
```css
background: linear-gradient(145deg, 亮色, 暗色);
box-shadow:
  8rpx 8rpx 24rpx rgba(89, 91, 140, 0.18),    /* 右下深色投影 */
  -6rpx -6rpx 20rpx rgba(255, 255, 255, 0.7),  /* 左上高光投影 */
  inset 2rpx 2rpx 6rpx rgba(255, 255, 255, 0.6); /* 内部微高光 */
```
小尺寸元素适当缩小数值：`6rpx 6rpx 16rpx` / `-4rpx -4rpx 12rpx` / `inset 1rpx 1rpx 4rpx`

## 开发方式

使用**微信开发者工具**打开项目根目录进行开发、预览和调试。云函数修改后需在开发者工具中右键上传部署。
