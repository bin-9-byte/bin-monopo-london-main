export const enVertexShader = `
varying vec2 v_uv;

void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

export const enFragmentShader = `
uniform sampler2D u_texture;
uniform vec2 u_mouse;
uniform float u_aspect;
uniform bool u_enable;
uniform float u_scrollProgress;
uniform float u_fadeStart;
uniform float u_fadeEnd;
varying vec2 v_uv;

void main() {
  vec4 tex = texture2D(u_texture, v_uv);

  vec2 aspect = vec2(u_aspect, 1.0);
  float radius = 0.19;
  float dist = distance(u_mouse * aspect, v_uv * aspect);
  float d = 1.0 - smoothstep(radius, radius + 0.005, dist);
  
  // 滚动效果：全局淡出（位置不动）
  float fadeAlpha = 1.0 - smoothstep(u_fadeStart, u_fadeEnd, u_scrollProgress);
  
  if (u_enable) {
    tex.a = mix(tex.a, 0.0, d);
  }
  
  // 应用滚动淡出效果（全局淡出）
  tex.a *= fadeAlpha;

  gl_FragColor = tex;
}
`

// ========================================================
export const jpVertexShader = `
varying vec2 v_uv;

void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

export const jpFragmentShader = `
uniform sampler2D u_texture;
uniform vec2 u_mouse;
uniform float u_aspect;
uniform bool u_enable;
uniform float u_scrollProgress;
uniform float u_fadeStart;
uniform float u_fadeEnd;
varying vec2 v_uv;

void main() {
  vec2 aspect = vec2(u_aspect, 1.0);
  float radius = 0.19;
  float dist = distance(u_mouse * aspect, v_uv * aspect);
  float d = smoothstep(radius, radius + 0.005, dist);

  vec2 sub = u_mouse - v_uv;
  sub *= aspect;

  vec2 uv = v_uv - sub * pow(dist * 0.7, 0.7);
  vec4 tex_r = texture2D(u_texture, uv);
  vec4 tex_g = texture2D(u_texture, uv + sub * 0.03);
  vec4 tex_b = texture2D(u_texture, uv + sub * 0.01);
  float a = max(max(tex_r.a, tex_g.a), tex_b.a);
  vec4 tex = vec4(tex_r.r, tex_g.g, tex_b.b, a);

  if (u_enable) {
    tex.a = mix(tex.a, 0.0, d);
  }
  
  // 滚动效果：全局淡出（位置不动）
  float fadeAlpha = 1.0 - smoothstep(u_fadeStart, u_fadeEnd, u_scrollProgress);
  tex.a *= fadeAlpha;
  
  // 保持在未启用鼠标效果时仍显示文字

  gl_FragColor = tex;
}
`
