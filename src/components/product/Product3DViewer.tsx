import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float, MeshDistortMaterial, RoundedBox, Torus, Sphere, Box } from "@react-three/drei";
import * as THREE from "three";

interface ProductShapeProps {
  productType: string;
  gradient: string;
}

const ProductShape = ({ productType, gradient }: ProductShapeProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Extract color from gradient class
  const getColor = () => {
    if (gradient.includes("purple")) return "#8b5cf6";
    if (gradient.includes("cyan")) return "#06b6d4";
    if (gradient.includes("blue")) return "#3b82f6";
    if (gradient.includes("green") || gradient.includes("emerald")) return "#10b981";
    if (gradient.includes("red") || gradient.includes("pink")) return "#ef4444";
    if (gradient.includes("indigo") || gradient.includes("violet")) return "#6366f1";
    if (gradient.includes("yellow") || gradient.includes("orange") || gradient.includes("amber")) return "#f59e0b";
    if (gradient.includes("fuchsia")) return "#d946ef";
    if (gradient.includes("slate") || gradient.includes("zinc")) return "#64748b";
    if (gradient.includes("teal")) return "#14b8a6";
    return "#f26c21"; // Default ALSAMOS primary
  };

  const color = getColor();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  // Render different shapes based on product type
  const renderShape = () => {
    switch (productType) {
      case "AI & Robotics":
        return (
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={groupRef}>
              {/* Brain-like structure */}
              <Sphere args={[1.2, 64, 64]} position={[0, 0, 0]}>
                <MeshDistortMaterial
                  color={color}
                  attach="material"
                  distort={0.4}
                  speed={2}
                  roughness={0.2}
                  metalness={0.8}
                />
              </Sphere>
              {/* Neural connections */}
              {[...Array(6)].map((_, i) => (
                <Torus
                  key={i}
                  args={[1.5 + i * 0.1, 0.02, 16, 100]}
                  rotation={[Math.PI / (2 + i), i * 0.5, 0]}
                  position={[0, 0, 0]}
                >
                  <meshStandardMaterial color={color} opacity={0.5} transparent />
                </Torus>
              ))}
            </group>
          </Float>
        );

      case "Consumer Electronics":
      case "Wearables":
        return (
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
            <group ref={groupRef}>
              {/* Watch-like shape */}
              <RoundedBox args={[1.2, 1.5, 0.3]} radius={0.15} smoothness={4}>
                <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
              </RoundedBox>
              {/* Screen */}
              <RoundedBox args={[1, 1.2, 0.1]} radius={0.1} position={[0, 0, 0.15]}>
                <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.2} />
              </RoundedBox>
              {/* Band */}
              <Box args={[0.4, 2.5, 0.1]} position={[0, 0, -0.1]}>
                <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
              </Box>
            </group>
          </Float>
        );

      case "Technology":
      case "Enterprise":
        return (
          <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.3}>
            <group ref={groupRef}>
              {/* Cloud-like server structure */}
              <RoundedBox args={[2, 0.4, 1.2]} radius={0.05} position={[0, 0.5, 0]}>
                <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
              </RoundedBox>
              <RoundedBox args={[2, 0.4, 1.2]} radius={0.05} position={[0, 0, 0]}>
                <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
              </RoundedBox>
              <RoundedBox args={[2, 0.4, 1.2]} radius={0.05} position={[0, -0.5, 0]}>
                <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
              </RoundedBox>
              {/* LED indicators */}
              {[...Array(4)].map((_, i) => (
                <Sphere key={i} args={[0.05]} position={[-0.8 + i * 0.3, 0.5, 0.61]}>
                  <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
                </Sphere>
              ))}
            </group>
          </Float>
        );

      case "Automotive":
        return (
          <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
            <group ref={groupRef}>
              {/* Car body */}
              <RoundedBox args={[2.5, 0.5, 1]} radius={0.1} position={[0, 0, 0]}>
                <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
              </RoundedBox>
              {/* Cabin */}
              <RoundedBox args={[1.2, 0.4, 0.9]} radius={0.15} position={[0, 0.4, 0]}>
                <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.2} />
              </RoundedBox>
              {/* Wheels */}
              {[[-0.8, -0.3, 0.5], [0.8, -0.3, 0.5], [-0.8, -0.3, -0.5], [0.8, -0.3, -0.5]].map((pos, i) => (
                <Torus key={i} args={[0.2, 0.08, 16, 32]} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
                  <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
                </Torus>
              ))}
            </group>
          </Float>
        );

      case "Healthcare":
        return (
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
            <group ref={groupRef}>
              {/* Heart shape approximation */}
              <Sphere args={[0.8, 32, 32]} position={[-0.4, 0.2, 0]}>
                <MeshDistortMaterial color={color} distort={0.2} speed={3} roughness={0.3} metalness={0.5} />
              </Sphere>
              <Sphere args={[0.8, 32, 32]} position={[0.4, 0.2, 0]}>
                <MeshDistortMaterial color={color} distort={0.2} speed={3} roughness={0.3} metalness={0.5} />
              </Sphere>
              <Sphere args={[1, 32, 32]} position={[0, -0.4, 0]}>
                <MeshDistortMaterial color={color} distort={0.3} speed={3} roughness={0.3} metalness={0.5} />
              </Sphere>
              {/* Pulse rings */}
              {[1.5, 2, 2.5].map((size, i) => (
                <Torus key={i} args={[size, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
                  <meshStandardMaterial color={color} opacity={0.3 - i * 0.1} transparent />
                </Torus>
              ))}
            </group>
          </Float>
        );

      case "Gaming":
        return (
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={groupRef}>
              {/* VR Headset */}
              <RoundedBox args={[2, 1, 0.8]} radius={0.2} position={[0, 0, 0]}>
                <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
              </RoundedBox>
              {/* Lenses */}
              <Sphere args={[0.3]} position={[-0.4, 0, 0.5]}>
                <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
              </Sphere>
              <Sphere args={[0.3]} position={[0.4, 0, 0.5]}>
                <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
              </Sphere>
              {/* Strap */}
              <Torus args={[1.2, 0.08, 16, 32]} rotation={[0, Math.PI / 2, 0]}>
                <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
              </Torus>
            </group>
          </Float>
        );

      default:
        // Default futuristic shape
        return (
          <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
            <group ref={groupRef}>
              <RoundedBox args={[1.5, 1.5, 1.5]} radius={0.2} smoothness={4}>
                <MeshDistortMaterial
                  color={color}
                  attach="material"
                  distort={0.2}
                  speed={2}
                  roughness={0.2}
                  metalness={0.8}
                />
              </RoundedBox>
              {/* Orbiting rings */}
              <Torus args={[1.2, 0.03, 16, 100]} rotation={[Math.PI / 3, 0, 0]}>
                <meshStandardMaterial color={color} opacity={0.6} transparent />
              </Torus>
              <Torus args={[1.3, 0.02, 16, 100]} rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
                <meshStandardMaterial color={color} opacity={0.4} transparent />
              </Torus>
            </group>
          </Float>
        );
    }
  };

  return renderShape();
};

interface Product3DViewerProps {
  productType: string;
  gradient: string;
}

const Product3DViewer = ({ productType, gradient }: Product3DViewerProps) => {
  return (
    <div className="w-full h-full min-h-[400px] rounded-3xl overflow-hidden bg-gradient-to-br from-surface-soft to-surface-muted relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <ProductShape productType={productType} gradient={gradient} />
          
          <Environment preset="city" />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={3}
            maxDistance={8}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
      
      {/* Controls hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};

export default Product3DViewer;
