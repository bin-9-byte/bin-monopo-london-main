# 3D文字特效组件重构

这个重构将原来的3D文字特效拆分为更灵活、更可控的组件结构，以便更好地实现滚动交互效果和鼠标气泡效果。

## 组件结构

### 1. TextLine 组件
处理单行文字的组件，可以独立控制每行文字的效果。

```tsx
<TextLine
  text="Hello World"
  position="top"  // "top" 或 "bottom"
  vertexShader={vertexShader}
  fragmentShader={fragmentShader}
  scrollProgress={scrollProgress}
  mouseEffect={true}  // 是否启用鼠标效果
/>
```

### 2. LenseEffect 组件
独立的鼠标气泡效果组件，可以单独控制是否启用。

```tsx
<LenseEffect enabled={true} />
```

### 3. TextEffect 组件
重构后的文字特效组件，使用多个 TextLine 组件。

```tsx
<TextEffect 
  scrollProgress={scrollProgress} 
  enableMouseEffect={true}
  enableLense={true}
/>
```

### 4. AdvancedTextEffect 组件
高级文字特效组件，允许自定义每行文字的配置。

```tsx
<AdvancedTextEffect 
  scrollProgress={scrollProgress} 
  enableMouseEffect={true}
  enableLense={true}
  textLines={customTextLines}  // 自定义文字配置
/>
```

### 5. ScrollController 组件
独立的滚动控制组件，提供更精细的滚动控制。

```tsx
<ScrollController 
  onScrollChange={handleScrollChange}
  scrollThreshold={0.01}  // 滚动阈值
  debounceMs={16}  // 防抖延迟
/>
```

## 使用示例

### 基本使用
```tsx
import { TextEffect } from './components/three/TextEffect';
import { ScrollController } from './components/three/ScrollController';

const MyComponent = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const handleScrollChange = (progress: number) => {
    setScrollProgress(progress);
  };
  
  return (
    <div>
      <ScrollController onScrollChange={handleScrollChange} />
      <TextEffect 
        scrollProgress={scrollProgress} 
        enableMouseEffect={true}
        enableLense={true}
      />
    </div>
  );
};
```

### 自定义文字效果
```tsx
import { AdvancedTextEffect } from './components/three/AdvancedTextEffect';

const customTextLines = [
  {
    text: "Custom Text",
    position: "top",
    vertexShader: customVertexShader,
    fragmentShader: customFragmentShader,
    scrollProgress,
    mouseEffect: true,
    scrollEffect: true,
    scrollDirection: "up",
    scrollSpeed: 1.0
  }
];

<AdvancedTextEffect 
  scrollProgress={scrollProgress} 
  enableMouseEffect={true}
  enableLense={true}
  textLines={customTextLines}
/>
```

## 优势

1. **模块化**: 每个组件都有明确的职责，可以独立使用和测试。
2. **灵活性**: 可以单独控制每行文字的效果，实现更复杂的交互。
3. **性能**: 通过 ScrollController 组件优化滚动事件处理。
4. **可扩展性**: 易于添加新的效果和交互。

## 自定义着色器

你可以为每行文字提供自定义的顶点和片段着色器，实现独特的视觉效果。着色器可以使用以下 uniform 变量：

- `u_texture`: 文字纹理
- `u_mouse`: 鼠标位置 (vec2)
- `u_aspect`: 屏幕宽高比
- `u_enable`: 是否启用鼠标效果
- `u_scrollProgress`: 滚动进度 (0-1)

例如，创建一个滚动时缩放的效果：

```glsl
// 顶点着色器
varying vec2 vUv;
uniform float u_scrollProgress;

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // 滚动时缩放
  float scale = 1.0 + u_scrollProgress * 0.5;
  pos *= scale;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

## 演示

查看 `ScrollEffectDemo.tsx` 文件，了解如何使用这些组件创建不同的滚动效果。