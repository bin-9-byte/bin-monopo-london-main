import { useMemo, useRef, VFC } from 'react';
import * as THREE from 'three';
import { Plane } from '@react-three/drei';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { Drawer } from './drawer';

type TextLineProps = {
    text: string
    position: 'top' | 'bottom'
    vertexShader: string
    fragmentShader: string
    scrollProgress?: number
    mouseEffect?: boolean
    fadeStart?: number
    fadeEnd?: number
    globalMouse?: { x: number; y: number }
}

export const TextLine: VFC<TextLineProps> = props => {
    const { text, position, vertexShader, fragmentShader, scrollProgress = 0, mouseEffect = true, fadeStart = 0.05, fadeEnd = 0.22, globalMouse } = props

	// 创建一个只包含单行文字的Drawer实例
    const drawer = useMemo(() => {
        const d = new Drawer(position === 'top' ? text : '', position === 'bottom' ? text : '')
        d.draw()
        return d
    }, [text, position])

    const { aspect } = useThree(({ viewport }) => viewport)
    const meshRef = useRef<THREE.Mesh>(null)
    const raycaster = useMemo(() => new THREE.Raycaster(), [])

    const shader: THREE.Shader = useMemo(() => ({
        uniforms: {
            u_texture: { value: drawer.texture },
            u_mouse: { value: new THREE.Vector2() },
            u_aspect: { value: drawer.aspect },
            u_enable: { value: false },
            u_scrollProgress: { value: 0 },
            u_fadeStart: { value: fadeStart },
            u_fadeEnd: { value: fadeEnd }
        },
        vertexShader,
        fragmentShader
    }), [drawer.texture, drawer.aspect, vertexShader, fragmentShader, fadeStart, fadeEnd])

    const target = new THREE.Vector2()
    useFrame((state, delta) => {
        const isScrolling = (scrollProgress ?? 0) > 0.001

        // 使用统一的 NDC → 射线投射 → uv 映射（滚动与静止一致）
        const ndc = new THREE.Vector2(
            globalMouse ? globalMouse.x : state.mouse.x,
            globalMouse ? globalMouse.y : state.mouse.y
        )
        let uvSet = false
        if (meshRef.current) {
            raycaster.setFromCamera(ndc, state.camera)
            const intersects = raycaster.intersectObject(meshRef.current, false)
            if (intersects.length && intersects[0].uv) {
                target.copy(intersects[0].uv as THREE.Vector2)
                uvSet = true
            }
        }
        if (!uvSet) {
            const u = THREE.MathUtils.clamp((ndc.x + 1) / 2, 0, 1)
            const v = THREE.MathUtils.clamp((ndc.y + 1) / 2, 0, 1)
            target.set(u, v)
        }

        const um = shader.uniforms.u_mouse.value
        um.x = THREE.MathUtils.damp(um.x, target.x, 12, delta)
        um.y = THREE.MathUtils.damp(um.y, target.y, 12, delta)

        if (isScrolling || mouseEffect) {
            shader.uniforms.u_enable.value = true
        } else {
            // 非滚动且不启用鼠标效果
            shader.uniforms.u_enable.value = false
        }

        shader.uniforms.u_scrollProgress.value = scrollProgress
    })

	const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
		if (mouseEffect && e.uv) {
			// 检查是否在文字实际区域内（基于纹理alpha值）
			const tex = drawer.texture
			if (tex && tex.image) {
				const canvas = tex.image
				const x = Math.floor(e.uv.x * canvas.width)
				const y = Math.floor((1 - e.uv.y) * canvas.height)
				const ctx = canvas.getContext('2d')
				if (ctx) {
					const imageData = ctx.getImageData(x, y, 1, 1)
					const alpha = imageData.data[3]
					if (alpha > 10) { // 只在有文字像素的地方触发
						target.copy(e.uv)
					}
				}
			} else {
				target.copy(e.uv)
			}
		}
	}

	const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
		if (mouseEffect && e.uv) {
			// 检查是否在文字实际区域内
			const tex = drawer.texture
			if (tex && tex.image) {
				const canvas = tex.image
				const x = Math.floor(e.uv.x * canvas.width)
				const y = Math.floor((1 - e.uv.y) * canvas.height)
				const ctx = canvas.getContext('2d')
				if (ctx) {
					const imageData = ctx.getImageData(x, y, 1, 1)
					const alpha = imageData.data[3]
					if (alpha > 10) { // 只在有文字像素的地方触发
						shader.uniforms.u_mouse.value.copy(e.uv)
						shader.uniforms.u_enable.value = true
					}
				}
			} else {
				shader.uniforms.u_mouse.value.copy(e.uv)
				shader.uniforms.u_enable.value = true
			}
		}
	}

	const handlePointerLeave = () => {
		if (mouseEffect) {
			shader.uniforms.u_enable.value = false
		}
	}

	return (
        <Plane
            ref={meshRef}
            args={[2.6, 2.6 / drawer.aspect]}
            scale={[1 / aspect, 1, 1]}
            onPointerMove={mouseEffect ? handlePointerMove : undefined}
            onPointerEnter={mouseEffect ? handlePointerEnter : undefined}
            onPointerLeave={mouseEffect ? handlePointerLeave : undefined}>
            <shaderMaterial args={[shader]} transparent />
        </Plane>
	)
}
