import React, { useState } from 'react';
import { Plus, Search, User, Phone, Mail, Building, Edit, Trash2 } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import { Client } from '../../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ClientListProps {
  onAddClient: () => void;
  onEditClient: (client: Client) => void;
}

export const ClientList: React.FC<ClientListProps> = ({ onAddClient, onEditClient }) => {
  const { clients, loading, deleteClient } = useClients();
  
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients
    .filter(client => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          client.name.toLowerCase().includes(searchLower) ||
          client.email?.toLowerCase().includes(searchLower) ||
          client.phone?.toLowerCase().includes(searchLower) ||
          client.company?.toLowerCase().includes(searchLower) ||
          client.notes?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого клиента? Все связанные проекты также будут удалены.')) {
      try {
        await deleteClient(clientId);
      } catch (error) {
        console.error('Ошибка удаления клиента:', error);
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
          <h1 className="text-xl sm:text-2xl font-heading drop-shadow-lg" style={{ color: '#c0c0c0' }}>Клиенты</h1>
          <p className="text-sm font-accent" style={{ color: '#a0a0a0' }}>
            Всего клиентов: {clients.length} | Показано: {filteredClients.length}
          </p>
        </div>
        
        <button
          onClick={onAddClient}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить клиента
        </button>
      </div>

      {/* Поиск */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Поиск клиентов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      {/* Список клиентов */}
      <div className="space-y-4">
        {filteredClients.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Клиентов не найдено</h3>
            <p>Добавьте своего первого клиента</p>
          </div>
        ) : (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(80, 80, 80, 0.2)' }}>
                    <User className="w-6 h-6" style={{ color: '#b0b0b0' }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {client.name}
                    </h3>
                    
                    {client.company && (
                      <p className="text-gray-600 mb-3 flex items-center">
                        <Building className="w-4 h-4 mr-2 text-gray-400" />
                        {client.company}
                      </p>
                    )}
                    
                    <div className="space-y-2 mb-3">
                      {client.email && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          <a href={`mailto:${client.email}`} className="hover:underline" style={{ color: '#c0c0c0' }}>
                            {client.email}
                          </a>
                        </p>
                      )}
                      
                      {client.phone && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <a href={`tel:${client.phone}`} className="hover:underline" style={{ color: '#c0c0c0' }}>
                            {client.phone}
                          </a>
                        </p>
                      )}
                    </div>
                    
                    {client.notes && (
                      <p className="text-gray-600 text-sm mb-3 break-words">
                        {client.notes}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        Добавлен: {format(new Date(client.createdAt), 'dd MMM yyyy', { locale: ru })}
                      </span>
                      <span>
                        Проектов: {client.projects.length}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditClient(client)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
