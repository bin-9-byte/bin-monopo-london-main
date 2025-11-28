import { useRef, VFC } from 'react';
import * as THREE from 'three';
import { Circle, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

type LenseEffectProps = {
    enabled?: boolean,
    scrollProgress?: number,
    fadeZone?: number,
    baseOpacity?: number,
    minOpacity?: number,
    fadeCurve?: 'smooth' | 'smoother' | 'pow',
    fadePow?: number,
    followSpeed?: number,
    followSmooth?: number,
    globalMouse?: { x: number; y: number },
    scrollFadeStart?: number,
    scrollFadeEnd?: number
}

export const LenseEffect: VFC<LenseEffectProps> = ({ 
    enabled = true,
    scrollProgress = 0,
    fadeZone = 0.2,
    baseOpacity = 1,
    minOpacity = 0.3,
    fadeCurve = 'smoother',
    fadePow = 0.7,
    followSpeed = 0.4,
    followSmooth = 12,
    globalMouse,
    scrollFadeStart = 0.06,
    scrollFadeEnd = 0.22
}) => {
	const ref = useRef<THREE.Mesh>(null)
	const materialRef = useRef<THREE.MeshBasicMaterial>(null)
	const texture = useTexture(process.env.PUBLIC_URL + '/assets/textures/lense.png')
	const { aspect } = useThree(({ viewport }) => viewport)

	const target = new THREE.Vector3()
    useFrame(({ mouse }, delta) => {
        if (enabled) {
            const mx = globalMouse ? globalMouse.x : mouse.x
            const my = globalMouse ? globalMouse.y : mouse.y
            target.set(mx, my, 0.01)
            const p = ref.current!.position
            p.x = THREE.MathUtils.damp(p.x, target.x, followSmooth, delta)
            p.y = THREE.MathUtils.damp(p.y, target.y, followSmooth, delta)
            p.z = 1
        }

		// 根据滚动状态与靠近分界线（视口底部）距离，动态调整透明度
		const isScrolling = (scrollProgress ?? 0) > 0.001
		const boundaryY = -1 // 归一化坐标下，视口底部为 -1
		const currentY = ref.current ? ref.current.position.y : target.y
		const radiusY = 0.23 * (ref.current?.scale.y ?? 1) // 气泡半径在Y轴方向
		const lowerEdgeY = currentY - radiusY // 用下边缘作为接触判定
		const distanceLower = lowerEdgeY - boundaryY // >0 表示在边界之上

		// 计算更柔和且以下边缘为基准的淡化因子
		let t = THREE.MathUtils.clamp(distanceLower / fadeZone, 0, 1)
		let fadeFactor = 1
		if (isScrolling) {
			if (fadeCurve === 'pow') {
				fadeFactor = Math.pow(t, fadePow)
			} else if (fadeCurve === 'smooth') {
				fadeFactor = t * t * (3 - 2 * t) // smoothstep
			} else {
				// smootherstep: 6t^5 - 15t^4 + 10t^3
				fadeFactor = t * t * t * (t * (t * 6 - 15) + 10)
			}
		}

		// 下边缘接触或越过边界线时，完全透明
		let opacity = minOpacity + (baseOpacity - minOpacity) * fadeFactor
		if (isScrolling && distanceLower <= 0) {
			opacity = 0
		}
        // 叠加基于滚动进度的全局渐隐（位置不动）
        const scrollFadeAlpha = isScrolling
            ? 1 - THREE.MathUtils.smoothstep(scrollProgress!, scrollFadeStart, scrollFadeEnd)
            : 1
        const finalOpacity = opacity * scrollFadeAlpha

        if (materialRef.current) {
            materialRef.current.opacity = finalOpacity
        }
	})

        return (
            <Circle 
                ref={ref} 
                args={[0.23, 50]} 
                position-z={1} 
                scale={[1 / aspect, 1, 1]}
                renderOrder={999}
                frustumCulled={false}
            >
                <meshBasicMaterial 
                    ref={materialRef} 
                    map={texture} 
                    transparent 
                    opacity={baseOpacity}
                    depthTest={false}
                    depthWrite={false}
                />
            </Circle>
        )
}
