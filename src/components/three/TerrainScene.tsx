import { useMemo, useRef } from 'react';
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

/* Ruido simplex 3D (Ashima / webgl-noise) para el displacement en GPU. */
const SIMPLEX = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const vertexShader = /* glsl */ `
uniform float uTime;
varying float vElevation;
varying vec2 vUv;
${SIMPLEX}
void main() {
  vUv = uv;
  vec3 pos = position;
  float t = uTime * 0.08;
  float e = snoise(vec3(pos.x * 0.16, pos.y * 0.16 + t, t)) * 1.7;
  e += snoise(vec3(pos.x * 0.42, pos.y * 0.42 + t, t * 1.4)) * 0.5;
  pos.z += e;
  vElevation = e;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uColorHi;
varying float vElevation;
varying vec2 vUv;
void main() {
  float h = smoothstep(-1.2, 2.2, vElevation);
  vec3 col = mix(uColor, uColorHi, h);
  // Se desvanece hacia el horizonte (borde superior de la malla)
  float depthFade = smoothstep(0.0, 0.55, vUv.y);
  float a = (0.10 + h * 0.6) * depthFade;
  gl_FragColor = vec4(col, a);
}
`;

function Terrain({ reduce }: { reduce: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#5a6b1f') },
      uColorHi: { value: new THREE.Color('#c6e94a') },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (matRef.current && !reduce) {
      matRef.current.uniforms.uTime.value += delta;
    }
    if (groupRef.current) {
      // Parallax suave hacia el puntero
      const px = state.pointer.x * 0.15;
      const py = state.pointer.y * 0.08;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, px, 0.04);
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        -2.4 + py,
        0.04,
      );
    }
  });

  const meshProps: ThreeElements['mesh'] = {
    rotation: [-Math.PI / 2.35, 0, 0],
  };

  return (
    <group ref={groupRef} position={[0, -2.4, 0]}>
      <mesh {...meshProps}>
        <planeGeometry args={[34, 26, 140, 110]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          wireframe
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function TerrainScene({ reduce = false }: { reduce?: boolean }) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 1.4, 7], fov: 52 }}
      dpr={[1, 1.75]}
      frameloop={reduce ? 'demand' : 'always'}
      style={{ width: '100%', height: '100%' }}
    >
      <fog attach="fog" args={['#141614', 6, 15]} />
      <Terrain reduce={reduce} />
    </Canvas>
  );
}
