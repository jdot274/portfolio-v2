'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContentStore } from '@/stores/content-store';
import { ContentItem } from '@/types';
import { getContentTypeIcon } from '@/lib/upload-router';
import { ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';

interface CanvasItemProps {
  item: ContentItem;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  scale: number;
}

function CanvasItem({ item, onPositionChange, scale }: CanvasItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(item.position || { x: Math.random() * 600, y: Math.random() * 400 });
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      
      const dx = (e.clientX - dragRef.current.startX) / scale;
      const dy = (e.clientY - dragRef.current.startY) / scale;
      
      setPosition({
        x: dragRef.current.startPosX + dx,
        y: dragRef.current.startPosY + dy,
      });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onPositionChange(item.id, position);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position, item.id, onPositionChange, scale]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: position.x,
        y: position.y,
      }}
      transition={{ type: 'spring', damping: 20 }}
      style={{ position: 'absolute' }}
      className={`
        w-48 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden
        ${isDragging ? 'cursor-grabbing shadow-2xl z-50' : 'cursor-grab hover:border-zinc-700'}
      `}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="p-3 border-b border-zinc-800 bg-zinc-900/80">
        <div className="flex items-center gap-2">
          <span>{getContentTypeIcon(item.type)}</span>
          <h3 className="text-sm font-medium text-white truncate flex-1">{item.title}</h3>
        </div>
      </div>

      {/* Tags */}
      <div className="p-2 flex flex-wrap gap-1">
        {item.tags.slice(0, 3).map((tag) => (
          <span
            key={tag.id}
            className="text-[10px] px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
          >
            {tag.name}
          </span>
        ))}
      </div>

      {/* Description */}
      {item.description && (
        <div className="px-3 pb-3">
          <p className="text-xs text-zinc-500 line-clamp-2">{item.description}</p>
        </div>
      )}

      {/* Connection points */}
      <div className="absolute -right-1.5 top-1/2 w-3 h-3 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -left-1.5 top-1/2 w-3 h-3 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

export default function CanvasView() {
  const { items, updateItemPosition } = useContentStore();
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<{ startX: number; startY: number; startPanX: number; startPanY: number } | null>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale(prev => Math.min(Math.max(prev * delta, 0.25), 2));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => canvas.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-bg')) {
      setIsPanning(true);
      panRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPanX: pan.x,
        startPanY: pan.y,
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning || !panRef.current) return;
      setPan({
        x: panRef.current.startPanX + (e.clientX - panRef.current.startX),
        y: panRef.current.startPanY + (e.clientY - panRef.current.startY),
      });
    };

    const handleMouseUp = () => setIsPanning(false);

    if (isPanning) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, pan]);

  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-950">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
        <button
          onClick={() => setScale(prev => Math.min(prev * 1.2, 2))}
          className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
        >
          <ZoomIn size={16} />
        </button>
        <span className="text-xs text-zinc-500 px-2">{Math.round(scale * 100)}%</span>
        <button
          onClick={() => setScale(prev => Math.max(prev * 0.8, 0.25))}
          className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
        >
          <ZoomOut size={16} />
        </button>
        <div className="w-px h-6 bg-zinc-800" />
        <button
          onClick={resetView}
          className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        onMouseDown={handleCanvasMouseDown}
        className={`w-full h-full ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * scale}px ${20 * scale}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      >
        <div
          className="canvas-bg absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          {items.map((item) => (
            <CanvasItem
              key={item.id}
              item={item}
              onPositionChange={updateItemPosition}
              scale={scale}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-xs text-zinc-600">
        <span className="flex items-center gap-2">
          <Move size={12} /> Drag items to arrange • Scroll to zoom • Drag background to pan
        </span>
      </div>
    </div>
  );
}

