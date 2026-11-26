import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sparkles } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const cameraStops = [
  { camera: [0, 27, 48], target: [0, 1, -2] },
  { camera: [0, 9, 29], target: [0, 2, 12] },
  { camera: [0, 6, 16], target: [0, 1, -5] },
  { camera: [0, 8, -1], target: [0, 1, -13] },
  { camera: [-11, 6, -15], target: [-7, 1, -16] },
  { camera: [11, 7, -16], target: [8, 1, -16] },
  { camera: [12, 7, 10], target: [7, 1, 8] },
  { camera: [0, 34, 50], target: [0, 0, -5] }
] as const;

const smooth = (t: number) => t * t * (3 - 2 * t);

function CameraPath() {
  const position = useRef(new THREE.Vector3());
  const focus = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const progress = useRef(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  useFrame((state, delta) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const targetProgress = reduced ? 0.03 : THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
    progress.current = THREE.MathUtils.damp(progress.current, targetProgress, reduced ? 10 : 2.2, delta);
    const scaled = progress.current * (cameraStops.length - 1);
    const index = Math.min(cameraStops.length - 2, Math.floor(scaled));
    const t = smooth(scaled - index);
    const a = cameraStops[index];
    const b = cameraStops[index + 1];
    position.current.set(
      THREE.MathUtils.lerp(a.camera[0], b.camera[0], t),
      THREE.MathUtils.lerp(a.camera[1], b.camera[1], t),
      THREE.MathUtils.lerp(a.camera[2], b.camera[2], t)
    );
    focus.current.set(
      THREE.MathUtils.lerp(a.target[0], b.target[0], t),
      THREE.MathUtils.lerp(a.target[1], b.target[1], t),
      THREE.MathUtils.lerp(a.target[2], b.target[2], t)
    );
    camera.position.lerp(position.current, 1 - Math.exp(-delta * 2.1));
    look.current.lerp(focus.current, 1 - Math.exp(-delta * 2.7));
    camera.lookAt(look.current);
  });
  return null;
}

function Palm({ x, z, scale = 1, rotation = 0 }: { x: number; z: number; scale?: number; rotation?: number }) {
  const angles = useMemo(() => Array.from({ length: 9 }, (_, i) => i * Math.PI * 2 / 9), []);
  return <group position={[x, 0, z]} rotation={[0, rotation, 0]} scale={scale}>
    <mesh position={[0, 2.45, 0]} rotation={[0, 0, -0.055]} castShadow>
      <cylinderGeometry args={[0.105, 0.22, 4.9, 9]} />
      <meshStandardMaterial color="#80694f" roughness={0.92} />
    </mesh>
    <group position={[0, 4.8, 0]}>
      {angles.map((angle, i) => <group key={i} rotation={[0, angle, -0.48 + (i % 3) * 0.07]}>
        <mesh position={[0, 1.45, 0]} rotation={[0.65, 0, 0]}>
          <coneGeometry args={[0.3, 3.25, 7, 1, false]} />
          <meshStandardMaterial color={i % 2 ? '#466d4d' : '#668957'} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.18, 0]} rotation={[0, 0, 0.02]}>
          <cylinderGeometry args={[0.025, 0.035, 2.8, 5]} />
          <meshStandardMaterial color="#a4a06a" />
        </mesh>
      </group>)}
    </group>
  </group>;
}

function GableRoof({ width, depth, y, color = '#51483c' }: { width: number; depth: number; y: number; color?: string }) {
  const geometry = useMemo(() => {
    const w = width / 2, d = depth / 2, ridge = y + width * 0.22;
    const vertices = new Float32Array([
      -w, y, -d, 0, ridge, -d, 0, ridge, d,
      -w, y, -d, 0, ridge, d, -w, y, d,
      0, ridge, -d, w, y, -d, w, y, d,
      0, ridge, -d, w, y, d, 0, ridge, d
    ]);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.computeVertexNormals();
    return g;
  }, [width, depth, y]);
  return <mesh geometry={geometry} castShadow>
    <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.82} />
  </mesh>;
}

