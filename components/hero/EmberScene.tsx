"use client";

// Signature hero scene: drifting ember/spark particles rising slowly through a
// dark field, with a soft heat-haze glow and gentle mouse parallax. Deliberately
// subtle and abstract — embers and heat, never literal flames.
//
// Loaded lazily (next/dynamic, ssr:false) from HeroBackdrop, which also gates
// reduced-motion and low-powered devices to a static gradient instead.

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 550;
const FIELD = { w: 22, h: 12, d: 8 };

const vertexShader = /* glsl */ `
  uniform float uTime;
  attribute float aSeed;
  attribute float aSpeed;
  attribute float aSize;
  varying float vSeed;
  varying float vLife;

  void main() {
    vSeed = aSeed;

    vec3 p = position;
    // Rise slowly, wrapping from bottom to top; each ember has its own pace.
    float travel = uTime * aSpeed;
    float life = fract((p.y + travel) / ${FIELD.h.toFixed(1)});
    p.y = life * ${FIELD.h.toFixed(1)} - ${(FIELD.h / 2).toFixed(1)};

    // Lateral drift — slow sinuous wander, unique per ember.
    p.x += sin(uTime * 0.18 + aSeed * 31.7) * 0.9
         + sin(uTime * 0.05 + aSeed * 7.3) * 0.6;
    p.z += cos(uTime * 0.14 + aSeed * 17.1) * 0.5;

    vLife = life;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // Shrink with distance; embers near the camera read larger and softer.
    gl_PointSize = aSize * (140.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vSeed;
  varying float vLife;

  void main() {
    // Soft round sprite with a hot core.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float glow = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.18, 0.0, d);

    // Ember palette: deep orange through amber to a pale hot centre.
    vec3 deep  = vec3(0.76, 0.29, 0.04);
    vec3 amber = vec3(0.98, 0.62, 0.18);
    vec3 pale  = vec3(1.0, 0.86, 0.62);
    vec3 col = mix(deep, amber, vSeed);
    col = mix(col, pale, core * 0.9);

    // Fade in near the floor, fade out as the ember rises and dies.
    float fade = smoothstep(0.0, 0.12, vLife) * (1.0 - smoothstep(0.55, 0.98, vLife));
    float alpha = glow * fade * (0.32 + 0.5 * vSeed);

    if (alpha < 0.003) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

function Embers() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  // THREE.Timer (Clock is deprecated from r183). update() accumulates per
  // rendered frame, so time freezes while the loop is paused — embers resume
  // exactly where they left off instead of jumping.
  const timer = useMemo(() => new THREE.Timer(), []);

  const { positions, seeds, speeds, sizes } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    const sizes = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * FIELD.w;
      positions[i * 3 + 1] = Math.random() * FIELD.h - FIELD.h / 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * FIELD.d;
      seeds[i] = Math.random();
      speeds[i] = 0.18 + Math.random() * 0.5; // slow, drifting rise
      sizes[i] = 0.5 + Math.random() * 1.7;
    }
    return { positions, seeds, speeds, sizes };
  }, []);

  useFrame(() => {
    timer.update();
    if (mat.current) mat.current.uniforms.uTime.value = timer.getElapsed();
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Soft heat-haze: a huge ember-tinted radial glow breathing slowly low in frame. */
function HeatHaze() {
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const timer = useMemo(() => new THREE.Timer(), []);
  useFrame(() => {
    timer.update();
    if (mat.current)
      mat.current.opacity = 0.05 + Math.sin(timer.getElapsed() * 0.25) * 0.018;
  });
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(249, 127, 17, 1)");
    g.addColorStop(0.5, "rgba(194, 75, 8, 0.35)");
    g.addColorStop(1, "rgba(194, 75, 8, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);
  return (
    <mesh position={[0, -4.5, -3]}>
      <planeGeometry args={[30, 16]} />
      <meshBasicMaterial
        ref={mat}
        map={texture}
        transparent
        opacity={0.06}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/** Gentle mouse parallax — the camera leans a fraction towards the pointer. */
function ParallaxRig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 0.7 - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 0.35 + 0.2 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function EmberScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.2, 9], fov: 50 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <ParallaxRig />
      <HeatHaze />
      <Embers />
    </Canvas>
  );
}
