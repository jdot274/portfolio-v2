'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════
// PORTFOLIO HOME - Clean Dark Gradient with Layered Glass Outlines
// ═══════════════════════════════════════════════════════════════════════════

const portfolioProjects = [
  { id: 1, title: 'NexusForge', description: 'Universal runtime + context engine', tags: ['Tauri', 'Rust', 'React'], type: 'App' },
  { id: 2, title: 'SpatialAppStore', description: 'Glass-style storefront with orb glyphs', tags: ['SwiftUI', 'Metal'], type: 'App' },
  { id: 3, title: 'AgentOS Gallery', description: 'Multi-widget AAA dashboard', tags: ['Next.js', 'Framer'], type: 'Demo', href: '/gallery' },
  { id: 4, title: 'ClaudeHub', description: 'Extension system with canvas & chat', tags: ['Tauri', 'React'], type: 'App' },
  { id: 5, title: 'AppMatrix', description: 'Scan & map macOS app capabilities', tags: ['Swift', 'AppKit'], type: 'Tool' },
  { id: 6, title: 'MCPManager', description: 'Model Context Protocol manager', tags: ['Rust', 'MCP'], type: 'Tool' },
];

const portfolioStats = [
  { value: '12', label: 'Projects' },
  { value: '6', label: 'Languages' },
  { value: '∞', label: 'Ideas' },
];

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Pure black gradient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0c] via-[#0d0d10] to-[#08080a] -z-10" />
      
      {/* Subtle ambient glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] -z-10" />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-xl">◆</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Portfolio</h1>
              <p className="text-sm text-white/50">Apps • Tools • Experiments</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex gap-8">
            {portfolioStats.map((stat, statIndex) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + statIndex * 0.1 }}
                className="flex items-baseline gap-2"
              >
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className="text-sm text-white/40">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.header>

        {/* Projects Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white/80">Projects</h2>
            <div className="flex gap-2">
              {['All', 'App', 'Tool', 'Demo'].map((filterType) => (
                <button 
                  key={filterType}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    filterType === 'All' 
                      ? 'bg-white/10 text-white border border-white/20' 
                      : 'text-white/40 hover:text-white/60 border border-transparent hover:border-white/10'
                  }`}
                >
                  {filterType}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {portfolioProjects.map((project, projectIndex) => (
              <ProjectCard key={project.id} project={project} index={projectIndex} />
            ))}
          </div>
        </section>

        {/* Footer Nav */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 pt-8 border-t border-white/5"
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-6">
              <Link href="/gallery" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                Widget Gallery
              </Link>
              <a href="https://github.com/jdot274" target="_blank" rel="noopener" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                GitHub
              </a>
            </div>
            <p className="text-xs text-white/20">© 2024</p>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT CARD - Layered glass with subtle outlines
// ═══════════════════════════════════════════════════════════════════════════

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  type: string;
  href?: string;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const CardWrapper = project.href ? Link : 'div';
  const wrapperProps = project.href ? { href: project.href } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.08, duration: 0.5 }}
    >
      <CardWrapper 
        {...wrapperProps as any}
        className="group block relative p-5 rounded-2xl cursor-pointer transition-all duration-300
                   bg-gradient-to-br from-white/[0.04] to-transparent
                   border border-white/[0.08]
                   hover:border-white/[0.15] hover:bg-white/[0.06]
                   hover:shadow-[0_0_40px_rgba(255,255,255,0.03)]"
      >
        {/* Subtle top edge highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-2xl" />
        
        {/* Content */}
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-white/90 group-hover:text-white transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-white/40 mt-1">{project.description}</p>
            </div>
            <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 border border-white/5">
              {project.type}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.map((tag) => (
              <span 
                key={tag}
                className="text-xs text-white/35 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Hover arrow */}
          {project.href && (
            <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white/30 text-lg">→</span>
            </div>
          )}
        </div>
      </CardWrapper>
    </motion.div>
  );
}
