"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { artworkById } from "@/data/artworks";

export type ArchiveChapter = "philosophy" | "history" | "art" | "markets";

type MuseumSceneProps = {
  activeChapter: ArchiveChapter;
  scrollProgress: number;
  onChapterChange: (chapter: ArchiveChapter) => void;
  onArtworkSelect: (artworkId: string) => void;
  onReady: () => void;
};

type Exhibit = {
  chapter: ArchiveChapter;
  z: number;
  side: "left" | "right" | "end";
  width: number;
  height: number;
  image?: string;
  texture?: THREE.Texture;
  title: string;
  artworkId?: string;
};

function createSurfaceTexture(size = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const image = context.createImageData(size, size);
  for (let index = 0; index < image.data.length; index += 4) {
    const value = 118 + Math.floor(Math.random() * 34);
    image.data[index] = value;
    image.data[index + 1] = value;
    image.data[index + 2] = value;
    image.data[index + 3] = 255;
  }
  context.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function fitText(context: CanvasRenderingContext2D, text: string, maxWidth: number, startSize: number, weight = 500) {
  let size = startSize;
  do {
    context.font = `${weight} ${size}px Georgia, serif`;
    if (context.measureText(text).width <= maxWidth) break;
    size -= 2;
  } while (size > 28);
}

function createLabelTexture(exhibit: Exhibit) {
  const artwork = exhibit.artworkId ? artworkById[exhibit.artworkId] : undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 1800;
  canvas.height = 300;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.fillStyle = "#d8ccb5";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#826231";
  context.fillRect(0, 0, 18, canvas.height);
  context.fillStyle = "#483326";
  context.fillRect(18, 0, canvas.width - 18, 8);
  context.fillStyle = "#6f5732";
  context.font = "600 27px monospace";
  context.fillText(`ON VIEW / ${(artwork?.room ?? exhibit.chapter).toUpperCase()}`, 72, 48);
  context.fillStyle = "#202a2d";
  fitText(context, artwork?.title ?? exhibit.title, 1650, 68, 600);
  context.fillText(artwork?.title ?? exhibit.title, 72, 116);
  context.fillStyle = "#3c4748";
  context.font = "500 34px Georgia, serif";
  context.fillText(`${artwork?.artist ?? "Personal collection"} · ${artwork?.year ?? ""}`, 72, 161, 1650);
  context.strokeStyle = "rgba(54, 58, 54, 0.24)";
  context.beginPath();
  context.moveTo(72, 188);
  context.lineTo(1728, 188);
  context.stroke();
  context.fillStyle = "#4f5855";
  context.font = "600 21px monospace";
  context.fillText("MEDIUM", 72, 224);
  context.fillText("COLLECTION", 850, 224);
  context.fillStyle = "#293437";
  context.font = "500 26px Georgia, serif";
  context.fillText(artwork?.medium ?? "Open access image", 72, 264, 690);
  context.fillText(artwork?.collection ?? "The personal collection", 850, 264, 878);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function createFrame(
  texture: THREE.Texture,
  exhibit: Exhibit,
  raycastTargets: THREE.Mesh[],
  frameMaterials: THREE.MeshStandardMaterial[],
  createdTextures: THREE.Texture[],
  plaqueSprites: THREE.Sprite[],
) {
  const group = new THREE.Group();
  group.userData.chapter = exhibit.chapter;
  group.userData.baseScale = 1;

  const imageMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.54,
    metalness: 0.02,
    emissive: 0xfff4df,
    emissiveIntensity: 0.045,
  });
  const image = new THREE.Mesh(new THREE.PlaneGeometry(exhibit.width, exhibit.height), imageMaterial);
  image.position.z = 0.09;
  image.userData.chapter = exhibit.chapter;
  image.userData.artworkId = exhibit.artworkId;
  image.userData.frame = group;
  group.add(image);
  raycastTargets.push(image);

  const wood = new THREE.MeshStandardMaterial({ color: 0x332219, roughness: 0.4, metalness: 0.08 });
  const gilt = new THREE.MeshStandardMaterial({
    color: 0xb58a45,
    roughness: 0.23,
    metalness: 0.86,
    emissive: 0x000000,
    emissiveIntensity: 0,
  });
  frameMaterials.push(gilt);

  const outer = 0.2;
  const inner = 0.045;
  const outerPieces: Array<[number, number, number, number, THREE.Material]> = [
    [0, exhibit.height / 2 + outer / 2, exhibit.width + outer * 2, outer, wood],
    [0, -exhibit.height / 2 - outer / 2, exhibit.width + outer * 2, outer, wood],
    [-exhibit.width / 2 - outer / 2, 0, outer, exhibit.height, wood],
    [exhibit.width / 2 + outer / 2, 0, outer, exhibit.height, wood],
    [0, exhibit.height / 2 + 0.02, exhibit.width + 0.08, inner, gilt],
    [0, -exhibit.height / 2 - 0.02, exhibit.width + 0.08, inner, gilt],
    [-exhibit.width / 2 - 0.02, 0, inner, exhibit.height, gilt],
    [exhibit.width / 2 + 0.02, 0, inner, exhibit.height, gilt],
  ];
  outerPieces.forEach(([x, y, width, height, material]) => {
    const piece = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.18), material);
    piece.position.set(x, y, 0);
    piece.castShadow = true;
    group.add(piece);
  });

  const titleTexture = exhibit.artworkId === "rubens-prometheus-bound" ? null : createLabelTexture(exhibit);
  if (titleTexture) {
    createdTextures.push(titleTexture);
    const plaque = new THREE.Sprite(new THREE.SpriteMaterial({ map: titleTexture, depthTest: false, depthWrite: false }));
    plaque.scale.set(3.5, 0.62, 1);
    plaque.position.set(0, -exhibit.height / 2 - 0.9, 0.18);
    plaque.renderOrder = 8;
    group.add(plaque);
    plaqueSprites.push(plaque);
  }
  return group;
}

