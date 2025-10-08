import React, { useState, useEffect } from 'react';
import { X, CreditCard, Calendar, DollarSign, FileText } from 'lucide-react';
import { usePayments } from '../../hooks/usePayments';
import { useClients } from '../../hooks/useClients';
import { useProjects } from '../../hooks/useProjects';
import { Payment, PaymentType, PaymentStatus } from '../../types';

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  payment?: Payment;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ 
  isOpen, 
  onClose, 
  payment
}) => {
  const { createPayment, updatePayment } = usePayments();
  const { clients } = useClients();
  const { projects } = useProjects();
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    type: 'income' as PaymentType,
    paymentDate: new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (payment) {
      setFormData({
        amount: payment.amount.toString(),
        description: payment.description,
        type: payment.type,
        paymentDate: payment.paidDate ? new Date(payment.paidDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        amount: '',
        description: '',
        type: 'income',
        paymentDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [payment]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.amount.trim()) {
      newErrors.amount = 'Сумма обязательна';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Введите корректную сумму';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const paymentData = {
        amount: Number(formData.amount),
        description: formData.description.trim(),
        type: formData.type,
        status: 'paid' as PaymentStatus,
        paidDate: new Date(formData.paymentDate),
        category: 'Общее',
        tags: []
      };

      if (payment) {
        await updatePayment(payment.id, paymentData);
      } else {
        await createPayment(paymentData);
      }
      
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения платежа:', error);
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
            {payment ? 'Редактировать платеж' : 'Добавить платеж'}
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
          {/* Сумма и тип */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Сумма *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className={`form-input ${errors.amount ? 'border-red-500' : ''}`}
                placeholder="10000"
                min="0"
                step="0.01"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                <CreditCard className="w-4 h-4 inline mr-1" />
                Тип операции
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="form-input"
              >
                <option value="income">Доход</option>
                <option value="expense">Расход</option>
              </select>
            </div>
          </div>

          {/* Дата платежа */}
          <div>
            <label className="form-label">
              <Calendar className="w-4 h-4 inline mr-1" />
              Дата платежа *
            </label>
            <input
              type="date"
              value={formData.paymentDate}
              onChange={(e) => handleChange('paymentDate', e.target.value)}
              className="form-input"
            />
          </div>

          {/* Описание */}
          <div>
            <label className="form-label">
              <FileText className="w-4 h-4 inline mr-1" />
              Комментарий *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`form-input h-20 resize-none ${errors.description ? 'border-red-500' : ''}`}
              placeholder="За что переведено (например: Оплата за разработку сайта)"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
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
              {isSubmitting ? 'Сохранение...' : (payment ? 'Сохранить' : 'Добавить')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
