'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// AGENTOS AAA GALLERY - Multi-Widget Dashboard
// ═══════════════════════════════════════════════════════════════════════════

export default function AAAGallery() {
  return (
    <div className="min-h-screen relative">
      {/* Graphite Background */}
      <div className="graphite-bg" />
      <div className="grid-hint" />

      <main className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-8"
        >
          <div>
            <h1 className="text-title-lg">AgentOS — AAA Gallery</h1>
            <p className="text-subtitle mt-1">Multi-widget dashboard with various AAA effects</p>
          </div>
          <Orb />
        </motion.header>

        {/* Widget Grid */}
        <div className="grid grid-cols-3 gap-5">
          {/* Row 1: Stats Cards */}
          <StatCard value="247" label="Projects" delay={0} />
          <StatCard value="18" label="Active Agents" delay={0.1} color="purple" />
          <StatCard value="99.7%" label="Uptime" delay={0.2} color="cyan" />

          {/* Row 2: Inspector (Silver) + Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-2"
          >
            <InspectorCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <TerminalCard />
          </motion.div>

          {/* Row 3: Mixed Shell + Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-2"
          >
            <MixedShellCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <ActivityCard />
          </motion.div>

          {/* Row 4: Quick Actions + Memory Graph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <QuickActionsCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="col-span-2"
          >
            <MemoryGraphCard />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function Orb() {
  return (
    <div className="orb" />
  );
}

function LEDIndicator({ label = "Live" }: { label?: string }) {
  return (
    <div className="led-indicator">
      <div className="led-dot" />
      <span className="led-label">{label}</span>
    </div>
  );
}

function StatCard({ 
  value, 
  label, 
  delay = 0,
  color = "blue"
}: { 
  value: string; 
  label: string; 
  delay?: number;
  color?: "blue" | "purple" | "cyan";
}) {
  const colors = {
    blue: { bg: "rgba(59, 130, 246, 0.15)", border: "rgba(59, 130, 246, 0.3)", glow: "rgba(59, 130, 246, 0.5)", line: "rgba(59, 130, 246, 0.6)" },
    purple: { bg: "rgba(139, 92, 246, 0.15)", border: "rgba(139, 92, 246, 0.3)", glow: "rgba(139, 92, 246, 0.5)", line: "rgba(139, 92, 246, 0.6)" },
    cyan: { bg: "rgba(6, 182, 212, 0.15)", border: "rgba(6, 182, 212, 0.3)", glow: "rgba(6, 182, 212, 0.5)", line: "rgba(6, 182, 212, 0.6)" },
  };
  const c = colors[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative p-6 rounded-[20px] overflow-hidden cursor-pointer"
      style={{ 
        background: `linear-gradient(135deg, ${c.bg}, rgba(255,255,255,0.02))`,
        border: `1px solid ${c.border}`,
      }}
    >
      {/* Top glow line */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, transparent, ${c.line}, transparent)` }}
      />
      {/* Radial glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${c.bg}, transparent 70%)` }}
      />
      
      <div 
        className="text-[2.5rem] font-bold tracking-tight"
        style={{ textShadow: `0 0 40px ${c.glow}` }}
      >
        {value}
      </div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
}

