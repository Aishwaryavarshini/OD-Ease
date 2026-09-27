import React from 'react';
import { PageRoute } from '../../types';
import { Cpu, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const links: { label: string; route: PageRoute }[] = [
    { label: 'Overview', route: '/' },
    { label: 'Digital Twin', route: '/digital-twin' },
    { label: 'Telemetry', route: '/telemetry' },
    { label: 'Diagnostics', route: '/diagnostics' },
    { label: 'Mission', route: '/mission' },
  ];

  return (
    <footer className="bg-[#050B12] border-t border-[#173342] text-xs font-mono-tech select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[#0B1D28] border border-[#19C7F1]/60 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-[#19C7F1]" />
              </div>
              <span className="text-lg font-bold tracking-widest text-[#E8F5FF]">AEROTWIN</span>
            </div>
            <div className="text-[11px] text-[#19C7F1] tracking-wider uppercase font-semibold">
              AI DIGITAL TWIN // UAV ENGINE INTELLIGENCE
            </div>
            <p className="text-xs text-[#78919F] max-w-md font-sans leading-relaxed">
              Real-time digital twin system for health monitoring, multivariate temporal fault prediction, degradation tracking, remaining useful life estimation, and mission reliability of MALE UAV aero piston engines.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B1D28] border border-[#173342] text-[10px] text-[#506C79]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#42DFA0]" />
              TARGET ARCHITECTURE: DRDO / VRDE 180 HP DIESEL
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <div className="text-[11px] text-[#506C79] uppercase tracking-widest font-bold">
              SYSTEM MODULES
            </div>
            <ul className="space-y-1.5 text-[#78919F]">
              {links.map((link) => (
                <li key={link.route}>
                  <button
                    onClick={() => onNavigate(link.route)}
                    className="hover:text-[#19C7F1] transition-colors uppercase cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Prototype Disclosure */}
          <div className="space-y-2.5">
            <div className="text-[11px] text-[#506C79] uppercase tracking-widest font-bold">
              COMPLIANCE & DEMO
            </div>
            <p className="text-[11px] text-[#78919F] leading-relaxed">
              This application is a frontend demonstration prototype for technical evaluation and presentation. All sensor streams, health indices, and predictions are generated via the client-side simulation engine.
            </p>
            <div className="text-[10px] text-[#19C7F1]/80">
              SIMULATED TELEMETRY ACTIVE
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-[#173342]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-[#506C79]">
          <div>© {new Date().getFullYear()} AEROTWIN SYSTEMS. MALE UAV PROPULSION INTELLIGENCE.</div>
          <div className="flex gap-4">
            <span>VRDE-180 COMPATIBLE</span>
            <span>LSTM TEMPORAL CORE</span>
            <span>SECURE AVIONICS BUS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
