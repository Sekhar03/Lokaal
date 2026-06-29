import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function DigiLockerCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Completing Aadhaar Verification...');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyCode = async () => {
      const code = searchParams.get('code');
      if (!code) {
        setError('Authorization code missing from DigiLocker redirect.');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/digilocker/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          localStorage.setItem('verified_aadhaar_name', data.name);
          setStatus('Identity verified successfully! Redirecting back...');
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        } else {
          setError(data.error || 'Failed to retrieve Aadhaar details.');
        }
      } catch (err) {
        console.error('[DIGILOCKER] Verification error:', err);
        setError('Unable to connect to Lokaal backend server to complete DigiLocker verification.');
      }
    };

    verifyCode();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="max-w-md w-full bg-white border border-gray-100 p-8 rounded-2xl shadow-sm text-center">
        <div className="flex justify-center mb-6">
          {/* DigiLocker Icon representation */}
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-2xl border-2 border-blue-100 shadow-sm animate-pulse">
            DL
          </div>
        </div>

        {error ? (
          <div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Verification Failed</h2>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors text-sm"
            >
              Back to Sign Up
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">DigiLocker Verification</h2>
            <p className="text-gray-500 text-sm animate-pulse">{status}</p>
          </div>
        )}
      </div>
    </div>
  );
}