function InspectorCard() {
  const permissions = ["Files: Selected", "Terminal: Allowlist", "Browser: Scoped", "Export: Artifacts"];
  const outputs = [
    { name: "deck.pptx", tag: "artifact" },
    { name: "sources.md", tag: "citations" },
    { name: "runlog.json", tag: "memory" },
  ];

  return (
    <div className="silver-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-title" style={{ color: 'rgba(0,0,0,0.82)' }}>Inspector</h2>
        <LEDIndicator label="Live" />
      </div>

      <div className="divider-light" />

      <div className="mb-4">
        <p className="text-label mb-3" style={{ color: 'rgba(0,0,0,0.55)' }}>Permissions</p>
        <div className="flex flex-wrap gap-2">
          {permissions.map((p) => (
            <span key={p} className="chip chip-light">{p}</span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-label mb-3" style={{ color: 'rgba(0,0,0,0.55)' }}>Outputs</p>
        <div className="space-y-2">
          {outputs.map((o) => (
            <div key={o.name} className="output-row">
              <span className="output-name">{o.name}</span>
              <span className="output-tag">{o.tag}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button className="btn-silver">Export</button>
        <button className="btn-silver">Publish</button>
      </div>
    </div>
  );
}

function TerminalCard() {
  const terminalOutput = `$ agentos run card:repo2pr --demo
• repo: sandboxed ✅
• tests: allowlisted ✅

[1/4] plan … ok
[2/4] implement … ok
[3/4] test … ok
[4/4] export … pr + notes

DONE ✅`;

  return (
    <div className="terminal-card h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold font-mono" style={{ color: 'var(--aaa-fg)' }}>terminal</span>
        <LEDIndicator label="running" />
      </div>
      <div className="divider-dark" />
      <pre className="terminal-text">
        {terminalOutput}
        <span className="terminal-cursor" />
      </pre>
    </div>
  );
}

function MixedShellCard() {
  const [message, setMessage] = useState('');

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-title">Chat Shell</h2>
        <LEDIndicator label="agent" />
      </div>

      <div className="flex gap-4">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="bubble bubble-user">
            Show me the run plan and export artifacts.
          </div>
          <div className="bubble bubble-assistant">
            Running tools… opening Terminal + preparing export.
          </div>
          
          <div className="mt-auto flex gap-3">
            <input 
              type="text"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-glass flex-1"
            />
            <button className="btn-glass">Send</button>
          </div>
        </div>

        {/* Mini Inspector */}
        <div className="w-44">
          <p className="text-label mb-3">Inspector</p>
          <div className="space-y-2">
            <span className="chip chip-dark block text-center">Files: scoped</span>
            <span className="chip chip-dark block text-center">Terminal: allowlist</span>
            <span className="chip chip-dark block text-center">Export: ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityCard() {
  const activities = [
    { time: "2m ago", action: "Agent completed repo2pr", status: "success" },
    { time: "5m ago", action: "Export triggered", status: "info" },
    { time: "12m ago", action: "Test suite passed", status: "success" },
    { time: "1h ago", action: "Memory snapshot saved", status: "info" },
  ];

  return (
    <div className="glass-card h-full">
      <h2 className="text-title mb-4">Activity</h2>
      <div className="space-y-3">
        {activities.map((a, i) => (
          <div key={i} className="flex items-center gap-3">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ 
                background: a.status === 'success' ? 'var(--accent-green)' : 'var(--accent-blue)',
                boxShadow: a.status === 'success' 
                  ? '0 0 8px rgba(34, 197, 94, 0.5)' 
                  : '0 0 8px rgba(59, 130, 246, 0.5)'
              }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: 'var(--aaa-fg)' }}>{a.action}</p>
              <p className="text-xs" style={{ color: 'var(--aaa-muted)' }}>{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActionsCard() {
  const actions = [
    { icon: "🚀", label: "Deploy" },
    { icon: "🔍", label: "Search" },
    { icon: "📦", label: "Export" },
    { icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className="glass-card">
      <h2 className="text-title mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((a) => (
          <motion.button
            key={a.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="btn-glass flex flex-col items-center gap-2 py-4"
          >
            <span className="text-2xl">{a.icon}</span>
            <span className="text-sm">{a.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function MemoryGraphCard() {
  // Fake graph bars
  const bars = [40, 65, 80, 55, 90, 70, 85, 60, 75, 95, 50, 88];

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-title">Memory Usage</h2>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold" style={{ 
            color: 'var(--aaa-fg)',
            textShadow: '0 0 30px rgba(6, 182, 212, 0.5)'
          }}>2.4 GB</span>
          <span className="chip chip-dark">/ 8 GB</span>
        </div>
      </div>

      {/* Graph */}
      <div className="flex items-end gap-2 h-32">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: 0.6 + i * 0.05, duration: 0.5 }}
            className="flex-1 rounded-t-md"
            style={{
              background: `linear-gradient(180deg, rgba(6, 182, 212, 0.8), rgba(6, 182, 212, 0.3))`,
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