export default function Premium3DScene({ activeChapter, scrollProgress, onChapterChange, onArtworkSelect, onReady }: MuseumSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(activeChapter);
  const progressRef = useRef(scrollProgress);
  const changeRef = useRef(onChapterChange);
  const artworkSelectRef = useRef(onArtworkSelect);
  const readyRef = useRef(onReady);

  useEffect(() => { activeRef.current = activeChapter; }, [activeChapter]);
  useEffect(() => { progressRef.current = scrollProgress; }, [scrollProgress]);
  useEffect(() => { changeRef.current = onChapterChange; }, [onChapterChange]);
  useEffect(() => { artworkSelectRef.current = onArtworkSelect; }, [onArtworkSelect]);
  useEffect(() => { readyRef.current = onReady; }, [onReady]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa89b87);
    scene.fog = new THREE.FogExp2(0xb3a790, 0.0058);

    const camera = new THREE.PerspectiveCamera(47, 1, 0.1, 150);
    camera.position.set(0, 0.55, 10);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.96;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.className = "archive-canvas";
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.setAttribute(
      "aria-label",
      "Interactive three-dimensional museum corridor featuring paintings connected to Aditya Agrawal's interests and work.",
    );
    mount.appendChild(renderer.domElement);

    const gallery = new THREE.Group();
    scene.add(gallery);

    const createdTextures: THREE.Texture[] = [];
    const wallSurface = createSurfaceTexture();
    const floorSurface = createSurfaceTexture();
    if (wallSurface) {
      wallSurface.repeat.set(3, 18);
      createdTextures.push(wallSurface);
    }
    if (floorSurface) {
      floorSurface.repeat.set(5, 32);
      createdTextures.push(floorSurface);
    }

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xaaa995,
      roughness: 0.82,
      metalness: 0.01,
      bumpMap: wallSurface,
      bumpScale: 0.035,
    });
    const floorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x786b5b,
      roughness: 0.34,
      metalness: 0.03,
      clearcoat: 0.68,
      clearcoatRoughness: 0.3,
      bumpMap: floorSurface,
      bumpScale: 0.018,
    });
    const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xc2b59e, roughness: 0.86 });
    const stoneMaterial = new THREE.MeshStandardMaterial({ color: 0x827867, roughness: 0.68, metalness: 0.02 });
    const trimMaterial = new THREE.MeshStandardMaterial({ color: 0xc3b59f, roughness: 0.58, metalness: 0.01 });
    const dadoMaterial = new THREE.MeshStandardMaterial({ color: 0x74796f, roughness: 0.84, metalness: 0.01 });
    const walnutMaterial = new THREE.MeshStandardMaterial({ color: 0x302118, roughness: 0.42, metalness: 0.04 });
    const brassMaterial = new THREE.MeshStandardMaterial({ color: 0x8a6a38, roughness: 0.34, metalness: 0.72 });
    const ironMaterial = new THREE.MeshStandardMaterial({ color: 0x42453f, roughness: 0.48, metalness: 0.72 });
    const daylightMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8d0bd,
      emissive: 0xf1d7ad,
      emissiveIntensity: 0.26,
      roughness: 0.22,
    });

    const floor = new THREE.Mesh(new THREE.BoxGeometry(12.4, 0.24, 92), floorMaterial);
    floor.position.set(0, -2.2, -33);
    floor.receiveShadow = true;
    gallery.add(floor);
    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(12.4, 0.2, 92), ceilingMaterial);
    ceiling.position.set(0, 5.24, -33);
    gallery.add(ceiling);
    [-6.08, 6.08].forEach((x) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(0.32, 7.4, 92), wallMaterial);
      wall.position.set(x, 1.5, -33);
      wall.receiveShadow = true;
      gallery.add(wall);
      const dado = new THREE.Mesh(new THREE.BoxGeometry(0.36, 2.7, 92), dadoMaterial);
      dado.position.set(x > 0 ? x - 0.2 : x + 0.2, -0.52, -33);
      gallery.add(dado);
      const baseboard = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.4, 92), stoneMaterial);
      baseboard.position.set(x > 0 ? x - 0.21 : x + 0.21, -1.9, -33);
      gallery.add(baseboard);
      const chairRail = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.11, 92), trimMaterial);
      chairRail.position.set(x > 0 ? x - 0.2 : x + 0.2, 1.68, -33);
      gallery.add(chairRail);
      const cornice = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.34, 92), trimMaterial);
      cornice.position.set(x > 0 ? x - 0.34 : x + 0.34, 4.84, -33);
      gallery.add(cornice);
    });

    for (let z = 1; z >= -70; z -= 12) {
      const skylight = new THREE.Mesh(new THREE.PlaneGeometry(5.9, 7.8), daylightMaterial);
      skylight.rotation.x = Math.PI / 2;
      skylight.position.set(0, 5.12, z - 4.3);
      gallery.add(skylight);
      [-2.95, 0, 2.95].forEach((x) => {
        const skylightBar = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.11, 8), ironMaterial);
        skylightBar.position.set(x, 5.08, z - 4.3);
        gallery.add(skylightBar);
      });
      for (let offset = -3.7; offset <= 3.7; offset += 1.85) {
        const crossbar = new THREE.Mesh(new THREE.BoxGeometry(6.05, 0.11, 0.07), ironMaterial);
        crossbar.position.set(0, 5.08, z - 4.3 + offset);
        gallery.add(crossbar);
      }
      const skyLight = new THREE.RectAreaLight(0xffdfb6, 2.15, 6, 7.5);
      skyLight.position.set(0, 4.9, z - 4.3);
      skyLight.lookAt(0, -2, z - 4.3);
      scene.add(skyLight);

      [-5.88, 5.88].forEach((x) => {
        const window = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.45), daylightMaterial);
        window.rotation.y = x > 0 ? -Math.PI / 2 : Math.PI / 2;
        window.position.set(x, 2.9, z - 4.3);
        gallery.add(window);
        [-1.65, 0, 1.65].forEach((offset) => {
          const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.55, 0.08), walnutMaterial);
          mullion.position.set(x > 0 ? x - 0.03 : x + 0.03, 2.9, z - 4.3 + offset);
          gallery.add(mullion);
        });
      });

      const bench = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.18, 0.72), walnutMaterial);
      bench.position.set(z % 24 === 1 ? -2.25 : 2.25, -1.25, z - 2.8);
      bench.castShadow = true;
      gallery.add(bench);
      [-0.95, 0.95].forEach((offset) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.72, 0.54), brassMaterial);
        leg.position.set(bench.position.x + offset, -1.63, bench.position.z);
        leg.castShadow = true;
        gallery.add(leg);
      });
    }

    scene.add(new THREE.HemisphereLight(0xe2d8c2, 0x554b3f, 0.82));
    const sun = new THREE.DirectionalLight(0xffd6a0, 1.72);
    sun.position.set(-8, 13, 9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -10;
    sun.shadow.camera.right = 10;
    sun.shadow.camera.top = 10;
    sun.shadow.camera.bottom = -10;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xaeb9b4, 0.38);
    fill.position.set(9, 7, -18);
    scene.add(fill);

    const loadingManager = new THREE.LoadingManager();
    let readySignalled = false;
    loadingManager.onLoad = () => {
      if (readySignalled) return;
      readySignalled = true;
      window.requestAnimationFrame(() => readyRef.current());
    };
    const textureLoader = new THREE.TextureLoader(loadingManager);

    const exhibits: Exhibit[] = [
      { chapter: "philosophy", artworkId: "rubens-prometheus-bound", z: 6.85, side: "right", width: 2.75, height: 3.18, image: "/archive/rubens-prometheus-bound.webp", title: "Prometheus Bound / Rubens" },
      { chapter: "philosophy", artworkId: "gowy-fall-of-icarus", z: -4.25, side: "right", width: 3.7, height: 4, image: "/archive/gowy-fall-of-icarus.webp", title: "The Fall of Icarus / Gowy" },
      { chapter: "history", artworkId: "leutze-washington", z: -16.15, side: "left", width: 5.45, height: 3.19, image: "/archive/washington.webp", title: "Washington Crossing the Delaware / Leutze" },
      { chapter: "art", artworkId: "david-cupid-psyche", z: -28.15, side: "right", width: 4.75, height: 3.6, image: "/archive/david-cupid-psyche.webp", title: "Love and Psyche / David" },
      { chapter: "markets", artworkId: "david-telemachus-eucharis", z: -40.15, side: "left", width: 4.75, height: 4.05, image: "/archive/david-telemachus-eucharis.webp", title: "The Farewell of Telemachus and Eucharis / David" },
      { chapter: "history", artworkId: "pierre-harmonia", z: -52.15, side: "right", width: 3.35, height: 4.41, image: "/archive/harmonia.webp", title: "The Death of Harmonia / Pierre" },
      { chapter: "philosophy", artworkId: "retzsch-chess-players", z: -61.8, side: "left", width: 4.7, height: 3.71, image: "/archive/retzsch-chess-players.webp", title: "The Chess Players / Retzsch" },
      { chapter: "art", artworkId: "leonardo-last-supper", z: -75.01, side: "end", width: 6.5, height: 3.41, image: "/archive/leonardo-last-supper.webp", title: "The Last Supper / Leonardo" },
    ];

    const raycastTargets: THREE.Mesh[] = [];
    const frames: THREE.Group[] = [];
    const plaqueSprites: THREE.Sprite[] = [];
    const frameMaterials: THREE.MeshStandardMaterial[] = [];
    exhibits.forEach((exhibit, index) => {
      const texture = exhibit.texture ?? textureLoader.load(exhibit.image ?? "", (loaded) => {
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.anisotropy = renderer.capabilities.getMaxAnisotropy();
      });
      if (!createdTextures.includes(texture)) createdTextures.push(texture);
      const frame = createFrame(texture, exhibit, raycastTargets, frameMaterials, createdTextures, plaqueSprites);
      const side = exhibit.side === "right" ? 1 : exhibit.side === "left" ? -1 : 0;
      frame.position.set(side * 5.74, 1.34 + Math.sin(index * 2.17) * 0.025, exhibit.z);
      frame.rotation.y = side * -Math.PI / 2;
      frame.rotation.z = Math.sin(index * 1.73) * 0.0032;
      gallery.add(frame);
      const plaque = plaqueSprites[plaqueSprites.length - 1];
      if (plaque?.parent === frame) {
        gallery.attach(plaque);
        // Camera-facing labels need a slight outward offset to sit visually
        // beneath paintings mounted on the corridor's side walls.
        if (side > 0) plaque.position.x = 6.05;
        if (side < 0) plaque.position.x = -6.82;
        else plaque.position.z = exhibit.z + 0.48;
      }
      frames.push(frame);

      const spot = new THREE.SpotLight(index % 2 ? 0xffcf91 : 0xffc47b, (exhibit.artworkId ? 70 : 42) + (index % 3) * 2.5, 15, Math.PI / 5.2, 0.7, 1.55);
      spot.position.set(side * 4.25, 4.3, exhibit.z + (exhibit.side === "end" ? 4.2 : 1.25));
      spot.target.position.set(side * 5.6, 1.15, exhibit.z);
      spot.castShadow = false;
      scene.add(spot, spot.target);
    });

    const endWall = new THREE.Mesh(new THREE.BoxGeometry(12.3, 7.4, 0.3), wallMaterial);
    endWall.position.set(0, 1.5, -75.2);
    gallery.add(endWall);

    const dustGeometry = new THREE.BufferGeometry();
    const dustCount = window.innerWidth < 760 ? 150 : 360;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let index = 0; index < dustCount; index += 1) {
      dustPositions[index * 3] = (Math.random() - 0.5) * 9;
      dustPositions[index * 3 + 1] = Math.random() * 4.8 - 1.8;
      dustPositions[index * 3 + 2] = 8 - Math.random() * 78;
    }
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dust = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({ color: 0xd8c8a2, size: 0.018, transparent: true, opacity: 0.34, depthWrite: false }),
    );
    gallery.add(dust);

    const pointer = new THREE.Vector2(0, 0);
    const smoothPointer = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    let hovered: THREE.Mesh | null = null;
    let pointerCursorVisible = false;
    let styledChapter: ArchiveChapter | null = null;
    let animationFrame = 0;
    let visible = !document.hidden;

    const updatePointer = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    };
    const clearPointer = () => pointer.set(4, 4);
    const selectExhibit = (event: PointerEvent) => {
      updatePointer(event);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(raycastTargets, false)[0];
      const chapter = hit?.object.userData.chapter as ArchiveChapter | undefined;
      const artworkId = hit?.object.userData.artworkId as string | undefined;
      if (artworkId) artworkSelectRef.current(artworkId);
      else if (chapter) changeRef.current(chapter);
    };
    renderer.domElement.addEventListener("pointermove", updatePointer, { passive: true });
    renderer.domElement.addEventListener("pointerleave", clearPointer, { passive: true });
    renderer.domElement.addEventListener("pointerup", selectExhibit);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      const mobile = width < 760;
      camera.aspect = width / Math.max(height, 1);
      camera.fov = mobile ? 67 : 47;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.08 : 1.35));
      renderer.setSize(width, height, false);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    const onVisibility = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);

    const timer = new THREE.Timer();
    timer.connect(document);
    const targetScale = new THREE.Vector3();
    const lookTarget = new THREE.Vector3(4.6, 0.9, 6.85);
    const desiredLookTarget = new THREE.Vector3();
    const roomSides = [1, 1, -1, 1, -1, 1, -1, 0];
    const roomCameraZ = [10, 2, -10, -22, -34, -46, -56, -67.2];
    const roomLookZ = [6.85, -4.25, -16.15, -28.15, -40.15, -52.15, -61.8, -75.01];
    const animate = (timestamp = performance.now()) => {
      animationFrame = window.requestAnimationFrame(animate);
      if (!visible) return;
      timer.update(timestamp);
      const delta = Math.min(timer.getDelta(), 0.04);
      const progress = THREE.MathUtils.clamp(progressRef.current, 0, 1);
      const mobile = window.innerWidth < 760;
      const roomPosition = progress * (roomCameraZ.length - 1);
      const roomIndex = Math.min(roomCameraZ.length - 2, Math.floor(roomPosition));
      const rawRoomMix = roomPosition - roomIndex;
      const hold = 0.16;
      const movingMix = THREE.MathUtils.clamp((rawRoomMix - hold) / (1 - hold * 2), 0, 1);
      const roomMix = movingMix * movingMix * (3 - 2 * movingMix);
      const exhibitSide = THREE.MathUtils.lerp(roomSides[roomIndex], roomSides[roomIndex + 1], roomMix);
      const targetZ = THREE.MathUtils.lerp(roomCameraZ[roomIndex], roomCameraZ[roomIndex + 1], roomMix);
      const targetLookZ = THREE.MathUtils.lerp(roomLookZ[roomIndex], roomLookZ[roomIndex + 1], roomMix);

      smoothPointer.lerp(pointer, reducedMotion ? 1 : 0.075);
      camera.position.x = THREE.MathUtils.damp(camera.position.x, smoothPointer.x * 0.14, 5.4, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, (mobile ? 0.28 : 0.38) + smoothPointer.y * 0.09, 5.4, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, reducedMotion ? 16 : 5.8, delta);
      desiredLookTarget.set(exhibitSide * (mobile ? 4.7 : 4.6), mobile ? 0.82 : 0.92, targetLookZ);
      lookTarget.x = THREE.MathUtils.damp(lookTarget.x, desiredLookTarget.x, reducedMotion ? 16 : 5.2, delta);
      lookTarget.y = THREE.MathUtils.damp(lookTarget.y, desiredLookTarget.y, reducedMotion ? 16 : 5.2, delta);
      lookTarget.z = THREE.MathUtils.damp(lookTarget.z, desiredLookTarget.z, reducedMotion ? 16 : 5.2, delta);
      camera.lookAt(lookTarget);
      raycaster.setFromCamera(smoothPointer, camera);
      const hit = raycaster.intersectObjects(raycastTargets, false)[0];
      hovered = hit?.object instanceof THREE.Mesh ? hit.object : null;
      const nextPointerCursorVisible = Boolean(hovered);
      if (nextPointerCursorVisible !== pointerCursorVisible) {
        renderer.domElement.style.cursor = nextPointerCursorVisible ? "pointer" : "default";
        pointerCursorVisible = nextPointerCursorVisible;
      }
      frames.forEach((frame) => {
        const chapter = frame.userData.chapter as ArchiveChapter;
        const isHovered = hovered?.userData.frame === frame;
        const scale = isHovered ? 1.035 : chapter === activeRef.current ? 1.012 : 1;
        targetScale.setScalar(scale);
        frame.scale.lerp(targetScale, reducedMotion ? 1 : 0.08);
      });
      if (styledChapter !== activeRef.current) {
        frameMaterials.forEach((material) => {
          material.emissive.set(activeRef.current === "art" ? 0x1c1207 : 0x000000);
          material.emissiveIntensity = activeRef.current === "art" ? 0.18 : 0;
        });
        styledChapter = activeRef.current;
      }

      if (!reducedMotion) dust.position.y = Math.sin(timestamp * 0.00018) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.domElement.removeEventListener("pointermove", updatePointer);
      renderer.domElement.removeEventListener("pointerleave", clearPointer);
      renderer.domElement.removeEventListener("pointerup", selectExhibit);
      timer.dispose();
      createdTextures.forEach((texture) => texture.dispose());
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
        if (object instanceof THREE.Sprite) object.material.dispose();
      });
      dustGeometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="archive-scene" />;
}
