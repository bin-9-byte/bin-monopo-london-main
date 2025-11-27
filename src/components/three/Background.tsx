import { VFC, useRef, useEffect, createContext, useContext } from 'react';
import * as THREE from 'three';
import { Plane } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { cnoise21 } from '../../modules/glsl/noise';

// 创建上下文来管理hover状态
export const HoverContext = createContext({
	isHovering: false,
	setHovering: (_: boolean) => {}
});

export const useHover = () => useContext(HoverContext);

export const Background: VFC = () => {
	const { isHovering } = useHover();
	
	const shader: THREE.Shader = {
		uniforms: {
			u_time: { value: 0 },
			u_mouse: { value: new THREE.Vector2() },
			u_hover: { value: isHovering ? 1.0 : 0.0 }
		},
		vertexShader,
		fragmentShader
	}

	const mouseRef = useRef({ x: 0.5, y: 0.5 }); // 初始位置设为中心
	
	// 初始化鼠标位置
	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			mouseRef.current.x = event.clientX / window.innerWidth;
			mouseRef.current.y = 1 - event.clientY / window.innerHeight;
		};
		
		window.addEventListener('mousemove', handleMouseMove);
		
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);
	
	// 更新着色器 - 不再考虑滚动状态，始终更新
	useFrame(() => {
		// 始终更新时间
		shader.uniforms.u_time.value += 0.005
		
		// 直接使用鼠标位置，不进行lerp插值
		shader.uniforms.u_mouse.value.x = mouseRef.current.x;
		shader.uniforms.u_mouse.value.y = mouseRef.current.y;
		
		// 更新hover状态
		shader.uniforms.u_hover.value = isHovering ? 1.0 : 0.0;
	})

	return (
		<Plane args={[2, 2]}>
			<shaderMaterial args={[shader]} />
		</Plane>
	)
}

const vertexShader = `
varying vec2 v_uv;

void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const fragmentShader = `
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_hover;
varying vec2 v_uv;

${cnoise21}

float random(vec2 p) {
  vec2 k1 = vec2(
    23.14069263277926, // e^pi (Gelfond's constant)
    2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
  );
  return fract(
    cos(dot(p, k1)) * 12345.6789
  );
}

const vec3 black = vec3(0.0);
const vec3 color1 = vec3(0.89, 0.34, 0.11);
const vec3 color2 = vec3(0.56, 0.64, 0.64);
const vec3 color3 = vec3(0.16, 0.26, 0.47);

void main() {
  vec2 seed = v_uv * 1.5 * (u_mouse + 0.3 * (length(u_mouse) + 0.5));
  float n = cnoise21(seed) + length(u_mouse) * 0.9;
  
  // 添加hover效果 - 当hover时增加噪声强度
  float hoverEffect = u_hover * 0.3;
  n += hoverEffect;

  float ml = pow(length(u_mouse), 2.5) * 0.15;
  float n1 = smoothstep(0.0, 0.0 + 0.2, n);
  vec3 color = mix(black, color1, n1);
  
  float n2 = smoothstep(0.1 + ml, 0.1 + ml + 0.2, n);
  color = mix(color, color2, n2);

  float n3 = smoothstep(0.2 + ml, 0.2 + ml + 0.2, n);
  color = mix(color, color3, n3);

  float n4 = smoothstep(0.3 + ml, 0.3 + ml + 0.2, n);
  color = mix(color, black, n4);

  vec2 uvrandom = v_uv;
  uvrandom.y *= random(vec2(uvrandom.y, 0.4));
  color.rgb += random(uvrandom) * 0.05;
  
  // hover时增加亮度
  color.rgb += u_hover * 0.1;

  gl_FragColor = vec4(color, 1.0);
}
`
