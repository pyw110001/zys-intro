import React, { useEffect, useRef } from 'react';

const VERTEX_SHADER_SRC = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;

  // Description : Array and textureless GLSL 2D simplex noise function.
  //      Author : Ian McEwan, Ashima Arts.
  //  Maintainer : ijm
  //     Lastmod : 20110822 (ijm)
  //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
  //               Distributed under the MIT License. See LICENSE file.
  //               https://github.com/ashima/webgl-noise
  
  vec3 permute(vec3 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
  }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx) ;
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0 ;
    vec3 h = abs(x) - 0.5 ;
    vec3 a0 = x - floor(x + 0.5);
    vec3 g = a0 * vec3(m.x, m.y, m.z) + h * vec3(m.x, m.y, m.z);
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Scale UV for coordinate space
    vec2 st = uv * 1.5;
    
    // Smooth time factor
    float t = u_time * 0.08;
    
    // Add domain warping (noise of noise)
    vec2 q = vec2(0.0);
    q.x = snoise(st + vec2(0.0, t * 0.2));
    q.y = snoise(st + vec2(1.0, t * 0.1));
    
    vec2 r = vec2(0.0);
    r.x = snoise(st + 4.0 * q + vec2(1.7, 9.2) + vec2(t * 0.15, t * 0.1));
    r.y = snoise(st + 4.0 * q + vec2(8.3, 2.8) + vec2(t * 0.08, t * 0.2));
    
    // Mouse interaction influence
    vec2 mouseDist = uv - u_mouse;
    float mInfluence = smoothstep(0.4, 0.0, length(mouseDist));
    
    // Warp space based on noise and mouse influence
    float f = snoise(st + 3.0 * r + mouseDist * mInfluence * 0.4);
    
    // Base Colors (Indigo theme)
    vec3 space = vec3(0.078, 0.082, 0.180); // #14152e (Dark base)
    vec3 teal = vec3(0.310, 0.718, 0.702);  // #4fb7b3 (Teal wave)
    vec3 mint = vec3(0.659, 0.984, 0.827);  // #a8fbd3 (Mint glow)
    vec3 lavender = vec3(0.388, 0.478, 0.725); // #637ab9 (Periwinkle highlight)
    
    // Color composition
    vec3 color = space;
    
    // Mix lavender base layers
    color = mix(color, lavender, clamp(f * f * 3.5, 0.0, 1.0) * 0.25);
    
    // Mix teal active waves
    color = mix(color, teal, clamp(length(q) * 0.6, 0.0, 1.0) * 0.3);
    
    // Mix mint bright peaks
    color = mix(color, mint, clamp(r.x * r.x * 2.0, 0.0, 1.0) * 0.15);
    
    // Add custom mouse highlight glow
    color += mint * mInfluence * 0.08;
    
    // Subtly enhance contrast
    color = pow(color, vec3(0.95));
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const WebGLBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS gradients.');
      return;
    }

    // Helper to compile shader
    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Setup full-screen quad vertices
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

    // Handle resizing
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // Track mouse coordinates
    let mouse = { x: 0.5, y: 0.5 };
    let targetMouse = { x: 0.5, y: 0.5 };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX / window.innerWidth;
      targetMouse.y = 1.0 - (e.clientY / window.innerHeight); // Invert Y for WebGL
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Render loop
    let animationFrameId: number;
    const startTime = performance.now();

    const render = () => {
      const elapsed = (performance.now() - startTime) / 1000.0;
      
      // Interpolate mouse movement for smooth delay effect
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      gl.clear(gl.COLOR_BUFFER_BIT);

      // Bind uniforms
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, elapsed);
      gl.uniform2f(mouseLoc, mouse.x, mouse.y);

      // Draw quad
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buffer);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-screen h-screen pointer-events-none"
      style={{ display: 'block' }}
    />
  );
};

export default WebGLBackground;
