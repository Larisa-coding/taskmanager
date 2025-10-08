import React, { useState, useEffect } from 'react';
import { X, User, Phone, Building, Mail } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import { Client } from '../../types';

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client;
}

export const ClientForm: React.FC<ClientFormProps> = ({ 
  isOpen, 
  onClose, 
  client
}) => {
  const { createClient, updateClient } = useClients();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email || '',
        phone: client.phone || '',
        company: client.company || '',
        notes: client.notes || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        notes: ''
      });
    }
  }, [client]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Имя клиента обязательно';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const clientData = {
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        company: formData.company.trim() || undefined,
        notes: formData.notes.trim() || undefined
      };

      if (client) {
        await updateClient(client.id, clientData);
      } else {
        await createClient(clientData);
      }
      
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения клиента:', error);
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
            {client ? 'Редактировать клиента' : 'Добавить клиента'}
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
          {/* Имя клиента */}
          <div>
            <label className="form-label">
              <User className="w-4 h-4 inline mr-1" />
              Имя клиента *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`form-input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Введите ФИО клиента"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="form-label">
              <Mail className="w-4 h-4 inline mr-1" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`form-input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="client@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Телефон */}
          <div>
            <label className="form-label">
              <Phone className="w-4 h-4 inline mr-1" />
              Телефон
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="form-input"
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          {/* Компания */}
          <div>
            <label className="form-label">
              <Building className="w-4 h-4 inline mr-1" />
              Компания
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className="form-input"
              placeholder="Название компании"
            />
          </div>

          {/* Заметки */}
          <div>
            <label className="form-label">
              Заметки
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="form-input h-24 resize-none"
              placeholder="Дополнительная информация о клиенте"
            />
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
              {isSubmitting ? 'Сохранение...' : (client ? 'Сохранить' : 'Добавить')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
