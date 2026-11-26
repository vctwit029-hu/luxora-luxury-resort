import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Sparkles } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const stops = [
  { p: [0, 34, 58], t: [0, 0, 0], f: 43 },
  { p: [0, 15, 39], t: [0, 3, 25], f: 48 },
  { p: [0, 8, 22], t: [0, 3, 14], f: 52 },
  { p: [0, 9, 4], t: [0, 1, -2], f: 54 },
  { p: [-10, 5.2, -14], t: [-9, 1.8, -20], f: 55 },
  { p: [13, 6, -7], t: [13, 2, -12], f: 53 },
  { p: [-13, 7, -5], t: [-14, 2, -9], f: 52 },
  { p: [0, 38, 57], t: [0, 0, -3], f: 43 }
];
const smooth = (v: number) => v * v * (3 - 2 * v);

function CinematicCamera() {
  const aim = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const pointer = useRef({ x: 0, y: 0 });
  const progress = useRef(0);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - .5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - .5) * 2;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  useFrame((state, delta) => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const targetProgress = THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
    progress.current = THREE.MathUtils.damp(progress.current, targetProgress, 1.7, delta);
    const scaled = progress.current * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(scaled));
    const k = smooth(scaled - i);
    const a = stops[i], b = stops[i + 1];
    desired.current.set(
      THREE.MathUtils.lerp(a.p[0], b.p[0], k),
      THREE.MathUtils.lerp(a.p[1], b.p[1], k),
      THREE.MathUtils.lerp(a.p[2], b.p[2], k)
    );
    aim.current.set(
      THREE.MathUtils.lerp(a.t[0], b.t[0], k),
      THREE.MathUtils.lerp(a.t[1], b.t[1], k),
      THREE.MathUtils.lerp(a.t[2], b.t[2], k)
    );
    const camera = state.camera as THREE.PerspectiveCamera;
    camera.position.lerp(desired.current, 1 - Math.exp(-delta * 2.2));
    camera.position.x += (pointer.current.x * .42 - camera.position.x * 0) * delta * .35;
    camera.position.y += (-pointer.current.y * .22) * delta * .35;
    look.current.lerp(aim.current, 1 - Math.exp(-delta * 2.8));
    camera.lookAt(look.current);
    camera.fov = THREE.MathUtils.damp(camera.fov, THREE.MathUtils.lerp(a.f, b.f, k), 2, delta);
    camera.updateProjectionMatrix();
  });
  return null;
}

function Palm({ x, z, size = 1, turn = 0 }: { x: number; z: number; size?: number; turn?: number }) {
  const fronds = useMemo(() => Array.from({ length: 9 }, (_, i) => i * Math.PI * 2 / 9), []);
  return <group position={[x, 0, z]} rotation={[0, turn, 0]} scale={size}>
    <mesh position={[0, 2.6, 0]} rotation={[0, 0, -.045]} castShadow>
      <cylinderGeometry args={[.11, .2, 5.2, 10]} />
      <meshStandardMaterial color="#806b50" roughness={.88} />
    </mesh>
    <group position={[0, 5.1, 0]}>
      {fronds.map((a, i) => <group key={i} rotation={[0, a, -.48 + (i % 3) * .08]}>
        <mesh position={[0, 1.35, 0]} rotation={[.5, 0, 0]} castShadow>
          <coneGeometry args={[.28, 3.1, 8]} />
          <meshStandardMaterial color={i % 2 ? '#315f43' : '#47794d'} roughness={.88} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, .22, 0]}>
          <cylinderGeometry args={[.025, .035, 2.65, 5]} />
          <meshStandardMaterial color="#b4a071" />
        </mesh>
      </group>)}
    </group>
  </group>;
}

