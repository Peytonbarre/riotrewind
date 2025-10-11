import './App.css'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three/src/Three.Core.js'
import { MeshLineGeometry, MeshLineMaterial} from 'meshline'
import { easing } from 'maath'

extend({MeshLineGeometry, MeshLineMaterial})

export default function App() {
  return (
    <Canvas camera={{position: [0, 0, 5], fov:90}}>
      <color attach="background" args={['#101020']}/>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <CameraRig/>
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
          {['red', 'blue', 'green', 'yellow', 'purple', 'orange'].map((color, i) => (
            <meshStandardMaterial key={i} attach={`material-${i}`} color={color} />
          ))}
      </mesh>
    </Canvas>
  )
}

function CameraRig({radius=20}){
  useFrame((state, dt) => {
    // easing.damp3(state.camera.position, [Math.sin(state.pointer.x) * radius, Math.atan(state.pointer.y) * radius, Math.cos(state.pointer.x) * radius], 0.25, dt)
    easing.damp3(state.camera.position, [Math.cos(state.pointer.y) * Math.sin(state.pointer.x) * radius,Math.sin(state.pointer.y) * Math.sin(state.pointer.x) * radius, Math.cos(state.pointer.x) * radius], 0.25, dt)
  })
}