function Villa({ x, z, width = 5.5, depth = 5, tone = '#e6dfcf', pool = false }: { x: number; z: number; width?: number; depth?: number; tone?: string; pool?: boolean }) {
  return <group position={[x, 0, z]}>
    <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
      <boxGeometry args={[width, 2.7, depth]} />
      <meshStandardMaterial color={tone} roughness={0.82} />
    </mesh>
    <GableRoof width={width + 1.1} depth={depth + 1} y={2.75} />
    <mesh position={[0, 1.35, depth / 2 + 0.012]}>
      <planeGeometry args={[width * 0.58, 1.85]} />
      <meshStandardMaterial color="#577b79" metalness={0.12} roughness={0.18} />
    </mesh>
    <mesh position={[0, 0.12, depth / 2 + 0.65]} receiveShadow>
      <boxGeometry args={[width + 0.7, 0.2, 1.35]} />
      <meshStandardMaterial color="#cbbda5" roughness={0.9} />
    </mesh>
    {pool && <>
      <mesh position={[0, 0.08, depth / 2 + 2.8]}>
        <boxGeometry args={[width * 0.72, 0.16, 3.2]} />
        <meshStandardMaterial color="#2b7777" roughness={0.18} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.18, depth / 2 + 2.8]}>
        <boxGeometry args={[width * 0.68, 0.035, 2.95]} />
        <meshStandardMaterial color="#78c5bd" transparent opacity={0.56} roughness={0.12} />
      </mesh>
    </>}
  </group>;
}

function Water({ position, size, color = '#3c9999' }: { position: [number, number, number]; size: [number, number]; color?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.55 + position[0]) * 0.025;
  });
  return <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={position}>
    <planeGeometry args={size} />
    <meshPhysicalMaterial color={color} roughness={0.16} metalness={0.12} clearcoat={0.8} clearcoatRoughness={0.12} transparent opacity={0.94} />
  </mesh>;
}

function Shrub({ x, z, scale = 1, tint = '#6e895e' }: { x: number; z: number; scale?: number; tint?: string }) {
  return <group position={[x, 0, z]} scale={scale}>
    {[[-0.35, 0.48, 0], [0.25, 0.55, 0.1], [0, 0.78, -0.18], [0.48, 0.35, -0.1]].map((p, i) =>
      <mesh key={i} position={p as [number, number, number]} castShadow>
        <icosahedronGeometry args={[0.58, 1]} />
        <meshStandardMaterial color={i % 2 ? tint : '#789468'} roughness={1} />
      </mesh>
    )}
  </group>;
}

function Pavilion({ position, size, roof = '#4e493e' }: { position: [number, number, number]; size: [number, number, number]; roof?: string }) {
  const [w, h, d] = size;
  return <group position={position}>
    <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color="#d9d0be" roughness={0.88} />
    </mesh>
    <mesh position={[0, h + 0.12, 0]} castShadow>
      <boxGeometry args={[w + 1.2, 0.24, d + 1.2]} />
      <meshStandardMaterial color={roof} roughness={0.8} />
    </mesh>
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[-w * 0.4 + i * w * 0.2, h / 2, d / 2 + 0.035]}>
      <boxGeometry args={[0.14, h, 0.14]} />
      <meshStandardMaterial color="#9c8868" roughness={0.75} />
    </mesh>)}
  </group>;
}

