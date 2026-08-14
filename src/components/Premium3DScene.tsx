"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type BodyConfig = {
  name: string;
  orbitX: number;
  orbitZ: number;
  radius: number;
  color: number;
  orbitColor: number;
  angle: number;
  speed: number;
  texture: string;
  tilt?: number;
  labelOffset?: [number, number, number];
  ring?: boolean;
};

type MissionConfig = {
  name: string;
  orbitX: number;
  orbitZ: number;
  angle: number;
  color: number;
  tilt: number;
};

type Premium3DSceneProps = {
  exploreMode?: boolean;
  onExploreChange?: (active: boolean) => void;
};

type BodyMaps = {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
};

const BODIES: BodyConfig[] = [
  { name: "MERCURY", orbitX: 1.05, orbitZ: 0.68, radius: 0.055, color: 0x9c8f82, orbitColor: 0xa36dff, angle: 0.15, speed: 1.6, texture: "/textures/planets/mercury.jpg" },
  { name: "VENUS", orbitX: 1.64, orbitZ: 1.08, radius: 0.078, color: 0xd9a33f, orbitColor: 0xe5a300, angle: 4.75, speed: 1.18, texture: "/textures/planets/venus.jpg" },
  { name: "EARTH", orbitX: 2.22, orbitZ: 1.48, radius: 0.086, color: 0x1ba7ff, orbitColor: 0x00a6d8, angle: 5.92, speed: 1.0, texture: "/textures/planets/earth.jpg", labelOffset: [0.18, 0.16, 0.02] },
  { name: "MARS", orbitX: 3.18, orbitZ: 2.16, radius: 0.07, color: 0xe36821, orbitColor: 0xd46a00, angle: 0.62, speed: 0.76, texture: "/textures/planets/mars.jpg" },
  { name: "JUPITER", orbitX: 5.25, orbitZ: 3.55, radius: 0.17, color: 0xd9b184, orbitColor: 0xf07040, angle: 2.58, speed: 0.36, texture: "/textures/planets/jupiter.jpg", labelOffset: [0.24, 0.18, 0] },
  { name: "SATURN", orbitX: 6.85, orbitZ: 4.62, radius: 0.15, color: 0xd8c78e, orbitColor: 0xe6d16e, angle: 3.88, speed: 0.28, texture: "/textures/planets/saturn.jpg", ring: true },
  { name: "URANUS", orbitX: 8.55, orbitZ: 5.7, radius: 0.12, color: 0x9eeeff, orbitColor: 0x5dd7ff, angle: 1.22, speed: 0.2, texture: "/textures/planets/uranus.jpg" },
  { name: "NEPTUNE", orbitX: 10.1, orbitZ: 6.75, radius: 0.12, color: 0x4069ff, orbitColor: 0x3666ff, angle: 5.22, speed: 0.16, texture: "/textures/planets/neptune.jpg" },
];

const MISSIONS: MissionConfig[] = [
  { name: "Parker Solar Probe", orbitX: 1.88, orbitZ: 1.04, angle: 5.82, color: 0xbfc4ca, tilt: 0.34 },
  { name: "STEREO Ahead", orbitX: 2.55, orbitZ: 1.58, angle: 0.4, color: 0x8f9aa8, tilt: -0.12 },
  { name: "Europa Clipper", orbitX: 4.65, orbitZ: 2.95, angle: 5.2, color: 0xd7dce5, tilt: 0.26 },
  { name: "Juice", orbitX: 4.95, orbitZ: 3.2, angle: 5.9, color: 0xaeb8c8, tilt: -0.22 },
  { name: "3I/ATLAS (C/2025 N1)", orbitX: 7.7, orbitZ: 1.45, angle: 2.2, color: 0xd7d7d7, tilt: 0.72 },
  { name: "Voyager 1", orbitX: 11.7, orbitZ: 7.8, angle: 3.76, color: 0xcccccc, tilt: -0.48 },
  { name: "New Horizons", orbitX: 9.4, orbitZ: 5.8, angle: 3.28, color: 0xb7bdc8, tilt: 0.42 },
];

function orbitPoint(orbitX: number, orbitZ: number, angle: number, y = 0) {
  return new THREE.Vector3(Math.cos(angle) * orbitX, y, Math.sin(angle) * orbitZ);
}

function makeOrbitGeometry(orbitX: number, orbitZ: number, tilt = 0, segments = 360) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    const point = orbitPoint(orbitX, orbitZ, angle);
    point.y = Math.sin(angle * 2.0) * tilt;
    points.push(point);
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

function seededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function bodySeed(name: string) {
  return Array.from(name).reduce((sum, character) => sum + character.charCodeAt(0) * 17, 97);
}

function drawSoftSpot(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  color: string,
  alpha: number,
  rotation = 0,
) {
  context.save();
  context.globalAlpha = alpha;
  context.translate(x, y);
  context.rotate(rotation);
  context.fillStyle = color;
  context.beginPath();
  context.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function makeBodyMaps(config: BodyConfig): BodyMaps | null {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = canvas.width;
  bumpCanvas.height = canvas.height;
  const context = canvas.getContext("2d");
  const bump = bumpCanvas.getContext("2d");
  if (!context || !bump) return null;

  const random = seededRandom(bodySeed(config.name));
  const width = canvas.width;
  const height = canvas.height;
  const name = config.name;

  const base = new THREE.Color(config.color);
  const light = base.clone().lerp(new THREE.Color(0xffffff), 0.36);
  const dark = base.clone().multiplyScalar(0.18);
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, `#${light.getHexString()}`);
  gradient.addColorStop(0.52, `#${base.getHexString()}`);
  gradient.addColorStop(1, `#${dark.getHexString()}`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  bump.fillStyle = "#606060";
  bump.fillRect(0, 0, width, height);

  if (name === "JUPITER" || name === "SATURN") {
    const bands = name === "JUPITER" ? 30 : 22;
    const palette = name === "JUPITER"
      ? ["#f7e0bd", "#c98e62", "#9e6046", "#fff2d2", "#b87a55"]
      : ["#f6e7b4", "#c4a86c", "#e8d497", "#816b45"];
    for (let i = 0; i < bands; i += 1) {
      const y = (i / bands) * height + (random() - 0.5) * 8;
      const bandHeight = height / bands * (0.72 + random() * 1.65);
      context.globalAlpha = 0.52 + random() * 0.28;
      context.fillStyle = palette[i % palette.length];
      context.fillRect(0, y, width, bandHeight);
      context.globalAlpha = 0.22;
      for (let j = 0; j < 8; j += 1) {
        drawSoftSpot(context, random() * width, y + random() * bandHeight, 55 + random() * 180, 3 + random() * 11, palette[(i + j + 1) % palette.length], 0.24, (random() - 0.5) * 0.08);
      }
      bump.globalAlpha = 0.14;
      bump.fillStyle = i % 2 ? "#888888" : "#3f3f3f";
      bump.fillRect(0, y, width, Math.max(2, bandHeight * 0.42));
    }
    if (name === "JUPITER") {
      drawSoftSpot(context, width * 0.66, height * 0.58, 82, 32, "rgba(151, 57, 35, 0.94)", 1, -0.08);
      drawSoftSpot(context, width * 0.66, height * 0.58, 54, 18, "rgba(230, 151, 99, 0.78)", 1, -0.08);
      drawSoftSpot(bump, width * 0.66, height * 0.58, 72, 24, "#9a9a9a", 0.8, -0.08);
    }
  } else if (name === "EARTH") {
    context.fillStyle = "#0b62be";
    context.fillRect(0, 0, width, height);
    const continents = [
      [0.17, 0.38, 70, 46], [0.28, 0.58, 88, 34], [0.47, 0.42, 110, 54],
      [0.58, 0.64, 72, 48], [0.75, 0.36, 126, 62], [0.84, 0.61, 68, 36],
    ];
    continents.forEach(([x, y, rx, ry], index) => {
      drawSoftSpot(context, x * width, y * height, rx, ry, index % 2 ? "#64c979" : "#47aa66", 0.94, (random() - 0.5) * 0.9);
      drawSoftSpot(bump, x * width, y * height, rx * 0.9, ry * 0.9, "#a0a0a0", 0.72, (random() - 0.5) * 0.9);
    });
    context.strokeStyle = "rgba(236, 250, 255, 0.62)";
    context.lineWidth = 5;
    for (let i = 0; i < 18; i += 1) {
      context.beginPath();
      const y = random() * height;
      context.moveTo(random() * width, y);
      context.bezierCurveTo(width * random(), y + (random() - 0.5) * 40, width * random(), y + (random() - 0.5) * 72, width * random(), y + (random() - 0.5) * 46);
      context.stroke();
    }
    context.fillStyle = "rgba(255, 255, 255, 0.8)";
    context.fillRect(0, 0, width, 34);
    context.fillRect(0, height - 38, width, 38);
  } else if (name === "MARS" || name === "MERCURY" || name === "VENUS") {
    const craterCount = name === "VENUS" ? 42 : name === "MARS" ? 72 : 92;
    for (let i = 0; i < craterCount; i += 1) {
      const x = random() * width;
      const y = random() * height;
      const radius = (name === "MERCURY" ? 7 : 10) + random() * (name === "MERCURY" ? 28 : 42);
      const color = name === "VENUS" ? "rgba(255, 231, 155, 0.22)" : name === "MARS" ? "rgba(75, 28, 18, 0.33)" : "rgba(35, 31, 28, 0.32)";
      drawSoftSpot(context, x, y, radius * 1.25, radius * 0.72, color, 1, random() * Math.PI);
      drawSoftSpot(context, x - radius * 0.16, y - radius * 0.12, radius * 0.5, radius * 0.24, "rgba(255,255,255,0.16)", 1, random() * Math.PI);
      drawSoftSpot(bump, x, y, radius, radius * 0.58, "#2f2f2f", 0.58, random() * Math.PI);
      drawSoftSpot(bump, x - radius * 0.12, y - radius * 0.1, radius * 0.46, radius * 0.22, "#9c9c9c", 0.42, random() * Math.PI);
    }
    if (name === "MARS") {
      drawSoftSpot(context, width * 0.48, height * 0.16, 120, 20, "rgba(255, 230, 190, 0.32)", 1, 0.08);
      drawSoftSpot(context, width * 0.72, height * 0.56, 190, 22, "rgba(80, 31, 23, 0.36)", 1, -0.16);
    }
    if (name === "VENUS") {
      context.strokeStyle = "rgba(255, 240, 174, 0.28)";
      context.lineWidth = 7;
      for (let i = 0; i < 18; i += 1) {
        context.beginPath();
        const y = random() * height;
        context.moveTo(0, y);
        context.bezierCurveTo(width * 0.35, y - 45 + random() * 90, width * 0.68, y - 35 + random() * 70, width, y - 30 + random() * 60);
        context.stroke();
      }
    }
  } else {
    const hueColor = name === "URANUS" ? "#c7ffff" : "#234bdc";
    context.globalAlpha = 0.34;
    context.strokeStyle = hueColor;
    context.lineWidth = 9;
    for (let i = 0; i < 22; i += 1) {
      context.beginPath();
      const y = (i / 22) * height + (random() - 0.5) * 14;
      context.moveTo(0, y);
      context.bezierCurveTo(width * 0.25, y + random() * 40, width * 0.7, y - random() * 42, width, y + (random() - 0.5) * 44);
      context.stroke();
    }
  }

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const bumpPixels = bump.getImageData(0, 0, bumpCanvas.width, bumpCanvas.height);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const noise = (random() - 0.5) * 30;
    pixels.data[i] = Math.max(0, Math.min(255, pixels.data[i] + noise));
    pixels.data[i + 1] = Math.max(0, Math.min(255, pixels.data[i + 1] + noise));
    pixels.data[i + 2] = Math.max(0, Math.min(255, pixels.data[i + 2] + noise));
    const bumpNoise = (random() - 0.5) * 58;
    bumpPixels.data[i] = Math.max(0, Math.min(255, bumpPixels.data[i] + bumpNoise));
    bumpPixels.data[i + 1] = bumpPixels.data[i];
    bumpPixels.data[i + 2] = bumpPixels.data[i];
  }
  context.putImageData(pixels, 0, 0);
  bump.putImageData(bumpPixels, 0, 0);

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.colorSpace = THREE.SRGBColorSpace;
  bumpMap.anisotropy = 6;
  return { map, bumpMap };
}

