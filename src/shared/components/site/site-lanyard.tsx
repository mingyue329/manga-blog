/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { Canvas, extend, type ThreeEvent, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  type RigidBodyProps,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}

interface SiteLanyardProps {
  className?: string;
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  isMobile?: boolean;
}

const LANYARD_ORIGIN_X = 4.6;
const LANYARD_ORIGIN_Y = 6.6;

function createLanyardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const stripeCount = 16;
  const stripeWidth = canvas.width / stripeCount;

  for (let index = 0; index < stripeCount; index += 1) {
    context.fillStyle = index % 2 === 0 ? "#111111" : "#ffffff";
    context.fillRect(index * stripeWidth, 0, stripeWidth, canvas.height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;

  return texture;
}

function LanyardBand({ isMobile }: { isMobile: boolean }): ReactElement {
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);
  const texture = useMemo(() => createLanyardTexture(), []);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );
  const [hovered, setHovered] = useState(false);
  const [dragged, setDragged] = useState<false | THREE.Vector3>(false);
  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const anchorVector = useMemo(() => new THREE.Vector3(), []);
  const resolution = useMemo(
    () => new THREE.Vector2(isMobile ? 760 : 1080, isMobile ? 1200 : 1080),
    [isMobile],
  );
  const segmentProps: RigidBodyProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 6,
    linearDamping: 5,
  };
  const { nodes, materials } = useGLTF("/card-BP4TWJmK.glb") as any;

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.6, 0],
  ]);

  useEffect(() => {
    if (!hovered && !dragged) {
      document.body.style.cursor = "auto";
      return;
    }

    document.body.style.cursor = dragged ? "grabbing" : "grab";

    return () => {
      document.body.style.cursor = "auto";
    };
  }, [dragged, hovered]);

  useEffect(() => {
    function handlePointerUp(): void {
      setDragged(false);
    }

    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current) {
      return;
    }

    const elapsedTime = state.clock.getElapsedTime();

    fixed.current.setNextKinematicTranslation({
      x: LANYARD_ORIGIN_X + Math.sin(elapsedTime * 0.72) * 0.03,
      y: LANYARD_ORIGIN_Y + Math.cos(elapsedTime * 0.52) * 0.015,
      z: 0,
    });

    if (dragged && typeof dragged !== "boolean") {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: THREE.MathUtils.clamp(vec.x - dragged.x, -8.2, 10.4),
        y: THREE.MathUtils.clamp(vec.y - dragged.y, -8.2, 7.4),
        z: THREE.MathUtils.clamp(vec.z - dragged.z, -6.4, 6.4),
      });
    }

    [j1, j2].forEach((ref) => {
      if (!ref.current?.lerped) {
        ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
      }

      const clampedDistance = Math.max(
        0.1,
        Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())),
      );

      ref.current.lerped.lerp(ref.current.translation(), delta * (8 + clampedDistance * 42));
    });

    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(j2.current.lerped);
    curve.points[2].copy(j1.current.lerped);
    curve.points[3].copy(fixed.current.translation());
    band.current.geometry.setPoints(curve.getPoints(isMobile ? 20 : 32));

    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    anchorVector.copy(card.current.translation());

    card.current.setAngvel({
      x: ang.x - rot.x * 0.22,
      y: ang.y - rot.y * 0.12,
      z: ang.z - rot.z * 0.4 + anchorVector.x * 0.02,
    });
  });

  curve.curveType = "chordal";

  function handlePointerDown(event: ThreeEvent<PointerEvent>): void {
    event.stopPropagation();
    if (!card.current) {
      return;
    }

    const target = event.target as Element & {
      setPointerCapture(pointerId: number): void;
    };
    target.setPointerCapture(event.pointerId);
    setDragged(
      new THREE.Vector3().copy(event.point).sub(vec.copy(card.current.translation())),
    );
  }

  function handlePointerUp(event: ThreeEvent<PointerEvent>): void {
    event.stopPropagation();
    const target = event.target as Element & {
      releasePointerCapture(pointerId: number): void;
    };
    target.releasePointerCapture(event.pointerId);
    setDragged(false);
  }

  return (
    <>
      <mesh
        position={[0, 0, -8]}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group position={[LANYARD_ORIGIN_X, LANYARD_ORIGIN_Y, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="kinematicPosition" />
        <RigidBody ref={j1} {...segmentProps} position={[0.5, 0, 0]}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={j2} {...segmentProps} position={[1, 0, 0]}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={j3} {...segmentProps} position={[1.5, 0, 0]}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          ref={card}
          {...segmentProps}
          position={[2, 0, 0]}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.05]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={(event) => {
              event.stopPropagation();
              setHovered(true);
            }}
            onPointerOut={(event) => {
              event.stopPropagation();
              setHovered(false);
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <mesh castShadow receiveShadow geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base?.map ?? null}
                color={materials.base?.color ?? "#faf6ed"}
                metalness={0.45}
                roughness={0.82}
                clearcoat={isMobile ? 0.25 : 1}
                clearcoatRoughness={0.18}
              />
            </mesh>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.28}
            />
            <mesh castShadow receiveShadow geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={resolution}
          useMap
          map={texture}
          repeat={[-3.8, 1]}
          lineWidth={1}
          transparent
        />
      </mesh>
    </>
  );
}

export function SiteLanyard({
  className,
  position = [0, 0, 35],
  gravity = [0, -40, 0],
  fov = 26,
  transparent = true,
  isMobile = false,
}: SiteLanyardProps): ReactElement {
  return (
    <div data-lanyard-interactive className={className}>
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.25 : 2]}
        gl={{ alpha: transparent, antialias: true }}
        shadows
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 40 : 1 / 60}>
          <LanyardBand isMobile={isMobile} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/card-BP4TWJmK.glb");
