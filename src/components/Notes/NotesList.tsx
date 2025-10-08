import React, { useState } from 'react';
import { Plus, Search, FileText, Tag, Calendar, X, Archive } from 'lucide-react';
import { useNotes } from '../../hooks/useNotes';
import { Note, NoteType } from '../../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface NotesListProps {
  onAddNote: () => void;
  onEditNote: (note: Note) => void;
}

export const NotesList: React.FC<NotesListProps> = ({ onAddNote, onEditNote }) => {
  const { notes, loading, deleteNote, updateNote } = useNotes();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<NoteType | 'all'>('all');

  const getTypeColor = (type: NoteType) => {
    switch (type) {
      case 'idea':
        return { bg: '#E6D5E6', text: '#4A2C4A', border: '#C8A8C8' }; // Матово-лиловый
      case 'reminder':
        return { bg: '#FFE4E1', text: '#8B4049', border: '#FFB6C1' }; // Пудровый
      case 'link':
        return { bg: '#E0F2F7', text: '#2C5F6F', border: '#B2D8E5' }; // Матово-небесный
      case 'book':
        return { bg: '#F5E6D3', text: '#6B5744', border: '#D4C5B0' }; // Миндальный
      case 'series':
        return { bg: '#FADADD', text: '#8B5F65', border: '#F4C2C2' }; // Матовая роза
      default:
        return { bg: '#E8E5D5', text: '#5A5742', border: '#C8C5B0' }; // Оливковый
    }
  };

  const getNoteBackgroundColor = (color?: string) => {
    // Если цвет сохранен в note.color
    if (color && !color.includes(',')) {
      return color;
    }
    // Если это формат "x,y,color"
    if (color && color.includes(',')) {
      const parts = color.split(',');
      if (parts.length >= 3) {
        return parts[2];
      }
    }
    return '#FEF3C7'; // Желтый по умолчанию
  };

  const getTypeText = (type: NoteType) => {
    switch (type) {
      case 'idea': return 'Идея';
      case 'reminder': return 'Напоминание';
      case 'link': return 'Ссылки';
      case 'book': return 'Книжки';
      case 'series': return 'Сериалы';
      default: return 'Другое';
    }
  };

  const filteredNotes = notes
    .filter(note => {
      // Исключаем архивированные заметки
      if (note.archived) {
        return false;
      }
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower) ||
          note.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .filter(note => {
      if (typeFilter !== 'all') {
        return note.type === typeFilter;
      }
      return true;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту заметку?')) {
      try {
        await deleteNote(noteId);
      } catch (error) {
        console.error('Ошибка удаления заметки:', error);
      }
    }
  };

  const handleArchiveNote = async (noteId: string) => {
    if (window.confirm('Архивировать эту заметку? Она будет перемещена в архив.')) {
      try {
        await updateNote(noteId, { archived: true, archivedAt: new Date() });
      } catch (error) {
        console.error('Ошибка архивирования заметки:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#c0c0c0' }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопки */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading drop-shadow-lg" style={{ color: '#c0c0c0' }}>Мои заметки</h1>
          <p className="font-accent" style={{ color: '#a0a0a0' }}>
            Всего заметок: {notes.length} | Показано: {filteredNotes.length}
          </p>
        </div>
        
        <button
          onClick={onAddNote}
          className="group relative w-14 h-14 rounded-full transition-all duration-500 hover:scale-110 hover:rotate-90 shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.95), rgba(35, 39, 41, 0.95))',
            border: '2px solid rgba(120, 120, 120, 0.4)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
          title="Добавить заметку"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <Plus className="w-7 h-7 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" style={{ color: '#d0d0d0' }} />
        </button>
      </div>

      {/* Поиск и фильтры */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Поиск заметок..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg backdrop-blur-sm border transition-all duration-300 focus:ring-2 focus:ring-gray-500/50 focus:border-transparent"
            style={{
              backgroundColor: 'rgba(80, 80, 80, 0.2)',
              borderColor: 'rgba(120, 120, 120, 0.3)',
              color: '#c0c0c0'
            }}
          />
        </div>
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as NoteType | 'all')}
          className="px-3 py-2 rounded-lg backdrop-blur-sm border transition-all duration-300 focus:ring-2 focus:ring-gray-500/50 focus:border-transparent"
          style={{
            backgroundColor: 'rgba(80, 80, 80, 0.2)',
            borderColor: 'rgba(120, 120, 120, 0.3)',
            color: '#c0c0c0'
          }}
        >
          <option value="all" style={{ backgroundColor: '#292d2f', color: '#c0c0c0' }}>Все типы</option>
          <option value="idea" style={{ backgroundColor: '#292d2f', color: '#c0c0c0' }}>Идеи</option>
          <option value="reminder" style={{ backgroundColor: '#292d2f', color: '#c0c0c0' }}>Напоминания</option>
          <option value="link" style={{ backgroundColor: '#292d2f', color: '#c0c0c0' }}>Ссылки</option>
          <option value="book" style={{ backgroundColor: '#292d2f', color: '#c0c0c0' }}>Книжки</option>
          <option value="series" style={{ backgroundColor: '#292d2f', color: '#c0c0c0' }}>Сериалы</option>
          <option value="other" style={{ backgroundColor: '#292d2f', color: '#c0c0c0' }}>Другое</option>
        </select>
      </div>

      {/* Список заметок */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12" style={{ color: '#808080' }}>
            <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: '#606060' }} />
            <h3 className="text-lg font-heading mb-2" style={{ color: '#c0c0c0' }}>Заметок не найдено</h3>
            <p style={{ color: '#a0a0a0' }}>Создайте свою первую заметку</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => {
              const bgColor = getNoteBackgroundColor(note.color);
              const typeColors = getTypeColor(note.type);
              
              return (
                <div
                  key={note.id}
                  className="relative group rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:-rotate-1 shadow-lg hover:shadow-2xl"
                  style={{
                    backgroundColor: bgColor,
                    border: '2px solid rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div 
                    className="p-5 cursor-pointer min-h-[200px] relative"
                    onClick={() => onEditNote(note)}
                  >
                    {/* Тип заметки - цветная плашка */}
                    <div className="absolute top-3 right-3">
                      <span 
                        className="px-3 py-1.5 rounded-full text-xs font-bold shadow-md"
                        style={{ 
                          backgroundColor: typeColors.bg,
                          color: typeColors.text,
                          border: `2px solid ${typeColors.border}`
                        }}
                      >
                        {getTypeText(note.type)}
                      </span>
                    </div>

                    <div className="pr-20 mb-3">
                      <h3 className="text-lg font-heading font-bold break-words" style={{ color: '#2c2c2e' }}>
                        {note.title}
                      </h3>
                    </div>
                    
                    <p className="text-sm mb-4 break-words whitespace-pre-wrap leading-relaxed" style={{ color: '#3c3c3e' }}>
                      {note.content}
                    </p>
                    
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {note.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 text-xs rounded-lg font-medium shadow-sm" style={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.15)',
                            color: '#2c2c2e'
                          }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="absolute bottom-3 right-3 text-xs font-medium" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>
                      {format(new Date(note.updatedAt), 'dd MMM', { locale: ru })}
                    </div>
                  </div>
                  
                  {/* Кнопки действий */}
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchiveNote(note.id);
                      }}
                      className="p-1.5 rounded-full shadow-lg"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(100, 100, 100, 0.3)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'}
                      title="Архивировать заметку"
                    >
                      <Archive className="w-4 h-4" style={{ color: '#2c2c2e' }} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="p-1.5 rounded-full shadow-lg"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(200, 50, 50, 0.3)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'}
                      title="Удалить заметку"
                    >
                      <X className="w-4 h-4" style={{ color: '#2c2c2e' }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

