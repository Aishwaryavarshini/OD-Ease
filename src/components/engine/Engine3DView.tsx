import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useTelemetry } from '../../context/TelemetryContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Maximize2, 
  RotateCcw, 
  Play, 
  Pause, 
  Layers, 
  Eye, 
  Activity, 
  Compass, 
  Box, 
  Sliders, 
  ZoomIn, 
  ZoomOut,
  Info,
  Sparkles
} from 'lucide-react';

export type ShadingMode = 'blueprint' | 'thermal' | 'mechanical' | 'solid';
export type CameraPreset = 'iso' | 'front' | 'top' | 'side' | 'turbo';

interface Engine3DViewProps {
  interactive?: boolean;
  shadingMode?: ShadingMode;
  onShadingModeChange?: (mode: ShadingMode) => void;
  className?: string;
  showControls?: boolean;
  height?: string;
}

export const Engine3DView: React.FC<Engine3DViewProps> = ({
  interactive = true,
  shadingMode: externalShadingMode,
  onShadingModeChange,
  className = '',
  showControls = true,
  height = '540px',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { telemetry } = useTelemetry();
  const { isLight } = useTheme();
  const isLightRef = useRef(isLight);
  isLightRef.current = isLight;

  // Lighting refs for dynamic theme coordination
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const primaryKeyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const cyanUnderGlowRef = useRef<THREE.PointLight | null>(null);

  // Internal state
  const [shadingMode, setShadingMode] = useState<ShadingMode>(externalShadingMode || 'blueprint');
  const [explodedRatio, setExplodedRatio] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [activeSensor, setActiveSensor] = useState<string | null>(null);
  const [hoveredSensor, setHoveredSensor] = useState<string | null>(null);
  const [wireframeOnly, setWireframeOnly] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('iso');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Sync external shading mode if provided
  useEffect(() => {
    if (externalShadingMode) {
      setShadingMode(externalShadingMode);
    }
  }, [externalShadingMode]);

  const handleShadingChange = (mode: ShadingMode) => {
    setShadingMode(mode);
    onShadingModeChange?.(mode);
  };

  // Sensor specifications with 3D coordinates
  const sensors3D = [
    {
      id: 'rpm',
      name: 'CRANKSHAFT HALL PICKUP',
      label: 'RPM',
      val: `${telemetry.rpm} RPM`,
      pos: new THREE.Vector3(-4.6, -0.2, 0.4),
      subsystem: 'Flywheel 60-2 Reluctor Wheel',
      status: telemetry.rpm > 2650 ? 'warning' : 'healthy',
      spec: 'Dual-redundant Hall magnetoresistive transducer (MIL-STD-810G)',
    },
    {
      id: 'cht',
      name: 'CYLINDER HEAD THERMOCOUPLE',
      label: 'CHT',
      val: `${telemetry.cht}°C`,
      pos: new THREE.Vector3(0.0, 2.4, 0.8),
      subsystem: 'Cylinder #2 Head Deck Jacket',
      status: telemetry.cht > 175 ? 'warning' : 'healthy',
      spec: 'K-Type Inconel-sheathed immersed thermocouple probe',
    },
    {
      id: 'fuel',
      name: 'COMMON RAIL TRANSDUCER',
      label: 'FUEL PRESS',
      val: `${telemetry.fuelPressure} bar`,
      pos: new THREE.Vector3(1.2, 3.2, 0.2),
      subsystem: 'Forged Common Rail (1600 bar nominal)',
      status: 'healthy',
      spec: 'Piezoresistive diaphragm sensor with integrated ASIC',
    },
    {
      id: 'boost',
      name: 'MANIFOLD PRESSURE (MAP)',
      label: 'BOOST',
      val: `${telemetry.boostPressure} bar`,
      pos: new THREE.Vector3(-2.8, 1.8, -2.2),
      subsystem: 'Compressor Charge Plenum Duct',
      status: 'healthy',
      spec: 'Absolute pressure piezoceramic element with temp compensation',
    },
    {
      id: 'egt',
      name: 'EXHAUST GAS THERMOCOUPLE',
      label: 'EGT',
      val: `${telemetry.egt}°C`,
      pos: new THREE.Vector3(3.2, 0.6, 2.4),
      subsystem: 'Turbine Exhaust Collector Volute',
      status: telemetry.egt > 730 ? 'warning' : 'healthy',
      spec: 'Fast-response multi-junction Inconel 625 probe',
    },
    {
      id: 'oil',
      name: 'OIL GALLERY PRESSURE',
      label: 'OIL PRESS',
      val: `${telemetry.oilPressure} bar`,
      pos: new THREE.Vector3(2.2, -1.2, -0.6),
      subsystem: 'Main Bearing Oil Supply Gallery',
      status: telemetry.oilPressure < 3.8 ? 'warning' : 'healthy',
      spec: 'Combined fluid pressure & PT100 temperature sensor',
    },
    {
      id: 'vib',
      name: 'TRI-AXIAL ACCELEROMETER',
      label: 'VIB',
      val: `${telemetry.vibration}g`,
      pos: new THREE.Vector3(-1.0, -1.8, 1.6),
      subsystem: 'Crankcase Engine Mount Webbing',
      status: telemetry.vibration > 3.0 ? 'warning' : 'healthy',
      spec: 'High-temperature shear-mode piezoelectric accelerometer',
    },
  ];

  // References to keep in animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const engineGroupRef = useRef<THREE.Group | null>(null);
  const crankshaftGroupRef = useRef<THREE.Group | null>(null);
  const pistonsRef = useRef<{ 
    group: THREE.Group; 
    pistonMesh: THREE.Group; 
    conRodMesh: THREE.Group; 
    pinX: number;
    angleOffset: number;
    firingOrderIndex: number;
    flameMesh?: THREE.Mesh;
  }[]>([]);
  const camshaftsRef = useRef<THREE.Group[]>([]);
  const turboImpellerRef = useRef<THREE.Mesh | null>(null);
  const turbineRotorRef = useRef<THREE.Mesh | null>(null);
  const valvesRef = useRef<{ mesh: THREE.Mesh; baseY: number; phase: number }[]>([]);
  const sensorNodesRef = useRef<{ id: string; mesh: THREE.Group; screenPos: { x: number; y: number } }[]>([]);
  
  // Exploded groups
  const headGroupRef = useRef<THREE.Group | null>(null);
  const sumpGroupRef = useRef<THREE.Group | null>(null);
  const turboGroupRef = useRef<THREE.Group | null>(null);
  const exhaustGroupRef = useRef<THREE.Group | null>(null);
  const fuelRailGroupRef = useRef<THREE.Group | null>(null);
  const blockGroupRef = useRef<THREE.Group | null>(null);

  // Materials map for dynamic mode switching
  const materialsRef = useRef<{
    [key: string]: THREE.Material;
  }>({});

  // Screen-projected sensor positions for HUD overlays
  const [screenSensors, setScreenSensors] = useState<{ id: string; x: number; y: number; visible: boolean }[]>([]);

  // Orbit state
  const orbitRef = useRef({
    isDown: false,
    prevX: 0,
    prevY: 0,
    rotX: 0.35, // Pitch
    rotY: -0.65, // Yaw
    targetRotX: 0.35,
    targetRotY: -0.65,
    distance: 14.5,
    targetDistance: 14.5,
    targetLookAt: new THREE.Vector3(0, 0.4, 0),
    currentLookAt: new THREE.Vector3(0, 0.4, 0),
  });

  // Telemetry refs for smooth 60fps reading
  const telemetryRef = useRef(telemetry);
  telemetryRef.current = telemetry;
  const shadingModeRef = useRef(shadingMode);
  shadingModeRef.current = shadingMode;
  const explodedRatioRef = useRef(explodedRatio);
  explodedRatioRef.current = explodedRatio;
  const wireframeOnlyRef = useRef(wireframeOnly);
  wireframeOnlyRef.current = wireframeOnly;
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  // Dynamically synchronize 3D scene lighting and background with light/dark theme
  useEffect(() => {
    if (!sceneRef.current) return;
    const bgCol = isLight ? 0xf1f5f9 : 0x04090f;
    sceneRef.current.background = new THREE.Color(bgCol);
    if (sceneRef.current.fog) {
      sceneRef.current.fog.color.setHex(bgCol);
    }
    if (ambientLightRef.current) {
      ambientLightRef.current.color.setHex(isLight ? 0xe2e8f0 : 0x1a364a);
      ambientLightRef.current.intensity = isLight ? 2.2 : 1.6;
    }
    if (primaryKeyLightRef.current) {
      primaryKeyLightRef.current.color.setHex(isLight ? 0xffffff : 0x1ad1f5);
      primaryKeyLightRef.current.intensity = isLight ? 2.6 : 2.2;
    }
    if (rimLightRef.current) {
      rimLightRef.current.color.setHex(isLight ? 0x0284c7 : 0xffb834);
      rimLightRef.current.intensity = isLight ? 1.0 : 1.4;
    }
    if (cyanUnderGlowRef.current) {
      cyanUnderGlowRef.current.color.setHex(isLight ? 0x0284c7 : 0x1ad1f5);
      cyanUnderGlowRef.current.intensity = isLight ? 1.2 : 1.8;
    }
  }, [isLight]);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const heightPx = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const initialBg = isLight ? 0xf1f5f9 : 0x04090f;
    scene.background = new THREE.Color(initialBg);
    scene.fog = new THREE.FogExp2(initialBg, 0.035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(10, 7, 12);
    camera.lookAt(0, 0.4, 0);

    // 3. Renderer with high-precision anti-aliasing
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. Aerospace Lighting Scheme
    const ambientLight = new THREE.AmbientLight(isLight ? 0xe2e8f0 : 0x1a364a, isLight ? 2.2 : 1.6);
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    const primaryKeyLight = new THREE.DirectionalLight(isLight ? 0xffffff : 0x1ad1f5, isLight ? 2.6 : 2.2);
    primaryKeyLightRef.current = primaryKeyLight;
    primaryKeyLight.position.set(12, 18, 10);
    primaryKeyLight.castShadow = true;
    scene.add(primaryKeyLight);

    const rimLight = new THREE.DirectionalLight(isLight ? 0x0284c7 : 0xffb834, isLight ? 1.0 : 1.4);
    rimLightRef.current = rimLight;
    rimLight.position.set(-14, 10, -10);
    scene.add(rimLight);

    const cyanUnderGlow = new THREE.PointLight(isLight ? 0x0284c7 : 0x1ad1f5, isLight ? 1.2 : 1.8, 25);
    cyanUnderGlowRef.current = cyanUnderGlow;
    cyanUnderGlow.position.set(0, -3.5, 0);
    scene.add(cyanUnderGlow);

    // 5. Precision CAD Floor Grid
    const gridHelper = new THREE.GridHelper(26, 32, 0x1ad1f5, 0x123040);
    gridHelper.position.y = -3.2;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.45;
    scene.add(gridHelper);

    // CAD Circular Range Rings
    const ringGeo = new THREE.RingGeometry(5.8, 5.85, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x1ad1f5, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -3.19;
    scene.add(ringMesh);

    // 6. Master Engine Assembly Group
    const engineMaster = new THREE.Group();
    engineGroupRef.current = engineMaster;
    scene.add(engineMaster);

    // Sub-assembly groups for exploded view
    const blockGroup = new THREE.Group();
    blockGroupRef.current = blockGroup;
    engineMaster.add(blockGroup);

    const headGroup = new THREE.Group();
    headGroupRef.current = headGroup;
    engineMaster.add(headGroup);

    const sumpGroup = new THREE.Group();
    sumpGroupRef.current = sumpGroup;
    engineMaster.add(sumpGroup);

    const turboGroup = new THREE.Group();
    turboGroupRef.current = turboGroup;
    engineMaster.add(turboGroup);

    const exhaustGroup = new THREE.Group();
    exhaustGroupRef.current = exhaustGroup;
    engineMaster.add(exhaustGroup);

    const fuelRailGroup = new THREE.Group();
    fuelRailGroupRef.current = fuelRailGroup;
    engineMaster.add(fuelRailGroup);

    // =========================================================================
    // 7. BUILD PROCEDURAL 3D CAD ENGINE COMPONENTS
    // =========================================================================

    // Utility helper to create blueprint wireframe + solid dual meshes
    const createCadPart = (
      geometry: THREE.BufferGeometry, 
      matName: string, 
      edgeColor = 0x1ad1f5
    ): THREE.Group => {
      const partGroup = new THREE.Group();
      
      // Base mesh
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x092232,
        roughness: 0.35,
        metalness: 0.75,
        transparent: true,
        opacity: 0.88,
      });
      materialsRef.current[matName] = baseMat;

      const mesh = new THREE.Mesh(geometry, baseMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      partGroup.add(mesh);

      // Sharp CAD wireframe edges
      const edges = new THREE.EdgesGeometry(geometry, 28);
      const line = new THREE.LineSegments(
        edges, 
        new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 1.2, transparent: true, opacity: 0.85 })
      );
      partGroup.add(line);

      return partGroup;
    };

    // A. ENGINE CRANKCASE & CYLINDER BLOCK
    const blockLength = 7.6;
    const blockHeight = 3.6;
    const blockWidth = 3.8;
    const blockGeo = new THREE.BoxGeometry(blockLength, blockHeight, blockWidth);
    const blockMeshGroup = createCadPart(blockGeo, 'block', 0x1ad1f5);
    blockMeshGroup.position.set(0, 0.4, 0);
    blockGroup.add(blockMeshGroup);

    // Stiffener ribs along crankcase
    for (let i = -3; i <= 3; i += 1.5) {
      const ribGeo = new THREE.BoxGeometry(0.18, 3.2, 4.1);
      const ribPart = createCadPart(ribGeo, `rib_${i}`, 0x14526e);
      ribPart.position.set(i, 0.4, 0);
      blockGroup.add(ribPart);
    }

    // Engine Mounting Brackets (Avionics Hardpoints)
    const mountGeo = new THREE.BoxGeometry(1.2, 0.4, 1.4);
    const leftMount = createCadPart(mountGeo, 'mount_l', 0x3ce698);
    leftMount.position.set(-2.6, -1.0, 2.4);
    blockGroup.add(leftMount);

    const rightMount = createCadPart(mountGeo, 'mount_r', 0x3ce698);
    rightMount.position.set(2.6, -1.0, 2.4);
    blockGroup.add(rightMount);

    // B. LOWER OIL SUMP & PAN
    const sumpGeo = new THREE.BoxGeometry(6.6, 1.4, 3.4);
    const sumpMeshGroup = createCadPart(sumpGeo, 'sump', 0x1c4258);
    sumpMeshGroup.position.set(0, -2.0, 0);
    sumpGroup.add(sumpMeshGroup);

    // Oil drain plug
    const plugGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.3, 12);
    const plugMesh = createCadPart(plugGeo, 'plug', 0xffb834);
    plugMesh.position.set(2.4, -2.7, 0);
    sumpGroup.add(plugMesh);

    // C. CRANKSHAFT & FLYWHEEL RELUCTOR
    const crankGroup = new THREE.Group();
    crankshaftGroupRef.current = crankGroup;
    blockGroup.add(crankGroup);
    crankGroup.position.set(0, -0.6, 0);

    // Main crankshaft axis bar
    const mainShaftGeo = new THREE.CylinderGeometry(0.32, 0.32, 8.4, 16);
    mainShaftGeo.rotateZ(Math.PI / 2);
    const mainShaft = createCadPart(mainShaftGeo, 'crankShaft', 0x3ce698);
    crankGroup.add(mainShaft);

    // 4 Crank counterweights & journals
    const cylXPositions = [-2.4, -0.8, 0.8, 2.4];
    const crankAngles = [0, Math.PI, Math.PI, 0]; // 1-3-4-2 inline 4 configuration

    cylXPositions.forEach((cx, idx) => {
      const cwGeo = new THREE.BoxGeometry(0.35, 1.4, 1.1);
      const cwMesh = createCadPart(cwGeo, `cw_${idx}`, 0x1ad1f5);
      cwMesh.position.set(cx, -0.5, 0);
      crankGroup.add(cwMesh);
    });

    // Front Flywheel / Reluctor Wheel (60-2 Teeth)
    const flywheelGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.45, 32);
    flywheelGeo.rotateZ(Math.PI / 2);
    const flywheelMesh = createCadPart(flywheelGeo, 'flywheel', 0x1ad1f5);
    flywheelMesh.position.set(-4.2, 0, 0);
    crankGroup.add(flywheelMesh);

    // Reluctor perimeter teeth
    for (let t = 0; t < 24; t++) {
      if (t === 0 || t === 1) continue; // 2 missing teeth for 60-2 sync
      const angle = (t / 24) * Math.PI * 2;
      const toothGeo = new THREE.BoxGeometry(0.5, 0.12, 0.15);
      const toothMesh = new THREE.Mesh(
        toothGeo,
        new THREE.MeshBasicMaterial({ color: 0x1ad1f5 })
      );
      toothMesh.position.set(
        -4.2,
        Math.cos(angle) * 1.66,
        Math.sin(angle) * 1.66
      );
      toothMesh.rotation.x = -angle;
      crankGroup.add(toothMesh);
    }

    // Front Propeller Reduction Hub Flange
    const propHubGeo = new THREE.CylinderGeometry(0.8, 1.0, 0.8, 16);
    propHubGeo.rotateZ(Math.PI / 2);
    const propHub = createCadPart(propHubGeo, 'propHub', 0x1ad1f5);
    propHub.position.set(-4.8, 0, 0);
    crankGroup.add(propHub);

    // D. 4 CYLINDERS, PISTONS & CONNECTING RODS
    const pistonsArray: any[] = [];
    const strokeRadius = 0.72; // half stroke
    const rodLength = 2.4;

    cylXPositions.forEach((cx, idx) => {
      const angleOffset = crankAngles[idx];
      const cylSubGroup = new THREE.Group();
      blockGroup.add(cylSubGroup);

      // Cylinder bore sleeve
      const boreGeo = new THREE.CylinderGeometry(0.95, 0.95, 3.2, 24, 1, true);
      const boreMesh = createCadPart(boreGeo, `bore_${idx}`, 0x16425c);
      boreMesh.position.set(cx, 1.4, 0);
      cylSubGroup.add(boreMesh);

      // Piston Group
      const pistonGroup = new THREE.Group();
      cylSubGroup.add(pistonGroup);

      // Piston crown with top direct injection bowl
      const crownGeo = new THREE.CylinderGeometry(0.88, 0.88, 1.0, 24);
      const crownMesh = createCadPart(crownGeo, `pistonCrown_${idx}`, 0x1ad1f5);
      pistonGroup.add(crownMesh);

      // Re-entrant combustion bowl cutout simulation
      const bowlGeo = new THREE.CylinderGeometry(0.45, 0.25, 0.25, 16);
      const bowlMesh = new THREE.Mesh(
        bowlGeo,
        new THREE.MeshBasicMaterial({ color: 0x050e16 })
      );
      bowlMesh.position.set(0, 0.45, 0);
      pistonGroup.add(bowlMesh);

      // Piston wrist pin
      const wristPinGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.1, 12);
      wristPinGeo.rotateZ(Math.PI / 2);
      const wristPin = createCadPart(wristPinGeo, `pin_${idx}`, 0x3ce698);
      wristPin.position.set(0, -0.15, 0);
      pistonGroup.add(wristPin);

      // Flame flash for combustion firing
      const flameGeo = new THREE.SphereGeometry(0.75, 12, 12);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xffb834,
        transparent: true,
        opacity: 0,
      });
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.set(0, 0.7, 0);
      pistonGroup.add(flameMesh);

      // Connecting Rod
      const conRodGroup = new THREE.Group();
      cylSubGroup.add(conRodGroup);

      const rodHBeamGeo = new THREE.BoxGeometry(0.24, rodLength, 0.45);
      const rodMesh = createCadPart(rodHBeamGeo, `conrod_${idx}`, 0x1ad1f5);
      rodMesh.position.set(0, rodLength / 2, 0);
      conRodGroup.add(rodMesh);

      // Rod Big-End Journal Cap
      const rodCapGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.4, 16);
      rodCapGeo.rotateZ(Math.PI / 2);
      const rodCapMesh = createCadPart(rodCapGeo, `rodcap_${idx}`, 0x3ce698);
      conRodGroup.add(rodCapMesh);

      pistonsArray.push({
        group: cylSubGroup,
        pistonMesh: pistonGroup,
        conRodMesh: conRodGroup,
        pinX: cx,
        angleOffset,
        firingOrderIndex: [1, 3, 4, 2][idx],
        flameMesh,
      });
    });
    pistonsRef.current = pistonsArray;

    // E. CYLINDER HEAD & DOHC VALVETRAIN
    const headLength = 7.4;
    const headHeight = 1.3;
    const headWidth = 3.6;
    const headGeo = new THREE.BoxGeometry(headLength, headHeight, headWidth);
    const headMesh = createCadPart(headGeo, 'head', 0x1ad1f5);
    headMesh.position.set(0, 2.75, 0);
    headGroup.add(headMesh);

    // Dual Overhead Camshafts (Intake & Exhaust)
    const camShaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 7.2, 16);
    camShaftGeo.rotateZ(Math.PI / 2);

    const intakeCam = createCadPart(camShaftGeo, 'cam_intake', 0x1ad1f5);
    intakeCam.position.set(0, 3.4, -0.9);
    headGroup.add(intakeCam);

    const exhaustCam = createCadPart(camShaftGeo, 'cam_exhaust', 0xffb834);
    exhaustCam.position.set(0, 3.4, 0.9);
    headGroup.add(exhaustCam);

    camshaftsRef.current = [intakeCam, exhaustCam];

    // Front Timing Gears & Cam Belt Pulley
    const camPulleyGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 24);
    camPulleyGeo.rotateZ(Math.PI / 2);

    const camPulley1 = createCadPart(camPulleyGeo, 'pulley1', 0x1ad1f5);
    camPulley1.position.set(-3.7, 3.4, -0.9);
    headGroup.add(camPulley1);

    const camPulley2 = createCadPart(camPulleyGeo, 'pulley2', 0x1ad1f5);
    camPulley2.position.set(-3.7, 3.4, 0.9);
    headGroup.add(camPulley2);

    // 16 Poppet Valves inside Head
    const valvelist: any[] = [];
    cylXPositions.forEach((cx, cIdx) => {
      [-0.4, 0.4].forEach((vOffset, vIdx) => {
        // Intake valve
        const valveGeo = new THREE.CylinderGeometry(0.08, 0.32, 1.1, 12);
        const vMesh = new THREE.Mesh(
          valveGeo,
          new THREE.MeshBasicMaterial({ color: 0x1ad1f5 })
        );
        vMesh.position.set(cx + vOffset, 2.3, -0.9);
        headGroup.add(vMesh);
        valvelist.push({ mesh: vMesh, baseY: 2.3, phase: crankAngles[cIdx] });

        // Exhaust valve
        const exMesh = new THREE.Mesh(
          valveGeo,
          new THREE.MeshBasicMaterial({ color: 0xffb834 })
        );
        exMesh.position.set(cx + vOffset, 2.3, 0.9);
        headGroup.add(exMesh);
        valvelist.push({ mesh: exMesh, baseY: 2.3, phase: crankAngles[cIdx] + Math.PI * 0.5 });
      });
    });
    valvesRef.current = valvelist;

    // F. COMMON RAIL DIRECT FUEL INJECTION (1600 BAR)
    const railTubeGeo = new THREE.CylinderGeometry(0.24, 0.24, 6.2, 16);
    railTubeGeo.rotateZ(Math.PI / 2);
    const railTube = createCadPart(railTubeGeo, 'railTube', 0x3ce698);
    railTube.position.set(0, 3.9, -0.1);
    fuelRailGroup.add(railTube);

    // 4 High-Pressure Solenoid Injectors
    cylXPositions.forEach((cx, idx) => {
      const injGeo = new THREE.CylinderGeometry(0.16, 0.08, 1.4, 12);
      const injMesh = createCadPart(injGeo, `injector_${idx}`, 0x3ce698);
      injMesh.position.set(cx, 3.1, 0);
      fuelRailGroup.add(injMesh);

      // High pressure curved feeder line
      const lineCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(cx, 3.9, -0.1),
        new THREE.Vector3(cx, 3.7, -0.3),
        new THREE.Vector3(cx, 3.5, 0),
      ]);
      const tubeGeo = new THREE.TubeGeometry(lineCurve, 8, 0.04, 6, false);
      const tubeMesh = new THREE.Mesh(tubeGeo, new THREE.MeshBasicMaterial({ color: 0x3ce698 }));
      fuelRailGroup.add(tubeMesh);
    });

    // G. TURBOCHARGER INDUCTION SYSTEM (FRONT-LEFT)
    const turboHousingGeo = new THREE.TorusGeometry(1.1, 0.55, 16, 32, Math.PI * 1.8);
    const turboHousing = createCadPart(turboHousingGeo, 'turboHousing', 0x1ad1f5);
    turboHousing.rotation.y = Math.PI / 2;
    turboHousing.position.set(-3.2, 1.6, -2.4);
    turboGroup.add(turboHousing);

    // Rotating Billet Compressor Impeller
    const impellerGeo = new THREE.ConeGeometry(0.8, 0.7, 12);
    impellerGeo.rotateX(Math.PI / 2);
    const impellerMesh = new THREE.Mesh(
      impellerGeo,
      new THREE.MeshStandardMaterial({ color: 0x1ad1f5, roughness: 0.2, metalness: 0.9 })
    );
    impellerMesh.position.set(-3.2, 1.6, -2.4);
    turboGroup.add(impellerMesh);
    turboImpellerRef.current = impellerMesh;

    // Charge Air Duct to Intercooler
    const chargeDuctCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.2, 1.6, -2.4),
      new THREE.Vector3(-2.0, 2.6, -2.8),
      new THREE.Vector3(0.0, 2.8, -2.1),
    ]);
    const chargeDuctGeo = new THREE.TubeGeometry(chargeDuctCurve, 16, 0.32, 12, false);
    const chargeDuct = createCadPart(chargeDuctGeo, 'chargeDuct', 0x1ad1f5);
    turboGroup.add(chargeDuct);

    // Charge Air Cooler / Intercooler
    const icGeo = new THREE.BoxGeometry(4.2, 1.2, 0.8);
    const icMesh = createCadPart(icGeo, 'intercooler', 0x1c4258);
    icMesh.position.set(0, 2.8, -2.5);
    turboGroup.add(icMesh);

    // H. EXHAUST MANIFOLD & TURBINE VOLUTE (RIGHT)
    cylXPositions.forEach((cx, idx) => {
      const exRunnerCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(cx, 2.4, 1.8),
        new THREE.Vector3(cx * 0.6 + 1.2, 1.8, 2.4),
        new THREE.Vector3(3.0, 0.8, 2.4),
      ]);
      const exRunnerGeo = new THREE.TubeGeometry(exRunnerCurve, 12, 0.24, 10, false);
      const runnerMesh = createCadPart(exRunnerGeo, `exRunner_${idx}`, 0xffb834);
      exhaustGroup.add(runnerMesh);
    });

    // Exhaust Turbine Housing
    const turbineVoluteGeo = new THREE.TorusGeometry(1.2, 0.65, 16, 32);
    turbineVoluteGeo.rotateY(Math.PI / 2);
    const turbineVolute = createCadPart(turbineVoluteGeo, 'turbineVolute', 0xff4d61);
    turbineVolute.position.set(3.4, 0.8, 2.4);
    exhaustGroup.add(turbineVolute);

    // Internal Inconel Turbine Rotor
    const turbineRotorGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.4, 12);
    turbineRotorGeo.rotateX(Math.PI / 2);
    const turbineRotor = new THREE.Mesh(
      turbineRotorGeo,
      new THREE.MeshStandardMaterial({ color: 0xffb834, roughness: 0.3, metalness: 0.8 })
    );
    turbineRotor.position.set(3.4, 0.8, 2.4);
    exhaustGroup.add(turbineRotor);
    turbineRotorRef.current = turbineRotor;

    // Exhaust Tailpipe Exit
    const tailpipeGeo = new THREE.CylinderGeometry(0.48, 0.52, 2.0, 16);
    tailpipeGeo.rotateZ(Math.PI / 4);
    const tailpipe = createCadPart(tailpipeGeo, 'tailpipe', 0xff4d61);
    tailpipe.position.set(4.6, 0.2, 2.4);
    exhaustGroup.add(tailpipe);

    // Wastegate Canister
    const wgGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.9, 12);
    const wgMesh = createCadPart(wgGeo, 'wastegate', 0x1ad1f5);
    wgMesh.position.set(3.4, 2.2, 2.2);
    exhaustGroup.add(wgMesh);

    // =========================================================================
    // 8. INTERACTIVE 3D SENSOR BEACONS
    // =========================================================================
    const sensorList: any[] = [];
    sensors3D.forEach((s) => {
      const sGroup = new THREE.Group();
      sGroup.position.copy(s.pos);
      sGroup.userData = { sensorId: s.id };

      // Inner glowing core
      const coreGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const coreMat = new THREE.MeshBasicMaterial({
        color: s.status === 'warning' ? 0xffb834 : 0x1ad1f5,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      sGroup.add(coreMesh);

      // Pulsing outer halo ring
      const haloGeo = new THREE.RingGeometry(0.24, 0.32, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: s.status === 'warning' ? 0xffb834 : 0x1ad1f5,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      sGroup.add(haloMesh);

      // Thin anchor pointer line
      const stemGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0x1ad1f5, transparent: true, opacity: 0.5 });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      stemMesh.position.y = -0.25;
      sGroup.add(stemMesh);

      engineMaster.add(sGroup);
      sensorList.push({ id: s.id, mesh: sGroup, screenPos: { x: 0, y: 0 } });
    });
    sensorNodesRef.current = sensorList;

    // =========================================================================
    // 9. ANIMATION & RENDER LOOP
    // =========================================================================
    let animId: number;
    let clock = new THREE.Clock();
    let crankAngle = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const currentTelemetry = telemetryRef.current;

      // Speed of engine animation tied to live RPM
      const rpmSpeed = (currentTelemetry.rpm / 60) * Math.PI * 2;
      const speedFactor = 0.6; // visual scaling for comfortable viewing
      crankAngle += delta * (rpmSpeed * 0.04 * speedFactor);

      // 1. Rotate Crankshaft & Camshafts
      if (crankshaftGroupRef.current) {
        crankshaftGroupRef.current.rotation.x = crankAngle;
      }

      camshaftsRef.current.forEach((cam) => {
        cam.rotation.x = crankAngle * 0.5; // DOHC rotates at half engine speed
      });

      // 2. Reciprocating Kinematics for Pistons & Rods
      pistonsRef.current.forEach((cyl) => {
        const theta = crankAngle + cyl.angleOffset;
        
        // Exact slider-crank displacement
        // y = r * cos(theta) + sqrt(l^2 - (r * sin(theta))^2)
        const r = strokeRadius;
        const l = rodLength;
        const sinT = Math.sin(theta);
        const cosT = Math.cos(theta);
        const dispY = r * cosT + Math.sqrt(Math.max(0, l * l - r * r * sinT * sinT)) - l;
        
        // Piston translation
        cyl.pistonMesh.position.y = 1.6 + dispY;

        // Connecting rod angle
        const rodAngle = -Math.asin((r * sinT) / l);
        cyl.conRodMesh.rotation.z = rodAngle;
        cyl.conRodMesh.position.y = -0.6 + r * cosT;
        cyl.conRodMesh.position.z = r * sinT;

        // Combustion flame pulse at TDC (Top Dead Center)
        if (cyl.flameMesh) {
          const tdcProximity = Math.max(0, cosT);
          if (tdcProximity > 0.85) {
            cyl.flameMesh.scale.setScalar(0.8 + tdcProximity * 0.6);
            (cyl.flameMesh.material as THREE.MeshBasicMaterial).opacity = (tdcProximity - 0.85) * 6;
          } else {
            (cyl.flameMesh.material as THREE.MeshBasicMaterial).opacity = 0;
          }
        }
      });

      // 3. Valvetrain Poppet Reciprocation
      valvesRef.current.forEach((v) => {
        const vLift = Math.max(0, Math.sin(crankAngle * 0.5 + v.phase));
        v.mesh.position.y = v.baseY - vLift * 0.22;
      });

      // 4. Turbo Compressor & Turbine Spin
      if (turboImpellerRef.current) {
        turboImpellerRef.current.rotation.z += delta * (rpmSpeed * 0.15);
      }
      if (turbineRotorRef.current) {
        turbineRotorRef.current.rotation.z += delta * (rpmSpeed * 0.15);
      }

      // 5. Exploded View Interpolation
      const explode = explodedRatioRef.current;
      if (headGroupRef.current) {
        headGroupRef.current.position.y = explode * 2.8;
      }
      if (fuelRailGroupRef.current) {
        fuelRailGroupRef.current.position.y = explode * 4.2;
      }
      if (sumpGroupRef.current) {
        sumpGroupRef.current.position.y = -explode * 2.2;
      }
      if (turboGroupRef.current) {
        turboGroupRef.current.position.z = -explode * 2.6;
        turboGroupRef.current.position.x = -explode * 1.2;
      }
      if (exhaustGroupRef.current) {
        exhaustGroupRef.current.position.z = explode * 2.6;
        exhaustGroupRef.current.position.x = explode * 1.2;
      }

      // 6. Shading Mode Appearance Updates
      const currentMode = shadingModeRef.current;
      const isWire = wireframeOnlyRef.current;

      Object.entries(materialsRef.current).forEach(([key, mat]: [string, any]) => {
        if (!mat) return;
        mat.wireframe = isWire;

        if (currentMode === 'blueprint') {
          if (isLightRef.current) {
            mat.color.setHex(0xdbeafe);
            mat.emissive.setHex(0x0284c7);
            mat.roughness = 0.3;
            mat.metalness = 0.4;
            mat.opacity = 0.85;
            mat.transparent = true;
          } else {
            mat.color.setHex(0x0a2233);
            mat.emissive.setHex(0x04131d);
            mat.roughness = 0.4;
            mat.metalness = 0.8;
            mat.opacity = 0.85;
            mat.transparent = true;
          }
        } else if (currentMode === 'thermal') {
          // Temperature heat map gradient
          if (key.includes('exRunner') || key.includes('turbine') || key.includes('tailpipe')) {
            const egtRatio = Math.min(1, Math.max(0, (currentTelemetry.egt - 600) / 200));
            mat.color.setRGB(1.0, 0.2 + (1 - egtRatio) * 0.5, 0.1);
            mat.emissive.setRGB(0.7 * egtRatio, 0.15, 0.05);
            mat.opacity = 0.95;
          } else if (key.includes('piston') || key.includes('head')) {
            const chtRatio = Math.min(1, Math.max(0, (currentTelemetry.cht - 120) / 80));
            mat.color.setRGB(0.9, 0.6 * (1 - chtRatio * 0.4), 0.1);
            mat.emissive.setRGB(0.4 * chtRatio, 0.2, 0.05);
          } else if (key.includes('turbo') || key.includes('charge') || key.includes('intercooler')) {
            mat.color.setHex(0x1ad1f5);
            mat.emissive.setHex(0x052e3d);
          } else {
            mat.color.setHex(0x13384d);
            mat.emissive.setHex(0x041824);
          }
          mat.transparent = false;
        } else if (currentMode === 'mechanical') {
          // FEA Stress Map (Von Mises)
          if (key.includes('cw_') || key.includes('conrod') || key.includes('rodcap') || key.includes('pin')) {
            mat.color.setHex(0xff4d61); // High cyclical fatigue areas
            mat.emissive.setHex(0x400c14);
          } else if (key.includes('rib') || key.includes('mount')) {
            mat.color.setHex(0xffb834); // Moderate stress webbing
            mat.emissive.setHex(0x301e05);
          } else if (key.includes('block') || key.includes('head')) {
            mat.color.setHex(0x3ce698); // Nominal casing structure
            mat.emissive.setHex(0x09301e);
          } else {
            mat.color.setHex(0x1ad1f5);
            mat.emissive.setHex(0x062838);
          }
          mat.transparent = false;
        } else if (currentMode === 'solid') {
          // Photorealistic brushed metal & cast aluminum
          mat.color.setHex(0x1a2e3b);
          mat.emissive.setHex(0x050c12);
          mat.roughness = 0.25;
          mat.metalness = 0.9;
          mat.transparent = false;
        }
      });

      // 7. Sensor Halo Breathing Pulse & Billboarding
      sensorNodesRef.current.forEach((sn) => {
        const pulse = 1.0 + Math.sin(clock.getElapsedTime() * 4) * 0.15;
        sn.mesh.children[1].scale.set(pulse, pulse, pulse);
        sn.mesh.children[1].lookAt(camera.position); // Always face camera
      });

      // 8. Orbit & Camera Smoothing
      const orb = orbitRef.current;
      if (autoRotateRef.current && !orb.isDown) {
        orb.targetRotY += delta * 0.35;
      }

      orb.rotX += (orb.targetRotX - orb.rotX) * 0.1;
      orb.rotY += (orb.targetRotY - orb.rotY) * 0.1;
      orb.distance += (orb.targetDistance - orb.distance) * 0.1;
      orb.currentLookAt.lerp(orb.targetLookAt, 0.1);

      // Clamp vertical pitch to prevent flipping
      orb.targetRotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, orb.targetRotX));
      orb.targetDistance = Math.max(6, Math.min(26, orb.targetDistance));

      // Spherical coordinates to Cartesian
      const cosPitch = Math.cos(orb.rotX);
      camera.position.x = orb.currentLookAt.x + orb.distance * cosPitch * Math.sin(orb.rotY);
      camera.position.y = orb.currentLookAt.y + orb.distance * Math.sin(orb.rotX);
      camera.position.z = orb.currentLookAt.z + orb.distance * cosPitch * Math.cos(orb.rotY);
      camera.lookAt(orb.currentLookAt);

      // 9. Calculate 2D Screen Projections for Interactive Sensor Pills
      const updatedScreenSensors = sensorNodesRef.current.map((sn) => {
        const worldPos = new THREE.Vector3();
        sn.mesh.getWorldPosition(worldPos);

        // Explode offset adjustment if parent group exploded
        const proj = worldPos.clone().project(camera);
        const x = (proj.x * 0.5 + 0.5) * width;
        const y = (-(proj.y * 0.5) + 0.5) * heightPx;
        const isBehind = proj.z > 1.0;

        return {
          id: sn.id,
          x,
          y,
          visible: !isBehind && x > 20 && x < width - 20 && y > 20 && y < heightPx - 20,
        };
      });
      setScreenSensors(updatedScreenSensors);

      // Render Scene
      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Window Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Camera Presets handler
  const setPreset = useCallback((preset: CameraPreset) => {
    setCameraPreset(preset);
    const orb = orbitRef.current;
    setAutoRotate(false);

    if (preset === 'iso') {
      orb.targetRotX = 0.35;
      orb.targetRotY = -0.65;
      orb.targetDistance = 14.5;
      orb.targetLookAt.set(0, 0.4, 0);
    } else if (preset === 'front') {
      orb.targetRotX = 0.05;
      orb.targetRotY = 0;
      orb.targetDistance = 12.0;
      orb.targetLookAt.set(0, 0.6, 0);
    } else if (preset === 'top') {
      orb.targetRotX = Math.PI / 2.1;
      orb.targetRotY = 0;
      orb.targetDistance = 14.0;
      orb.targetLookAt.set(0, 0, 0);
    } else if (preset === 'side') {
      orb.targetRotX = 0.1;
      orb.targetRotY = Math.PI / 2;
      orb.targetDistance = 11.5;
      orb.targetLookAt.set(0, 0.4, 0);
    } else if (preset === 'turbo') {
      orb.targetRotX = 0.3;
      orb.targetRotY = -2.2;
      orb.targetDistance = 8.5;
      orb.targetLookAt.set(-3.2, 1.6, -2.4);
    }
  }, []);

  // Mouse & Touch Orbit Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    orbitRef.current.isDown = true;
    orbitRef.current.prevX = e.clientX;
    orbitRef.current.prevY = e.clientY;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!orbitRef.current.isDown) return;
    const deltaX = e.clientX - orbitRef.current.prevX;
    const deltaY = e.clientY - orbitRef.current.prevY;
    orbitRef.current.prevX = e.clientX;
    orbitRef.current.prevY = e.clientY;

    orbitRef.current.targetRotY -= deltaX * 0.007;
    orbitRef.current.targetRotX += deltaY * 0.007;
  };

  const handleMouseUp = () => {
    orbitRef.current.isDown = false;
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    orbitRef.current.targetDistance += e.deltaY * 0.012;
  };

  // Touch controls for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      orbitRef.current.isDown = true;
      orbitRef.current.prevX = e.touches[0].clientX;
      orbitRef.current.prevY = e.touches[0].clientY;
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!orbitRef.current.isDown || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - orbitRef.current.prevX;
    const deltaY = e.touches[0].clientY - orbitRef.current.prevY;
    orbitRef.current.prevX = e.touches[0].clientX;
    orbitRef.current.prevY = e.touches[0].clientY;

    orbitRef.current.targetRotY -= deltaX * 0.009;
    orbitRef.current.targetRotX += deltaY * 0.009;
  };

  const handleTouchEnd = () => {
    orbitRef.current.isDown = false;
    setIsDragging(false);
  };

  // Zoom buttons
  const zoomIn = () => {
    orbitRef.current.targetDistance = Math.max(6, orbitRef.current.targetDistance - 2);
  };
  const zoomOut = () => {
    orbitRef.current.targetDistance = Math.min(26, orbitRef.current.targetDistance + 2);
  };
  const resetCamera = () => {
    setPreset('iso');
    setExplodedRatio(0);
  };

  // Active sensor detail object
  const activeSensorObj = sensors3D.find((s) => s.id === (activeSensor || hoveredSensor));

  return (
    <div className={`relative flex flex-col w-full select-none overflow-hidden rounded-lg bg-[#04090f] border border-[#142F3F] ${className}`}>
      {/* Top 3D Engineering Mode Bar */}
      {interactive && showControls && (
        <div className="w-full flex flex-wrap items-center justify-between px-3 py-2 border-b border-[#142F3F] bg-[#07121B] z-20 gap-2">
          {/* Unit Identification */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono-tech text-[#1AD1F5] font-semibold">
              <Compass className="w-3.5 h-3.5 text-[#1AD1F5]" />
              <span>3D CAD MODEL // DRDO/VRDE 180 HP</span>
            </div>
            <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-[#1AD1F5]/10 text-[#1AD1F5] border border-[#1AD1F5]/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              INTERACTIVE 3D
            </span>
          </div>

          {/* Shading / Visual Pipeline Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#0A1924] p-0.5 rounded border border-[#142F3F]">
            <button
              onClick={() => handleShadingChange('blueprint')}
              className={`px-2.5 py-1 text-[10px] font-mono-tech rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                shadingMode === 'blueprint'
                  ? 'bg-[#1AD1F5] text-[#04090F] font-bold shadow-sm'
                  : 'text-[#8BA3B3] hover:text-[#E6F4FF]'
              }`}
            >
              <Eye className="w-3 h-3" />
              CAD BLUEPRINT
            </button>
            <button
              onClick={() => handleShadingChange('thermal')}
              className={`px-2.5 py-1 text-[10px] font-mono-tech rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                shadingMode === 'thermal'
                  ? 'bg-[#FFB834] text-[#04090F] font-bold shadow-sm'
                  : 'text-[#8BA3B3] hover:text-[#E6F4FF]'
              }`}
            >
              <Layers className="w-3 h-3" />
              THERMAL FIELD
            </button>
            <button
              onClick={() => handleShadingChange('mechanical')}
              className={`px-2.5 py-1 text-[10px] font-mono-tech rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                shadingMode === 'mechanical'
                  ? 'bg-[#3CE698] text-[#04090F] font-bold shadow-sm'
                  : 'text-[#8BA3B3] hover:text-[#E6F4FF]'
              }`}
            >
              <Activity className="w-3 h-3" />
              FEA STRESS
            </button>
            <button
              onClick={() => handleShadingChange('solid')}
              className={`px-2.5 py-1 text-[10px] font-mono-tech rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                shadingMode === 'solid'
                  ? 'bg-[#E6F4FF] text-[#04090F] font-bold shadow-sm'
                  : 'text-[#8BA3B3] hover:text-[#E6F4FF]'
              }`}
            >
              <Box className="w-3 h-3" />
              SOLID CAD
            </button>
          </div>
        </div>
      )}

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full cursor-grab active:cursor-grabbing overflow-hidden ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={{ height }}
      >
        {/* Background Technical Reticles */}
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

        {/* Top-Left CAD Coordinates & Aero Specs */}
        <div className="absolute top-3 left-3 text-[9px] font-mono-tech text-[#526E7E] pointer-events-none leading-relaxed bg-[#050E16]/80 p-2 rounded border border-[#142F3F]/60 backdrop-blur-sm">
          <div className="text-[#1AD1F5] font-semibold">UNIT: DRDO-VRDE 180 HP AERO DIESEL</div>
          <div>MODEL: FULL 3D ASSEMBLY KINEMATICS</div>
          <div>STROKE: 90.0mm // BORE: 84.0mm // 1998cc</div>
          <div>FIRING: 1-3-4-2 RECIPROCATING MATRIX</div>
        </div>

        {/* Top-Right HUD Co-Sim Status */}
        <div className="absolute top-3 right-3 text-[9px] font-mono-tech text-right text-[#526E7E] pointer-events-none leading-relaxed bg-[#050E16]/80 p-2 rounded border border-[#142F3F]/60 backdrop-blur-sm">
          <div className="text-[#3CE698] font-semibold">3D DIGITAL TWIN SYNCHRONIZED</div>
          <div>CO-SIM ACCURACY: {telemetry.syncAccuracy}%</div>
          <div>CRANK SPEED: {telemetry.rpm} RPM</div>
          <div className="text-[#8BA3B3]">LEFT-CLICK + DRAG TO ROTATE // SCROLL TO ZOOM</div>
        </div>

        {/* 3D Floating Projected Telemetry Metric Badges */}
        <div className="absolute inset-0 pointer-events-none">
          {screenSensors.map((sp) => {
            const sensor = sensors3D.find((s) => s.id === sp.id);
            if (!sensor || !sp.visible) return null;

            const isWarning = sensor.status === 'warning';
            const isActive = activeSensor === sensor.id || hoveredSensor === sensor.id;

            return (
              <div
                key={`screen-sensor-${sensor.id}`}
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100 cursor-pointer"
                style={{ left: `${sp.x}px`, top: `${sp.y}px` }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSensor(activeSensor === sensor.id ? null : sensor.id);
                }}
                onMouseEnter={() => setHoveredSensor(sensor.id)}
                onMouseLeave={() => setHoveredSensor(null)}
              >
                <div
                  className={`px-2 py-1 rounded bg-[#08151F]/95 border backdrop-blur-sm flex items-center gap-1.5 shadow-lg transition-all ${
                    isActive
                      ? 'border-[#1AD1F5] bg-[#0B2538] scale-110 shadow-[0_0_12px_rgba(26,209,245,0.4)]'
                      : isWarning
                      ? 'border-[#FFB834]/80'
                      : 'border-[#142F3F] hover:border-[#1AD1F5]/80'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isWarning ? 'bg-[#FFB834]' : 'bg-[#1AD1F5]'
                    }`}
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-[7.5px] font-mono-tech uppercase tracking-wider text-[#8BA3B3]">
                      {sensor.label}
                    </span>
                    <span
                      className={`text-[10px] font-mono-tech font-bold leading-tight ${
                        isWarning ? 'text-[#FFB834]' : 'text-[#E6F4FF]'
                      }`}
                    >
                      {sensor.val}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Quick Action 3D Toolbar (Bottom-Left) */}
        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-1.5 bg-[#07121B]/90 border border-[#142F3F] p-1 rounded-md backdrop-blur-sm">
          {/* Camera Presets */}
          <div className="flex items-center gap-1 pr-1.5 border-r border-[#142F3F]">
            {(['iso', 'front', 'top', 'side', 'turbo'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => setPreset(preset)}
                className={`px-2 py-0.5 text-[9px] font-mono-tech uppercase rounded transition-colors cursor-pointer ${
                  cameraPreset === preset
                    ? 'bg-[#1AD1F5] text-[#04090F] font-bold'
                    : 'text-[#8BA3B3] hover:text-[#E6F4FF]'
                }`}
                title={`Camera View: ${preset}`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Auto-Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2 py-0.5 text-[9px] font-mono-tech uppercase rounded flex items-center gap-1 transition-colors cursor-pointer ${
              autoRotate
                ? 'bg-[#3CE698]/20 text-[#3CE698] border border-[#3CE698]/40'
                : 'text-[#8BA3B3] hover:text-[#E6F4FF]'
            }`}
            title="Toggle 3D Turntable Auto-Rotation"
          >
            {autoRotate ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
            AUTO-SPIN
          </button>

          {/* Wireframe toggle */}
          <button
            onClick={() => setWireframeOnly(!wireframeOnly)}
            className={`px-2 py-0.5 text-[9px] font-mono-tech uppercase rounded flex items-center gap-1 transition-colors cursor-pointer ${
              wireframeOnly
                ? 'bg-[#1AD1F5]/20 text-[#1AD1F5] border border-[#1AD1F5]/40'
                : 'text-[#8BA3B3] hover:text-[#E6F4FF]'
            }`}
            title="Toggle Wireframe Shell"
          >
            WIRE
          </button>

          {/* Zoom Buttons & Reset */}
          <div className="flex items-center gap-0.5 pl-1.5 border-l border-[#142F3F]">
            <button
              onClick={zoomIn}
              className="p-1 text-[#8BA3B3] hover:text-[#1AD1F5] rounded cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button
              onClick={zoomOut}
              className="p-1 text-[#8BA3B3] hover:text-[#1AD1F5] rounded cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <button
              onClick={resetCamera}
              className="p-1 text-[#8BA3B3] hover:text-[#1AD1F5] rounded cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Exploded View Slider (Bottom-Right) */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 bg-[#07121B]/90 border border-[#142F3F] px-2.5 py-1 rounded-md backdrop-blur-sm text-[10px] font-mono-tech">
          <Sliders className="w-3 h-3 text-[#1AD1F5]" />
          <span className="text-[#8BA3B3] uppercase">CAD EXPLODE:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={explodedRatio}
            onChange={(e) => setExplodedRatio(parseFloat(e.target.value))}
            className="w-20 sm:w-28 accent-[#1AD1F5] cursor-pointer"
          />
          <span className="text-[#1AD1F5] font-bold w-7 text-right">
            {Math.round(explodedRatio * 100)}%
          </span>
        </div>
      </div>

      {/* Sensor Deep-Dive Technical Detail Drawer */}
      {activeSensorObj && (
        <div className="w-full px-4 py-2.5 bg-[#0A1924] border-t border-[#1AD1F5]/40 flex flex-wrap items-center justify-between text-xs font-mono-tech gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[#1AD1F5]">
              <Compass className="w-4 h-4" />
              <span className="font-bold">{activeSensorObj.name}</span>
            </div>
            <span className="text-[#526E7E] hidden md:inline">|</span>
            <span className="text-[#8BA3B3] hidden md:inline">{activeSensorObj.subsystem}</span>
            <span className="text-[#526E7E] text-[10px] hidden lg:inline">({activeSensorObj.spec})</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] text-[#8BA3B3]">CURRENT TELEMETRY:</span>
              <span className="text-sm font-bold text-[#1AD1F5]">{activeSensorObj.val}</span>
            </div>
            <span
              className={`text-[9px] px-2 py-0.5 rounded border uppercase font-semibold ${
                activeSensorObj.status === 'warning'
                  ? 'bg-[#FFB834]/15 text-[#FFB834] border-[#FFB834]/40'
                  : 'bg-[#3CE698]/10 text-[#3CE698] border-[#3CE698]/30'
              }`}
            >
              {activeSensorObj.status === 'warning' ? 'ELEVATED SPEC' : 'NOMINAL ENVELOPE'}
            </span>
            <button
              onClick={() => {
                setActiveSensor(null);
                setHoveredSensor(null);
              }}
              className="text-[#8BA3B3] hover:text-[#E6F4FF] text-[11px] underline ml-1 cursor-pointer"
            >
              DISMISS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
