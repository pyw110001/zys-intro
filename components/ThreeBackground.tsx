import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 400;

const PARTICLE_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    pos.x += sin(uTime * 0.15 + aPhase) * 0.08;
    pos.y += cos(uTime * 0.12 + aPhase * 1.3) * 0.06;
    pos.z += sin(uTime * 0.1 + aPhase * 0.7) * 0.08;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * (280.0 / -mvPosition.z);
    vAlpha = 0.35 + 0.25 * sin(uTime + aPhase);
  }
`;

const PARTICLE_FRAGMENT = /* glsl */ `
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float dist = length(c);
    if (dist > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, dist);
    gl_FragColor = vec4(0.66, 0.98, 0.83, soft * vAlpha);
  }
`;

const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0b18');
    scene.fog = new THREE.FogExp2('#0a0b18', 0.045);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.className =
      'fixed inset-0 -z-10 w-screen h-screen pointer-events-none';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const particleGroup = new THREE.Group();
    scene.add(particleGroup);

    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleSizes = new Float32Array(PARTICLE_COUNT);
    const particlePhases = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 4 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 6;
      particleSizes[i] = 1.5 + Math.random() * 2.5;
      particlePhases[i] = Math.random() * Math.PI * 2;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('aSize', new THREE.BufferAttribute(particleSizes, 1));
    particleGeo.setAttribute('aPhase', new THREE.BufferAttribute(particlePhases, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERTEX,
      fragmentShader: PARTICLE_FRAGMENT,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMaterial);
    particleGroup.add(particles);

    let targetMouseX = 0;
    let targetMouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;
    let scrollY = 0;
    let smoothScrollY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onScroll();

    const startTime = performance.now();
    let animationFrameId = 0;

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;

      smoothMouseX += (targetMouseX - smoothMouseX) * 0.04;
      smoothMouseY += (targetMouseY - smoothMouseY) * 0.04;
      smoothScrollY += (scrollY - smoothScrollY) * 0.06;

      particleGroup.rotation.y = smoothMouseX * 0.35;
      particleGroup.rotation.x = smoothMouseY * 0.2;

      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollNorm = smoothScrollY / maxScroll;
      camera.position.y = scrollNorm * 2.5 - 0.5;
      camera.lookAt(0, scrollNorm * 0.8, -2);

      particleMaterial.uniforms.uTime.value = elapsed;
      particles.rotation.y = elapsed * 0.02;
      particles.rotation.x = Math.sin(elapsed * 0.015) * 0.1;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      particleGeo.dispose();
      particleMaterial.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} aria-hidden="true" />;
};

export default ThreeBackground;
