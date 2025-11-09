'use client';

import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import type { Vec3 } from '@/app/utils/mds';

type Props = {
  points: Vec3[];
  labels: string[];
  pointSize?: number;     // world units
  showLabels?: boolean;
};

function Points({ points, labels, pointSize = 0.04, showLabels = true }: Props) {
  return (
    <group>
      {points.map(([x,y,z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <sphereGeometry args={[pointSize, 16, 16]} />
            <meshStandardMaterial />
          </mesh>
          {showLabels && (
            <Html distanceFactor={8}>
              <div className="text-xs bg-black/60 px-1.5 py-0.5 rounded border border-neutral-700">
                {labels[i] ?? `#${i+1}`}
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

export default function MdsEmbedding3D(props: Props) {
  const { points } = props;
  const hasPoints = points && points.length > 0;
  const radius = useMemo(() => {
    let r = 0.8;
    if (hasPoints) {
      let maxR = 0;
      for (const [x,y,z] of points) {
        const rr = Math.sqrt(x*x + y*y + z*z);
        if (rr > maxR) maxR = rr;
      }
      r = Math.max(0.8, maxR + 0.5);
    }
    return r;
  }, [hasPoints, points]);

  return (
    <div className="rounded-2xl border border-neutral-700 overflow-hidden">
      <div className="p-3 border-b border-neutral-800">
        <h3 className="text-lg font-semibold">3D MDS Embedding</h3>
        <p className="text-xs opacity-70">Distances → centered Gram matrix → top-3 eigenspace.</p>
      </div>
      <Canvas style={{ height: 420, width: '100%', background: 'transparent' }} camera={{ position: [radius, radius, radius], fov: 45 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 4, 1]} intensity={1.0} />
        {hasPoints && <Points {...props} />}
        <gridHelper args={[2, 10]} />
        <axesHelper args={[1]} />
        <OrbitControls enableDamping />
      </Canvas>
    </div>
  );
}
