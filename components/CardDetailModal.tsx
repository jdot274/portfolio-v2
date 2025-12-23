'use client';

import { useState, useEffect } from 'react';
import { 
  X, Calendar, Flag, CheckSquare, Plus, Trash2, 
  Tag, ExternalLink, Pin, MoreHorizontal, Globe,
  Layers, Code2, Clock, Save, Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContentStore } from '@/stores/content-store';
import { ContentItem, Checklist, ChecklistItem, BoardColumnId } from '@/types';
import { getContentTypeIcon } from '@/lib/upload-router';

interface CardDetailModalProps {
  item: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'bg-gray-500' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
];

const COLUMN_OPTIONS = [
  { id: 'backlog', label: 'Backlog', color: '#6b7280' },
  { id: 'todo', label: 'To Do', color: '#3b82f6' },
  { id: 'in-progress', label: 'In Progress', color: '#f59e0b' },
  { id: 'review', label: 'Review', color: '#8b5cf6' },
  { id: 'done', label: 'Done', color: '#22c55e' },
];

export default function CardDetailModal({ item, isOpen, onClose }: CardDetailModalProps) {
  const { updateItem, removeItem } = useContentStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ContentItem['priority']>();
  const [dueDate, setDueDate] = useState('');
  const [boardColumn, setBoardColumn] = useState<BoardColumnId | undefined>();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description || '');
      setPriority(item.priority);
      setDueDate(item.dueDate || '');
      setBoardColumn(item.boardColumn);
      setChecklists(item.checklists || []);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSave = () => {
    const completedTasks = checklists.reduce((acc, checklist) => acc + checklist.items.filter(checklistItem => checklistItem.completed).length, 0);
    const totalTasks = checklists.reduce((acc, checklist) => acc + checklist.items.length, 0);
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : undefined;

    updateItem(item.id, {
      title,
      description: description || undefined,
      priority,
      dueDate: dueDate || undefined,
      boardColumn,
      checklists: checklists.length > 0 ? checklists : undefined,
      progress,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this item?')) {
      removeItem(item.id);
      onClose();
    }
  };

  const handleTogglePin = () => {
    updateItem(item.id, { isPinned: !item.isPinned });
  };

  const addChecklist = () => {
    if (!newChecklistTitle.trim()) return;
    const newChecklist: Checklist = {
      id: `checklist-${Date.now()}`,
      title: newChecklistTitle,
      items: [],
    };
    setChecklists([...checklists, newChecklist]);
    setNewChecklistTitle('');
  };

  const addChecklistItem = (checklistId: string, text: string) => {
    setChecklists(checklists.map(checklist => 
      checklist.id === checklistId 
        ? { ...checklist, items: [...checklist.items, { id: `item-${Date.now()}`, text, completed: false }] }
        : checklist
    ));
  };

  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(checklists.map(checklist => 
      checklist.id === checklistId 
        ? { ...checklist, items: checklist.items.map(checklistItem => checklistItem.id === itemId ? { ...checklistItem, completed: !checklistItem.completed } : checklistItem) }
        : checklist
    ));
  };

  const deleteChecklist = (checklistId: string) => {
    setChecklists(checklists.filter(checklist => checklist.id !== checklistId));
  };

  const completedTasks = checklists.reduce((acc, checklist) => acc + checklist.items.filter(checklistItem => checklistItem.completed).length, 0);
  const totalTasks = checklists.reduce((acc, checklist) => acc + checklist.items.length, 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20 overflow-y-auto"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <span className="text-xl">{getContentTypeIcon(item.type)}</span>
              {isEditing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-transparent text-lg font-semibold text-white border-b border-zinc-700 focus:border-emerald-500 outline-none"
                />
              ) : (
                <h2 className="text-lg font-semibold text-white">{title}</h2>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePin}
                className={`p-2 rounded-lg ${item.isPinned ? 'bg-yellow-500/20 text-yellow-500' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                <Pin size={16} />
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-2 rounded-lg ${isEditing ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                <Edit3 size={16} />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Type & URL */}
            <div className="flex items-center gap-4 text-sm">
              <span className="text-zinc-500">Type: <span className="text-white capitalize">{item.type}</span></span>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-emerald-500 hover:text-emerald-400"
                >
                  <ExternalLink size={14} /> Open
                </a>
              )}
            </div>

            {/* Website info */}
            {item.website && (
              <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Globe size={16} />
                  <span className="text-sm font-medium">Website Details</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-500">Pages:</span>
                    <span className="text-white ml-2">{item.website.pages.length}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Framework:</span>
                    <span className="text-white ml-2">{item.website.framework || 'Unknown'}</span>
                  </div>
                </div>
                {item.website.techStack && item.website.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.website.techStack.map((tech, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-zinc-700 text-zinc-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <label className="text-sm text-zinc-500 mb-2 block">Description</label>
              {isEditing ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
                  placeholder="Add a description..."
                />
              ) : (
                <p className="text-zinc-300 text-sm">{description || 'No description'}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm text-zinc-500 mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                  >
                    {tag.aiGenerated && '✨ '}{tag.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Board & Priority Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Board Column */}
              <div>
                <label className="text-sm text-zinc-500 mb-2 block">Board Column</label>
                <select
                  value={boardColumn || ''}
                  onChange={(e) => setBoardColumn(e.target.value as BoardColumnId || undefined)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">None</option>
                  {COLUMN_OPTIONS.map((col) => (
                    <option key={col.id} value={col.id}>{col.label}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm text-zinc-500 mb-2 block">Priority</label>
                <select
                  value={priority || ''}
                  onChange={(e) => setPriority(e.target.value as ContentItem['priority'] || undefined)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">None</option>
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-sm text-zinc-500 mb-2 block">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Checklists */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-zinc-500 flex items-center gap-2">
                  <CheckSquare size={16} />
                  Checklists
                  {totalTasks > 0 && (
                    <span className="text-xs text-zinc-600">({completedTasks}/{totalTasks})</span>
                  )}
                </label>
              </div>

              <div className="space-y-4">
                {checklists.map((checklist) => (
                  <div key={checklist.id} className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-white">{checklist.title}</h4>
                      <button
                        onClick={() => deleteChecklist(checklist.id)}
                        className="p-1 rounded hover:bg-zinc-700 text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    {/* Progress bar */}
                    {checklist.items.length > 0 && (
                      <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-300"
                          style={{ 
                            width: `${(checklist.items.filter(checklistItem => checklistItem.completed).length / checklist.items.length) * 100}%` 
                          }}
                        />
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-1">
                      {checklist.items.map((checkItem) => (
                        <label
                          key={checkItem.id}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={checkItem.completed}
                            onChange={() => toggleChecklistItem(checklist.id, checkItem.id)}
                            className="rounded border-zinc-600 bg-zinc-700 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className={`text-sm ${checkItem.completed ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                            {checkItem.text}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Add item */}
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Add an item..."
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value) {
                            addChecklistItem(checklist.id, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Add checklist */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newChecklistTitle}
                    onChange={(e) => setNewChecklistTitle(e.target.value)}
                    placeholder="New checklist name..."
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                    onKeyPress={(e) => e.key === 'Enter' && addChecklist()}
                  />
                  <button
                    onClick={addChecklist}
                    disabled={!newChecklistTitle.trim()}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 rounded-lg text-zinc-400"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-zinc-800">
            <button
              onClick={handleDelete}
              className="px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10"
            >
              <Trash2 size={16} />
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

