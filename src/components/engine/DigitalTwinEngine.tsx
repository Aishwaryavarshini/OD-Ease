import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Activity, Cpu, Layers, Eye, Gauge, Compass, Sliders, Info, AlertTriangle, Box, Sparkles } from 'lucide-react';
import { Engine3DView, ShadingMode } from './Engine3DView';

export interface DigitalTwinEngineProps {
  interactive?: boolean;
  viewModeDefault?: 'wireframe' | 'thermal' | 'mechanical';
  defaultFormat?: '3d' | '2d';
  className?: string;
  showLabels?: boolean;
  height?: string;
}

export const DigitalTwinEngine: React.FC<DigitalTwinEngineProps> = ({
  interactive = true,
  viewModeDefault = 'wireframe',
  defaultFormat = '3d',
  className = '',
  showLabels = true,
  height = '540px',
}) => {
  const { telemetry } = useTelemetry();
  const [format, setFormat] = useState<'3d' | '2d'>(defaultFormat);
  const [viewMode, setViewMode] = useState<'wireframe' | 'thermal' | 'mechanical'>(viewModeDefault);
  const [activeSensor, setActiveSensor] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Smooth animation frame tick for reciprocating pistons and crankshaft
  useEffect(() => {
    let animId: number;
    const animate = () => {
      setTick((prev) => (prev + 1) % 360);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Sensor definitions with exact coordinates on the 900x560 engineering drawing canvas
  const sensors = [
    {
      id: 'rpm',
      name: 'CRANKSHAFT HALL PICKUP',
      label: 'RPM',
      val: `${telemetry.rpm}`,
      unit: 'RPM',
      x: 235,
      y: 430,
      subsystem: 'Flywheel 60-2 Reluctor Wheel',
      status: telemetry.rpm > 2650 ? 'warning' : 'healthy',
      spec: 'Dual-redundant Hall magnetoresistive transducer (MIL-STD-810G)',
      calib: '±0.5 RPM resolution @ 50 Hz acquisition',
    },
    {
      id: 'cht',
      name: 'CYLINDER HEAD THERMOCOUPLE',
      label: 'CHT',
      val: `${telemetry.cht}°C`,
      unit: '°C',
      x: 375,
      y: 195,
      subsystem: 'Cylinder #2 Head Deck Jacket',
      status: telemetry.cht > 175 ? 'warning' : 'healthy',
      spec: 'K-Type Inconel-sheathed immersed thermocouple probe',
      calib: 'NIST calibrated -40°C to +300°C (±0.8°C)',
    },
    {
      id: 'fuel',
      name: 'COMMON RAIL HIGH-PRESSURE TRANSDUCER',
      label: 'FUEL PRESS',
      val: `${telemetry.fuelPressure} bar`,
      unit: 'bar',
      x: 450,
      y: 125,
      subsystem: 'Forged Common Rail (1600 bar nominal)',
      status: 'healthy',
      spec: 'Piezoresistive diaphragm sensor with integrated ASIC',
      calib: 'Operating range 0–2200 bar (0.1 bar delta)',
    },
    {
      id: 'boost',
      name: 'MANIFOLD ABSOLUTE PRESSURE (MAP)',
      label: 'BOOST',
      val: `${telemetry.boostPressure} bar`,
      unit: 'bar',
      x: 185,
      y: 190,
      subsystem: 'Compressor Charge Plenum Duct',
      status: 'healthy',
      spec: 'Absolute pressure piezoceramic element with temp compensation',
      calib: 'Calibrated for MSL to 30,000 ft operational ceiling',
    },
    {
      id: 'egt',
      name: 'EXHAUST GAS THERMOCOUPLE RAKE',
      label: 'EGT',
      val: `${telemetry.egt}°C`,
      unit: '°C',
      x: 690,
      y: 250,
      subsystem: 'Turbine Exhaust Collector Volute',
      status: telemetry.egt > 730 ? 'warning' : 'healthy',
      spec: 'Fast-response multi-junction Inconel 625 probe',
      calib: 'Response time < 180ms for transient flameout detection',
    },
    {
      id: 'oil',
      name: 'LUBRICATION GALLERY PRESSURE/TEMP',
      label: 'OIL PRESS',
      val: `${telemetry.oilPressure} bar`,
      unit: 'bar',
      x: 540,
      y: 430,
      subsystem: 'Main Bearing Oil Supply Gallery',
      status: telemetry.oilPressure < 3.8 ? 'warning' : 'healthy',
      spec: 'Combined fluid pressure & PT100 temperature sensor',
      calib: 'MIL-PRF-23699 synthetic turbine oil compatible',
    },
    {
      id: 'vib',
      name: 'TRI-AXIAL PIEZO ACCELEROMETER',
      label: 'VIB',
      val: `${telemetry.vibration}g`,
      unit: 'g',
      x: 330,
      y: 470,
      subsystem: 'Crankcase Engine Mount Webbing',
      status: telemetry.vibration > 3.0 ? 'warning' : 'healthy',
      spec: 'High-temperature shear-mode piezoelectric accelerometer',
      calib: 'Frequency response 2 Hz – 10 kHz (0.01g sensitivity)',
    },
  ];

  // Piston crank angles for 4-cylinder firing order (1-3-4-2)
  const rad = (tick * Math.PI) / 180;
  const strokeAmp = 18; // mm piston stroke visual displacement

  // Cylinder kinematics: X coordinates & piston displacements
  const cylinders = [
    { id: 1, x: 310, angle: rad },
    { id: 2, x: 400, angle: rad + Math.PI },
    { id: 3, x: 490, angle: rad + Math.PI },
    { id: 4, x: 580, angle: rad },
  ].map((cyl) => {
    // True reciprocating piston motion approximation
    const disp = Math.cos(cyl.angle) * strokeAmp;
    return {
      ...cyl,
      disp,
      pistonY: 220 + disp,
      conRodAngle: Math.sin(cyl.angle) * 12,
    };
  });

  return (
    <div className={`relative flex flex-col items-center select-none overflow-hidden ${className}`}>
      {/* Top Engineering Mode & Model Header Bar */}
      {interactive && (
        <div className="w-full flex flex-wrap items-center justify-between px-3 py-2 border-b border-[#142F3F] bg-[#07121B] z-20 gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono-tech text-[#1AD1F5] font-semibold">
              <Cpu className="w-3.5 h-3.5 text-[#1AD1F5]" />
              <span>DRDO/VRDE 180 HP UAV DIESEL</span>
            </div>
            <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-[#1AD1F5]/10 text-[#1AD1F5] border border-[#1AD1F5]/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              CAD DIGITAL TWIN
            </span>
          </div>

          {/* Model Format Switcher: 3D CAD MODEL vs 2D BLUEPRINT */}
          <div className="flex items-center gap-1 bg-[#050E16] p-0.5 rounded border border-[#142F3F]">
            <button
              onClick={() => setFormat('3d')}
              className={`px-3 py-1 text-[11px] font-mono-tech rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                format === '3d'
                  ? 'bg-[#1AD1F5] text-[#04090F] font-bold shadow-[0_0_10px_rgba(26,209,245,0.4)]'
                  : 'text-[#8BA3B3] hover:text-[#E6F4FF]'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D CAD MODEL</span>
            </button>
            <button
              onClick={() => setFormat('2d')}
              className={`px-3 py-1 text-[11px] font-mono-tech rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                format === '2d'
                  ? 'bg-[#1AD1F5] text-[#04090F] font-bold shadow-[0_0_10px_rgba(26,209,245,0.4)]'
                  : 'text-[#8BA3B3] hover:text-[#E6F4FF]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>2D BLUEPRINT</span>
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#0A1924] p-0.5 rounded border border-[#142F3F]">
            <button
              onClick={() => setViewMode('wireframe')}
              className={`px-2.5 py-1 text-[10px] font-mono-tech rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'wireframe'
                  ? 'bg-[#1AD1F5] text-[#04090F] font-bold shadow-sm'
                  : 'text-[#8BA3B3] hover:text-[#E6F4FF]'
              }`}
            >
              <Eye className="w-3 h-3" />
              CAD BLUEPRINT
            </button>
            <button
              onClick={() => setViewMode('thermal')}
              className={`px-2.5 py-1 text-[10px] font-mono-tech rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'thermal'
                  ? 'bg-[#FFB834] text-[#04090F] font-bold shadow-sm'
                  : 'text-[#8BA3B3] hover:text-[#E6F4FF]'
              }`}
            >
              <Layers className="w-3 h-3" />
              THERMODYNAMICS
            </button>
            <button
              onClick={() => setViewMode('mechanical')}
              className={`px-2.5 py-1 text-[10px] font-mono-tech rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'mechanical'
                  ? 'bg-[#3CE698] text-[#04090F] font-bold shadow-sm'
                  : 'text-[#8BA3B3] hover:text-[#E6F4FF]'
              }`}
            >
              <Activity className="w-3 h-3" />
              STRESS / FEA
            </button>
          </div>
        </div>
      )}

      {/* Render 3D CAD Model OR 2D Schematic Cutaway */}
      {format === '3d' ? (
        <div className="w-full">
          <Engine3DView
            interactive={interactive}
            shadingMode={
              viewMode === 'wireframe'
                ? 'blueprint'
                : viewMode === 'thermal'
                ? 'thermal'
                : viewMode === 'mechanical'
                ? 'mechanical'
                : 'solid'
            }
            onShadingModeChange={(m) => {
              if (m === 'blueprint') setViewMode('wireframe');
              else if (m === 'thermal') setViewMode('thermal');
              else if (m === 'mechanical') setViewMode('mechanical');
              else setViewMode('solid');
            }}
            showControls={false}
            height={height}
            className="border-0 rounded-none"
          />
        </div>
      ) : (
        /* Main SVG Blueprint Visualization Viewport */
        <div className="relative w-full aspect-[900/540] max-h-[560px] bg-[#050E16] flex items-center justify-center p-1">
        {/* Subtle Precision Technical Coordinate Grid */}
        <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

        {/* Technical Corner Annotations & Specifications */}
        <div className="absolute top-3 left-3 text-[9px] font-mono-tech text-[#526E7E] pointer-events-none leading-relaxed">
          <div className="text-[#8BA3B3] font-semibold">UNIT: DRDO-VRDE 180 HP</div>
          <div>DISP: 1998cc // 4-STROKE CI</div>
          <div>CONFIG: IN-LINE 4 CYLINDER</div>
          <div>BORE: 84.0mm × STROKE: 90.0mm</div>
        </div>

        <div className="absolute top-3 right-3 text-[9px] font-mono-tech text-right text-[#526E7E] pointer-events-none leading-relaxed">
          <div className="text-[#1AD1F5] font-semibold">CO-SIM SYNC: {telemetry.syncAccuracy}%</div>
          <div>INJ: BOSCH CRDi 1600 BAR</div>
          <div>ASPIRATION: TURBOCHARGED + IC</div>
          <div>STATUS: {telemetry.health > 90 ? 'NOMINAL FLIGHT ENVELOPE' : 'ELEVATED MONITORING'}</div>
        </div>

        {/* Laser Scanning Sweep Bar */}
        <div
          className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-[#1AD1F5]/10 to-transparent pointer-events-none z-10 animate-scan"
          style={{ width: '80px' }}
        >
          <div className="w-[1px] h-full bg-[#1AD1F5]/60" />
        </div>

        {/* Aerospace Engine Cutaway SVG */}
        <svg
          viewBox="0 0 900 540"
          className="w-full h-full max-h-full overflow-visible select-none drop-shadow-lg"
        >
          <defs>
            {/* Aerospace Metal Gradients */}
            <linearGradient id="crankcaseCasting" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0D202D" />
              <stop offset="60%" stopColor="#091823" />
              <stop offset="100%" stopColor="#051017" />
            </linearGradient>

            <linearGradient id="machinedSteel" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#142C3C" />
              <stop offset="50%" stopColor="#22485E" />
              <stop offset="100%" stopColor="#142C3C" />
            </linearGradient>

            <linearGradient id="cylinderSleeve" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0B1C28" />
              <stop offset="15%" stopColor="#183649" />
              <stop offset="85%" stopColor="#183649" />
              <stop offset="100%" stopColor="#0B1C28" />
            </linearGradient>

            <linearGradient id="thermalFieldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#071926" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#1AD1F5" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#FFB834" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FF4D61" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="feaStressGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#0B202F" />
              <stop offset="40%" stopColor="#1AD1F5" stopOpacity="0.6" />
              <stop offset="75%" stopColor="#3CE698" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFB834" stopOpacity="0.9" />
            </linearGradient>

            {/* Cross-hatch pattern for cylinder liner honing */}
            <pattern id="honingHatch" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M0 16 L16 0 M0 0 L16 16" stroke="#16384C" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
          </defs>

          {/* ========================================================================= */}
          {/* 1. CRANKCASE & ENGINE MOUNT CHASSIS                                      */}
          {/* ========================================================================= */}
          <g id="engine-block-casting">
            {/* Main Cast Aluminum Block Envelope */}
            <polygon
              points="220,470 670,470 690,320 675,180 215,180 200,320"
              fill={
                viewMode === 'thermal'
                  ? 'url(#thermalFieldGrad)'
                  : viewMode === 'mechanical'
                  ? 'url(#feaStressGrad)'
                  : 'url(#crankcaseCasting)'
              }
              stroke={viewMode === 'wireframe' ? '#1AD1F5' : '#1C4258'}
              strokeWidth="1.5"
            />

            {/* Block Structural Reinforcement Webbing */}
            {[265, 355, 445, 535, 625].map((xWeb, i) => (
              <g key={`web-${i}`}>
                <line x1={xWeb} y1="320" x2={xWeb} y2="470" stroke="#142F3F" strokeWidth="1.5" strokeDasharray="6 3" />
                <circle cx={xWeb} cy="470" r="3" fill="#0A1924" stroke="#1AD1F5" strokeWidth="1" />
              </g>
            ))}

            {/* Lower Oil Sump Pan */}
            <path
              d="M 250 470 L 270 510 L 620 510 L 640 470 Z"
              fill="#06121B"
              stroke="#1C4258"
              strokeWidth="1.5"
            />
            {/* Oil baffle level line */}
            <line x1="285" y1="495" x2="605" y2="495" stroke="#FFB834" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.7" />
            <text x="615" y="498" fill="#FFB834" fontSize="8" fontFamily="monospace">OIL LVL</text>
            <circle cx="280" cy="505" r="4" fill="#0A1924" stroke="#1C4258" strokeWidth="1" />
          </g>

          {/* ========================================================================= */}
          {/* 2. FOUR IN-LINE CYLINDERS WITH RECIPROCATING ASSEMBLIES                  */}
          {/* ========================================================================= */}
          <g id="cylinders-reciprocating">
            {cylinders.map((cyl) => (
              <g key={`cyl-assembly-${cyl.id}`} id={`cyl-${cyl.id}`}>
                {/* Cylinder Sleeve Outer Wall */}
                <rect
                  x={cyl.x - 36}
                  y="180"
                  width="72"
                  height="140"
                  fill="url(#cylinderSleeve)"
                  stroke={viewMode === 'wireframe' ? '#1AD1F5' : '#142F3F'}
                  strokeWidth="1.5"
                />

                {/* Micro-Honed Cylinder Wall Texture */}
                <rect
                  x={cyl.x - 34}
                  y="182"
                  width="68"
                  height="136"
                  fill="url(#honingHatch)"
                  opacity="0.7"
                />

                {/* Cylinder Water Jacket Cooling Passages */}
                <path
                  d={`M ${cyl.x - 42} 190 L ${cyl.x - 38} 190 L ${cyl.x - 38} 280 L ${cyl.x - 42} 280 Z`}
                  fill="#0B2A3E"
                  stroke="#1AD1F5"
                  strokeWidth="0.75"
                  strokeOpacity="0.5"
                />
                <path
                  d={`M ${cyl.x + 38} 190 L ${cyl.x + 42} 190 L ${cyl.x + 42} 280 L ${cyl.x + 38} 280 Z`}
                  fill="#0B2A3E"
                  stroke="#1AD1F5"
                  strokeWidth="0.75"
                  strokeOpacity="0.5"
                />

                {/* PISTON CROWN & RE-ENTRANT COMBUSTION BOWL */}
                <g transform={`translate(0, ${cyl.disp})`}>
                  {/* Piston Body */}
                  <rect
                    x={cyl.x - 32}
                    y="195"
                    width="64"
                    height="42"
                    fill={
                      viewMode === 'thermal'
                        ? cyl.id === 2 && telemetry.egt > 730
                          ? '#FF4D61'
                          : '#FFB834'
                        : viewMode === 'mechanical'
                        ? '#1AD1F5'
                        : '#0F2636'
                    }
                    stroke="#1AD1F5"
                    strokeWidth="1.2"
                    rx="1"
                  />

                  {/* Re-entrant Direct-Injection Combustion Bowl Profile */}
                  <path
                    d={`M ${cyl.x - 18} 195 C ${cyl.x - 12} 205, ${cyl.x + 12} 205, ${cyl.x + 18} 195 Z`}
                    fill="#07141E"
                    stroke="#1AD1F5"
                    strokeWidth="1"
                  />

                  {/* 3 Compression & Oil Scraper Ring Grooves */}
                  <line x1={cyl.x - 32} y1="202" x2={cyl.x + 32} y2="202" stroke="#1AD1F5" strokeWidth="1" strokeOpacity="0.7" />
                  <line x1={cyl.x - 32} y1="207" x2={cyl.x + 32} y2="207" stroke="#1AD1F5" strokeWidth="1" strokeOpacity="0.7" />
                  <line x1={cyl.x - 32} y1="212" x2={cyl.x + 32} y2="212" stroke="#1AD1F5" strokeWidth="1" strokeOpacity="0.7" />

                  {/* Gudgeon (Wrist) Pin & Bushing */}
                  <circle cx={cyl.x} cy="222" r="7" fill="#0A1822" stroke="#1AD1F5" strokeWidth="1.5" />
                  <circle cx={cyl.x} cy="222" r="3" fill="#1AD1F5" />

                  {/* Combustion Chamber Fuel Atomization Plumes (Simulated Injector Spray) */}
                  {cyl.id === ((Math.floor(tick / 90) % 4) + 1) && (
                    <g opacity="0.8">
                      <polygon
                        points={`${cyl.x},180 ${cyl.x - 14},194 ${cyl.x + 14},194`}
                        fill="#FFB834"
                        opacity="0.5"
                      />
                      <line x1={cyl.x} y1="180" x2={cyl.x - 12} y2="194" stroke="#FF4D61" strokeWidth="1" />
                      <line x1={cyl.x} y1="180" x2={cyl.x + 12} y2="194" stroke="#FF4D61" strokeWidth="1" />
                    </g>
                  )}
                </g>

                {/* CONNECTING ROD (H-Beam Profile) */}
                <g>
                  {/* Small end at wrist pin */}
                  <line
                    x1={cyl.x}
                    y1={222 + cyl.disp}
                    x2={cyl.x + Math.sin(cyl.angle) * 16}
                    y2={370 - cyl.disp * 0.3}
                    stroke="#1AD1F5"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeOpacity="0.9"
                  />
                  {/* Flanged H-beam center groove */}
                  <line
                    x1={cyl.x}
                    y1={222 + cyl.disp}
                    x2={cyl.x + Math.sin(cyl.angle) * 16}
                    y2={370 - cyl.disp * 0.3}
                    stroke="#0A1822"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* Big-End Rod Cap & Journal Bearing */}
                  <circle
                    cx={cyl.x + Math.sin(cyl.angle) * 16}
                    cy={370 - cyl.disp * 0.3}
                    r="10"
                    fill="#081822"
                    stroke="#1AD1F5"
                    strokeWidth="1.5"
                  />
                </g>

                {/* Cylinder Identification Callout */}
                <text
                  x={cyl.x}
                  y="335"
                  textAnchor="middle"
                  fill="#526E7E"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  CYL {cyl.id}
                </text>
              </g>
            ))}
          </g>

          {/* ========================================================================= */}
          {/* 3. FORGED CRANKSHAFT & RELUCTOR FLYWHEEL                                 */}
          {/* ========================================================================= */}
          <g id="crankshaft-assembly">
            {/* Main Crankshaft Centerline Axis */}
            <line x1="220" y1="370" x2="660" y2="370" stroke="#1AD1F5" strokeWidth="2" strokeDasharray="14 4" strokeOpacity="0.5" />

            {/* Counterweight webs for each throw */}
            {[310, 400, 490, 580].map((xCenter, idx) => (
              <g key={`cw-${idx}`}>
                <path
                  d={`M ${xCenter - 22} 370 C ${xCenter - 25} 415, ${xCenter + 25} 415, ${xCenter + 22} 370 Z`}
                  fill="#0D202E"
                  stroke="#1C4258"
                  strokeWidth="1.2"
                />
                {/* 45° Cross-drilled oil passage holes */}
                <circle cx={xCenter} cy="390" r="2.5" fill="#FFB834" stroke="#050E16" strokeWidth="0.5" />
              </g>
            ))}

            {/* Front Timing / Flywheel 60-2 Trigger Reluctor Wheel (Left) */}
            <g id="flywheel-reluctor">
              <rect x="215" y="325" width="16" height="90" rx="2" fill="#0A1822" stroke="#1AD1F5" strokeWidth="1.5" />
              {/* Reluctor pickup tooth markers */}
              {[...Array(9)].map((_, i) => (
                <rect key={`tooth-${i}`} x="212" y={332 + i * 9} width="3" height="4" fill="#1AD1F5" />
              ))}
              {/* Crankshaft Nose Extension to Propeller Reduction Hub */}
              <rect x="195" y="360" width="20" height="20" rx="1" fill="#0F2636" stroke="#1AD1F5" strokeWidth="1.2" />
            </g>
          </g>

          {/* ========================================================================= */}
          {/* 4. CYLINDER HEAD, DOHC VALVES & COMMON RAIL FUEL INJECTION                */}
          {/* ========================================================================= */}
          <g id="cylinder-head-valvetrain">
            {/* Head Assembly Cast Structure */}
            <rect x="235" y="115" width="430" height="65" rx="3" fill="#0B1D29" stroke="#1AD1F5" strokeWidth="1.5" />

            {/* DOHC Camshaft Tunnels (Intake & Exhaust) */}
            <line x1="245" y1="135" x2="655" y2="135" stroke="#1AD1F5" strokeWidth="3" strokeOpacity="0.4" />
            <line x1="245" y1="155" x2="655" y2="155" stroke="#1AD1F5" strokeWidth="3" strokeOpacity="0.4" />

            {/* Valve Springs & Poppet Valves for each cylinder */}
            {cylinders.map((cyl) => (
              <g key={`valves-${cyl.id}`}>
                {/* Intake Valve (Left) */}
                <line x1={cyl.x - 14} y1="145" x2={cyl.x - 14} y2="180" stroke="#1AD1F5" strokeWidth="1.5" />
                <polygon points={`${cyl.x - 20},180 ${cyl.x - 8},180 ${cyl.x - 14},175`} fill="#1AD1F5" />
                {/* Exhaust Valve (Right) */}
                <line x1={cyl.x + 14} y1="145" x2={cyl.x + 14} y2="180" stroke="#FFB834" strokeWidth="1.5" />
                <polygon points={`${cyl.x + 8},180 ${cyl.x + 20},180 ${cyl.x + 14},175`} fill="#FFB834" />

                {/* Common Rail Direct Injector Body */}
                <rect x={cyl.x - 3} y="105" width="6" height="40" fill="#07121B" stroke="#3CE698" strokeWidth="1" />
                {/* High pressure feeder line from main rail */}
                <path
                  d={`M ${cyl.x} 105 L ${cyl.x} 88`}
                  fill="none"
                  stroke="#3CE698"
                  strokeWidth="2"
                />
              </g>
            ))}

            {/* Main Forged Common Rail Manifold (1600 bar) */}
            <line x1="280" y1="88" x2="610" y2="88" stroke="#3CE698" strokeWidth="4" strokeLinecap="round" />
            <rect x="272" y="84" width="8" height="8" rx="1" fill="#0A1822" stroke="#3CE698" strokeWidth="1" />
            <rect x="610" y="84" width="10" height="8" rx="1" fill="#0A1822" stroke="#3CE698" strokeWidth="1" />
            <text x="445" y="78" textAnchor="middle" fill="#3CE698" fontSize="8" fontFamily="monospace" fontWeight="bold">
              COMMON RAIL HIGH-PRESSURE ACCUMULATOR (1600 BAR)
            </text>
          </g>

          {/* ========================================================================= */}
          {/* 5. TURBOCHARGER COMPRESSOR & CHARGE-AIR INTERCOOLER (LEFT)                */}
          {/* ========================================================================= */}
          <g id="turbocharger-induction">
            {/* Turbo Compressor Housing Outer Scroll Volute */}
            <path
              d="M 120 220 C 120 170, 180 160, 195 200 C 205 230, 180 270, 130 260 Z"
              fill="#0B1D28"
              stroke="#1AD1F5"
              strokeWidth="2"
            />
            {/* Inner Billet Aluminum Compressor Wheel */}
            <circle cx="155" cy="215" r="28" fill="#06121A" stroke="#1AD1F5" strokeWidth="1.2" strokeDasharray="4 2" />
            <circle cx="155" cy="215" r="8" fill="#1AD1F5" />
            {/* Compressor Impeller Blade Fins */}
            {[...Array(8)].map((_, i) => {
              const a = (i * 45 * Math.PI) / 180 + rad * 3;
              const x1 = 155 + Math.cos(a) * 8;
              const y1 = 215 + Math.sin(a) * 8;
              const x2 = 155 + Math.cos(a) * 26;
              const y2 = 215 + Math.sin(a) * 26;
              return <line key={`blade-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1AD1F5" strokeWidth="1.5" />;
            })}

            {/* High-Pressure Boost Delivery Duct to Intake Plenum */}
            <path
              d="M 175 190 Q 210 145 235 150"
              fill="none"
              stroke="#1AD1F5"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="8 4"
            />

            {/* Intercooler Core Outline */}
            <rect x="70" y="160" width="38" height="90" rx="2" fill="#08151E" stroke="#1AD1F5" strokeWidth="1.2" />
            {/* Intercooler heat exchange fins */}
            {[...Array(8)].map((_, i) => (
              <line key={`ic-fin-${i}`} x1="72" y1={168 + i * 10} x2="106" y2={168 + i * 10} stroke="#142F3F" strokeWidth="1" />
            ))}
            <text x="89" y="262" textAnchor="middle" fill="#526E7E" fontSize="8" fontFamily="monospace">INTERCOOLER</text>
            <text x="155" y="278" textAnchor="middle" fill="#1AD1F5" fontSize="8" fontFamily="monospace" fontWeight="bold">TURBO COMPRESSOR</text>
          </g>

          {/* ========================================================================= */}
          {/* 6. EXHAUST MANIFOLD & TURBINE HOUSING (RIGHT)                            */}
          {/* ========================================================================= */}
          <g id="exhaust-turbine-subsystem">
            {/* Stainless Steel Tuned Exhaust Runners Converging */}
            <path
              d="M 645 160 Q 690 180 715 220 L 735 235"
              fill="none"
              stroke={telemetry.egt > 730 ? '#FF4D61' : '#FFB834'}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 645 180 Q 685 195 715 225 L 735 235"
              fill="none"
              stroke={telemetry.egt > 730 ? '#FF4D61' : '#FFB834'}
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Radial Inflow Exhaust Turbine Housing */}
            <circle
              cx="745"
              cy="245"
              r="34"
              fill="#0E1820"
              stroke={telemetry.egt > 730 ? '#FF4D61' : '#FFB834'}
              strokeWidth="2"
            />
            <circle cx="745" cy="245" r="18" fill="#071017" stroke="#FFB834" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="745" cy="245" r="6" fill="#FFB834" />

            {/* Wastegate Actuator Canister & Linkage Arm */}
            <rect x="765" y="185" width="22" height="15" rx="2" fill="#0A1822" stroke="#1C4258" strokeWidth="1" />
            <line x1="775" y1="200" x2="755" y2="225" stroke="#1AD1F5" strokeWidth="1.5" />

            {/* Exhaust Tailpipe Discharge */}
            <path
              d="M 770 260 L 820 285 L 820 305 L 760 275 Z"
              fill="#0A131A"
              stroke="#FFB834"
              strokeWidth="1.2"
              strokeOpacity="0.7"
            />
            <text x="745" y="295" textAnchor="middle" fill="#FFB834" fontSize="8" fontFamily="monospace" fontWeight="bold">
              TURBINE HOUSING
            </text>
          </g>

          {/* ========================================================================= */}
          {/* 7. PRECISION SENSOR TAP NODES & LEADER LINES                             */}
          {/* ========================================================================= */}
          {sensors.map((sensor) => {
            const isHovered = activeSensor === sensor.id;
            const isWarning = sensor.status === 'warning';
            const nodeColor = isWarning ? '#FFB834' : '#1AD1F5';

            return (
              <g
                key={`sensor-node-${sensor.id}`}
                className="cursor-pointer group"
                onClick={() => setActiveSensor(isHovered ? null : sensor.id)}
                onMouseEnter={() => setActiveSensor(sensor.id)}
                onMouseLeave={() => setActiveSensor(null)}
              >
                {/* Concentric Precision Reticle Rings */}
                <circle
                  cx={sensor.x}
                  cy={sensor.y}
                  r="12"
                  fill="none"
                  stroke={nodeColor}
                  strokeWidth="0.75"
                  strokeDasharray="2 2"
                  opacity={isHovered ? 1 : 0.6}
                />
                <circle
                  cx={sensor.x}
                  cy={sensor.y}
                  r="6"
                  fill="#050E16"
                  stroke={nodeColor}
                  strokeWidth="1.5"
                />
                <circle cx={sensor.x} cy={sensor.y} r="2.5" fill={nodeColor} />

                {/* Leader Line to HUD Label */}
                {showLabels && (
                  <g>
                    <line
                      x1={sensor.x}
                      y1={sensor.y}
                      x2={sensor.x + (sensor.x > 450 ? 30 : -30)}
                      y2={sensor.y - 20}
                      stroke={nodeColor}
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={sensor.x + (sensor.x > 450 ? 30 : -30)}
                      cy={sensor.y - 20}
                      r="1.5"
                      fill={nodeColor}
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Telemetry Metric Pills Anchored to Sensor Positions */}
        {showLabels && (
          <div className="absolute inset-0 pointer-events-none">
            {sensors.map((sensor) => {
              const leftPct = (sensor.x / 900) * 100;
              const topPct = (sensor.y / 540) * 100;
              const isWarning = sensor.status === 'warning';
              const isHovered = activeSensor === sensor.id;

              return (
                <div
                  key={`badge-${sensor.id}`}
                  className={`absolute pointer-events-auto transform -translate-y-8 transition-transform duration-150 cursor-pointer ${
                    sensor.x > 450 ? 'translate-x-4' : '-translate-x-full -ml-3'
                  }`}
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                  onClick={() => setActiveSensor(activeSensor === sensor.id ? null : sensor.id)}
                >
                  <div
                    className={`px-2 py-1 rounded bg-[#08151F]/95 border backdrop-blur-sm flex items-center gap-1.5 ${
                      isHovered
                        ? 'border-[#1AD1F5] bg-[#0A1D2B]'
                        : isWarning
                        ? 'border-[#FFB834]/80'
                        : 'border-[#142F3F] hover:border-[#1AD1F5]/60'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isWarning ? 'bg-[#FFB834]' : 'bg-[#1AD1F5]'
                      }`}
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-[8px] font-mono-tech uppercase tracking-wider text-[#8BA3B3]">
                        {sensor.label}
                      </span>
                      <span
                        className={`text-[11px] font-mono-tech font-bold leading-none ${
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
        )}
      </div>
      )}

      {/* Sensor Deep-Dive Technical Drawer (2D Mode) */}
      {format === '2d' && activeSensor && (
        <div className="w-full px-4 py-2.5 bg-[#0A1924] border-t border-[#1AD1F5]/40 flex flex-wrap items-center justify-between text-xs font-mono-tech gap-3">
          {(() => {
            const current = sensors.find((s) => s.id === activeSensor);
            if (!current) return null;
            return (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[#1AD1F5]">
                    <Gauge className="w-4 h-4" />
                    <span className="font-bold">{current.name}</span>
                  </div>
                  <span className="text-[#526E7E] hidden md:inline">|</span>
                  <span className="text-[#8BA3B3] hidden md:inline">{current.subsystem}</span>
                  <span className="text-[#526E7E] text-[10px] hidden lg:inline">({current.spec})</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[10px] text-[#8BA3B3]">CURRENT:</span>
                    <span className="text-sm font-bold text-[#1AD1F5]">{current.val}</span>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded border uppercase font-semibold ${
                      current.status === 'warning'
                        ? 'bg-[#FFB834]/15 text-[#FFB834] border-[#FFB834]/40'
                        : 'bg-[#3CE698]/10 text-[#3CE698] border-[#3CE698]/30'
                    }`}
                  >
                    {current.status === 'warning' ? 'ELEVATED' : 'NOMINAL SPEC'}
                  </span>
                  <button
                    onClick={() => setActiveSensor(null)}
                    className="text-[#8BA3B3] hover:text-[#E6F4FF] text-[11px] underline ml-1 cursor-pointer"
                  >
                    DISMISS
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
