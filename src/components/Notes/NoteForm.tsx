import React, { useState, useEffect } from 'react';
import { X, FileText, Tag, Palette } from 'lucide-react';
import { useNotes } from '../../hooks/useNotes';
import { Note, NoteType } from '../../types';

interface NoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note;
}

const noteColors = [
  { name: 'Желтый', value: '#FEF3C7', text: '#92400E' },
  { name: 'Оливковый', value: '#E8E5D5', text: '#5A5742' },
  { name: 'Пудровый', value: '#FFE4E1', text: '#8B4049' },
  { name: 'Матово-лиловый', value: '#E6D5E6', text: '#4A2C4A' },
  { name: 'Миндальный', value: '#F5E6D3', text: '#6B5744' },
  { name: 'Матово-небесный', value: '#E0F2F7', text: '#2C5F6F' },
  { name: 'Матовая роза', value: '#FADADD', text: '#8B5F65' },
  { name: 'Мятный', value: '#D1FAE5', text: '#065F46' }
];

export const NoteForm: React.FC<NoteFormProps> = ({ 
  isOpen, 
  onClose, 
  note
}) => {
  const { createNote, updateNote } = useNotes();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'idea' as NoteType,
    color: noteColors[0].value,
    tags: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        type: note.type,
        color: note.color || noteColors[0].value,
        tags: note.tags.join(', ')
      });
    } else {
      setFormData({
        title: '',
        content: '',
        type: 'idea',
        color: noteColors[0].value,
        tags: ''
      });
    }
  }, [note]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Заголовок заметки обязателен';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Содержимое заметки обязательно';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const noteData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        type: formData.type,
        color: formData.color,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (note) {
        await updateNote(note.id, noteData);
      } else {
        await createNote(noteData);
      }
      
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения заметки:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="rounded-xl shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#f5f5f7' }}>
        <div className="flex items-center justify-between p-4 sm:p-6 border-b" style={{ borderColor: '#e0e0e0' }}>
          <h2 className="text-base sm:text-xl font-heading break-words pr-2" style={{ color: '#2c2c2e' }}>
            {note ? 'Редактировать заметку' : 'Создать стикер-заметку'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors flex-shrink-0"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
          >
            <X className="w-5 h-5" style={{ color: '#2c2c2e' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Заголовок */}
          <div>
            <label className="form-label">
              <FileText className="w-4 h-4 inline mr-1" />
              Заголовок заметки *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`form-input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Краткое описание заметки"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Содержимое */}
          <div>
            <label className="form-label">
              Содержимое заметки *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              className={`form-input h-32 resize-none ${errors.content ? 'border-red-500' : ''}`}
              placeholder="Напишите свою заметку, список дел или идею..."
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          {/* Тип и цвет */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                Тип заметки
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="form-input"
              >
                <option value="idea">💡 Идея</option>
                <option value="reminder">⏰ Напоминание</option>
                <option value="link">🔗 Ссылки</option>
                <option value="book">📚 Книжки</option>
                <option value="series">📺 Сериалы</option>
                <option value="other">📝 Другое</option>
              </select>
            </div>

            <div>
              <label className="form-label">
                <Palette className="w-4 h-4 inline mr-1" />
                Цвет стикера
              </label>
              <div className="grid grid-cols-4 gap-3">
                {noteColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleChange('color', color.value)}
                    className={`relative h-12 rounded-xl border-2 transition-all duration-300 hover:scale-110 shadow-md ${
                      formData.color === color.value 
                        ? 'border-gray-800 ring-2 ring-gray-400 ring-offset-2' 
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {formData.color === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Теги */}
          <div>
            <label className="form-label">
              <Tag className="w-4 h-4 inline mr-1" />
              Теги
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              className="form-input"
              placeholder="важное, срочно, работа"
            />
            <p className="text-xs text-gray-500 mt-1">
              Разделяйте теги запятыми
            </p>
          </div>

          {/* Предварительный просмотр стикера */}
          <div>
            <label className="form-label">
              Предварительный просмотр
            </label>
            <div 
              className="p-4 rounded-lg border-2 border-dashed border-gray-300"
              style={{ 
                backgroundColor: formData.color,
                color: noteColors.find(c => c.value === formData.color)?.text || '#000'
              }}
            >
              <h4 className="font-semibold mb-2">
                {formData.title || 'Заголовок заметки'}
              </h4>
              <p className="text-sm whitespace-pre-wrap">
                {formData.content || 'Содержимое заметки...'}
              </p>
              {formData.tags && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.tags.split(',').map((tag, index) => (
                    <span key={index} className="px-2 py-1 text-xs rounded-full bg-black bg-opacity-10">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Сохранение...' : (note ? 'Сохранить' : 'Создать стикер')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
