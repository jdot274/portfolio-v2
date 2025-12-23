'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, Calendar, CheckSquare, Flag, GripVertical } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useContentStore } from '@/stores/content-store';
import { ContentItem, BoardColumn, BoardColumnId } from '@/types';
import { getContentTypeIcon } from '@/lib/upload-router';

const DEFAULT_COLUMNS: BoardColumn[] = [
  { id: 'backlog', title: 'Backlog', color: '#6b7280', items: [] },
  { id: 'todo', title: 'To Do', color: '#3b82f6', items: [] },
  { id: 'in-progress', title: 'In Progress', color: '#f59e0b', items: [] },
  { id: 'review', title: 'Review', color: '#8b5cf6', items: [] },
  { id: 'done', title: 'Done', color: '#22c55e', items: [] },
];

interface KanbanCardProps {
  item: ContentItem;
  onEdit: (item: ContentItem) => void;
  onMove: (itemId: string, columnId: BoardColumnId) => void;
}

function KanbanCard({ item, onEdit, onMove }: KanbanCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const priorityColors = {
    low: 'bg-gray-500',
    medium: 'bg-blue-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500',
  };

  const completedTasks = item.checklists?.reduce(
    (acc, cl) => acc + cl.items.filter(i => i.completed).length, 0
  ) || 0;
  const totalTasks = item.checklists?.reduce(
    (acc, cl) => acc + cl.items.length, 0
  ) || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 cursor-pointer hover:border-zinc-600 group"
      onClick={() => onEdit(item)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">{getContentTypeIcon(item.type)}</span>
          <h4 className="text-sm font-medium text-white line-clamp-2">{item.title}</h4>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-1 rounded hover:bg-zinc-700 text-zinc-500 opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className="text-[10px] px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${tag.color}30`, color: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          {/* Priority */}
          {item.priority && (
            <span className={`w-2 h-2 rounded-full ${priorityColors[item.priority]}`} />
          )}
          
          {/* Due date */}
          {item.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}

          {/* Checklist progress */}
          {totalTasks > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare size={10} />
              {completedTasks}/{totalTasks}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {item.progress !== undefined && item.progress > 0 && (
          <div className="w-12 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Move menu */}
      {showMenu && (
        <div
          className="absolute right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          {DEFAULT_COLUMNS.map((col) => (
            <button
              key={col.id}
              onClick={() => { onMove(item.id, col.id); setShowMenu(false); }}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
              Move to {col.title}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

interface KanbanColumnProps {
  column: BoardColumn;
  items: ContentItem[];
  onEditItem: (item: ContentItem) => void;
  onMoveItem: (itemId: string, columnId: BoardColumnId) => void;
  onAddItem: (columnId: BoardColumnId) => void;
}

function KanbanColumn({ column, items, onEditItem, onMoveItem, onAddItem }: KanbanColumnProps) {
  return (
    <div className="flex-shrink-0 w-72 bg-zinc-900/50 rounded-xl border border-zinc-800">
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
          <h3 className="font-medium text-white text-sm">{column.title}</h3>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
            {items.length}
          </span>
        </div>
        <button
          onClick={() => onAddItem(column.id)}
          className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-white"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Cards */}
      <div className="p-2 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
        <AnimatePresence>
          {items.map((item) => (
            <KanbanCard
              key={item.id}
              item={item}
              onEdit={onEditItem}
              onMove={onMoveItem}
            />
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="text-center py-8 text-zinc-600 text-sm">
            No items
          </div>
        )}
      </div>
    </div>
  );
}

interface KanbanBoardProps {
  onEditItem?: (item: ContentItem) => void;
}

export default function KanbanBoard({ onEditItem }: KanbanBoardProps) {
  const { items, updateItem, addItem } = useContentStore();
  const [columns] = useState(DEFAULT_COLUMNS);

  // Group items by column
  const getColumnItems = (columnId: BoardColumnId) => {
    return items.filter(item => item.boardColumn === columnId);
  };

  const handleMoveItem = (itemId: string, columnId: BoardColumnId) => {
    updateItem(itemId, { boardColumn: columnId });
  };

  const handleAddItem = (columnId: BoardColumnId) => {
    const newItem: ContentItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: 'document',
      title: 'New Task',
      storageLocation: 'local',
      tags: [],
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      boardColumn: columnId,
    };
    addItem(newItem);
  };

  const handleEditItem = (item: ContentItem) => {
    onEditItem?.(item);
  };

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-4 p-4 min-w-max">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            items={getColumnItems(column.id)}
            onEditItem={handleEditItem}
            onMoveItem={handleMoveItem}
            onAddItem={handleAddItem}
          />
        ))}
      </div>
    </div>
  );
}

