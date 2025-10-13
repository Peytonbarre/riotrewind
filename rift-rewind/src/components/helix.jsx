import './helix.css'

export default function Helix({n,phase}) {
    return Array.from({ length: n }, (value, index) => [new Vector3(Math.cos(5*index/n-phase),Math.cos(5*index/n-phase) , 5*index/n)]);
}



