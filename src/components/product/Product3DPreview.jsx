import { Suspense, Component, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Decal, useGLTF, useTexture, Center, Bounds } from "@react-three/drei";

class ThreeErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err) { console.error("3D preview error:", err); }
  render() {
    if (this.state.failed) {
      return (
        <div className="flex h-[520px] items-center justify-center rounded-2xl border border-slate-200 bg-[#F2F1EE] text-center text-[14px] text-[#98A2B3]">
          3D preview unavailable — model failed to load.
        </div>
      );
    }
    return this.props.children;
  }
}

function Logo({ url, center, r }) {
  const logo = useTexture(url);
  return (
    <Decal
      position={[center.x, center.y + r * 0.1, center.z + r * 0.55]}
      rotation={[0, 0, 0]}
      scale={r * 0.5}
      map={logo}
      polygonOffsetFactor={-4}
    />
  );
}

function Shirt({ modelUrl, logoUrl, color = "#ffffff" }) {
  const { scene } = useGLTF(modelUrl);

  const { mesh, r, center } = useMemo(() => {
    let found = null;
    scene.traverse((o) => { if (!found && o.isMesh && o.geometry) found = o; });
    if (found) {
      found.geometry.computeBoundingSphere();
      const bs = found.geometry.boundingSphere;
      return { mesh: found, r: bs.radius, center: bs.center };
    }
    return { mesh: null, r: 1, center: null };
  }, [scene]);

  if (!mesh) return <primitive object={scene} rotation={[0, Math.PI, 0]} />;

  if (mesh.material) {
  mesh.material.map = null;          // remove the baked triangle pattern
  if (mesh.material.color) mesh.material.color.set(color);
  mesh.material.needsUpdate = true;
}

  return (
    <mesh geometry={mesh.geometry} material={mesh.material} dispose={null} rotation={[0, Math.PI, 0]}>
      {logoUrl && <Logo url={logoUrl} center={center} r={r} />}
    </mesh>
  );
}

export default function Product3DPreview({ modelUrl, logoUrl, color = "#ffffff" }) {
  return (
    <ThreeErrorBoundary>
      <div className="h-[520px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#F2F1EE]">
        <Canvas camera={{ position: [0, 0, 5], fov: 40 }} gl={{ preserveDrawingBuffer: true }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <directionalLight position={[-5, -2, -5]} intensity={0.6} />
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.2}>
              <Center>
                <Shirt modelUrl={modelUrl} logoUrl={logoUrl} color={color} />
              </Center>
            </Bounds>
          </Suspense>
          <OrbitControls enablePan={false} makeDefault />
        </Canvas>
      </div>
    </ThreeErrorBoundary>
  );
}