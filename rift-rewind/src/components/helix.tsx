import React, { useMemo } from 'react';
import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            meshLineGeometry: any;
            meshLineMaterial: any;
        }
    }
}

extend({MeshLineGeometry, MeshLineMaterial})

interface HelixProps {
    n?: number;
    phase?: number;
    radius?: number;
    height?: number;
    turns?: number;
    color?: string;
}

export default function Helix({
    n = 100,
    phase = 0,
    radius = 1,
    height = 5,
    turns = 3,
    color = "#00ffff"
}: HelixProps) {
    const points = useMemo(() => {
        const pts = []
        for(let i = 0; i < n; i++) {
            const t = (i / n) * turns * Math.PI * 2
            const x = radius * Math.cos(t + phase)
            const y = radius * Math.sin(t + phase)
            const z = (height * i) / n - height / 2
            pts.push(new THREE.Vector3(x, y, z))
        }
        return pts
    }, [n, phase, radius, height, turns])
    
    return(
        <mesh>
            {/* @ts-ignore */}
            <meshLineGeometry points={points}/>
            {/* @ts-ignore */}
            <meshLineMaterial
                color={color}
                lineWidth={0.1}
                transparent
                opacity={0.8}
            />
        </mesh>
    )
}

export {}