function GlassPavilion({ x, z, w, d, h, roof = '#594d3c' }: { x:number; z:number; w:number; d:number; h:number; roof?:string }) {
  return <group position={[x,0,z]}>
    <mesh position={[0,.16,0]} receiveShadow><boxGeometry args={[w+1.1,.32,d+1.1]}/><meshStandardMaterial color="#c7b99e" roughness={.8}/></mesh>
    <mesh position={[0,h/2,0]}><boxGeometry args={[w,h,d]}/><meshPhysicalMaterial color="#9bb7b2" roughness={.12} metalness={.18} transparent opacity={.2} transmission={.42} thickness={.3}/></mesh>
    {[-w/2,w/2].map((xx)=>[-d/2,d/2].map((zz)=><mesh key={xx+':'+zz} position={[xx,h/2,zz]} castShadow><cylinderGeometry args={[.12,.16,h,10]}/><meshStandardMaterial color="#b9a47e" metalness={.35} roughness={.38}/></mesh>))}
    <mesh position={[0,h+.22,0]} castShadow><boxGeometry args={[w+1.8,.44,d+1.8]}/><meshStandardMaterial color={roof} roughness={.72}/></mesh>
    <mesh position={[0,h+.47,0]}><boxGeometry args={[w*.84,.08,d*.82]}/><meshStandardMaterial color="#9e8b6a" roughness={.7}/></mesh>
    {Array.from({length:Math.max(3,Math.floor(w/1.5))},(_,i)=><mesh key={i} position={[-w*.42+i*(w*.84/(Math.max(3,Math.floor(w/1.5))-1)),h/2,d/2+.02]}><boxGeometry args={[.045,h*.9,.055]}/><meshStandardMaterial color="#927b5b" metalness={.25}/></mesh>)}
  </group>;
}

function Villa({x,z,angle=0}: {x:number;z:number;angle?:number}) {
  return <group position={[x,0,z]} rotation={[0,angle,0]}>
    <mesh position={[0,1.45,0]} castShadow receiveShadow><boxGeometry args={[7,2.9,6]}/><meshStandardMaterial color="#d9d0bd" roughness={.72}/></mesh>
    <mesh position={[0,1.48,3.02]}><planeGeometry args={[4.7,2.15]}/><meshPhysicalMaterial color="#294c50" metalness={.25} roughness={.12} transparent opacity={.72}/></mesh>
    <mesh position={[0,3.05,0]} castShadow><boxGeometry args={[7.8,.22,6.8]}/><meshStandardMaterial color="#5c5142" roughness={.8}/></mesh>
    <mesh position={[0,3.55,0]} rotation={[0,0,0]} castShadow><coneGeometry args={[5.1,.9,4]}/><meshStandardMaterial color="#514b3e" roughness={.9}/></mesh>
    <mesh position={[0,.18,4.5]} receiveShadow><boxGeometry args={[8,.32,3.4]}/><meshStandardMaterial color="#bcae92" roughness={.85}/></mesh>
    <mesh position={[0,.08,7.4]}><boxGeometry args={[5.5,.18,4.4]}/><meshStandardMaterial color="#2c7779" roughness={.16} metalness={.12}/></mesh>
    <mesh position={[0,.18,7.4]}><boxGeometry args={[5.25,.035,4.15]}/><meshPhysicalMaterial color="#78c6c1" roughness={.08} transparent opacity={.62} clearcoat={1}/></mesh>
    {[-3.2,3.2].map(xx=><mesh key={xx} position={[xx,.42,5.6]}><boxGeometry args={[.18,.65,.18]}/><meshStandardMaterial color="#9b8768"/></mesh>)}
  </group>;
}

function Water({x=0,z=0,w=100,d=100,color='#2b8490'}:{x?:number;z?:number;w?:number;d?:number;color?:string}) {
  const ref=useRef<THREE.Mesh>(null);
  useFrame(({clock})=>{if(ref.current){const mat=ref.current.material as THREE.MeshStandardMaterial;mat.opacity=.86+Math.sin(clock.elapsedTime*.6)*.025;}});
  return <mesh ref={ref} rotation={[-Math.PI/2,0,0]} position={[x,-.28,z]}><planeGeometry args={[w,d,48,48]}/><meshPhysicalMaterial color={color} roughness={.19} metalness={.18} transparent opacity={.88} clearcoat={1} clearcoatRoughness={.1}/></mesh>;
}

