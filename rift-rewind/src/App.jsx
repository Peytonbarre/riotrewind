import './App.css'
import { Canvas, extend } from '@react-three/fiber'
import { Vector3 } from 'three/src/Three.Core.js'
import { MeshLineGeometry, MeshLineMaterial} from 'meshline'

extend({MeshLineGeometry, MeshLineMaterial})

export default function App() {
  return (
    <Canvas camera={{position: [0, 0, 5], fov:90}}>
      <color attach="background" args={['#101020']}/>å
      <mesh>
        <meshLineGeometry points={[-1, 1, -1, 0, 1, 0, 1, 1, 1]}/>
        <meshLineMaterial width={0.5} color={'#fe3d00'}/>
      </mesh>
    </Canvas>
  )
}