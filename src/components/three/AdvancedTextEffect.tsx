import React, { Suspense, VFC } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import {
	enFragmentShader, enVertexShader, jpFragmentShader, jpVertexShader
} from '../../modules/glsl/shader';
import { TextLine } from './TextLine';
import { LenseEffect } from './LenseEffect';

type TextLineConfig = {
	text: string
	position: 'top' | 'bottom'
	vertexShader: string
	fragmentShader: string
	scrollProgress?: number
	mouseEffect?: boolean
	scrollEffect?: boolean
	scrollDirection?: 'up' | 'down' | 'left' | 'right' | 'rotate'
	scrollSpeed?: number
}

type AdvancedTextEffectProps = {
    scrollProgress?: number
    enableMouseEffect?: boolean
    enableLense?: boolean
    textLines?: TextLineConfig[]
    globalMouse?: { x: number; y: number }
}

export const AdvancedTextEffect: VFC<AdvancedTextEffectProps> = ({ 
    scrollProgress = 0, 
    enableMouseEffect = true,
    enableLense = true,
    textLines,
    globalMouse
}) => {
	const OrthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10)

	// 默认文字配置
	const defaultTextLines: TextLineConfig[] = [
		{
			text: "Welcome to",
			position: "top",
			vertexShader: enVertexShader,
			fragmentShader: enFragmentShader,
			scrollProgress,
			mouseEffect: enableMouseEffect,
			scrollEffect: true,
			scrollDirection: "left",
			scrollSpeed: 1.0
		},
		{
			text: "BIN'S Portfolio",
			position: "bottom",
			vertexShader: enVertexShader,
			fragmentShader: enFragmentShader,
			scrollProgress,
			mouseEffect: enableMouseEffect,
			scrollEffect: true,
			scrollDirection: "right",
			scrollSpeed: 1.0
		},
		{
			text: "欢迎来到",
			position: "top",
			vertexShader: jpVertexShader,
			fragmentShader: jpFragmentShader,
			scrollProgress,
			mouseEffect: enableMouseEffect,
			scrollEffect: true,
			scrollDirection: "right",
			scrollSpeed: 1.0
		},
		{
			text: "马斌的设计世界",
			position: "bottom",
			vertexShader: jpVertexShader,
			fragmentShader: jpFragmentShader,
			scrollProgress,
			mouseEffect: enableMouseEffect,
			scrollEffect: true,
			scrollDirection: "left",
			scrollSpeed: 1.0
		}
	]

	// 使用传入的配置或默认配置
	const linesToRender = textLines || defaultTextLines

    return (
        <Canvas 
            camera={OrthographicCamera} 
            dpr={Math.min(window.devicePixelRatio, 1.5)}
            gl={{ powerPreference: 'high-performance', antialias: true }}
        >
			<Suspense fallback={null}>
                {enableLense && (
                    <LenseEffect 
                        enabled={enableMouseEffect}
                        scrollProgress={scrollProgress}
                        fadeZone={0.24}
                        baseOpacity={1}
                        minOpacity={0}
                        fadeCurve={'pow'}
                        fadePow={2.0}
                        followSpeed={0.45}
                        followSmooth={12}
                        globalMouse={globalMouse}
                        scrollFadeStart={0.06}
                        scrollFadeEnd={0.22}
                    />
                )}
				
                {linesToRender.map((line, index) => (
                    React.createElement(TextLine as unknown as React.FC<any>, {
                        key: index,
                        text: line.text,
                        position: line.position,
                        vertexShader: line.vertexShader,
                        fragmentShader: line.fragmentShader,
                        scrollProgress: scrollProgress,
                        mouseEffect: enableMouseEffect && scrollProgress < 0.001,
                        fadeStart: 0.06,
                        fadeEnd: 0.22,
                        globalMouse: globalMouse
                    })
                ))}
			</Suspense>
		</Canvas>
	)
}
