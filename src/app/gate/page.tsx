"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════════════════════════
   ManBearPig — Cinematic 3D Gate Page
   Three.js procedural beast scene + GSAP UI
   ═══════════════════════════════════════════════════════════ */

declare global {
  interface Window {
    THREE: any;
    gsap: any;
  }
}

interface GSAPTimeline {
  fromTo: (
    targets: unknown,
    from: object,
    to: object,
    pos?: number | string,
  ) => GSAPTimeline;
  to: (targets: unknown, vars: object, pos?: number | string) => GSAPTimeline;
  from: (targets: unknown, vars: object, pos?: number | string) => GSAPTimeline;
  set: (targets: unknown, vars: object, pos?: number | string) => GSAPTimeline;
  call: (
    fn: () => void,
    params?: unknown[],
    pos?: number | string,
  ) => GSAPTimeline;
}

export default function BeastGatePage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const clawSlashRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const sceneStateRef = useRef<{
    camera?: any;
    beast?: any;
    particles?: any;
    embers?: any;
    fog1?: any;
    fog2?: any;
    rimLight?: any;
    composer?: { render: () => void };
    raf?: number;
  }>({});
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [entered, setEntered] = useState(false);

  /* ── Load Three.js + GSAP from CDN ── */
  useEffect(() => {
    let loaded = 0;
    const total = 4;
    const check = () => {
      if (++loaded === total) setScriptsLoaded(true);
    };

    const load = (src: string, cb: () => void) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        cb();
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.onload = cb;
      document.head.appendChild(s);
    };

    load(
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
      () => {
        load(
          "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js",
          check,
        );
        load(
          "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js",
          () => {
            load(
              "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js",
              () => {
                load(
                  "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js",
                  check,
                );
              },
            );
            check();
          },
        );
        load(
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
          check,
        );
      },
    );

    return () => {};
  }, []);

  /* ── Build Three.js scene ── */
  useEffect(() => {
    if (!scriptsLoaded || !canvasRef.current) return;
    const THREE = window.THREE;
    if (!THREE) return;

    const canvas = canvasRef.current;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x040705, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    (renderer as unknown as { toneMapping: number }).toneMapping =
      THREE.ACESFilmicToneMapping;
    (
      renderer as unknown as { toneMappingExposure: number }
    ).toneMappingExposure = 1.1;

    /* Scene */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040705, 0.038);

    /* Camera */
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 200);
    camera.position.set(0, 2.8, 11);
    camera.lookAt(0, 2.2, 0);
    sceneStateRef.current.camera = camera;

    /* ── LIGHTING ── */
    // Moonlight — cold blue key
    const moon = new THREE.DirectionalLight(0x7ec8e3, 0.55);
    moon.position.set(-8, 14, 6);
    moon.castShadow = true;
    moon.shadow.mapSize.width = 2048;
    moon.shadow.mapSize.height = 2048;
    moon.shadow.camera.near = 0.5;
    moon.shadow.camera.far = 60;
    moon.shadow.camera.left = -15;
    moon.shadow.camera.right = 15;
    moon.shadow.camera.top = 15;
    moon.shadow.camera.bottom = -15;
    scene.add(moon);

    // Rim light — deep scarlet right edge
    const rim = new THREE.PointLight(0xc0392b, 3.5, 18);
    rim.position.set(5, 5, -3);
    scene.add(rim);
    sceneStateRef.current.rimLight = rim;

    // Ember fill — warm glow from below
    const fill = new THREE.PointLight(0xe84d0e, 1.2, 12);
    fill.position.set(0, -1, 3);
    scene.add(fill);

    // Ambient
    const ambient = new THREE.AmbientLight(0x0d1a0e, 0.8);
    scene.add(ambient);

    // Under-beast ground glow
    const groundGlow = new THREE.PointLight(0x8b1a1a, 2.0, 8);
    groundGlow.position.set(0, 0.2, 0);
    scene.add(groundGlow);

    /* ── GROUND ── */
    const groundGeo = new THREE.PlaneGeometry(60, 60, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x080e08,
      roughness: 0.95,
      metalness: 0.05,
    });
    // Subtle terrain displacement
    const groundVerts = groundGeo.attributes.position;
    for (let i = 0; i < groundVerts.count; i++) {
      const x = groundVerts.getX(i);
      const z = groundVerts.getZ(i);
      const dist = Math.sqrt(x * x + z * z);
      groundVerts.setY(
        i,
        Math.sin(x * 0.3) * 0.15 + Math.cos(z * 0.25) * 0.1 - dist * 0.004,
      );
    }
    groundGeo.computeVertexNormals();
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    /* ── MOUNTAIN SILHOUETTES ── */
    const mkMountain = (
      x: number,
      z: number,
      h: number,
      w: number,
      col: number,
    ) => {
      const geo = new THREE.ConeGeometry(w, h, 5, 1);
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        roughness: 1,
        metalness: 0,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, h / 2 - 0.5, z);
      m.rotation.y = Math.random() * Math.PI;
      scene.add(m);
    };
    mkMountain(-18, -22, 14, 7, 0x0a1209);
    mkMountain(-8, -25, 18, 9, 0x081008);
    mkMountain(5, -28, 22, 11, 0x060e06);
    mkMountain(16, -20, 12, 6, 0x0a1209);
    mkMountain(26, -24, 16, 8, 0x081008);
    mkMountain(-28, -18, 10, 5, 0x0a1209);

    /* ── PINE TREES ── */
    const mkPine = (x: number, z: number, h: number) => {
      const g = new THREE.Group();
      const trunkGeo = new THREE.CylinderGeometry(0.08, 0.12, h * 0.35, 6);
      const trunkMat = new THREE.MeshStandardMaterial({
        color: 0x1a0f07,
        roughness: 1,
      });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = h * 0.175;
      g.add(trunk);
      const layerCount = 3;
      for (let i = 0; i < layerCount; i++) {
        const ratio = 1 - i / layerCount;
        const coneGeo = new THREE.ConeGeometry(
          h * 0.28 * ratio,
          h * 0.55 * ratio,
          7,
        );
        const coneMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0x0a1a0a).lerp(
            new THREE.Color(0x061006),
            i / layerCount,
          ),
          roughness: 1,
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.y = h * 0.35 + h * 0.28 * (i / layerCount);
        g.add(cone);
      }
      g.position.set(x, 0, z);
      g.castShadow = true;
      scene.add(g);
    };
    const treePositions = [
      [-7, -6],
      [-9, -4],
      [-11, -8],
      [-13, -3],
      [-15, -6],
      [7, -6],
      [9, -4],
      [11, -8],
      [13, -3],
      [15, -6],
      [-5, -10],
      [5, -10],
      [0, -12],
      [-8, -12],
      [8, -12],
    ];
    treePositions.forEach(([x, z]) => mkPine(x, z, 3 + Math.random() * 2));

    /* ── PROCEDURAL BEAST ── */
    const beast = new THREE.Group();
    sceneStateRef.current.beast = beast;

    const beastMat = new THREE.MeshStandardMaterial({
      color: 0x3d1f0a,
      roughness: 0.85,
      metalness: 0.1,
    });
    const redMat = new THREE.MeshStandardMaterial({
      color: 0x8b1a1a,
      roughness: 0.7,
      metalness: 0.2,
      emissive: new THREE.Color(0x3a0808),
      emissiveIntensity: 0.3,
    });

    // Torso
    const torsoGeo = new THREE.CylinderGeometry(0.85, 0.7, 1.8, 16);
    const torso = new THREE.Mesh(torsoGeo, redMat);
    torso.position.y = 2.2;
    torso.scale.set(1.1, 1, 1);
    torso.castShadow = true;
    beast.add(torso);

    // Chest bulge
    const chestGeo = new THREE.SphereGeometry(0.9, 12, 12);
    const chest = new THREE.Mesh(chestGeo, redMat);
    chest.position.set(0, 2.4, 0.3);
    chest.scale.set(1, 0.85, 0.7);
    beast.add(chest);

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 3.9, 0.1);
    beast.add(headGroup);

    const headGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const head = new THREE.Mesh(headGeo, beastMat);
    head.scale.set(1, 1.1, 0.95);
    head.castShadow = true;
    headGroup.add(head);

    // Snout
    const snoutGeo = new THREE.SphereGeometry(0.38, 10, 10);
    const snout = new THREE.Mesh(
      snoutGeo,
      new THREE.MeshStandardMaterial({ color: 0x2a0e04, roughness: 0.9 }),
    );
    snout.position.set(0, -0.1, 0.52);
    snout.scale.set(1, 0.7, 0.75);
    headGroup.add(snout);

    // Ears
    [-0.55, 0.55].forEach((xOff) => {
      const earGeo = new THREE.ConeGeometry(0.22, 0.45, 6);
      const ear = new THREE.Mesh(earGeo, beastMat);
      ear.position.set(xOff, 0.6, -0.1);
      ear.rotation.z = xOff > 0 ? 0.3 : -0.3;
      headGroup.add(ear);
    });

    // Horns (bull horns)
    [-0.45, 0.45].forEach((xOff, idx) => {
      const hornGeo = new THREE.ConeGeometry(0.1, 0.7, 8);
      const hornMat = new THREE.MeshStandardMaterial({
        color: 0xc9a84c,
        roughness: 0.3,
        metalness: 0.6,
      });
      const horn = new THREE.Mesh(hornGeo, hornMat);
      horn.position.set(xOff, 0.75, 0);
      horn.rotation.z = idx === 0 ? -0.6 : 0.6;
      horn.rotation.x = -0.2;
      headGroup.add(horn);
    });

    // Sunglasses
    const lensGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 16);
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0x050a14,
      metalness: 0.9,
      roughness: 0.1,
      emissive: new THREE.Color(0x0a1428),
      emissiveIntensity: 0.5,
    });
    [-0.25, 0.25].forEach((xOff) => {
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.position.set(xOff, 0.05, 0.65);
      lens.rotation.x = Math.PI / 2;
      headGroup.add(lens);
    });
    // Bridge
    const bridgeGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.5, 6);
    const bridge = new THREE.Mesh(
      bridgeGeo,
      new THREE.MeshStandardMaterial({ color: 0xb8b8b8, metalness: 0.8 }),
    );
    bridge.position.set(0, 0.05, 0.65);
    bridge.rotation.z = Math.PI / 2;
    bridge.rotation.x = Math.PI / 2;
    headGroup.add(bridge);

    // Eyes glow
    [-0.25, 0.25].forEach((xOff) => {
      const eyeGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const eyeMat = new THREE.MeshStandardMaterial({
        color: 0xff2200,
        emissive: new THREE.Color(0xff2200),
        emissiveIntensity: 2,
      });
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(xOff, 0.08, 0.66);
      headGroup.add(eye);
    });

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.38, 0.45, 0.55, 12);
    const neck = new THREE.Mesh(neckGeo, beastMat);
    neck.position.set(0, 3.4, 0.05);
    beast.add(neck);

    // Arms
    [
      [-1.05, 2.3, 0.1, 0.35],
      [1.05, 2.3, 0.1, -0.35],
    ].forEach(([x, y, z, rotZ]) => {
      const upperArmGeo = new THREE.CylinderGeometry(0.28, 0.22, 1.0, 10);
      const upperArm = new THREE.Mesh(upperArmGeo, x < 0 ? beastMat : redMat);
      upperArm.position.set(x, y, z);
      upperArm.rotation.z = rotZ;
      upperArm.castShadow = true;
      beast.add(upperArm);

      const foreArmGeo = new THREE.CylinderGeometry(0.2, 0.16, 0.9, 10);
      const foreArm = new THREE.Mesh(foreArmGeo, beastMat);
      foreArm.position.set(x * 1.15, y - 0.9, z);
      foreArm.rotation.z = rotZ * 0.6;
      beast.add(foreArm);

      // Fist
      const fistGeo = new THREE.SphereGeometry(0.22, 8, 8);
      const fist = new THREE.Mesh(fistGeo, beastMat);
      fist.position.set(x * 1.22, y - 1.6, z);
      fist.scale.set(1, 0.85, 0.9);
      beast.add(fist);
    });

    // Cuban chain
    const chainGroup = new THREE.Group();
    const chainMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.1,
      emissive: new THREE.Color(0x2a1e00),
      emissiveIntensity: 0.2,
    });
    const chainRadius = 0.62;
    const linkCount = 24;
    for (let i = 0; i < linkCount; i++) {
      const angle = (i / linkCount) * Math.PI * 2;
      const linkGeo = new THREE.TorusGeometry(0.055, 0.018, 6, 8);
      const link = new THREE.Mesh(linkGeo, chainMat);
      link.position.set(
        Math.sin(angle) * chainRadius,
        3.0 + Math.cos(angle) * 0.08,
        Math.cos(angle) * 0.22,
      );
      link.rotation.y = angle;
      link.rotation.z = Math.PI / 2;
      chainGroup.add(link);
    }
    beast.add(chainGroup);

    // Panda pendant
    const pendantGroup = new THREE.Group();
    pendantGroup.position.set(0, 2.55, 0.65);
    const pendantFaceGeo = new THREE.SphereGeometry(0.22, 12, 12);
    const pandaMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.4,
    });
    const pendantFace = new THREE.Mesh(pendantFaceGeo, pandaMat);
    pendantGroup.add(pendantFace);
    // Panda eyes
    [-0.08, 0.08].forEach((xOff) => {
      const eyePatchGeo = new THREE.SphereGeometry(0.065, 8, 8);
      const eyePatch = new THREE.Mesh(
        eyePatchGeo,
        new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 }),
      );
      eyePatch.position.set(xOff, 0.04, 0.2);
      pendantGroup.add(eyePatch);
    });
    // Panda ears
    [-0.16, 0.16].forEach((xOff) => {
      const earGeo = new THREE.SphereGeometry(0.065, 8, 8);
      const pandaEar = new THREE.Mesh(
        earGeo,
        new THREE.MeshStandardMaterial({ color: 0x111111 }),
      );
      pandaEar.position.set(xOff, 0.2, 0);
      pendantGroup.add(pandaEar);
    });
    beast.add(pendantGroup);

    // Legs
    [
      [-0.42, 1.0, 0],
      [0.42, 1.0, 0],
    ].forEach(([x, y, z]) => {
      const thighGeo = new THREE.CylinderGeometry(0.32, 0.27, 0.9, 10);
      const thigh = new THREE.Mesh(thighGeo, beastMat);
      thigh.position.set(x, y, z);
      thigh.castShadow = true;
      beast.add(thigh);

      const shinGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.85, 10);
      const shin = new THREE.Mesh(shinGeo, beastMat);
      shin.position.set(x, y - 0.85, z + 0.05);
      beast.add(shin);

      // Paw/foot
      const footGeo = new THREE.SphereGeometry(0.22, 8, 8);
      const foot = new THREE.Mesh(footGeo, beastMat);
      foot.position.set(x, y - 1.45, z + 0.14);
      foot.scale.set(1.1, 0.6, 1.4);
      beast.add(foot);

      // Claws
      for (let c = 0; c < 3; c++) {
        const clawGeo = new THREE.ConeGeometry(0.03, 0.14, 5);
        const clawMat = new THREE.MeshStandardMaterial({
          color: 0x888888,
          metalness: 0.7,
          roughness: 0.2,
        });
        const claw = new THREE.Mesh(clawGeo, clawMat);
        claw.position.set(x + (c - 1) * 0.08, y - 1.6, z + 0.28);
        claw.rotation.x = -Math.PI / 6;
        beast.add(claw);
      }
    });

    // Belt with MBP
    const beltGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.12, 20);
    const beltMat = new THREE.MeshStandardMaterial({
      color: 0x1a1008,
      roughness: 0.6,
      metalness: 0.4,
    });
    const belt = new THREE.Mesh(beltGeo, beltMat);
    belt.position.set(0, 1.55, 0);
    beast.add(belt);

    // Belt buckle
    const buckleGeo = new THREE.BoxGeometry(0.28, 0.12, 0.06);
    const buckleMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.1,
    });
    const buckle = new THREE.Mesh(buckleGeo, buckleMat);
    buckle.position.set(0, 1.55, 0.72);
    beast.add(buckle);

    // Body glow effect (emissive sphere inside)
    const glowGeo = new THREE.SphereGeometry(0.5, 12, 12);
    const glowMat = new THREE.MeshStandardMaterial({
      color: 0x8b1a1a,
      emissive: new THREE.Color(0x8b1a1a),
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.35,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(0, 2.3, 0);
    beast.add(glow);

    beast.position.set(0.4, 0, 0);
    beast.scale.setScalar(0);
    scene.add(beast);

    /* ── ATMOSPHERIC PARTICLES ── */
    // Floating dust/spores
    const partCount = 800;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);
    const partCol = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount; i++) {
      partPos[i * 3] = (Math.random() - 0.5) * 30;
      partPos[i * 3 + 1] = Math.random() * 8;
      partPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      const warm = Math.random();
      partCol[i * 3] = warm > 0.7 ? 0.75 : 0.25;
      partCol[i * 3 + 1] = warm > 0.7 ? 0.3 : 0.45;
      partCol[i * 3 + 2] = warm > 0.7 ? 0.17 : 0.35;
    }
    partGeo.setAttribute("position", new THREE.BufferAttribute(partPos, 3));
    partGeo.setAttribute("color", new THREE.BufferAttribute(partCol, 3));
    const partMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);
    sceneStateRef.current.particles = particles;

    // Embers — brighter scarlet rising
    const emberCount = 120;
    const emberGeo = new THREE.BufferGeometry();
    const emberPos = new Float32Array(emberCount * 3);
    const emberVel = new Float32Array(emberCount * 3);
    for (let i = 0; i < emberCount; i++) {
      emberPos[i * 3] = (Math.random() - 0.5) * 8;
      emberPos[i * 3 + 1] = Math.random() * 5;
      emberPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      emberVel[i * 3] = (Math.random() - 0.5) * 0.008;
      emberVel[i * 3 + 1] = 0.006 + Math.random() * 0.012;
      emberVel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPos, 3));
    const emberMat = new THREE.PointsMaterial({
      size: 0.055,
      color: 0xe84d0e,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    });
    const embers = new THREE.Points(emberGeo, emberMat);
    scene.add(embers);
    sceneStateRef.current.embers = embers;

    /* ── FOG PLANES ── */
    const fogTexture = (() => {
      const size = 256;
      const data = new Uint8Array(size * size * 4);
      for (let i = 0; i < size * size; i++) {
        const x = (i % size) / size - 0.5;
        const y = Math.floor(i / size) / size - 0.5;
        const d = Math.sqrt(x * x + y * y) * 2;
        const v = Math.max(0, 1 - d) * (0.5 + Math.random() * 0.5);
        const idx = i * 4;
        data[idx] = data[idx + 1] = data[idx + 2] = Math.floor(v * 25);
        data[idx + 3] = Math.floor(v * 180);
      }
      const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
      t.needsUpdate = true;
      return t;
    })();

    const mkFogPlane = (
      y: number,
      z: number,
      scale: number,
      opacity: number,
    ) => {
      const geo = new THREE.PlaneGeometry(28, 5);
      const mat = new THREE.MeshBasicMaterial({
        map: fogTexture,
        transparent: true,
        opacity,
        depthWrite: false,
        color: 0x1a2e1b,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(0, y, z);
      m.scale.setScalar(scale);
      scene.add(m);
      return m;
    };
    sceneStateRef.current.fog1 = mkFogPlane(0.4, 2, 1.2, 0.22);
    sceneStateRef.current.fog2 = mkFogPlane(0.8, 0, 1.6, 0.15);

    /* ── RESIZE ── */
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    /* ── ANIMATE ── */
    let t = 0;
    const baseCamPos = { x: 0, y: 2.8, z: 11 };

    const animate = () => {
      sceneStateRef.current.raf = requestAnimationFrame(animate);
      t += 0.008;

      // Mouse parallax
      const mouse = mouseRef.current;
      mouse.tx += (mouse.x - mouse.tx) * 0.04;
      mouse.ty += (mouse.y - mouse.ty) * 0.04;

      camera.position.x = baseCamPos.x + mouse.tx * 1.4;
      camera.position.y = baseCamPos.y + mouse.ty * 0.7;
      camera.position.z = baseCamPos.z + Math.sin(t * 0.15) * 0.4;
      camera.lookAt(0.4, 2.2, 0);

      // Beast breathe + subtle sway
      if (sceneStateRef.current.beast) {
        const b = sceneStateRef.current.beast;
        b.position.y = Math.sin(t * 0.8) * 0.06;
        b.rotation.y = Math.sin(t * 0.3) * 0.04 + mouse.tx * 0.08;
        // Head tracks mouse slightly
        const head = b.children.find((c: any) => c.type === "Group") as any;
        if (head) {
          head.rotation.y = mouse.tx * 0.12;
          head.rotation.x = mouse.ty * 0.06;
        }
      }

      // Ember drift upward
      if (sceneStateRef.current.embers) {
        const pos = sceneStateRef.current.embers.geometry.attributes.position;
        const vel = emberVel;
        for (let i = 0; i < emberCount; i++) {
          pos.setX(i, pos.getX(i) + vel[i * 3]);
          pos.setY(i, pos.getY(i) + vel[i * 3 + 1]);
          pos.setZ(i, pos.getZ(i) + vel[i * 3 + 2]);
          if (pos.getY(i) > 8) {
            pos.setY(i, 0);
            pos.setX(i, (Math.random() - 0.5) * 8);
            pos.setZ(i, (Math.random() - 0.5) * 6);
          }
        }
        pos.needsUpdate = true;
      }

      // Dust drift
      if (sceneStateRef.current.particles) {
        sceneStateRef.current.particles.rotation.y += 0.0003;
        sceneStateRef.current.particles.position.y = Math.sin(t * 0.2) * 0.15;
      }

      // Fog drift
      if (sceneStateRef.current.fog1) {
        sceneStateRef.current.fog1.position.x = Math.sin(t * 0.18) * 2.5;
        (sceneStateRef.current.fog1.material as any).opacity =
          0.18 + Math.sin(t * 0.4) * 0.06;
      }
      if (sceneStateRef.current.fog2) {
        sceneStateRef.current.fog2.position.x = Math.sin(t * 0.13 + 1) * 3;
        (sceneStateRef.current.fog2.material as any).opacity =
          0.12 + Math.cos(t * 0.35) * 0.04;
      }

      // Rim light pulse
      if (sceneStateRef.current.rimLight) {
        sceneStateRef.current.rimLight.intensity =
          3.0 + Math.sin(t * 1.2) * 0.5;
      }

      // Ground glow pulse
      groundGlow.intensity = 1.8 + Math.sin(t * 2.1) * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    /* ── GSAP entrance ── */
    const gsap = window.gsap;
    if (gsap) {
      // Beast scales in from nothing
      gsap.to(sceneStateRef.current.beast!.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.8,
        ease: "elastic.out(1,0.6)",
        delay: 0.8,
      });
    }

    return () => {
      cancelAnimationFrame(sceneStateRef.current.raf!);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, [scriptsLoaded]);

  /* ── GSAP UI Entrance ── */
  useEffect(() => {
    if (!scriptsLoaded) return;
    const gsap = window.gsap;
    if (!gsap) return;

    const tl = gsap.timeline({ delay: 0.4 });
    tl.fromTo(
      ".gate-badge",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      0.3,
    )
      .fromTo(
        ".gate-char",
        { opacity: 0, y: 70, rotateX: -90, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.03,
          ease: "back.out(1.5)",
        },
        0.7,
      )
      .fromTo(
        ".gate-sub",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        1.5,
      )
      .fromTo(
        btnRef.current,
        { opacity: 0, y: 30, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "elastic.out(1,0.65)",
        },
        1.9,
      )
      .fromTo(
        ".gate-micro",
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        2.5,
      );
  }, [scriptsLoaded]);

  /* ── Mouse tracking ── */
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  /* ── Enter transition ── */
  const handleEnter = useCallback(() => {
    if (entered) return;
    setEntered(true);

    const gsap = window.gsap;
    if (!gsap) {
      router.push("/landing");
      return;
    }

    // Button impact
    gsap
      .timeline()
      .to(btnRef.current, { scale: 0.88, duration: 0.07, ease: "power4.in" })
      .to(btnRef.current, {
        scale: 1.05,
        duration: 0.2,
        ease: "elastic.out(1.4,0.5)",
      });

    // Beast lunge forward
    if (sceneStateRef.current.beast) {
      gsap.to(sceneStateRef.current.beast.position, {
        z: 5,
        y: 0.5,
        duration: 0.6,
        ease: "power3.in",
      });
      gsap.to(sceneStateRef.current.beast.scale, {
        x: 1.4,
        y: 1.4,
        z: 1.4,
        duration: 0.6,
        ease: "power3.in",
      });
    }

    // UI dissolves
    gsap.to(uiRef.current, { opacity: 0, duration: 0.4, delay: 0.25 });

    // Claw slash
    gsap.to(clawSlashRef.current, {
      scaleX: 1,
      duration: 0.22,
      ease: "power4.out",
      delay: 0.3,
    });

    // Black out
    gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 0.55,
      ease: "power3.in",
      delay: 0.35,
      onComplete: () => router.push("/home"),
    });
  }, [entered, router]);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-[#040705]"
      onMouseMove={onMouseMove}
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      {/* ─── Styles ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Oswald:wght@400;600;700&family=DM+Sans:ital,wght@0,400;1,400&display=swap');
        * { box-sizing: border-box; }
        :root {
          --scarlet: #c0392b; --ember: #e84d0e; --blood: #8b1a1a;
          --bone: #e8dcc8; --moss: #4a7c59; --ash: #6b7280;
          --sky: #7ec8e3; --gold: #d4af37;
        }
        .beast-font { font-family: 'Black Han Sans', sans-serif; }

        /* CTA button */
        .cta-btn {
          position: relative; display: inline-flex; align-items: center; gap: 14px;
          padding: 20px 52px 20px 36px;
          font-family: 'Oswald', sans-serif; font-size: 16px; font-weight: 700;
          letter-spacing: 0.26em; text-transform: uppercase; color: var(--bone);
          background: #040705; border: none; overflow: hidden;
          clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
          box-shadow: inset 0 0 0 1px rgba(192,57,43,0.35), 0 6px 40px rgba(0,0,0,0.9);
          transition: box-shadow 0.3s ease, letter-spacing 0.25s ease;
          cursor: pointer; will-change: transform;
        }
        .cta-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(192,57,43,0.25) 0%, rgba(232,77,14,0.1) 100%);
          transform: translateX(-101%); transition: transform 0.45s cubic-bezier(0.23,1,0.32,1); z-index: 1;
        }
        .cta-btn:hover::before { transform: translateX(0); }
        .cta-btn:hover {
          box-shadow: inset 0 0 0 1px rgba(192,57,43,0.7), 0 10px 60px rgba(0,0,0,0.95), 0 0 70px rgba(192,57,43,0.3);
          letter-spacing: 0.32em;
        }
        .cta-edge {
          position: absolute; left: 0; top: 0; bottom: 0; width: 5px;
          background: linear-gradient(180deg, var(--ember), var(--scarlet), var(--blood));
          z-index: 4; animation: edgePulse 2s ease-in-out infinite;
        }
        @keyframes edgePulse {
          0%,100% { box-shadow: 0 0 8px rgba(192,57,43,0.5), 0 0 20px rgba(192,57,43,0.2); }
          50% { box-shadow: 0 0 20px rgba(232,77,14,0.9), 0 0 50px rgba(232,77,14,0.4); }
        }
        .cta-paw {
          position: relative; z-index: 3; display: inline-flex; align-items: center;
          color: var(--scarlet); flex-shrink: 0;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), color 0.2s ease, filter 0.2s ease;
        }
        .cta-btn:hover .cta-paw {
          transform: rotate(-20deg) scale(1.3); color: var(--ember);
          filter: drop-shadow(0 0 8px rgba(232,77,14,0.9));
        }
        .cta-label { position: relative; z-index: 3; }
        .cta-corner-tl { position:absolute; top:0; right:0; }
        .cta-corner-br { position:absolute; bottom:0; left:0; }

        /* Headline outline */
        .headline-outline {
          -webkit-text-stroke: 3px var(--scarlet); color: transparent;
          text-shadow: 4px 4px 0 rgba(192,57,43,0.22), 0 0 40px rgba(192,57,43,0.2);
          filter: drop-shadow(0 0 18px rgba(192,57,43,0.28));
        }

        /* Vignette */
        .vignette {
          background: radial-gradient(ellipse 75% 70% at 65% 50%, transparent 30%, rgba(4,7,5,0.6) 65%, rgba(4,7,5,0.95) 100%);
        }

        /* Warning sign */
        .warn-sign {
          background: #f5f0e0; border: 3px solid #2a2a2a;
          box-shadow: inset 0 0 0 2px #2a2a2a, 4px 4px 0 rgba(0,0,0,0.55);
          animation: signSwing 3s ease-in-out infinite; transform-origin: top center;
        }
        @keyframes signSwing { 0%,100%{transform:rotate(-2.5deg)} 50%{transform:rotate(2.5deg)} }

        /* Claw mark SVG */
        .claw-entrance { stroke-dasharray: 250; stroke-dashoffset: 250;
          animation: clawDraw 0.8s ease-out 2s forwards; }
        @keyframes clawDraw { to { stroke-dashoffset: 0; } }

        * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M8 4 L12 16 L4 14 Z' fill='%23c0392b'/%3E%3C/svg%3E"), auto; }

        @media(max-width:768px) {
          .gate-headline { font-size: 15vw !important; }
          .gate-h2 { font-size: 15vw !important; }
          .cta-btn { padding: 16px 36px 16px 24px; font-size: 14px; }
        }
      `}</style>

      {/* ─── Three.js canvas (full screen) ─── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* ─── Vignette ─── */}
      <div
        className="vignette absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/* ─── Top gradient ─── */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: 200,
          background:
            "linear-gradient(180deg, rgba(4,7,5,0.92) 0%, transparent 100%)",
          zIndex: 3,
        }}
      />

      {/* ─── Bottom gradient ─── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: 180,
          background:
            "linear-gradient(0deg, rgba(4,7,5,0.95) 0%, transparent 100%)",
          zIndex: 3,
        }}
      />

      {/* ─── Claw marks top-left ─── */}
      <svg
        className="absolute pointer-events-none"
        style={{ top: "8%", left: "1.5%", zIndex: 5, opacity: 0.2 }}
        width="130"
        height="70"
        viewBox="0 0 130 70"
      >
        <defs>
          <filter id="cg2">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[
          "M4,4 C28,20 72,44 126,66",
          "M16,2 C40,17 85,40 128,62",
          "M30,5 C52,18 96,42 126,60",
        ].map((d, i) => (
          <path
            key={i}
            className="claw-entrance"
            d={d}
            stroke={`rgba(192,57,43,${0.9 - i * 0.15})`}
            strokeWidth={2.8 - i * 0.55}
            strokeLinecap="round"
            fill="none"
            filter="url(#cg2)"
            style={{ animationDelay: `${2 + i * 0.1}s` }}
          />
        ))}
      </svg>

      {/* ─── Warning sign ─── */}
      <div
        className="absolute warn-sign"
        style={{ top: "9%", left: "2.5%", width: 136, zIndex: 6 }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-[#5c3a1e]"
          style={{ bottom: -50, width: 6, height: 50 }}
        />
        <div
          style={{
            background: "#c0392b",
            fontFamily: "'Oswald',sans-serif",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "white",
            padding: "3px 8px",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <svg width="9" height="9" viewBox="0 0 10 10" fill="white">
            <path d="M5 1 L9 9 H1 Z" />
          </svg>
          WARNING
        </div>
        <div
          style={{
            fontFamily: "'Oswald',sans-serif",
            fontSize: 10,
            fontWeight: 600,
            textAlign: "center",
            color: "#1a1a1a",
            padding: "8px 10px",
            letterSpacing: "0.04em",
            lineHeight: 1.65,
            textTransform: "uppercase",
          }}
        >
          MAN-BEAR-PIG
          <br />
          SEEN IN
          <br />
          THIS AREA
        </div>
      </div>

      {/* ─── Main UI ─── */}
      <div
        ref={uiRef}
        className="absolute inset-0 flex flex-col justify-center"
        style={{
          zIndex: 8,
          paddingLeft: "clamp(24px, 5.5vw, 90px)",
          paddingBottom: "5vh",
        }}
      >
        {/* Live badge */}
        <div
          className="gate-badge flex items-center gap-2 mb-6"
          style={{ opacity: 0 }}
        >
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full animate-ping"
              style={{ background: "#c0392b", opacity: 0.65 }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ background: "#c0392b" }}
            />
          </span>
          <span
            style={{
              fontFamily: "'Oswald',sans-serif",
              fontSize: 10,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(107,114,128,0.65)",
            }}
          >
            Sui Network · Live
          </span>
        </div>

        {/* Headline */}
        <div style={{ perspective: 700, transformStyle: "preserve-3d" }}>
          {/* Line 1: ENTER THE */}
          <div
            className="beast-font gate-headline"
            style={{
              fontSize: "clamp(58px, 8.5vw, 124px)",
              lineHeight: 0.92,
              color: "#e8dcc8",
              marginBottom: 4,
            }}
          >
            {"ENTER THE".split("").map((ch, i) => (
              <span
                key={`a${i}`}
                className="gate-char inline-block"
                style={{ opacity: 0, transformOrigin: "50% 100%" }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </div>
          {/* Line 2: BEAST — outlined */}
          <div
            className="beast-font headline-outline gate-h2"
            style={{
              fontSize: "clamp(68px, 10vw, 148px)",
              lineHeight: 0.88,
              marginBottom: 6,
            }}
          >
            {"BEAST".split("").map((ch, i) => (
              <span
                key={`b${i}`}
                className="gate-char inline-block"
                style={{ opacity: 0, transformOrigin: "50% 100%" }}
              >
                {ch}
              </span>
            ))}
          </div>
        </div>

        {/* Sub */}
        <p
          className="gate-sub"
          style={{
            fontFamily: "'Oswald',sans-serif",
            fontSize: "clamp(12px, 1.3vw, 16px)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: "#7ec8e3",
            marginTop: 16,
            marginBottom: 32,
            opacity: 0,
            maxWidth: 460,
          }}
        >
          Half man. Half bear. Half pig.{" "}
          <span style={{ color: "#c0392b", fontWeight: 700 }}>100% CHAOS.</span>
        </p>

        {/* CTA */}
        <div>
          <button
            ref={btnRef}
            className="cta-btn"
            style={{ opacity: 0 }}
            onClick={handleEnter}
            disabled={entered}
            aria-label="Enter the den — ManBearPig"
          >
            <span className="cta-edge" />
            <svg
              className="cta-corner-tl"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <polyline
                points="0,12 0,0 12,0"
                stroke="rgba(192,57,43,0.7)"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            <svg
              className="cta-corner-br"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <polyline
                points="16,4 16,16 4,16"
                stroke="rgba(139,26,26,0.6)"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            <span className="cta-paw">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <ellipse cx="7" cy="5" rx="2.5" ry="3" />
                <ellipse cx="17" cy="5" rx="2.5" ry="3" />
                <ellipse cx="3.5" cy="11" rx="2" ry="2.5" />
                <ellipse cx="20.5" cy="11" rx="2" ry="2.5" />
                <path d="M12 22c-4 0-7-3-7-6.5S8 10 12 10s7 2 7 5.5S16 22 12 22z" />
              </svg>
            </span>
            <span className="cta-label">
              {entered ? "UNLEASHING…" : "ENTER THE DEN"}
            </span>
            <svg
              width="11"
              height="11"
              viewBox="0 0 12 12"
              fill="none"
              style={{
                position: "relative",
                zIndex: 3,
                opacity: 0.45,
                flexShrink: 0,
              }}
            >
              <path
                d="M1 11 L11 1 M6 1 L11 1 L11 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Microcopy */}
        <p
          className="gate-micro"
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 11,
            marginTop: 16,
            color: "rgba(107,114,128,0.4)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontStyle: "italic",
            opacity: 0,
          }}
        >
          Proceed if you&apos;re ready. The beast doesn&apos;t wait.
        </p>

        {/* Socials */}
        <div
          className="gate-micro flex items-center gap-5 mt-8"
          style={{ opacity: 0 }}
        >
          {["Twitter", "Telegram", "Discord"].map((s) => (
            <span
              key={s}
              style={{
                fontFamily: "'Oswald',sans-serif",
                fontSize: 10,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(107,114,128,0.38)",
                borderBottom: "1px solid rgba(107,114,128,0.15)",
                paddingBottom: 2,
                cursor: "pointer",
              }}
            >
              {s}
            </span>
          ))}
          <span style={{ color: "rgba(107,114,128,0.18)", fontSize: 10 }}>
            ·
          </span>
          <span
            style={{
              fontFamily: "'Oswald',sans-serif",
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(126,200,227,0.3)",
            }}
          >
            Built on Sui
          </span>
        </div>
      </div>

      {/* ─── Claw slash transition ─── */}
      <div
        ref={clawSlashRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 50,
          transformOrigin: "left center",
          transform: "scaleX(0)",
          background:
            "linear-gradient(105deg, transparent 0%, rgba(139,26,26,0.5) 30%, rgba(192,57,43,0.75) 50%, rgba(139,26,26,0.5) 70%, transparent 100%)",
        }}
      />

      {/* ─── Black exit overlay ─── */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 51, background: "#040705", opacity: 0 }}
      />
    </div>
  );
}
