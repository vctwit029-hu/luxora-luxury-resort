import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sparkles } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const chapters = [
  { camera: [0, 23, 42], target: [0, 0, 2] },
  { camera: [0, 8, 25], target: [0, 2, 8] },
  { camera: [0, 5.5, 13], target: [0, 2, 4] },
  { camera: [0, 7, -1], target: [0, 0, -7] },
  { camera: [-10, 5, -13], target: [-7, 2, -12] },
  { camera: [10, 6, -14], target: [8, 2, -12] },
  { camera: [11, 5, 9], target: [8, 1, 7] },
  { camera: [0, 31, 43], target: [0, 0, -2] }
] as const;

function smoothstep(t: number) { return t * t * (3 - 2 * t); }

function CameraPath() {
  const desired = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());
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
    const activeCamera = state.camera as THREE.PerspectiveCamera;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const raw = reduced ? 0.04 : THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
    progress.current = THREE.MathUtils.damp(progress.current, raw, reduced ? 12 : 3.2, delta);
    const scaled = progress.current * (chapters.length - 1);
    const index = Math.min(chapters.length - 2, Math.floor(scaled));
    const t = smoothstep(scaled - index);
    const a = chapters[index];
    const b = chapters[index + 1];
    desired.current.set(
      THREE.MathUtils.lerp(a.camera[0], b.camera[0], t),
      THREE.MathUtils.lerp(a.camera[1], b.camera[1], t),
      THREE.MathUtils.lerp(a.camera[2], b.camera[2], t)
    );
    target.current.set(
      THREE.MathUtils.lerp(a.target[0], b.target[0], t),
      THREE.MathUtils.lerp(a.target[1], b.target[1], t),
      THREE.MathUtils.lerp(a.target[2], b.target[2], t)
    );
    activeCamera.position.lerp(desired.current, 1 - Math.exp(-delta * 2.5));
    look.current.lerp(target.current, 1 - Math.exp(-delta * 3));
    activeCamera.lookAt(look.current);
    activeCamera.updateProjectionMatrix();
  });
  return null;
}

function Palm({ x, z, scale = 1, rotation = 0 }: { x: number; z: number; scale?: number; rotation?: number }) {
  const fronds = useMemo(() => Array.from({ length: 7 }, (_, i) => i * Math.PI * 2 / 7), []);
  return <group position={[x, 0, z]} rotation={[0, rotation, 0]} scale={scale}>
    <mesh position={[0, 2.1, 0]} rotation={[0, 0, -0.08]} castShadow>
      <cylinderGeometry args={[0.12, 0.2, 4.2, 7]} />
      <meshStandardMaterial color="#8a765b" roughness={0.9} />
    </mesh>
    <group position={[0, 4.1, 0]}>
      {fronds.map((angle, i) => <group key={i} rotation={[0, angle, -0.55]}>
        <mesh position={[0, 1.1, 0]} rotation={[0.7, 0, 0]}>
          <coneGeometry args={[0.22, 2.5, 5]} />
          <meshStandardMaterial color={i % 2 ? '#52765a' : '#668b62'} roughness={0.86} />
        </mesh>
      </group>)}
    </group>
  </group>;
}

function Villa({ x, z, width = 5, depth = 4, tone = '#e6dfcf' }: { x: number; z: number; width?: number; depth?: number; tone?: string }) {
  return <group position={[x, 0, z]}>
    <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
      <boxGeometry args={[width, 2.7, depth]} />
      <meshStandardMaterial color={tone} roughness={0.82} />
    </mesh>
    <mesh position={[0, 2.82, 0]} castShadow>
      <boxGeometry args={[width + 0.7, 0.22, depth + 0.65]} />
      <meshStandardMaterial color="#5b5144" roughness={0.75} />
    </mesh>
    <mesh position={[0, 1.35, depth / 2 + 0.012]}>
      <planeGeometry args={[width * 0.48, 1.8]} />
      <meshStandardMaterial color="#6e8986" metalness={0.18} roughness={0.22} />
    </mesh>
    <mesh position={[0, 0.12, depth / 2 + 0.55]} receiveShadow>
      <boxGeometry args={[width + 0.4, 0.18, 1.1]} />
      <meshStandardMaterial color="#c9bda7" />
    </mesh>
  </group>;
}

