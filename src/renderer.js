import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

varying vec2 vUv;
varying vec3 vNormal;

uniform vec3 uCenterColor;
uniform vec3 uPetalColor;
uniform vec3 uBorderColor;
uniform float uPetals;
uniform float uRounds;
uniform float uSoftness;
uniform float uGlow;
uniform float uDepth;
uniform float uTime;
uniform float uCenterRadius;
uniform float uPetalInner;
uniform float uPetalOuter;
uniform float uSquareStart;
uniform float uSquareEnd;
uniform float uBorderInner;
uniform float uSideClusters;

float edgeBand(float value, float inner, float outer, float softness) {
  return smoothstep(inner, inner + softness, value) * (1.0 - smoothstep(outer - softness, outer, value));
}

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float dist = length(p);
  float squareDist = max(abs(p.x), abs(p.y)) * 1.14;
  float angle = atan(p.y, p.x);
  float softness = mix(0.012, 0.06, clamp(uSoftness, 0.0, 1.0));
  float flowerWave = 0.5 + 0.5 * cos(angle * uPetals + uTime * 0.4);
  float petalMask = edgeBand(dist - flowerWave * 0.055, uPetalInner, uPetalOuter, softness * 1.4);
  float centerMask = 1.0 - smoothstep(uCenterRadius - softness * 2.0, uCenterRadius + softness * 2.0, dist);
  float squareBody = 1.0 - smoothstep(uSquareEnd - softness * 8.0, uSquareEnd + softness * 6.0, squareDist);
  float borderMask = edgeBand(squareDist, uBorderInner, uSquareEnd, softness * 2.4);

  float squareMix = smoothstep(uPetalOuter - 0.05, uSquareStart + 0.03, squareDist);
  float shapeDist = mix(dist, squareDist, squareMix);
  float alpha = 1.0 - smoothstep(uSquareEnd + 0.05, uSquareEnd + 0.14, shapeDist);

  vec3 yarnBase = vec3(0.12, 0.08, 0.05);
  vec3 col = mix(yarnBase, uBorderColor, squareBody);
  col = mix(col, uPetalColor, petalMask);
  col = mix(col, uCenterColor, centerMask);
  col = mix(col, uBorderColor, borderMask);

  float ridges = 0.06 * sin((p.x + p.y) * mix(24.0, 44.0, uSoftness) + uTime)
    + 0.04 * sin(angle * (uPetals + uSideClusters) + uTime * 0.5);
  float yarn = 0.92 + ridges;

  float squareSpan = max(uSquareEnd - uSquareStart, 0.001);
  float ringCoord = clamp((squareDist - uSquareStart) / squareSpan, 0.0, 1.0);
  float ringLines = abs(fract(ringCoord * max(uRounds - 2.0, 1.0)) - 0.5);
  float roundDefinition = 1.0 - smoothstep(0.36, 0.49, ringLines);

  float highlight = uGlow * edgeBand(dist, uCenterRadius * 0.75, uPetalOuter, softness * 3.0);
  float depthShade = mix(0.88, 1.2, clamp(vNormal.z * 0.5 + 0.5, 0.0, 1.0)) * mix(0.92, 1.15, uDepth);

  col *= yarn * depthShade;
  col += roundDefinition * 0.08 * vec3(1.0, 0.86, 0.62);
  col += highlight * vec3(1.0, 0.77, 0.42);

  gl_FragColor = vec4(col, alpha);
}
`;

export function createRenderer(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#1f150f');

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.15, 3.75);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 2.35;
  controls.maxDistance = 6.5;
  controls.maxPolarAngle = Math.PI * 0.53;

  const geometry = new THREE.PlaneGeometry(2.85, 2.85, 1, 1);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    uniforms: {
      uCenterColor: { value: new THREE.Color('#f4d35e') },
      uPetalColor: { value: new THREE.Color('#f28f3b') },
      uBorderColor: { value: new THREE.Color('#5b3a29') },
      uPetals: { value: 8 },
      uRounds: { value: 5 },
      uSoftness: { value: 0.7 },
      uGlow: { value: 0.45 },
      uDepth: { value: 0.55 },
      uTime: { value: 0 },
      uCenterRadius: { value: 0.17 },
      uPetalInner: { value: 0.17 },
      uPetalOuter: { value: 0.38 },
      uSquareStart: { value: 0.38 },
      uSquareEnd: { value: 0.9 },
      uBorderInner: { value: 0.72 },
      uSideClusters: { value: 3 },
    },
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(4.8, 4.8, 1, 1),
    new THREE.MeshBasicMaterial({ color: '#140d0a', transparent: true, opacity: 0.96 }),
  );
  backdrop.position.z = -0.28;
  scene.add(backdrop);

  scene.add(new THREE.AmbientLight(0xffffff, 1.7));
  const keyLight = new THREE.DirectionalLight(0xffe1b3, 1.9);
  keyLight.position.set(2, 2.4, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffb46f, 0.9);
  fillLight.position.set(-2.4, -1.3, 2);
  scene.add(fillLight);

  function resize() {
    const { clientWidth, clientHeight } = container;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);
  resize();

  let raf = 0;
  const clock = new THREE.Clock();

  function animate() {
    raf = requestAnimationFrame(animate);
    material.uniforms.uTime.value = clock.getElapsedTime();
    mesh.rotation.z += 0.0018;
    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  return {
    update(artifact) {
      const { normalizedInputs, render, summary } = artifact;
      material.uniforms.uCenterColor.value.set(normalizedInputs.centerColor);
      material.uniforms.uPetalColor.value.set(normalizedInputs.petalColor);
      material.uniforms.uBorderColor.value.set(normalizedInputs.borderColor);
      material.uniforms.uPetals.value = summary.petals;
      material.uniforms.uRounds.value = summary.rounds;
      material.uniforms.uSoftness.value = normalizedInputs.softness;
      material.uniforms.uGlow.value = normalizedInputs.glow;
      material.uniforms.uDepth.value = normalizedInputs.depth;
      material.uniforms.uCenterRadius.value = render.centerRadius;
      material.uniforms.uPetalInner.value = render.petalInner;
      material.uniforms.uPetalOuter.value = render.petalOuter;
      material.uniforms.uSquareStart.value = render.squareStart;
      material.uniforms.uSquareEnd.value = render.squareEnd;
      material.uniforms.uBorderInner.value = render.borderInner;
      material.uniforms.uSideClusters.value = render.sideClusters;

      const scale = 0.95 + (summary.rounds - 3) * 0.06;
      mesh.scale.setScalar(scale);
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      controls.dispose();
      geometry.dispose();
      backdrop.geometry.dispose();
      backdrop.material.dispose();
      material.dispose();
      renderer.dispose();
      container.innerHTML = '';
    },
  };
}
