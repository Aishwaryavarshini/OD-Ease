import React, { useState, useEffect } from 'react';
import { PageRoute } from '../../types';
import { useTelemetry } from '../../context/TelemetryContext';
import { Shield, Cpu, Activity, Sliders, Menu, X } from 'lucide-react';
import { Button } from '../common/Button';
import { ThemeToggle } from '../common/ThemeToggle';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { isPaused, setIsSimModalOpen } = useTelemetry();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; route: PageRoute }[] = [
    { label: 'Overview', route: '/' },
    { label: 'Digital Twin', route: '/digital-twin' },
    { label: 'Telemetry', route: '/telemetry' },
    { label: 'Mission Reliability', route: '/mission' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || currentRoute !== '/'
          ? 'bg-[#050B12]/95 backdrop-blur-md border-b border-[#173342] shadow-lg'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-9 h-9 rounded bg-[#0B1D28] border border-[#19C7F1]/60 flex items-center justify-center shadow-[0_0_12px_rgba(25,199,241,0.25)] group-hover:border-[#19C7F1] transition-all">
            <Cpu className="w-5 h-5 text-[#19C7F1]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#42DFA0] animate-pulse" />
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-mono-tech font-bold tracking-[0.2em] text-[#E8F5FF] group-hover:text-[#19C7F1] transition-colors">
              AEROTWIN
            </span>
            <span className="text-[9px] font-mono-tech tracking-widest text-[#78919F] uppercase">
              AI DIGITAL TWIN // UAV INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-[#0B1D28]/60 p-1 rounded-md border border-[#173342]/80">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => onNavigate(item.route)}
                className={`px-3 py-1.5 text-xs font-mono-tech tracking-wider uppercase rounded transition-all ${
                  isActive
                    ? 'bg-[#19C7F1]/15 text-[#19C7F1] font-semibold border border-[#19C7F1]/40 shadow-[0_0_10px_rgba(25,199,241,0.2)]'
                    : 'text-[#78919F] hover:text-[#E8F5FF] hover:bg-[#0E2430]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Actions: Demo Simulation Pill + Theme Toggle + Command Center CTA */}
        <div className="hidden sm:flex items-center gap-2.5">
          <ThemeToggle showLabel={true} />

          <button
            onClick={() => setIsSimModalOpen(true)}
            title="Configure Simulated Engine Telemetry"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] font-mono-tech border border-[#173342] bg-[#071019] text-[#78919F] hover:text-[#19C7F1] hover:border-[#19C7F1]/50 transition-all cursor-pointer"
          >
            <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-[#FFC857]' : 'bg-[#42DFA0] animate-pulse'}`} />
            <span>{isPaused ? 'PAUSED' : 'LIVE DEMO'}</span>
            <Sliders className="w-3 h-3 ml-1 text-[#19C7F1]" />
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('/dashboard')}
            glow
          >
            Launch Command Center
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsSimModalOpen(true)}
            className="p-1.5 rounded border border-[#173342] text-[#19C7F1]"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded text-[#78919F] hover:text-[#E8F5FF] focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#071019] border-b border-[#173342] px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.route}
              onClick={() => {
                onNavigate(item.route);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-mono-tech uppercase tracking-wider rounded ${
                currentRoute === item.route
                  ? 'bg-[#19C7F1]/20 text-[#19C7F1] font-bold border border-[#19C7F1]/40'
                  : 'text-[#78919F] hover:text-[#E8F5FF]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#173342]">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => {
                onNavigate('/dashboard');
                setMobileMenuOpen(false);
              }}
            >
              Launch Command Center
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
