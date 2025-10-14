import './App.css'
import { useState, useRef } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { MeshLineGeometry, MeshLineMaterial} from 'meshline'
import { easing } from 'maath'
import { OrbitControls } from '@react-three/drei'
import Navbar from './components/Navbar'
import * as THREE from 'three'
import Helix from './components/helix.jsx'

extend({MeshLineGeometry, MeshLineMaterial})

export default function App() {
  return (
    <>
      <Navbar/>
      <Canvas camera={{position: [0, 0, 5], fov:90}}>
        <color attach="background" args={['#101020']}/>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls enableZoom={true} enableRotate={true} />
        <CameraRig/>
        <AnimatedHelix/>
        {/* <mesh>
          <boxGeometry args={[2, 2, 2]} />
            {['red', 'blue', 'green', 'yellow', 'purple', 'orange'].map((color, i) => (
              <meshStandardMaterial key={i} attach={`material-${i}`} color={color} />
            ))}
        </mesh> */}
      </Canvas>
    </>
  )
}

function CameraRig({radius=5}){
  const [isDragging, setIsDragging] = useState(false)
  const basePosition = useRef(new THREE.Vector3(0,0,5))
  const handleDragEnd = (e) => {
    basePosition.current.copy(e.target.object.position)
    setIsDragging(false)
  }
  useFrame((state, dt) => {
    if(!isDragging){
      const offset = new THREE.Vector3(
        Math.sin(state.pointer.x * 0.5) * radius,
        Math.atan(state.pointer.y * 0.5) * radius,
        0
      )
      const targetPos = basePosition.current.clone().add(offset)
      easing.damp3(state.camera.position, targetPos.toArray(), 0.3, dt)
      state.camera.lookAt(0, 0, 0)
    }
  })
  return (
    <OrbitControls 
      onStart={() => setIsDragging(true)}
      onEnd={handleDragEnd}
      zoomSpeed={0.3}
      minDistance={3}
      maxDistance={15}
    />
  )
}

function AnimatedHelix(){
  const [phase, setPhase] = useState(0)
  useFrame((state, delta) => {
    setPhase((prev) => prev + delta * 0.5)
  })
  return(
    <>
      <Helix n={150} phase={phase} radius={1.5} height={1} turns={4} color="#00ffff"/>     
      <Helix n={150} phase={phase + Math.PI/2} radius={1.5} height={1} turns={4} color="#ffff00"/>     
    </>
  )
}