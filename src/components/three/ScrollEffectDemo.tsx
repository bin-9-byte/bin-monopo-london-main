import React, { VFC, useState } from 'react';
import { css } from '@emotion/css';
import { AdvancedTextEffect } from './AdvancedTextEffect';
import { ScrollController } from './ScrollController';
import { PageOneOverlay } from './PageOneOverlay';

// 示例：展示如何使用新的组件结构创建不同的滚动效果
export const ScrollEffectDemo: VFC = () => {
	const [scrollProgress, setScrollProgress] = useState(0);
	const [hasScrolled, setHasScrolled] = useState(false);

	const handleScrollChange = (progress: number) => {
		// 标记用户已经开始滚动
		if (!hasScrolled && progress > 0) {
			setHasScrolled(true);
		}
		setScrollProgress(progress);
	};

	// 自定义文字配置，展示不同的滚动效果
	const customTextLines = [
		{
			text: "Scrolling",
			position: "top" as const,
			vertexShader: `
				varying vec2 vUv;
				uniform float u_scrollProgress;
				
				void main() {
					vUv = uv;
					vec3 pos = position;
					
					// 滚动时向上移动
					pos.y += u_scrollProgress * 0.5;
					
					gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
				}
			`,
			fragmentShader: `
				varying vec2 vUv;
				uniform sampler2D u_texture;
				uniform vec2 u_mouse;
				uniform float u_aspect;
				uniform bool u_enable;
				
				void main() {
					vec4 color = texture2D(u_texture, vUv);
					
					if (u_enable) {
						vec2 cursor = u_mouse;
						cursor.x *= u_aspect;
						float dist = distance(vUv * vec2(u_aspect, 1.0), cursor);
						float influence = 1.0 - smoothstep(0.0, 0.3, dist);
						color.rgb += influence * 0.2;
					}
					
					gl_FragColor = color;
				}
			`,
			scrollProgress,
			mouseEffect: true,
			scrollEffect: true,
			scrollDirection: "up" as const,
			scrollSpeed: 1.0
		},
		{
			text: "Effects",
			position: "bottom" as const,
			vertexShader: `
				varying vec2 vUv;
				uniform float u_scrollProgress;
				
				void main() {
					vUv = uv;
					vec3 pos = position;
					
					// 滚动时旋转
					float angle = u_scrollProgress * 3.14159 * 0.25;
					mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
					pos.xy = rotation * pos.xy;
					
					gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
				}
			`,
			fragmentShader: `
				varying vec2 vUv;
				uniform sampler2D u_texture;
				uniform vec2 u_mouse;
				uniform float u_aspect;
				uniform bool u_enable;
				
				void main() {
					vec4 color = texture2D(u_texture, vUv);
					
					if (u_enable) {
						vec2 cursor = u_mouse;
						cursor.x *= u_aspect;
						float dist = distance(vUv * vec2(u_aspect, 1.0), cursor);
						float influence = 1.0 - smoothstep(0.0, 0.3, dist);
						color.rgb += influence * vec3(0.2, 0.1, 0.3);
					}
					
					gl_FragColor = color;
				}
			`,
			scrollProgress,
			mouseEffect: true,
			scrollEffect: true,
			scrollDirection: "rotate" as const,
			scrollSpeed: 1.0
		}
	];

	return (
		<div className={styles.container}>
			{/* 滚动控制器 */}
			<ScrollController onScrollChange={handleScrollChange} />

			{/* 第一页：展示自定义滚动效果 */}
			<div className={styles.firstPage}>
				<PageOneOverlay />
				<AdvancedTextEffect 
					scrollProgress={hasScrolled ? scrollProgress : 0} 
					enableMouseEffect={true}
					enableLense={true}
					textLines={customTextLines}
				/>
			</div>

			{/* 第二页：说明文字 */}
			<div className={styles.page}>
				<div className={styles.content}>
					<h1>滚动效果演示</h1>
					<p>这个页面展示了如何使用新的组件结构来创建不同的滚动效果。</p>
					<p>第一行文字在滚动时会向上移动，第二行文字在滚动时会旋转。</p>
					<p>鼠标悬停在文字上时，会有不同的颜色效果。</p>
				</div>
			</div>
		</div>
	);
};

const styles = {
	container: css`
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	`,
	firstPage: css`
		position: relative;
		width: 100%;
		height: 100vh;
	`,
	page: css`
		position: relative;
		width: 100%;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.8);
	`,
	content: css`
		max-width: 800px;
		padding: 40px;
		color: white;
		
		h1 {
			font-size: 2.5rem;
			margin-bottom: 20px;
		}
		
		p {
			font-size: 1.2rem;
			line-height: 1.6;
			margin-bottom: 16px;
		}
	`
};