function ResortModel() {
  const palmPositions = [
    [-12, 15], [12, 15], [-14, 7], [14, 7], [-14, -2], [14, -2],
    [-13, -12], [13, -12], [-9, -19], [9, -19], [-4, 17], [5, 17],
    [-17, -7], [17, -7], [-17, 2], [17, 2], [-7, -23], [7, -23]
  ];
  const villas = [
    [-8, -12], [-8, -18], [-8, -24], [8, -12], [8, -18], [8, -24]
  ];
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, 0]} receiveShadow>
      <planeGeometry args={[60, 74]} />
      <meshStandardMaterial color="#a9a58b" roughness={1} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.13, -34]}>
      <planeGeometry args={[120, 16]} />
      <meshStandardMaterial color="#367f87" roughness={0.25} metalness={0.28} />
    </mesh>
    <mesh position={[0, -0.08, -24]}>
      <boxGeometry args={[23, 0.2, 7]} />
      <meshStandardMaterial color="#d7c9aa" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.02, -7]} receiveShadow>
      <boxGeometry args={[13, 0.3, 19]} />
      <meshStandardMaterial color="#b6a98e" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.13, -6]}>
      <boxGeometry args={[8.2, 0.22, 14]} />
      <meshStandardMaterial color="#3f9da0" metalness={0.22} roughness={0.2} />
    </mesh>
    <mesh position={[0, 0.27, -6]}>
      <boxGeometry args={[7.7, 0.08, 13.5]} />
      <meshStandardMaterial color="#63b6b1" transparent opacity={0.58} roughness={0.15} />
    </mesh>
    {[-5.3, 5.3].map(x => <mesh key={x} position={[x, 0.35, -6]}><boxGeometry args={[0.35, 0.2, 14.5]} /><meshStandardMaterial color="#e7ddc7" /></mesh>)}
    <Villa x={-7.5} z={5} width={6} depth={5} tone="#e7dfd0" />
    <Villa x={7.5} z={5} width={6} depth={5} tone="#e1d8c7" />
    <Villa x={0} z={14} width={9} depth={5} tone="#d8d0bf" />
    {villas.map(([x, z], i) => <Villa key={i} x={x} z={z} width={4.5} depth={4.5} tone={i % 2 ? '#e2d9c8' : '#eee6d7'} />)}
    <group position={[0, 0, 23]}>
      <mesh position={[0, 1.4, 0]} castShadow><boxGeometry args={[12, 2.8, 5]} /><meshStandardMaterial color="#e8dfcf" /></mesh>
      <mesh position={[0, 2.95, 0]}><boxGeometry args={[13, 0.25, 6]} /><meshStandardMaterial color="#5c5143" /></mesh>
      {[-4, -2, 0, 2, 4].map(x => <mesh key={x} position={[x, 1.35, 2.52]}><boxGeometry args={[0.14, 2.7, 0.14]} /><meshStandardMaterial color="#9e8b6c" /></mesh>)}
    </group>
    <group position={[9, 0, -5]}>
      <mesh position={[0, 1.3, 0]} castShadow><boxGeometry args={[6, 2.6, 5]} /><meshStandardMaterial color="#d7cdbb" /></mesh>
      <mesh position={[0, 2.75, 0]}><boxGeometry args={[6.8, 0.2, 5.8]} /><meshStandardMaterial color="#554c40" /></mesh>
      <mesh position={[0, 1.5, 2.55]}><planeGeometry args={[4.8, 1.7]} /><meshStandardMaterial color="#7c9a91" /></mesh>
    </group>
    <group position={[-10, 0, 8]}>
      <mesh position={[0, 1.1, 0]}><boxGeometry args={[5, 2.2, 5]} /><meshStandardMaterial color="#d8d0c1" /></mesh>
      <mesh position={[0, 2.3, 0]}><boxGeometry args={[5.7, 0.2, 5.7]} /><meshStandardMaterial color="#605446" /></mesh>
    </group>
    {palmPositions.map(([x, z], i) => <Palm key={i} x={x} z={z} scale={0.78 + (i % 3) * 0.12} rotation={i * 0.6} />)}
    {Array.from({ length: 34 }, (_, i) => {
      const x = (i % 9) * 3.1 - 12.4;
      const z = Math.floor(i / 9) * 7 - 14;
      if (Math.abs(x) < 5 && z > -14 && z < 2) return null;
      return <mesh key={i} position={[x, 0.55, z]} scale={[1.1, 0.85, 1]}>
        <sphereGeometry args={[0.8, 8, 7]} />
        <meshStandardMaterial color={i % 2 ? '#647c55' : '#81916a'} roughness={1} />
      </mesh>;
    })}
    <mesh position={[0, -0.3, 0]}>
      <boxGeometry args={[0.2, 0.1, 50]} />
      <meshStandardMaterial color="#d7c6a7" />
    </mesh>
    <Sparkles count={70} scale={[26, 8, 44]} size={1.3} speed={0.12} opacity={0.22} color="#f4d9a2" />
  </group>;
}

function Scene() {
  return <>
    <color attach="background" args={['#9aa9a0']} />
    <fog attach="fog" args={['#9aa9a0', 28, 82]} />
    <ambientLight intensity={1.25} />
    <directionalLight position={[-18, 24, 14]} intensity={2.1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
    <hemisphereLight args={['#dce8e0', '#6d7057', 0.7]} />
    <ResortModel />
    <Environment preset="sunset" />
    <CameraPath />
  </>;
}

export default function ResortWorld() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const id = window.setTimeout(() => setReady(true), 250); return () => window.clearTimeout(id); }, []);
  return <div className={ready ? 'resort-world ready' : 'resort-world'} aria-hidden="true">
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 23, 42], fov: 42, near: 0.1, far: 150 }}>
      <Scene />
    </Canvas>
  </div>;
}