function makeLabelSprite(text: string, color = "#f2f6ff", scale = 0.34) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 160;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = "700 58px Orbitron, Arial, sans-serif";
  context.letterSpacing = "12px";
  context.fillStyle = color;
  context.shadowColor = color;
  context.shadowBlur = 12;
  context.fillText(text, 18, 98);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    }),
  );
  sprite.scale.set(scale * 4.5, scale * 0.7, 1);
  sprite.userData.baseScale = sprite.scale.clone();
  return sprite;
}

function makeSunGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const gradient = context.createRadialGradient(256, 256, 12, 256, 256, 256);
  gradient.addColorStop(0, "rgba(255, 255, 180, 1)");
  gradient.addColorStop(0.2, "rgba(255, 225, 68, 0.8)");
  gradient.addColorStop(0.55, "rgba(255, 154, 26, 0.22)");
  gradient.addColorStop(1, "rgba(255, 154, 26, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 512, 512);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeRingTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const random = seededRandom(8192);
  for (let x = 0; x < canvas.width; x += 1) {
    const t = x / canvas.width;
    const gap = (t > 0.42 && t < 0.48) || (t > 0.73 && t < 0.765);
    const alpha = gap ? 0.05 : 0.28 + random() * 0.36;
    const shade = 150 + Math.floor(random() * 82);
    context.fillStyle = `rgba(${shade}, ${Math.floor(shade * 0.9)}, ${Math.floor(shade * 0.68)}, ${alpha})`;
    context.fillRect(x, 0, 1, canvas.height);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function prepareTexture(texture: THREE.Texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export default function Premium3DScene({ exploreMode = false, onExploreChange }: Premium3DSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef(exploreMode);
  const onExploreChangeRef = useRef(onExploreChange);

  useEffect(() => {
    exploreRef.current = exploreMode;
  }, [exploreMode]);

  useEffect(() => {
    onExploreChangeRef.current = onExploreChange;
  }, [onExploreChange]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.01);
    const textureLoader = new THREE.TextureLoader();

    const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 220);
    camera.position.set(0.8, 5.0, 7.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    const normalPixelRatio = Math.min(window.devicePixelRatio, 1.42);
    const explorePixelRatio = Math.min(window.devicePixelRatio, 1.16);
    let activePixelRatio = normalPixelRatio;
    renderer.setPixelRatio(activePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.dataset.testid = "premium-3d-canvas";
    renderer.domElement.className = "premium-3d-canvas";
    renderer.domElement.style.pointerEvents = "auto";
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x2c3858, 1.55));

    const solarSystem = new THREE.Group();
    solarSystem.position.set(1.9, -0.95, -1.6);
    solarSystem.scale.setScalar(1.02);
    scene.add(solarSystem);

    const orbitMaterials: THREE.Material[] = [];
    const orbitGeometries: THREE.BufferGeometry[] = [];
    const bodyTextures: THREE.Texture[] = [];
    const ringTextures: THREE.Texture[] = [];
    const labelSprites: THREE.Sprite[] = [];
    const bodyMeshes: Array<{ mesh: THREE.Mesh; config: BodyConfig; baseAngle: number; label?: THREE.Sprite; ring?: THREE.Mesh; cloud?: THREE.Mesh; marker: THREE.Line; isMission?: boolean }> = [];
    const planetMeshes: THREE.Mesh[] = [];
    const missionMaterials: THREE.Material[] = [];
    const missionGroup = new THREE.Group();
    solarSystem.add(missionGroup);

    const sunLight = new THREE.PointLight(0xffe56a, 230, 65);
    sunLight.position.set(0, 0.18, 0);
    solarSystem.add(sunLight);

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0xfff15f, toneMapped: false }),
    );
    solarSystem.add(sun);
    textureLoader.load("/textures/planets/sun.jpg", (texture) => {
      prepareTexture(texture);
      bodyTextures.push(texture);
      const material = sun.material as THREE.MeshBasicMaterial;
      material.map = texture;
      material.needsUpdate = true;
    });

    const sunGlowTexture = makeSunGlowTexture();
    const sunGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: sunGlowTexture ?? undefined,
        color: 0xffe55e,
        transparent: true,
        opacity: 0.86,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    sunGlow.scale.set(1.05, 1.05, 1);
    solarSystem.add(sunGlow);

    const sunLabel = makeLabelSprite("SUN", "#f7f8ff", 0.22);
    if (sunLabel) {
      sunLabel.position.set(0.25, 0.28, 0.1);
      solarSystem.add(sunLabel);
      labelSprites.push(sunLabel);
    }

    BODIES.forEach((config) => {
      const orbitGeometry = makeOrbitGeometry(config.orbitX, config.orbitZ, 0.015);
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: config.orbitColor,
        transparent: true,
        opacity: config.name === "EARTH" || config.name === "MARS" ? 0.95 : 0.72,
      });
      const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
      solarSystem.add(orbit);
      orbitGeometries.push(orbitGeometry);
      orbitMaterials.push(orbitMaterial);

      const texture = makeBodyMaps(config);
      if (texture) bodyTextures.push(texture.map, texture.bumpMap);

      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: texture?.map,
        bumpMap: texture?.bumpMap,
        bumpScale: config.name === "EARTH" ? 0.012 : config.name === "JUPITER" || config.name === "SATURN" ? 0.006 : 0.018,
        emissive: config.color,
        emissiveIntensity: 0.15,
        roughness: config.name === "EARTH" ? 0.36 : 0.58,
        metalness: 0.04,
      });

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(config.radius, 64, 64),
        material,
      );
      mesh.position.copy(orbitPoint(config.orbitX, config.orbitZ, config.angle, 0.02));
      mesh.rotation.z = config.tilt ?? 0;
      mesh.userData.bodyName = config.name;
      solarSystem.add(mesh);
      planetMeshes.push(mesh);
      textureLoader.load(config.texture, (loadedTexture) => {
        prepareTexture(loadedTexture);
        bodyTextures.push(loadedTexture);
        material.map = loadedTexture;
        material.needsUpdate = true;
      });

      const markerGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-config.radius * 1.65, 0, 0),
        new THREE.Vector3(config.radius * 1.65, 0, 0),
      ]);
      const marker = new THREE.Line(
        markerGeometry,
        new THREE.LineBasicMaterial({ color: config.orbitColor, transparent: true, opacity: 0.9 }),
      );
      marker.position.copy(mesh.position);
      solarSystem.add(marker);
      orbitGeometries.push(markerGeometry);
      orbitMaterials.push(marker.material);

      let ring: THREE.Mesh | undefined;
      if (config.ring) {
        const ringTexture = makeRingTexture();
        if (ringTexture) ringTextures.push(ringTexture);
        ring = new THREE.Mesh(
          new THREE.RingGeometry(config.radius * 1.38, config.radius * 2.22, 128),
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: ringTexture ?? undefined,
            transparent: true,
            opacity: 0.82,
            side: THREE.DoubleSide,
            depthWrite: false,
          }),
        );
        ring.position.copy(mesh.position);
        ring.rotation.x = Math.PI / 2.35;
        ring.rotation.z = 0.35;
        solarSystem.add(ring);
        textureLoader.load("/textures/planets/saturn-ring.png", (loadedRingTexture) => {
          prepareTexture(loadedRingTexture);
          ringTextures.push(loadedRingTexture);
          const ringMaterial = ring?.material;
          if (ringMaterial instanceof THREE.MeshBasicMaterial) {
            ringMaterial.map = loadedRingTexture;
            ringMaterial.needsUpdate = true;
          }
        });
      }

      let cloud: THREE.Mesh | undefined;
      if (config.name === "EARTH") {
        const cloudMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.38,
          roughness: 0.8,
          metalness: 0,
          depthWrite: false,
        });
        cloud = new THREE.Mesh(new THREE.SphereGeometry(config.radius * 1.018, 64, 64), cloudMaterial);
        cloud.position.copy(mesh.position);
        solarSystem.add(cloud);
        textureLoader.load("/textures/planets/earth-clouds.jpg", (cloudTexture) => {
          prepareTexture(cloudTexture);
          bodyTextures.push(cloudTexture);
          cloudMaterial.map = cloudTexture;
          cloudMaterial.alphaMap = cloudTexture;
          cloudMaterial.needsUpdate = true;
        });
      }

      const label = makeLabelSprite(config.name, "#f7f9ff", config.name.length > 6 ? 0.28 : 0.31);
      if (label) {
        const offset = config.labelOffset ?? [0.14, 0.18, 0.05];
        label.position.set(mesh.position.x + offset[0], mesh.position.y + offset[1], mesh.position.z + offset[2]);
        solarSystem.add(label);
        labelSprites.push(label);
      }

      bodyMeshes.push({ mesh, config, baseAngle: config.angle, label: label ?? undefined, ring, cloud, marker });
    });

    MISSIONS.forEach((mission) => {
      const geometry = makeOrbitGeometry(mission.orbitX, mission.orbitZ, mission.tilt, 420);
      const material = new THREE.LineBasicMaterial({ color: mission.color, transparent: true, opacity: 0.66 });
      const line = new THREE.Line(geometry, material);
      missionGroup.add(line);
      orbitGeometries.push(geometry);
      orbitMaterials.push(material);
      missionMaterials.push(material);

      const point = orbitPoint(mission.orbitX, mission.orbitZ, mission.angle, Math.sin(mission.angle * 2) * mission.tilt);
      const craft = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.035, 0),
        new THREE.MeshBasicMaterial({ color: mission.color, transparent: true, opacity: 0.82 }),
      );
      craft.position.copy(point);
      missionGroup.add(craft);
      missionMaterials.push(craft.material);

      const label = makeLabelSprite(mission.name, "#c2c9d6", 0.18);
      if (label) {
        label.position.set(point.x + 0.1, point.y + 0.13, point.z);
        missionGroup.add(label);
        labelSprites.push(label);
        missionMaterials.push(label.material);
      }

      bodyMeshes.push({ mesh: craft, config: { ...BODIES[0], name: mission.name, speed: 0.08, orbitX: mission.orbitX, orbitZ: mission.orbitZ, angle: mission.angle, radius: 0.035, color: mission.color, orbitColor: mission.color }, baseAngle: mission.angle, label: label ?? undefined, marker: new THREE.Line(), isMission: true });
    });

    const starCount = 6200;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starColor = new THREE.Color();
    for (let i = 0; i < starCount; i += 1) {
      const index = i * 3;
      starPositions[index] = THREE.MathUtils.randFloatSpread(46);
      starPositions[index + 1] = THREE.MathUtils.randFloatSpread(28);
      starPositions[index + 2] = -10 - Math.random() * 70;
      const hue = Math.random() > 0.82 ? 0.12 + Math.random() * 0.02 : 0.58 + Math.random() * 0.12;
      const saturation = Math.random() > 0.75 ? 0.55 : 0.18;
      const lightness = 0.55 + Math.random() * 0.42;
      starColor.setHSL(hue, saturation, lightness);
      starColors[index] = starColor.r;
      starColors[index + 1] = starColor.g;
      starColors[index + 2] = starColor.b;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ size: 0.027, vertexColors: true, transparent: true, opacity: 0.96, depthWrite: false }),
    );
    scene.add(stars);

    const pointer = new THREE.Vector2(0, 0);
    const rayPointer = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    let selectedBody: THREE.Mesh | null = null;
    let hoveredBody: THREE.Mesh | null = null;
    let isDragging = false;
    let dragDistance = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let manualYaw = 0;
    let manualPitch = 0;
    let exploreZoom = 0;
    let exploreZoomTarget = 0;
    let exploreLevel = 0;
    let missionOpacity = 1;
    const cameraTarget = new THREE.Vector3();
    const selectedWorld = new THREE.Vector3();
    const focusTarget = new THREE.Vector3(1.65, -0.2, -1.4);
    const desiredFocusTarget = new THREE.Vector3();

    const updateRayPointer = (event: PointerEvent | MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      rayPointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      rayPointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const getIntersectedPlanet = () => {
      raycaster.setFromCamera(rayPointer, camera);
      const hits = raycaster.intersectObjects(planetMeshes, false);
      return hits[0]?.object instanceof THREE.Mesh ? hits[0].object : null;
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
      updateRayPointer(event);

      if (exploreRef.current && isDragging) {
        const deltaX = event.clientX - lastPointerX;
        const deltaY = event.clientY - lastPointerY;
        dragDistance += Math.abs(deltaX) + Math.abs(deltaY);
        manualYaw += deltaX * 0.004;
        manualPitch = THREE.MathUtils.clamp(manualPitch + deltaY * 0.0025, -0.42, 0.34);
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        return;
      }

      hoveredBody = exploreRef.current ? getIntersectedPlanet() : null;
      renderer.domElement.style.cursor = exploreRef.current ? (hoveredBody ? "pointer" : "grab") : "zoom-in";
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!exploreRef.current) return;
      isDragging = true;
      dragDistance = 0;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      renderer.domElement.style.cursor = "grabbing";
    };

    const onPointerUp = () => {
      isDragging = false;
      renderer.domElement.style.cursor = exploreRef.current ? "grab" : "zoom-in";
    };

    const onCanvasClick = (event: MouseEvent) => {
      updateRayPointer(event);
      if (!exploreRef.current) {
        onExploreChangeRef.current?.(true);
        return;
      }

      if (dragDistance > 6) return;
      const planet = getIntersectedPlanet();
      selectedBody = planet ?? selectedBody;
    };

    const onWheel = (event: WheelEvent) => {
      if (!exploreRef.current) return;
      event.preventDefault();
      exploreZoomTarget = THREE.MathUtils.clamp(exploreZoomTarget + event.deltaY * -0.0007, -0.32, 0.95);
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("click", onCanvasClick);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    let frameId = 0;
    let scrollCurrent = 0;
    const timer = new THREE.Timer();
    timer.connect(document);

    const animate = () => {
      timer.update();
      const elapsed = timer.getElapsed();
      const scrollMax = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollTarget = window.scrollY / scrollMax;
      scrollCurrent += (scrollTarget - scrollCurrent) * 0.065;
      const motionScale = prefersReducedMotion ? 0.1 : 1;
      const isMobile = window.innerWidth < 700;
      exploreLevel += ((exploreRef.current ? 1 : 0) - exploreLevel) * 0.055;
      const targetPixelRatio = exploreLevel > 0.08 ? explorePixelRatio : normalPixelRatio;
      if (Math.abs(targetPixelRatio - activePixelRatio) > 0.02) {
        activePixelRatio = targetPixelRatio;
        renderer.setPixelRatio(activePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      exploreZoom += (exploreZoomTarget - exploreZoom) * 0.095;
      const zoomProgress = THREE.MathUtils.smoothstep(scrollCurrent, 0.02, 0.92);
      const deepZoom = THREE.MathUtils.clamp(THREE.MathUtils.lerp(zoomProgress, 1, exploreLevel) + exploreZoom * exploreLevel, 0, 1.38);

      const nextMissionOpacity = Math.max(0, 1 - exploreLevel * 1.35);
      if (Math.abs(nextMissionOpacity - missionOpacity) > 0.012) {
        missionOpacity = nextMissionOpacity;
        missionMaterials.forEach((material) => {
          material.opacity = missionOpacity;
          material.transparent = true;
        });
      }
      missionGroup.visible = missionOpacity > 0.02;

      bodyMeshes.forEach(({ mesh, config, baseAngle, label, ring, cloud, marker, isMission }, index) => {
        const angle = baseAngle + elapsed * config.speed * 0.035 * motionScale + scrollCurrent * (0.65 + index * 0.025);
        const point = orbitPoint(config.orbitX, config.orbitZ, angle, Math.sin(angle * 2) * 0.012);
        mesh.position.copy(point);
        mesh.rotation.y += 0.012 * motionScale;
        if (!isMission && marker.geometry.attributes.position) {
          marker.position.copy(point);
          marker.scale.setScalar(THREE.MathUtils.lerp(marker.scale.x, mesh === selectedBody ? 2.45 : mesh === hoveredBody ? 1.7 : 1, 0.12));
        }
        if (label && !isMission) {
          const offset = config.labelOffset ?? [0.14, 0.18, 0.05];
          label.position.set(point.x + offset[0], point.y + offset[1], point.z + offset[2]);
          const baseScale = label.userData.baseScale as THREE.Vector3 | undefined;
          const labelZoomScale = THREE.MathUtils.lerp(1, 0.72, exploreLevel * Math.min(deepZoom, 1));
          const labelFactor = labelZoomScale * (mesh === selectedBody ? 0.42 : mesh === hoveredBody ? 1.02 : 1);
          if (baseScale) label.scale.lerp(baseScale.clone().multiplyScalar(labelFactor), 0.1);
          label.material.opacity = THREE.MathUtils.lerp(label.material.opacity, mesh === selectedBody ? 0.28 : 1, 0.1);
        }
        if (!isMission) {
          const explorerBodyScale = 1 + exploreLevel * (0.55 + deepZoom * 0.28);
          const targetBodyScale = explorerBodyScale * (mesh === selectedBody ? 2.1 : mesh === hoveredBody ? 1.42 : 1);
          mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, targetBodyScale, 0.12));
          const material = mesh.material;
          if (material instanceof THREE.MeshStandardMaterial) {
            material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, mesh === selectedBody ? 0.65 : mesh === hoveredBody ? 0.46 : 0.24, 0.12);
          }
        }
        if (ring) {
          ring.position.copy(point);
          ring.rotation.z += 0.003 * motionScale;
          const explorerRingScale = 1 + exploreLevel * (0.45 + deepZoom * 0.2);
          ring.scale.setScalar(THREE.MathUtils.lerp(ring.scale.x, explorerRingScale * (mesh === selectedBody ? 1.45 : mesh === hoveredBody ? 1.18 : 1), 0.12));
        }
        if (cloud) {
          cloud.position.copy(point);
          cloud.rotation.y += 0.014 * motionScale;
          cloud.scale.setScalar(mesh.scale.x);
        }
      });

      sun.rotation.y = elapsed * 0.12 * motionScale;
      sunGlow.material.rotation = elapsed * 0.045 * motionScale;
      sunGlow.scale.setScalar(1.05 + Math.sin(elapsed * 1.2) * 0.05);

      const targetScale = (isMobile ? 0.62 : 0.96) + deepZoom * (isMobile ? 0.7 : 0.95);
      const targetX = isMobile ? 0.38 - deepZoom * 1.16 : 2.28 - deepZoom * 1.95;
      const targetY = isMobile ? -1.32 + deepZoom * 0.42 : -0.95 + deepZoom * 0.62;
      solarSystem.scale.setScalar(THREE.MathUtils.lerp(solarSystem.scale.x, targetScale, 0.05));
      solarSystem.position.x = THREE.MathUtils.lerp(solarSystem.position.x, targetX + pointer.x * 0.1, 0.045);
      solarSystem.position.y = THREE.MathUtils.lerp(solarSystem.position.y, targetY - pointer.y * 0.08, 0.045);
      solarSystem.rotation.x = THREE.MathUtils.lerp(solarSystem.rotation.x, -0.08 - pointer.y * 0.025 + manualPitch * exploreLevel, 0.05);
      solarSystem.rotation.y = THREE.MathUtils.lerp(solarSystem.rotation.y, -0.18 + pointer.x * 0.025 + deepZoom * 0.28 + manualYaw * exploreLevel, 0.05);
      solarSystem.rotation.z = THREE.MathUtils.lerp(solarSystem.rotation.z, -0.03 + deepZoom * 0.08, 0.05);

      stars.rotation.y = elapsed * 0.003 * motionScale + deepZoom * 0.24;
      stars.position.x = deepZoom * -1.15;
      stars.position.z = deepZoom * 1.65;

      if (isMobile) {
        cameraTarget.set(0.95 - deepZoom * 0.72, -0.05 + deepZoom * 0.22, -1.25 + deepZoom * 0.38);
      } else {
        cameraTarget.set(1.65 - deepZoom * 0.92, -0.2 + deepZoom * 0.3, -1.4 + deepZoom * 0.46);
      }
      desiredFocusTarget.copy(cameraTarget);
      if (exploreLevel > 0.05 && selectedBody) {
        selectedBody.getWorldPosition(selectedWorld);
        desiredFocusTarget.lerp(selectedWorld, 0.82 * exploreLevel);
      }
      focusTarget.lerp(desiredFocusTarget, selectedBody ? 0.05 : 0.08);
      const pointerCameraInfluence = selectedBody ? 0.28 : 1;
      camera.position.x += ((isMobile ? 0.1 : 0.78) + pointer.x * 0.18 * pointerCameraInfluence + deepZoom * (isMobile ? 0.25 : 0.62) - camera.position.x) * 0.045;
      camera.position.y += ((isMobile ? 4.25 : 5.0) - pointer.y * 0.14 - deepZoom * (isMobile ? 1.28 : 1.72) - camera.position.y) * 0.045;
      camera.position.z += ((isMobile ? 7.85 : 7.4) - deepZoom * (isMobile ? 3.2 : 3.85) - camera.position.z) * 0.045;
      camera.lookAt(focusTarget);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("click", onCanvasClick);
      renderer.domElement.removeEventListener("wheel", onWheel);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      sun.geometry.dispose();
      (sun.material as THREE.Material).dispose();
      sunGlow.geometry.dispose();
      sunGlow.material.dispose();
      sunGlowTexture?.dispose();
      starGeometry.dispose();
      (stars.material as THREE.Material).dispose();
      orbitGeometries.forEach((geometry) => geometry.dispose());
      orbitMaterials.forEach((material) => material.dispose());
      bodyTextures.forEach((texture) => texture.dispose());
      ringTextures.forEach((texture) => texture.dispose());
      bodyMeshes.forEach(({ mesh, ring, cloud }) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
        if (ring) {
          ring.geometry.dispose();
          (ring.material as THREE.Material).dispose();
        }
        if (cloud) {
          cloud.geometry.dispose();
          (cloud.material as THREE.Material).dispose();
        }
      });
      labelSprites.forEach((sprite) => {
        sprite.material.map?.dispose();
        sprite.material.dispose();
      });
      timer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 overflow-hidden bg-black" />;
}
