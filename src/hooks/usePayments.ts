import { useState, useEffect, useCallback } from 'react';
import { db } from '../database/db';
import { Payment, PaymentType, PaymentStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const paymentsData = await db.payments.orderBy('createdAt').toArray();
      setPayments(paymentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки платежей');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const createPayment = async (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newPayment: Payment = {
        ...paymentData,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.payments.add(newPayment);
      await loadPayments();
      return newPayment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания платежа');
      throw err;
    }
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await db.payments.update(id, updateData);
      await loadPayments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления платежа');
      throw err;
    }
  };

  const deletePayment = async (id: string) => {
    try {
      await db.payments.delete(id);
      await loadPayments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления платежа');
      throw err;
    }
  };

  const markAsPaid = async (id: string, paidDate?: Date) => {
    try {
      await db.payments.update(id, {
        status: 'paid',
        paidDate: paidDate || new Date(),
        updatedAt: new Date()
      });
      await loadPayments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления статуса платежа');
      throw err;
    }
  };

  const getFinancialStats = useCallback(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyPayments = payments.filter(payment => 
      payment.createdAt >= startOfMonth && payment.createdAt <= endOfMonth
    );

    const income = monthlyPayments
      .filter(p => p.type === 'income' && p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const expenses = monthlyPayments
      .filter(p => p.type === 'expense' && p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingIncome = payments
      .filter(p => p.type === 'income' && p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    const overduePayments = payments.filter(p => 
      p.status === 'pending' && p.dueDate && p.dueDate < now
    );

    return {
      monthlyIncome: income,
      monthlyExpenses: expenses,
      netIncome: income - expenses,
      pendingIncome,
      overduePayments: overduePayments.length,
      totalPayments: payments.length
    };
  }, [payments]);

  return {
    payments,
    loading,
    error,
    createPayment,
    updatePayment,
    deletePayment,
    markAsPaid,
    getFinancialStats,
    refetch: loadPayments
  };
};
