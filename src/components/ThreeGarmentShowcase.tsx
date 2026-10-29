import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Eye, RotateCcw, Sparkles, ChevronDown, ChevronUp, Layers, Palette } from 'lucide-react';

interface ThreeGarmentShowcaseProps {
  onClose?: () => void;
  initialGarmentTitle?: string;
}

export const ThreeGarmentShowcase: React.FC<ThreeGarmentShowcaseProps> = ({
  onClose,
  initialGarmentTitle = 'Vintage Denim Jacket',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [activeColorway, setActiveColorway] = useState<'indigo' | 'washedBlack' | 'khaki' | 'olive'>('indigo');
  const [wearLevel, setWearLevel] = useState<'fresh' | 'mediumFade' | 'heavyDistress'>('mediumFade');
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraView, setCameraView] = useState<'front' | 'threeQuarter' | 'detail' | 'full'>('threeQuarter');

  // Mutable refs to communicate cleanly with Three.js render loop without re-instantiating scene
  const colorwayRef = useRef(activeColorway);
  const wearLevelRef = useRef(wearLevel);
  const autoRotateRef = useRef(autoRotate);
  const targetCameraPosRef = useRef(new THREE.Vector3(0, 0.4, 3.8));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const denimMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    colorwayRef.current = activeColorway;
    if (denimMaterialRef.current) {
      const colors = {
        indigo: 0x243a5e,
        washedBlack: 0x2d2e30,
        khaki: 0x7c735a,
        olive: 0x3d4b3b,
      };
      denimMaterialRef.current.color.setHex(colors[activeColorway]);
    }
  }, [activeColorway]);

  useEffect(() => {
    wearLevelRef.current = wearLevel;
    if (denimMaterialRef.current) {
      if (wearLevel === 'fresh') {
        denimMaterialRef.current.roughness = 0.8;
      } else if (wearLevel === 'mediumFade') {
        denimMaterialRef.current.roughness = 0.88;
      } else {
        denimMaterialRef.current.roughness = 0.95;
      }
    }
  }, [wearLevel]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    if (cameraView === 'front') {
      targetCameraPosRef.current.set(0, 0.1, 3.6);
      targetLookAtRef.current.set(0, 0, 0);
    } else if (cameraView === 'threeQuarter') {
      targetCameraPosRef.current.set(1.8, 0.5, 3.2);
      targetLookAtRef.current.set(0, 0, 0);
    } else if (cameraView === 'detail') {
      targetCameraPosRef.current.set(0.2, 0.65, 1.9);
      targetLookAtRef.current.set(0, 0.5, 0);
    } else if (cameraView === 'full') {
      targetCameraPosRef.current.set(0, 0.2, 4.4);
      targetLookAtRef.current.set(0, -0.1, 0);
    }
  }, [cameraView]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL renderer string
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 550;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5efe6);
    scene.fog = new THREE.Fog(0xf5efe6, 4.5, 12);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(1.8, 0.5, 3.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment map via PMREMGenerator & RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-Point Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.8);
    keyLight.position.set(3, 4, 3.5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 10;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
      const d = 2.2;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
    }
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0xebe2d5, 0x827063, 1.4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    // Procedural Denim Texture generator
    const generateDenimTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;

      // Base weave pattern
      ctx.fillStyle = '#445a7d';
      ctx.fillRect(0, 0, 256, 256);

      // Diagonal twill weave lines
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let i = -256; i < 512; i += 4) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 256, 256);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Micro speckle noise
      for (let i = 0; i < 1500; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)';
        ctx.fillRect(x, y, 1.5, 1.5);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(6, 6);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    };

    const denimTexture = generateDenimTexture();

    // Material Library
    const denimMat = new THREE.MeshStandardMaterial({
      color: 0x243a5e,
      roughness: 0.88,
      metalness: 0.04,
      map: denimTexture,
    });
    denimMaterialRef.current = denimMat;

    const hangerWoodMat = new THREE.MeshStandardMaterial({
      color: 0x6e472a,
      roughness: 0.55,
      metalness: 0.05,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4a72c,
      roughness: 0.28,
      metalness: 0.88,
    });

    const stitchMat = new THREE.MeshStandardMaterial({
      color: 0xc49b4b,
      roughness: 0.9,
      metalness: 0.0,
    });

    // Composite 3D Garment Model Group (11 distinct parts)
    const garmentGroup = new THREE.Group();

    // Part 1: Contoured Wooden Hanger Arms
    const hangerArmGeo = new THREE.CylinderGeometry(0.038, 0.055, 1.48, 16);
    hangerArmGeo.rotateZ(Math.PI / 2);
    const hangerArm = new THREE.Mesh(hangerArmGeo, hangerWoodMat);
    hangerArm.position.set(0, 1.05, 0);
    hangerArm.castShadow = !isSoftwareGl;
    garmentGroup.add(hangerArm);

    // Part 2: Metallic Swivel Hook
    const hookCurve = new THREE.CurvePath<THREE.Vector3>();
    const hookStem = new THREE.LineCurve3(new THREE.Vector3(0, 1.05, 0), new THREE.Vector3(0, 1.25, 0));
    hookCurve.add(hookStem);
    const hookGeo = new THREE.TorusGeometry(0.12, 0.015, 12, 24, Math.PI * 1.3);
    hookGeo.rotateZ(-Math.PI / 2);
    const hook = new THREE.Mesh(hookGeo, brassMat);
    hook.position.set(0.08, 1.34, 0);
    garmentGroup.add(hook);

    // Part 3: Main Denim Jacket Torso Body
    const torsoGeo = new THREE.CylinderGeometry(0.55, 0.48, 1.35, 24, 1, true);
    torsoGeo.scale(1.2, 1.0, 0.55);
    const torso = new THREE.Mesh(torsoGeo, denimMat);
    torso.position.set(0, 0.35, 0);
    torso.castShadow = !isSoftwareGl;
    torso.receiveShadow = !isSoftwareGl;
    garmentGroup.add(torso);

    // Part 4: Folded Point Collar with lapels
    const collarGroup = new THREE.Group();
    const collarLeftGeo = new THREE.BoxGeometry(0.32, 0.16, 0.04);
    collarLeftGeo.rotateZ(0.25);
    collarLeftGeo.rotateY(-0.35);
    const collarLeft = new THREE.Mesh(collarLeftGeo, denimMat);
    collarLeft.position.set(-0.24, 0.96, 0.22);
    collarGroup.add(collarLeft);

    const collarRightGeo = new THREE.BoxGeometry(0.32, 0.16, 0.04);
    collarRightGeo.rotateZ(-0.25);
    collarRightGeo.rotateY(0.35);
    const collarRight = new THREE.Mesh(collarRightGeo, denimMat);
    collarRight.position.set(0.24, 0.96, 0.22);
    collarGroup.add(collarRight);

    // Collar backing band
    const collarBackGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.12, 16, 1, true, -Math.PI / 2, Math.PI);
    collarBackGeo.scale(1.0, 1.0, 0.6);
    const collarBack = new THREE.Mesh(collarBackGeo, denimMat);
    collarBack.position.set(0, 1.02, 0);
    collarGroup.add(collarBack);
    garmentGroup.add(collarGroup);

    // Part 5: Left Flapped Chest Pocket with brass button
    const pocketGeo = new THREE.BoxGeometry(0.22, 0.24, 0.035);
    const leftPocket = new THREE.Mesh(pocketGeo, denimMat);
    leftPocket.position.set(-0.32, 0.56, 0.24);
    leftPocket.rotation.y = -0.15;
    garmentGroup.add(leftPocket);

    const leftFlapGeo = new THREE.BoxGeometry(0.23, 0.08, 0.04);
    const leftFlap = new THREE.Mesh(leftFlapGeo, denimMat);
    leftFlap.position.set(-0.32, 0.68, 0.25);
    leftFlap.rotation.y = -0.15;
    garmentGroup.add(leftFlap);

    const leftPocketButtonGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.015, 12);
    leftPocketButtonGeo.rotateX(Math.PI / 2);
    const leftPocketButton = new THREE.Mesh(leftPocketButtonGeo, brassMat);
    leftPocketButton.position.set(-0.32, 0.67, 0.28);
    garmentGroup.add(leftPocketButton);

    // Part 6: Right Flapped Chest Pocket with brass button
    const rightPocket = new THREE.Mesh(pocketGeo, denimMat);
    rightPocket.position.set(0.32, 0.56, 0.24);
    rightPocket.rotation.y = 0.15;
    garmentGroup.add(rightPocket);

    const rightFlap = new THREE.Mesh(leftFlapGeo, denimMat);
    rightFlap.position.set(0.32, 0.68, 0.25);
    rightFlap.rotation.y = 0.15;
    garmentGroup.add(rightFlap);

    const rightPocketButton = new THREE.Mesh(leftPocketButtonGeo, brassMat);
    rightPocketButton.position.set(0.32, 0.67, 0.28);
    garmentGroup.add(rightPocketButton);

    // Part 7: Vertical Center Placket & 5 Front Brass Rivet Buttons
    const placketGeo = new THREE.BoxGeometry(0.08, 1.25, 0.03);
    const placket = new THREE.Mesh(placketGeo, denimMat);
    placket.position.set(0, 0.35, 0.26);
    garmentGroup.add(placket);

    // Golden decorative contrast stitch strip
    const stitchGeo = new THREE.BoxGeometry(0.008, 1.22, 0.032);
    const stitchL = new THREE.Mesh(stitchGeo, stitchMat);
    stitchL.position.set(-0.035, 0.35, 0.265);
    garmentGroup.add(stitchL);
    const stitchR = new THREE.Mesh(stitchGeo, stitchMat);
    stitchR.position.set(0.035, 0.35, 0.265);
    garmentGroup.add(stitchR);

    // 5 Center Buttons
    const buttonPositionsY = [0.85, 0.65, 0.45, 0.25, 0.05];
    buttonPositionsY.forEach((y) => {
      const btn = new THREE.Mesh(leftPocketButtonGeo, brassMat);
      btn.position.set(0, y, 0.28);
      btn.castShadow = !isSoftwareGl;
      garmentGroup.add(btn);
    });

    // Part 8 & 9: Left and Right Sleeves with stitched cuff bands
    const sleeveLength = 1.05;
    const sleeveGeo = new THREE.CylinderGeometry(0.18, 0.13, sleeveLength, 16);
    const cuffGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.12, 16);

    // Left Sleeve
    const leftSleeveGroup = new THREE.Group();
    const leftSleeveMesh = new THREE.Mesh(sleeveGeo, denimMat);
    leftSleeveMesh.position.set(0, -sleeveLength / 2, 0);
    leftSleeveMesh.castShadow = !isSoftwareGl;
    const leftCuffMesh = new THREE.Mesh(cuffGeo, denimMat);
    leftCuffMesh.position.set(0, -sleeveLength, 0);
    const leftCuffBtn = new THREE.Mesh(leftPocketButtonGeo, brassMat);
    leftCuffBtn.position.set(0.12, -sleeveLength, 0.05);
    leftSleeveGroup.add(leftSleeveMesh, leftCuffMesh, leftCuffBtn);
    leftSleeveGroup.position.set(-0.68, 0.92, 0);
    leftSleeveGroup.rotation.z = 0.24;
    leftSleeveGroup.rotation.x = -0.06;
    garmentGroup.add(leftSleeveGroup);

    // Right Sleeve
    const rightSleeveGroup = new THREE.Group();
    const rightSleeveMesh = new THREE.Mesh(sleeveGeo, denimMat);
    rightSleeveMesh.position.set(0, -sleeveLength / 2, 0);
    rightSleeveMesh.castShadow = !isSoftwareGl;
    const rightCuffMesh = new THREE.Mesh(cuffGeo, denimMat);
    rightCuffMesh.position.set(0, -sleeveLength, 0);
    const rightCuffBtn = new THREE.Mesh(leftPocketButtonGeo, brassMat);
    rightCuffBtn.position.set(-0.12, -sleeveLength, 0.05);
    rightSleeveGroup.add(rightSleeveMesh, rightCuffMesh, rightCuffBtn);
    rightSleeveGroup.position.set(0.68, 0.92, 0);
    rightSleeveGroup.rotation.z = -0.24;
    rightSleeveGroup.rotation.x = -0.06;
    garmentGroup.add(rightSleeveGroup);

    // Part 10: Lower Waist Hem Band with waistband adjusters
    const waistGeo = new THREE.CylinderGeometry(0.485, 0.49, 0.14, 24, 1, true);
    waistGeo.scale(1.22, 1.0, 0.56);
    const waistband = new THREE.Mesh(waistGeo, denimMat);
    waistband.position.set(0, -0.32, 0);
    garmentGroup.add(waistband);

    // Part 11: Ground Contact Radial Shadow Disk
    const shadowGeo = new THREE.PlaneGeometry(2.4, 1.4);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
    grad.addColorStop(0, 'rgba(40, 30, 25, 0.35)');
    grad.addColorStop(0.5, 'rgba(40, 30, 25, 0.15)');
    grad.addColorStop(1, 'rgba(40, 30, 25, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
    groundShadow.position.set(0, -1.18, 0);
    scene.add(groundShadow);

    // Position garment group
    garmentGroup.position.set(0, -0.05, 0);
    scene.add(garmentGroup);

    // Mouse drag interaction for rotating garment
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      rotationVelocityY = deltaX * 0.008;
      rotationVelocityX = deltaY * 0.005;

      garmentGroup.rotation.y += rotationVelocityY;
      garmentGroup.rotation.x = Math.max(-0.35, Math.min(0.35, garmentGroup.rotation.x + rotationVelocityX));

      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    dom.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    dom.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with smooth exponential damping and software GL safety
    let animId = 0;
    let lastTime = performance.now();

    const currentLookAt = new THREE.Vector3(0, 0, 0);

    function tick() {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Auto-rotation when not interacting
      if (autoRotateRef.current && !isDragging) {
        garmentGroup.rotation.y += 0.007;
      }

      // Inertia decay
      if (!isDragging) {
        rotationVelocityX *= 0.92;
        rotationVelocityY *= 0.92;
        garmentGroup.rotation.y += rotationVelocityY;
        garmentGroup.rotation.x = Math.max(-0.35, Math.min(0.35, garmentGroup.rotation.x + rotationVelocityX));
      }

      // Smooth camera interpolation towards target viewpoint
      const dampFactor = 1 - Math.exp(-6 * dt);
      camera.position.lerp(targetCameraPosRef.current, dampFactor);
      currentLookAt.lerp(targetLookAtRef.current, dampFactor);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        // Safe paced callback for software WebGL
        animId = window.setTimeout(tick, 80);
      } else {
        animId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      if (isSoftwareGl) {
        clearTimeout(animId);
      } else {
        cancelAnimationFrame(animId);
      }
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onPointerDown);
      dom.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      dom.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      renderer.dispose();
      denimTexture.dispose();
      shadowTex.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#A99B91]/30 bg-[#F5EFE6] shadow-xl">
      {/* Top Header Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#201C1C]/90 text-[#F8F3EB] px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide shadow-md">
        <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
        <span>3D Studio Inspection: {initialGarmentTitle}</span>
        <span className="hidden sm:inline text-[#A99B91]">| Drag to Rotate</span>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-[#201C1C]/80 hover:bg-[#201C1C] text-[#F8F3EB] px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer"
        >
          Exit Studio
        </button>
      )}

      {/* WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-[460px] md:h-[540px] cursor-grab active:cursor-grabbing select-none"
      />

      {/* Ergonomic Unified Bottom Control Dock */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[840px] transition-all duration-300 ${
          isDockCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
        }`}
      >
        {/* Toggle Collapse/Expand Button */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#201C1C] text-[#F8F3EB] text-xs font-medium rounded-t-lg shadow-md border-t border-x border-[#A99B91]/30 hover:bg-[#75192F] transition cursor-pointer"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-[#D4A72C]" />
                <span>Show Studio Dock</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-[#D4A72C]" />
                <span>Hide Studio Dock</span>
              </>
            )}
          </button>
        </div>

        {/* Dock Surface (Solid/rgba surfaces, no backdrop-filter over WebGL) */}
        <div className="bg-[#201C1C]/95 text-[#F8F3EB] p-3.5 md:p-4 rounded-xl shadow-2xl border border-[#A99B91]/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs items-center">
            {/* Colorway Switcher */}
            <div>
              <div className="flex items-center gap-1.5 text-[#A99B91] font-medium mb-1.5">
                <Palette className="w-3.5 h-3.5 text-[#D4A72C]" />
                <span>Thrift Colorway</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveColorway('indigo')}
                  title="Classic Indigo"
                  className={`w-6 h-6 rounded-full bg-[#243a5e] border-2 transition ${
                    activeColorway === 'indigo' ? 'border-[#D4A72C] scale-110' : 'border-transparent opacity-75'
                  }`}
                />
                <button
                  onClick={() => setActiveColorway('washedBlack')}
                  title="Washed Black"
                  className={`w-6 h-6 rounded-full bg-[#2d2e30] border-2 transition ${
                    activeColorway === 'washedBlack' ? 'border-[#D4A72C] scale-110' : 'border-transparent opacity-75'
                  }`}
                />
                <button
                  onClick={() => setActiveColorway('khaki')}
                  title="Vintage Khaki"
                  className={`w-6 h-6 rounded-full bg-[#7c735a] border-2 transition ${
                    activeColorway === 'khaki' ? 'border-[#D4A72C] scale-110' : 'border-transparent opacity-75'
                  }`}
                />
                <button
                  onClick={() => setActiveColorway('olive')}
                  title="Army Olive"
                  className={`w-6 h-6 rounded-full bg-[#3d4b3b] border-2 transition ${
                    activeColorway === 'olive' ? 'border-[#D4A72C] scale-110' : 'border-transparent opacity-75'
                  }`}
                />
              </div>
            </div>

            {/* Vintage Patina / Fade */}
            <div>
              <div className="flex items-center gap-1.5 text-[#A99B91] font-medium mb-1.5">
                <Layers className="w-3.5 h-3.5 text-[#D4A72C]" />
                <span>Vintage Wash</span>
              </div>
              <div className="flex gap-1">
                {(['fresh', 'mediumFade', 'heavyDistress'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setWearLevel(level)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                      wearLevel === level
                        ? 'bg-[#75192F] text-[#F8F3EB] shadow-sm'
                        : 'bg-[#2a2424] text-[#A99B91] hover:text-[#F8F3EB]'
                    }`}
                  >
                    {level === 'fresh' ? 'Crisp' : level === 'mediumFade' ? 'Medium' : 'Worn'}
                  </button>
                ))}
              </div>
            </div>

            {/* Camera Viewpoints */}
            <div>
              <div className="flex items-center gap-1.5 text-[#A99B91] font-medium mb-1.5">
                <Eye className="w-3.5 h-3.5 text-[#D4A72C]" />
                <span>Camera View</span>
              </div>
              <div className="flex gap-1">
                {(['front', 'threeQuarter', 'detail', 'full'] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => setCameraView(view)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                      cameraView === view
                        ? 'bg-[#D4A72C] text-[#201C1C] font-semibold'
                        : 'bg-[#2a2424] text-[#A99B91] hover:text-[#F8F3EB]'
                    }`}
                  >
                    {view === 'front' ? 'Front' : view === 'threeQuarter' ? '3/4' : view === 'detail' ? 'Lapel' : 'Full'}
                  </button>
                ))}
              </div>
            </div>

            {/* Turntable Auto-Rotate Toggle */}
            <div className="flex items-center justify-end md:justify-start gap-2 pt-1 md:pt-0">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition cursor-pointer border ${
                  autoRotate
                    ? 'border-[#75192F] bg-[#75192F]/40 text-[#F8F3EB]'
                    : 'border-[#A99B91]/30 bg-[#2a2424] text-[#A99B91]'
                }`}
              >
                <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'text-[#D4A72C]' : ''}`} />
                <span>{autoRotate ? '360° Rotating' : 'Rotate Paused'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
