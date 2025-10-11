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

// return (
//   <Canvas camera={{ position: [0, 0, 5], fov: 90 }}>
//     <color attach="background" args={['#101020']} />
//     <Lines dash={dash} count={count} radius={radius} colors={[[10, 0.5, 2], [1, 2, 10], '#A2CCB6', '#FCEEB5', '#EE786E', '#e0feff']} />
//     <Rig />
//     <EffectComposer>
//       <Bloom mipmapBlur luminanceThreshold={1} radius={0.6} />
//     </EffectComposer>
//   </Canvas>
// )