import * as THREE from 'three'
import './helix.css';
import { useMemo } from 'react';
import { extend } from '@react-three/fiber'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

extend({MeshLineGeometry, MeshLineMaterial})

export default function Helix({n=100 ,phase=0, radius=1, height=5, turns=3, color="#00ffff"}) {
    //return Array.from({ length: n }, (value, index) => [new Vector3(Math.cos(5*index/n-phase),Math.cos(5*index/n-phase) , 5*index/n)]);
    const points = useMemo(() => {
        const pts = []
        for(let i = 0; i < n; i++) {
            const t = (i / n) * turns*Math.PI * 2
            const x = radius * Math.cos(t + phase)
            const y = radius * Math.sin(t + phase)
            const z = (height * i) / n - height / 2
            pts.push(new THREE.Vector3(x, y, z))
        }
        return pts
    }, [n, phase, radius, height, turns])
    return(
        <mesh>
            <meshLineGeometry points={points}/>
            <meshLineMaterial
                color={color}
                lineWidth={0.1}
                transparent
                opacity={0.8}
            />
        </mesh>
    )
}



