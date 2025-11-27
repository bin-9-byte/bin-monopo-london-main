# R3F Monopo London

一个基于React Three Fiber的交互式网页效果，重现了[Monopo London](https://monopo.london/)网站的视觉体验。

![Demo](https://user-images.githubusercontent.com/46724121/163683407-7a22bcb5-88e8-4ef8-b3d7-282284d5c8aa.gif)

## 项目简介

这个项目展示了现代Web技术在创建沉浸式交互体验方面的能力。通过结合React、Three.js和自定义着色器，我们创建了一个具有以下特性的网页：

- **第一页**：3D文字特效，随滚动淡出
- **第二页**：交互式内容区域，背景为动态粒子特效
- **响应式交互**：背景粒子特效响应鼠标移动和元素悬停状态
- **平滑过渡**：页面间的无缝滚动体验

## 技术栈

- **TypeScript** - 类型安全的JavaScript超集
- **React** - 使用Create React App构建的用户界面库
- **React Three Fiber** - React的Three.js渲染器
- **Emotion** - CSS-in-JS样式解决方案
- **自定义GLSL着色器** - 用于创建粒子特效和文字动画

## 项目结构

```
src/
├── components/
│   ├── App.tsx              # 主应用组件
│   ├── LinkIconButton.tsx   # 链接图标按钮组件
│   └── three/
│       ├── Background.tsx   # 背景粒子特效组件
│       ├── ScrollableContainer.tsx  # 可滚动容器组件
│       ├── TCanvas.tsx      # Three.js画布组件
│       ├── Lense.tsx        # 镜头效果组件
│       └── TextPlane.tsx    # 文字平面组件
├── modules/
│   └── glsl/
│       ├── shader.ts        # 着色器代码
│       └── noise.ts         # 噪声函数
├── hooks/
│   └── useHoverState.ts     # 悬停状态管理Hook
└── contexts/                # React上下文
```

## 主要功能

### 3D文字特效

第一页展示了动态的3D文字效果，包括英文和日文文本，随滚动进度淡出。

### 背景粒子特效

使用自定义GLSL着色器创建的动态粒子背景，具有以下特性：
- 响应鼠标移动
- 响应元素悬停状态
- 多层颜色混合
- 实时噪声动画

### 交互式内容区域

第二页包含交互式内容，如图片占位符，当鼠标悬停时会触发背景特效的变化。

## 安装与运行

### 前置要求

- Node.js (推荐v14或更高版本)
- npm或yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

应用将在 `http://localhost:3000` 上运行。

### 构建生产版本

```bash
npm run build
```

## 自定义与扩展

### 修改着色器效果

着色器代码位于 `src/modules/glsl/` 目录下。您可以修改这些文件来改变粒子特效的外观和行为。

### 添加新页面

在 `ScrollableContainer.tsx` 中添加新的内容区块，并调整相应的样式。

### 自定义交互

通过修改 `Background.tsx` 和 `ScrollableContainer.tsx` 中的事件处理程序，可以添加新的交互效果。

## 性能优化

- 使用 `useFrame` 钩子进行高效的动画循环
- 实现了滚动节流以优化性能
- 使用 React.memo 和 useCallback 避免不必要的重渲染

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

**重要提示：此源代码不是MIT许可证。**

❌ 禁止商业使用<br>
❌ 禁止再分发<br>
❌ 禁止挪用（例如将所有代码合并到其他项目中）<br>
✅ 您可以查看应用程序并重现其表现形式<br>
✅ 您可以使用部分代码

## 贡献

欢迎提交问题报告和功能请求。如果您想贡献代码，请确保：

1. 遵循现有的代码风格
2. 添加适当的类型注释
3. 确保所有测试通过
4. 更新相关文档

## 致谢

- 灵感来源于 [Monopo London](https://monopo.london/)
- 使用了 [React Three Fiber](https://github.com/pmndrs/react-three-fiber) 框架
- 着色器效果基于 GLSL 实现