function ResortIsland() {
  const palms = useMemo(()=>Array.from({length:34},(_,i)=>({x:Math.sin(i*2.17)*24,z:Math.cos(i*1.71)*34,size:.72+(i%4)*.1})),[]);
  return <group>
    <Water w={180} d={180} color="#155b69"/>
    <mesh position={[0,-.55,0]} scale={[1.02,.35,1.22]} receiveShadow><sphereGeometry args={[38,64,32]}/><meshStandardMaterial color="#d9c49d" roughness={.96}/></mesh>
    <mesh position={[0,-.12,0]} scale={[1,.3,1.18]} receiveShadow><sphereGeometry args={[34,64,32]}/><meshStandardMaterial color="#a99f7b" roughness={1}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.08,0]}><circleGeometry args={[34,96]}/><meshStandardMaterial color="#b8ad88" roughness={1}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.02,0]}><circleGeometry args={[28,96]}/><meshStandardMaterial color="#788b62" roughness={1}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,.015,25]}><planeGeometry args={[18,20]}/><meshStandardMaterial color="#d8c29d" roughness={.96}/></mesh>
    <GlassPavilion x={0} z={25} w={16} d={8} h={4.2} roof="#554b3d"/>
    <mesh position={[0,.13,18]}><boxGeometry args={[14,.25,5]}/><meshStandardMaterial color="#c7b89a"/></mesh>
    <GlassPavilion x={0} z={13} w={11} d={7} h={3.5} roof="#6a5a43"/>
    <mesh position={[0,.1,-1]}><boxGeometry args={[18,.28,28]}/><meshStandardMaterial color="#c9b99b" roughness={.86}/></mesh>
    <mesh position={[0,.24,-1]}><boxGeometry args={[15,.12,25]}/><meshPhysicalMaterial color="#8bd1ca" roughness={.12} metalness={.18} clearcoat={1}/></mesh>
    <mesh position={[0,.3,-13.3]}><boxGeometry args={[17,.32,.5]}/><meshStandardMaterial color="#e8ddc7" roughness={.55}/></mesh>
    <mesh position={[0,.1,-17]}><boxGeometry args={[20,.2,5]}/><meshStandardMaterial color="#c7b99e"/></mesh>
    {[-1,1].map(s=><group key={s}><Villa x={s*12} z={-18} angle={s===1?-.1:.1}/><Villa x={s*12} z={-29} angle={s===1?-.1:.1}/></group>)}
    <GlassPavilion x={14} z={-7} w={8} d={8} h={3.3} roof="#554b3d"/>
    <GlassPavilion x={-15} z={-8} w={8} d={10} h={3.2} roof="#5c5140"/>
    {palms.map((p,i)=><Palm key={i} x={p.x} z={p.z} size={p.size} turn={i*.51}/>)}
    {Array.from({length:42},(_,i)=>{const x=Math.sin(i*4.2)*25,z=Math.cos(i*2.8)*32;return <mesh key={i} position={[x,.35,z]} scale={[1.2,.55,1]} castShadow><icosahedronGeometry args={[1.05,1]}/><meshStandardMaterial color={i%2?'#526f4d':'#6d8058'} roughness={1}/></mesh>;})}
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,.07,0]}><ringGeometry args={[28.5,29.2,96]}/><meshStandardMaterial color="#d8c49e" roughness={.95}/></mesh>
    <Sparkles count={120} scale={[60,12,72]} size={1.4} speed={.12} opacity={.22} color="#f3dfb4"/>
  </group>;
}

function Scene() {
  return <>
    <color attach="background" args={['#9bb6b4']}/>
    <fog attach="fog" args={['#9bb6b4',65,145]}/>
    <ambientLight intensity={.72}/>
    <hemisphereLight args={['#e6f1ed','#5b674b',1.1]}/>
    <directionalLight position={[-35,48,24]} intensity={2.6} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}/>
    <pointLight position={[0,9,-2]} intensity={32} distance={48} color="#9ce1dc"/>
    <ResortIsland/>
    <ContactShadows position={[0,-.02,0]} opacity={.24} scale={100} blur={2.5} far={25}/>
    <Environment preset="sunset"/>
    <CinematicCamera/>
  </>;
}

export default function ResortWorld() {
  const [ready,setReady]=useState(false);
  useEffect(()=>{const id=window.setTimeout(()=>setReady(true),300);return()=>window.clearTimeout(id);},[]);
  return <div className={ready?'resort-world ready':'resort-world'} aria-hidden="true">
    <Canvas shadows dpr={[1,1.6]} camera={{position:[0,34,58],fov:43,near:.1,far:220}}>
      <Scene/>
    </Canvas>
  </div>;
}
