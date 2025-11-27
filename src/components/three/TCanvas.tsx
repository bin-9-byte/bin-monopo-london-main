import React, { Suspense, VFC } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import {
	enFragmentShader, enVertexShader, jpFragmentShader, jpVertexShader
} from '../../modules/glsl/shader';
import { Background } from './Background';
import { Lense } from './Lense';
import { TextPlane } from './TextPlane';

// 背景粒子特效组件 - 独立层，不受滚动影响
export const BackgroundEffect: VFC = () => {
	const OrthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10)

	return (
		<Canvas camera={OrthographicCamera} dpr={window.devicePixelRatio}>
			<Suspense fallback={null}>
				<Background />
			</Suspense>
		</Canvas>
	)
}

// 3D文字特效组件 - 在滚动容器的第一页
export const TextEffect: VFC<{ scrollProgress?: number }> = ({ scrollProgress = 0 }) => {
	const OrthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10)

	return (
		<Canvas camera={OrthographicCamera} dpr={window.devicePixelRatio}>
			<Suspense fallback={null}>
				<Lense />
				<TextPlane
					text={['Welcome to', 'BIN\'S Portfolio']}
					vertexShader={enVertexShader}
					fragmentShader={enFragmentShader}
					scrollProgress={scrollProgress}
				/>
				<TextPlane 
					text={['欢迎来到', '马斌的设计世界']} 
					vertexShader={jpVertexShader} 
					fragmentShader={jpFragmentShader}
					scrollProgress={scrollProgress}
				/>
			</Suspense>
		</Canvas>
	)
}

// 合并的3D场景组件，包含背景和文字效果 - 保留以防其他地方引用
export const SceneEffect: VFC<{ scrollProgress?: number }> = ({ scrollProgress = 0 }) => {
	const OrthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10)

	return (
		<Canvas camera={OrthographicCamera} dpr={window.devicePixelRatio}>
			<Suspense fallback={null}>
				<Background />
				<Lense />
				<TextPlane
					text={['We are a brand', 'of collective']}
					vertexShader={enVertexShader}
					fragmentShader={enFragmentShader}
					scrollProgress={scrollProgress}
				/>
				<TextPlane 
					text={['今日は', '何を作ろうか?']} 
					vertexShader={jpVertexShader} 
					fragmentShader={jpFragmentShader}
					scrollProgress={scrollProgress}
				/>
			</Suspense>
		</Canvas>
	)
}

// 原始的TCanvas组件，保持不变以防其他地方引用
export const TCanvas: VFC = () => {
	const OrthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10)

	return (
		<Canvas camera={OrthographicCamera} dpr={window.devicePixelRatio}>
			<Suspense fallback={null}>
				<Background />
				<Lense />
				<TextPlane
					text={['We are a brand', 'of collective']}
					vertexShader={enVertexShader}
					fragmentShader={enFragmentShader}
				/>
				<TextPlane text={['今日は', '何を作ろうか?']} vertexShader={jpVertexShader} fragmentShader={jpFragmentShader} />
			</Suspense>
			{/* helper */}
			{/* <Stats /> */}
		</Canvas>
	)
}
