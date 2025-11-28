import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdvancedTextEffect } from './AdvancedTextEffect';
import { ScrollController } from './ScrollController';

// 自定义着色器示例
const customVertexShader = `
  varying vec2 vUv;
  uniform float u_scrollProgress;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // 滚动时缩放效果
    float scale = 1.0 + u_scrollProgress * 0.5;
    pos *= scale;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const customFragmentShader = `
  uniform sampler2D u_texture;
  uniform vec2 u_mouse;
  uniform float u_aspect;
  uniform float u_enable;
  uniform float u_scrollProgress;
  
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv;
    
    // 基础颜色
    vec4 color = texture2D(u_texture, uv);
    
    // 滚动时颜色变化
    color.rgb *= (1.0 - u_scrollProgress * 0.5);
    
    // 鼠标效果
    if (u_enable > 0.5) {
      vec2 mouse = u_mouse;
      mouse.x *= u_aspect;
      float dist = distance(uv, mouse);
      float influence = 1.0 - smoothstep(0.0, 0.3, dist);
      color.rgb += influence * vec3(0.2, 0.5, 0.8);
    }
    
    gl_FragColor = color;
  }
`;

// 自定义文字配置
const customTextLines = [
  {
    text: "MONOPO",
    position: "top" as const,
    vertexShader: customVertexShader,
    fragmentShader: customFragmentShader,
    scrollProgress: 0,
    mouseEffect: true,
    scrollEffect: true,
    scrollDirection: "up" as const,
    scrollSpeed: 1.0
  },
  {
    text: "LONDON",
    position: "bottom" as const,
    vertexShader: customVertexShader,
    fragmentShader: customFragmentShader,
    scrollProgress: 0,
    mouseEffect: true,
    scrollEffect: true,
    scrollDirection: "down" as const,
    scrollSpeed: 1.5
  },
  {
    text: "モノポ",
    position: "top" as const,
    vertexShader: customVertexShader,
    fragmentShader: customFragmentShader,
    scrollProgress: 0,
    mouseEffect: true,
    scrollEffect: true,
    scrollDirection: "up" as const,
    scrollSpeed: 0.8
  },
  {
    text: "ロンドン",
    position: "bottom" as const,
    vertexShader: customVertexShader,
    fragmentShader: customFragmentShader,
    scrollProgress: 0,
    mouseEffect: true,
    scrollEffect: true,
    scrollDirection: "down" as const,
    scrollSpeed: 1.2
  }
];

export const CustomTextEffectExample = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const handleScrollChange = (progress: number) => {
    setScrollProgress(progress);
  };
  
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <ScrollController onScrollChange={handleScrollChange} />
      
      <Canvas
        camera={{
          position: [0, 0, 10],
          left: window.innerWidth / -2,
          right: window.innerWidth / 2,
          top: window.innerHeight / 2,
          bottom: window.innerHeight / -2,
          near: 0.1,
          far: 1000
        }}
        orthographic
        gl={{ preserveDrawingBuffer: true }}
      >
        <AdvancedTextEffect 
          scrollProgress={scrollProgress} 
          enableMouseEffect={true}
          enableLense={true}
          textLines={customTextLines.map(line => ({
            ...line,
            scrollProgress
          }))}
        />
      </Canvas>
      
      {/* 滚动内容 */}
      <div style={{ position: 'absolute', top: '100vh', width: '100%', height: '200vh' }}>
        <h1>滚动查看效果</h1>
        <p>当前滚动进度: {scrollProgress.toFixed(2)}</p>
      </div>
    </div>
  );
};