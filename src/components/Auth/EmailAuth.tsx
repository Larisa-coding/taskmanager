import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const EmailAuth: React.FC = () => {
  const { loginWithEmail, registerWithEmail } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      setLoading(false);
      return;
    }

    try {
      const result = isLogin 
        ? await loginWithEmail(email, password)
        : await registerWithEmail(email, password);

      if (!result.success) {
        setError(result.error || 'Произошла ошибка');
      }
    } catch (error: any) {
      setError('Произошла неожиданная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(to bottom right, #1a1d1f, #292d2f, #1f2224)' }}
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Логотип */}
        <div className="text-center mb-8">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-xl shadow-2xl"
            style={{ 
              background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.9), rgba(35, 39, 41, 0.9))',
              border: '2px solid rgba(120, 120, 120, 0.4)'
            }}
          >
            <Shield className="w-10 h-10" style={{ color: '#d0d0d0' }} />
          </div>
          <h1 className="text-3xl font-heading mb-2" style={{ color: '#c0c0c0' }}>TaskManager Pro</h1>
          <p className="font-accent" style={{ color: '#a0a0a0' }}>
            {isLogin ? 'Вход в систему' : 'Создание аккаунта'}
          </p>
        </div>

        {/* Форма */}
        <div 
          className="backdrop-blur-xl rounded-2xl p-8 shadow-2xl border"
          style={{ 
            background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.9), rgba(35, 39, 41, 0.9))',
            borderColor: 'rgba(120, 120, 120, 0.3)'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-accent mb-2" style={{ color: '#c0c0c0' }}>
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg border backdrop-blur-sm transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(80, 80, 80, 0.2)',
                  borderColor: 'rgba(120, 120, 120, 0.3)',
                  color: '#c0c0c0'
                }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-accent mb-2" style={{ color: '#c0c0c0' }}>
                <Lock className="w-4 h-4 inline mr-2" />
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Минимум 6 символов"
                className="w-full px-4 py-3 rounded-lg border backdrop-blur-sm transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(80, 80, 80, 0.2)',
                  borderColor: 'rgba(120, 120, 120, 0.3)',
                  color: '#c0c0c0'
                }}
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-accent mb-2" style={{ color: '#c0c0c0' }}>
                  <Lock className="w-4 h-4 inline mr-2" />
                  Подтвердите пароль
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторите пароль"
                  className="w-full px-4 py-3 rounded-lg border backdrop-blur-sm transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(80, 80, 80, 0.2)',
                    borderColor: 'rgba(120, 120, 120, 0.3)',
                    color: '#c0c0c0'
                  }}
                  required
                />
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(200, 80, 80, 0.2)', color: '#c08080' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: '#c0c0c0' }}></div>
              ) : (
                <>
                  <span>{isLogin ? 'Войти' : 'Создать аккаунт'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-sm font-accent transition-colors hover:underline"
                style={{ color: '#80c080' }}
              >
                {isLogin ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}
              </button>
            </div>
          </form>
        </div>

        {/* Информация */}
        <div className="mt-8 text-center">
          <p className="text-sm font-accent" style={{ color: '#808080' }}>
            Ваши данные защищены и хранятся в облаке
          </p>
          <p className="text-xs mt-2" style={{ color: '#707070' }}>
            Работает на любом устройстве с синхронизацией
          </p>
        </div>
      </div>
    </div>
  );
};
