import React, { Suspense, VFC } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import {
	enFragmentShader, enVertexShader, jpFragmentShader, jpVertexShader
} from '../../modules/glsl/shader';
import { TextLine } from './TextLine';
import { LenseEffect } from './LenseEffect';

type TextEffectProps = {
	scrollProgress?: number
	enableMouseEffect?: boolean
	enableLense?: boolean
}

export const TextEffect: VFC<TextEffectProps> = ({ 
	scrollProgress = 0, 
	enableMouseEffect = true,
	enableLense = true 
}) => {
	const OrthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10)

	return (
		<Canvas camera={OrthographicCamera} dpr={window.devicePixelRatio}>
			<Suspense fallback={null}>
				{enableLense && <LenseEffect enabled={enableMouseEffect} />}
				
				{/* 英文文字 - 上行 */}
				<TextLine
					text="Welcome to"
					position="top"
					vertexShader={enVertexShader}
					fragmentShader={enFragmentShader}
					scrollProgress={scrollProgress}
					mouseEffect={enableMouseEffect}
				/>
				
				{/* 英文文字 - 下行 */}
				<TextLine
					text="BIN'S Portfolio"
					position="bottom"
					vertexShader={enVertexShader}
					fragmentShader={enFragmentShader}
					scrollProgress={scrollProgress}
					mouseEffect={enableMouseEffect}
				/>
				
				{/* 日文文字 - 上行 */}
				<TextLine
					text="欢迎来到"
					position="top"
					vertexShader={jpVertexShader}
					fragmentShader={jpFragmentShader}
					scrollProgress={scrollProgress}
					mouseEffect={enableMouseEffect}
				/>
				
				{/* 日文文字 - 下行 */}
				<TextLine
					text="马斌的设计世界"
					position="bottom"
					vertexShader={jpVertexShader}
					fragmentShader={jpFragmentShader}
					scrollProgress={scrollProgress}
					mouseEffect={enableMouseEffect}
				/>
			</Suspense>
		</Canvas>
	)
}