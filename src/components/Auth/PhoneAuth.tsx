import React, { useState } from 'react';
import { Phone, Shield, ArrowRight } from 'lucide-react';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult 
} from 'firebase/auth';
import { auth } from '../../config/firebase';

export const PhoneAuth: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('+7');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (value: string) => {
    // Убираем все кроме цифр и +
    const cleaned = value.replace(/[^\d+]/g, '');
    
    // Гарантируем, что начинается с +7
    if (!cleaned.startsWith('+7')) {
      return '+7';
    }
    
    return cleaned;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          }
        }
      );
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      alert('Код отправлен на ваш номер телефона!');
    } catch (error: any) {
      console.error('Ошибка отправки кода:', error);
      
      // Более детальная обработка ошибок
      if (error.code === 'auth/configuration-not-found' || error.code === 'auth/invalid-api-key') {
        setError('⚠️ Firebase не настроен! Откройте файл SETUP_INSTRUCTIONS.md для настройки.');
      } else if (error.code === 'auth/invalid-phone-number') {
        setError('Неверный формат номера. Используйте международный формат: +79991234567');
      } else if (error.code === 'auth/quota-exceeded') {
        setError('Превышен лимит SMS. Попробуйте позже.');
      } else {
        setError(`Ошибка: ${error.message || 'Проверьте настройки Firebase'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (confirmationResult) {
        await confirmationResult.confirm(verificationCode);
        // Пользователь успешно вошел
      }
    } catch (error: any) {
      console.error('Ошибка проверки кода:', error);
      setError('Неверный код. Попробуйте еще раз.');
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
            {confirmationResult ? 'Введите код из SMS' : 'Вход по номеру телефона'}
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
          {!confirmationResult ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-sm font-accent mb-2" style={{ color: '#c0c0c0' }}>
                  <Phone className="w-4 h-4 inline mr-2" />
                  Номер телефона
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="+79991234567"
                  className="w-full px-4 py-3 rounded-lg border backdrop-blur-sm transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(80, 80, 80, 0.2)',
                    borderColor: 'rgba(120, 120, 120, 0.3)',
                    color: '#c0c0c0'
                  }}
                  required
                />
                <p className="text-xs mt-2" style={{ color: '#909090' }}>
                  Пример: +79991234567 (11 цифр)
                </p>
              </div>

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
                    <span>Получить код</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className="block text-sm font-accent mb-2" style={{ color: '#c0c0c0' }}>
                  Код подтверждения
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-lg border backdrop-blur-sm transition-all duration-300 text-center text-2xl tracking-widest"
                  style={{
                    backgroundColor: 'rgba(80, 80, 80, 0.2)',
                    borderColor: 'rgba(120, 120, 120, 0.3)',
                    color: '#c0c0c0'
                  }}
                  maxLength={6}
                  required
                />
                <p className="text-xs mt-2 text-center" style={{ color: '#909090' }}>
                  Код отправлен на {phoneNumber}
                </p>
              </div>

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
                    <span>Войти</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setConfirmationResult(null);
                  setVerificationCode('');
                  setError('');
                }}
                className="w-full btn-secondary py-2"
              >
                Изменить номер
              </button>
            </form>
          )}
        </div>

        {/* reCAPTCHA контейнер */}
        <div id="recaptcha-container"></div>

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

