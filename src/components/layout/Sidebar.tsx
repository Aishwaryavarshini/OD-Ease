import React from 'react';
import { PageRoute } from '../../types';
import { useTelemetry } from '../../context/TelemetryContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  LayoutDashboard, 
  Cpu, 
  Activity, 
  Wrench, 
  Navigation, 
  Settings, 
  Sliders,
  Sun,
  Moon
} from 'lucide-react';

interface SidebarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate, className = '' }) => {
  const { faults, setIsSimModalOpen } = useTelemetry();
  const { isLight, toggleTheme } = useTheme();

  const commandItems: { label: string; route: PageRoute; icon: React.ReactNode; count?: number }[] = [
    { label: 'Dashboard', route: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Digital Twin', route: '/digital-twin', icon: <Cpu className="w-4 h-4" /> },
    { label: 'Telemetry', route: '/telemetry', icon: <Activity className="w-4 h-4" /> },
    { label: 'Diagnostics', route: '/diagnostics', icon: <Wrench className="w-4 h-4" />, count: faults.filter(f => f.severity !== 'healthy').length },
    { label: 'Mission Reliability', route: '/mission', icon: <Navigation className="w-4 h-4" /> },
  ];

  return (
    <aside className={`w-64 bg-[#050E16] border-r border-[#142F3F] flex flex-col justify-between shrink-0 select-none ${className}`}>
      {/* Top Branding */}
      <div>
        <div
          onClick={() => onNavigate('/')}
          className="p-3.5 border-b border-[#142F3F] flex items-center gap-3 cursor-pointer hover:bg-[#08151F] transition-colors"
        >
          <div className="w-8 h-8 rounded bg-[#08151F] border border-[#142F3F] flex items-center justify-center">
            <Cpu className="w-4 h-4 text-[#1AD1F5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-mono-tech font-bold tracking-widest text-[#E6F4FF]">
              AEROTWIN
            </span>
            <span className="text-[9px] font-mono-tech tracking-wider text-[#8BA3B3]">
              MISSION CONTROL // MALE UAV
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-5">
          {/* Section: COMMAND */}
          <div>
            <div className="px-3 mb-2 text-[9px] font-mono-tech tracking-widest uppercase text-[#526E7E] font-semibold">
              COMMAND SUBSYSTEMS
            </div>
            <div className="space-y-0.5">
              {commandItems.map((item) => {
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => onNavigate(item.route)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono-tech uppercase tracking-wider rounded transition-colors group ${
                      isActive
                        ? 'bg-[#08151F] text-[#1AD1F5] font-semibold border-l-2 border-[#1AD1F5]'
                        : 'text-[#8BA3B3] hover:text-[#E6F4FF] hover:bg-[#08151F]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-[#1AD1F5]' : 'text-[#526E7E] group-hover:text-[#E6F4FF]'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.count !== undefined && item.count > 0 && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#FFB834]/15 text-[#FFB834] border border-[#FFB834]/40 font-bold">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: SYSTEM */}
          <div>
            <div className="px-3 mb-2 text-[9px] font-mono-tech tracking-widest uppercase text-[#526E7E] font-semibold">
              SIMULATION & CONTROLS
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => setIsSimModalOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono-tech uppercase tracking-wider rounded text-[#8BA3B3] hover:text-[#E6F4FF] hover:bg-[#08151F]/60 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 text-[#1AD1F5]" />
                  <span>Fault Injector</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1AD1F5]/10 text-[#1AD1F5] border border-[#1AD1F5]/30">
                  SIM
                </span>
              </button>

              <button
                onClick={() => onNavigate('/')}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono-tech uppercase tracking-wider rounded text-[#8BA3B3] hover:text-[#E6F4FF] hover:bg-[#08151F]/60 transition-colors"
              >
                <Settings className="w-4 h-4 text-[#526E7E]" />
                <span>Executive Overview</span>
              </button>

              <button
                onClick={toggleTheme}
                title={`Switch to ${isLight ? 'Dark' : 'Light'} Theme`}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono-tech uppercase tracking-wider rounded text-[#8BA3B3] hover:text-[#E6F4FF] hover:bg-[#08151F]/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {isLight ? (
                    <Sun className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-[#1AD1F5]" />
                  )}
                  <span>{isLight ? 'Light Theme' : 'Dark Theme'}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-[#1AD1F5] border border-sky-500/30">
                  {isLight ? 'LIGHT' : 'DARK'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Engine Hardware Metadata */}
      <div className="p-3 border-t border-[#142F3F] bg-[#04090F] font-mono-tech">
        <div className="p-2.5 rounded bg-[#08151F] border border-[#142F3F] space-y-1 text-xs">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[#526E7E]">TARGET ENGINE:</span>
            <span className="font-bold text-[#1AD1F5]">DRDO VRDE-180</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[#526E7E]">AVIONICS LINK:</span>
            <span className="flex items-center gap-1.5 text-[#3CE698] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3CE698]" />
              ARINC-429 OK
            </span>
          </div>
          <div className="text-[9px] text-[#526E7E] pt-1 border-t border-[#142F3F] truncate">
            RATING: 180 HP @ 2500 RPM
          </div>
        </div>
      </div>
    </aside>
  );
};