function ResortModel() {
  const palms = [
    [-13, 17], [13, 17], [-16, 9], [16, 9], [-16, -1], [16, -1],
    [-15, -11], [15, -11], [-10, -22], [10, -22], [-5, 20], [6, 20],
    [-19, -6], [19, -6], [-18, 4], [18, 4], [-7, -26], [7, -26],
    [-3, -10], [4, -17], [-12, -4], [12, -5], [-9, 12], [9, 12]
  ];
  const villas = [
    [-8.5, -13], [-8.5, -20], [-8.5, -27], [8.5, -13], [8.5, -20], [8.5, -27]
  ];
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.24, 0]} receiveShadow>
      <planeGeometry args={[62, 82]} />
      <meshStandardMaterial color="#a9a184" roughness={1} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.28, -43]}>
      <planeGeometry args={[150, 34]} />
      <meshStandardMaterial color="#276f7b" roughness={0.22} metalness={0.2} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.16, -27]}>
      <planeGeometry args={[62, 7]} />
      <meshStandardMaterial color="#e2d0ac" roughness={0.96} />
    </mesh>
    <Water position={[0, -0.08, -6]} size={[13.2, 21]} color="#318f91" />
    <mesh position={[0, 0.02, -6]} receiveShadow>
      <boxGeometry args={[15, 0.28, 22]} />
      <meshStandardMaterial color="#c8b99e" roughness={0.9} />
    </mesh>
    <Water position={[0, 0.19, -6]} size={[12.8, 20.5]} color="#6fc4bd" />
    {[-6.8, 6.8].map(x => <mesh key={x} position={[x, 0.28, -6]}>
      <boxGeometry args={[0.35, 0.22, 21.5]} />
      <meshStandardMaterial color="#eee2cc" />
    </mesh>)}
    <mesh position={[0, 0.04, 10]}><boxGeometry args={[15, 0.22, 7]} /><meshStandardMaterial color="#d6c6a8" /></mesh>
    <Pavilion position={[0, 0, 21]} size={[14, 3.1, 6]} />
    <Pavilion position={[9.5, 0, -6]} size={[6.5, 2.8, 6]} roof="#51493d" />
    <Pavilion position={[-10, 0, 8]} size={[6, 2.5, 6]} roof="#605342" />
    <Villa x={-7.8} z={5} width={6.2} depth={5.2} tone="#e7dfd0" />
    <Villa x={7.8} z={5} width={6.2} depth={5.2} tone="#e1d8c7" />
    <Villa x={0} z={13.5} width={8.8} depth={5.2} tone="#d8d0bf" />
    {villas.map(([x, z], i) => <Villa key={i} x={x} z={z} width={4.8} depth={4.8} tone={i % 2 ? '#e2d9c8' : '#eee6d7'} pool={i < 4} />)}
    {palms.map(([x, z], i) => <Palm key={i} x={x} z={z} scale={0.76 + (i % 4) * 0.1} rotation={i * 0.47} />)}
    {Array.from({ length: 48 }, (_, i) => {
      const x = (i % 8) * 3.7 - 13;
      const z = Math.floor(i / 8) * 6.8 - 16;
      if (Math.abs(x) < 5.5 && z > -15 && z < 3) return null;
      return <Shrub key={i} x={x} z={z} scale={0.72 + (i % 3) * 0.16} tint={i % 3 ? '#6e895e' : '#82936a'} />;
    })}
    {Array.from({ length: 13 }, (_, i) => <mesh key={i} position={[-5.5 + i * 0.92, 0.12, 11]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.24, 16]} />
      <meshStandardMaterial color={i % 2 ? '#bba77e' : '#e5d6b8'} />
    </mesh>)}
    <mesh position={[0, -0.05, 0]}><boxGeometry args={[0.24, 0.12, 52]} /><meshStandardMaterial color="#d9c9a9" /></mesh>
    <Sparkles count={90} scale={[34, 10, 54]} size={1.25} speed={0.16} opacity={0.2} color="#f5dfad" />
  </group>;
}

function Scene() {
  return <>
    <color attach="background" args={['#a9b9b4']} />
    <fog attach="fog" args={['#a9b9b4', 38, 105]} />
    <ambientLight intensity={0.85} />
    <directionalLight position={[-24, 30, 18]} intensity={2.25} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
    <hemisphereLight args={['#e4f0e9', '#6a7055', 0.9]} />
    <ResortModel />
    <Environment preset="sunset" />
    <CameraPath />
  </>;
}

export default function ResortWorld() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 250);
    return () => window.clearTimeout(id);
  }, []);
  return <div className={ready ? 'resort-world ready' : 'resort-world'} aria-hidden="true">
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 27, 48], fov: 43, near: 0.1, far: 180 }}>
      <Scene />
    </Canvas>
  </div>;
}
