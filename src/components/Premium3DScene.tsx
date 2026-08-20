"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type ArchiveChapter = "philosophy" | "history" | "art" | "markets";

type MuseumSceneProps = {
  activeChapter: ArchiveChapter;
  scrollProgress: number;
  onChapterChange: (chapter: ArchiveChapter) => void;
  onArtworkSelect: (artworkId: string) => void;
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

function createLabelTexture(title: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 240;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.fillStyle = "#cfc2aa";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#9b7132";
  context.fillRect(0, 0, 13, canvas.height);
  context.fillStyle = "#263137";
  context.font = "500 48px Georgia, serif";
  context.fillText(title, 62, 105, 1070);
  context.fillStyle = "rgba(38, 49, 55, 0.62)";
  context.font = "500 25px monospace";
  context.fillText("THE PERSONAL COLLECTION / OPEN ACCESS", 62, 177);
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
) {
  const group = new THREE.Group();
  group.userData.chapter = exhibit.chapter;
  group.userData.baseScale = 1;

  const imageMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.68,
    metalness: 0.02,
    emissive: 0xffffff,
    emissiveIntensity: 0.025,
  });
  const image = new THREE.Mesh(new THREE.PlaneGeometry(exhibit.width, exhibit.height), imageMaterial);
  image.position.z = 0.09;
  image.userData.chapter = exhibit.chapter;
  image.userData.artworkId = exhibit.artworkId;
  image.userData.frame = group;
  group.add(image);
  raycastTargets.push(image);

  const wood = new THREE.MeshStandardMaterial({ color: 0x3f291d, roughness: 0.48, metalness: 0.08 });
  const gilt = new THREE.MeshStandardMaterial({
    color: 0xb68a42,
    roughness: 0.27,
    metalness: 0.82,
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

  const titleTexture = createLabelTexture(exhibit.title);
  if (titleTexture) {
    createdTextures.push(titleTexture);
    const plaque = new THREE.Mesh(
      new THREE.PlaneGeometry(Math.min(exhibit.width, 2.25), 0.45),
      new THREE.MeshBasicMaterial({ map: titleTexture }),
    );
    plaque.position.set(0, -exhibit.height / 2 - 0.5, 0.1);
    group.add(plaque);
  }
  return group;
}

export default function Premium3DScene({ activeChapter, scrollProgress, onChapterChange, onArtworkSelect }: MuseumSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(activeChapter);
  const progressRef = useRef(scrollProgress);
  const changeRef = useRef(onChapterChange);
  const artworkSelectRef = useRef(onArtworkSelect);

  useEffect(() => { activeRef.current = activeChapter; }, [activeChapter]);
  useEffect(() => { progressRef.current = scrollProgress; }, [scrollProgress]);
  useEffect(() => { changeRef.current = onChapterChange; }, [onChapterChange]);
  useEffect(() => { artworkSelectRef.current = onArtworkSelect; }, [onArtworkSelect]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb8ae9d);
    scene.fog = new THREE.FogExp2(0xbcb19e, 0.0065);

    const camera = new THREE.PerspectiveCamera(47, 1, 0.1, 150);
    camera.position.set(0, 0.55, 10);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.88;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.className = "archive-canvas";
    mount.appendChild(renderer.domElement);

    const gallery = new THREE.Group();
    scene.add(gallery);

    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xa9aa9b, roughness: 0.88, metalness: 0.01 });
    const floorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x9b9282,
      roughness: 0.3,
      metalness: 0.03,
      clearcoat: 0.58,
      clearcoatRoughness: 0.22,
    });
    const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xbeb19d, roughness: 0.9 });
    const stoneMaterial = new THREE.MeshStandardMaterial({ color: 0x918675, roughness: 0.7, metalness: 0.02 });
    const trimMaterial = new THREE.MeshStandardMaterial({ color: 0xc5b7a2, roughness: 0.62, metalness: 0.01 });
    const dadoMaterial = new THREE.MeshStandardMaterial({ color: 0x7f847a, roughness: 0.9, metalness: 0.01 });
    const walnutMaterial = new THREE.MeshStandardMaterial({ color: 0x38271e, roughness: 0.5, metalness: 0.04 });
    const brassMaterial = new THREE.MeshStandardMaterial({ color: 0x76613f, roughness: 0.4, metalness: 0.68 });
    const ironMaterial = new THREE.MeshStandardMaterial({ color: 0x42453f, roughness: 0.48, metalness: 0.72 });
    const daylightMaterial = new THREE.MeshStandardMaterial({
      color: 0xd5d0c2,
      emissive: 0xe4d7bf,
      emissiveIntensity: 0.2,
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
      const skyLight = new THREE.RectAreaLight(0xffe4bd, 2.6, 6, 7.5);
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

    scene.add(new THREE.HemisphereLight(0xd8d3c6, 0x655c4e, 0.92));
    const sun = new THREE.DirectionalLight(0xffdbad, 1.55);
    sun.position.set(-8, 13, 9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -10;
    sun.shadow.camera.right = 10;
    sun.shadow.camera.top = 10;
    sun.shadow.camera.bottom = -10;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xaeb9b4, 0.46);
    fill.position.set(9, 7, -18);
    scene.add(fill);

    const createdTextures: THREE.Texture[] = [];
    const textureLoader = new THREE.TextureLoader();

    const exhibits: Exhibit[] = [
      { chapter: "philosophy", artworkId: "rembrandt-self-portrait", z: 6.85, side: "right", width: 2.75, height: 3.34, image: "/archive/rembrandt.jpg", title: "Self-Portrait / Rembrandt" },
      { chapter: "philosophy", artworkId: "friedrich-moon", z: -4.25, side: "right", width: 4.35, height: 3.52, image: "/archive/friedrich.jpg", title: "Two Men Contemplating the Moon / Friedrich" },
      { chapter: "history", artworkId: "leutze-washington", z: -16.15, side: "left", width: 5.45, height: 3.19, image: "/archive/washington.jpg", title: "Washington Crossing the Delaware / Leutze" },
      { chapter: "art", artworkId: "van-gogh-cypresses", z: -28.15, side: "right", width: 4.75, height: 3.78, image: "/archive/van-gogh.jpg", title: "Wheat Field with Cypresses / Van Gogh" },
      { chapter: "markets", artworkId: "turner-venice", z: -40.15, side: "left", width: 5, height: 3.73, image: "/archive/turner.jpg", title: "Venice from the Salute / Turner" },
      { chapter: "history", artworkId: "pierre-harmonia", z: -52.15, side: "right", width: 3.35, height: 4.41, image: "/archive/harmonia.jpg", title: "The Death of Harmonia / Pierre" },
      { chapter: "philosophy", artworkId: "vermeer-lute", z: -61.8, side: "left", width: 3.55, height: 4.08, image: "/archive/vermeer.jpg", title: "Young Woman with a Lute / Vermeer" },
      { chapter: "art", artworkId: "turner-whalers", z: -75.01, side: "end", width: 4.8, height: 3.6, image: "/archive/whalers.jpg", title: "Whalers / Turner" },
    ];

    const raycastTargets: THREE.Mesh[] = [];
    const frames: THREE.Group[] = [];
    const frameMaterials: THREE.MeshStandardMaterial[] = [];
    exhibits.forEach((exhibit) => {
      const texture = exhibit.texture ?? textureLoader.load(exhibit.image ?? "", (loaded) => {
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.anisotropy = renderer.capabilities.getMaxAnisotropy();
      });
      if (!createdTextures.includes(texture)) createdTextures.push(texture);
      const frame = createFrame(texture, exhibit, raycastTargets, frameMaterials, createdTextures);
      const side = exhibit.side === "right" ? 1 : exhibit.side === "left" ? -1 : 0;
      frame.position.set(side * 5.74, 0.55, exhibit.z);
      frame.rotation.y = side * -Math.PI / 2;
      gallery.add(frame);
      frames.push(frame);

      const spot = new THREE.SpotLight(0xffd79b, exhibit.artworkId ? 66 : 38, 15, Math.PI / 4.6, 0.62, 1.45);
      spot.position.set(side * 4.35, 4.2, exhibit.z + (exhibit.side === "end" ? 4.2 : 1.4));
      spot.target.position.set(side * 5.6, 0.5, exhibit.z);
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
    const lookTarget = new THREE.Vector3(4.6, 0.4, 6.85);
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
      const roomMix = roomPosition - roomIndex;
      const exhibitSide = THREE.MathUtils.lerp(roomSides[roomIndex], roomSides[roomIndex + 1], roomMix);
      const targetZ = THREE.MathUtils.lerp(roomCameraZ[roomIndex], roomCameraZ[roomIndex + 1], roomMix);
      const targetLookZ = THREE.MathUtils.lerp(roomLookZ[roomIndex], roomLookZ[roomIndex + 1], roomMix);

      smoothPointer.lerp(pointer, reducedMotion ? 1 : 0.075);
      camera.position.x = THREE.MathUtils.damp(camera.position.x, smoothPointer.x * 0.14, 5.4, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, (mobile ? 0.28 : 0.38) + smoothPointer.y * 0.09, 5.4, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, reducedMotion ? 16 : 5.8, delta);
      desiredLookTarget.set(exhibitSide * (mobile ? 4.8 : 4.6), mobile ? 0.42 : 0.5, targetLookZ);
      lookTarget.x = THREE.MathUtils.damp(lookTarget.x, desiredLookTarget.x, reducedMotion ? 16 : 5.2, delta);
      lookTarget.y = THREE.MathUtils.damp(lookTarget.y, desiredLookTarget.y, reducedMotion ? 16 : 5.2, delta);
      lookTarget.z = THREE.MathUtils.damp(lookTarget.z, desiredLookTarget.z, reducedMotion ? 16 : 5.2, delta);
      camera.lookAt(lookTarget);

      raycaster.setFromCamera(smoothPointer, camera);
      const hit = raycaster.intersectObjects(raycastTargets, false)[0];
      hovered = hit?.object instanceof THREE.Mesh ? hit.object : null;
      renderer.domElement.style.cursor = hovered ? "pointer" : "default";
      frames.forEach((frame) => {
        const chapter = frame.userData.chapter as ArchiveChapter;
        const isHovered = hovered?.userData.frame === frame;
        const scale = isHovered ? 1.035 : chapter === activeRef.current ? 1.012 : 1;
        targetScale.setScalar(scale);
        frame.scale.lerp(targetScale, reducedMotion ? 1 : 0.08);
      });
      frameMaterials.forEach((material) => {
        material.emissive.set(activeRef.current === "art" ? 0x1c1207 : 0x000000);
        material.emissiveIntensity = activeRef.current === "art" ? 0.18 : 0;
      });

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
      });
      dustGeometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="archive-scene" aria-hidden="true" />;
}
