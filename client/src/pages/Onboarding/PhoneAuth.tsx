import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function PhoneAuth() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) setStep('OTP');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      login({ phone: '+91' + phone, name: 'Lokaal User', pinCode: '462001' });
      navigate('/feed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2 text-center">Lokaal</h1>
        <p className="text-gray-500 mb-8 text-center text-sm">Your Neighbourhood in Your Pocket</p>

        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-gray-700">Enter Mobile Number</label>
            <div className="flex bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <span className="px-4 py-3 bg-gray-100 text-gray-500 font-medium border-r border-gray-200">+91</span>
              <input 
                type="tel" 
                maxLength={10} 
                className="w-full px-4 py-3 bg-transparent outline-none font-medium" 
                placeholder="98765 43210" 
                value={phone} 
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                autoFocus 
              />
            </div>
            <button 
              type="submit" 
              disabled={phone.length !== 10}
              className="w-full py-3 mt-4 bg-[#E85D2B] text-white font-bold rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-gray-700 text-center">Enter 6-digit OTP sent to +91 {phone}</label>
            <input 
              type="text" 
              maxLength={6} 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none font-bold text-center tracking-widest text-2xl" 
              placeholder="••••••" 
              value={otp} 
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              autoFocus 
            />
            <button 
              type="submit" 
              disabled={otp.length !== 6}
              className="w-full py-3 mt-4 bg-[#E85D2B] text-white font-bold rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors"
            >
              Verify & Proceed
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
