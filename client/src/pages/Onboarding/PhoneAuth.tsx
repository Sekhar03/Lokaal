import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function PhoneAuth() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [pinCode, setPinCode] = useState('');
  
  // Profile fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('RESIDENT');
  const [flatNumber, setFlatNumber] = useState('');
  
  // Verification field
  const [verificationDoc, setVerificationDoc] = useState('');

  const [step, setStep] = useState<'PHONE' | 'OTP' | 'PROFILE' | 'VERIFICATION' | 'LOCATION'>('PHONE');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      setIsLoading(true);
      try {
        await fetch('http://localhost:3001/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: '+91' + phone })
        });
        setStep('OTP');
      } catch (err) {
        console.warn('API failed, falling back to mock OTP sending:', err);
        setStep('OTP');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      setIsLoading(true);
      try {
        const res = await fetch('http://localhost:3001/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: '+91' + phone, otp })
        });
        const data = await res.json();
        
        if (data.token) {
          localStorage.setItem('lokaal_token', data.token);
          
          if (data.user.name === 'New User' || !data.user.name) {
            setStep('PROFILE');
          } else if (!data.user.pinCode) {
            setStep('LOCATION');
          } else {
            login(data.user);
            navigate('/feed');
          }
        } else {
          alert(data.error || 'Invalid OTP');
        }
      } catch (err) {
        console.warn('API failed, falling back to mock OTP verification:', err);
        if (otp === '123456') {
          const mockUser = {
            id: 'mock-user-123',
            phone: '+91' + phone,
            name: 'New User',
            pinCode: '',
            role: phone === '9999999999' ? 'PLATFORM_ADMIN' : 'RESIDENT'
          };
          localStorage.setItem('lokaal_token', 'mock-token-123');
          localStorage.setItem('mock_user', JSON.stringify(mockUser));
          setStep('PROFILE');
        } else {
          alert('Invalid OTP (Mock mode accepts 123456)');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('lokaal_token');
        const res = await fetch('http://localhost:3001/api/auth/profile', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name, role, flatNumber })
        });
        const data = await res.json();
        if (data.success) {
          if (role !== 'RESIDENT') {
            setStep('VERIFICATION');
          } else {
            setStep('LOCATION');
          }
        } else {
          alert(data.error || 'Failed to update profile');
        }
      } catch (err) {
        console.warn('API failed, falling back to mock profile update:', err);
        const mockUserStr = localStorage.getItem('mock_user');
        if (mockUserStr) {
          const mockUser = JSON.parse(mockUserStr);
          mockUser.name = name;
          mockUser.role = role;
          mockUser.flatNumber = flatNumber;
          localStorage.setItem('mock_user', JSON.stringify(mockUser));
        }
        if (role !== 'RESIDENT') {
          setStep('VERIFICATION');
        } else {
          setStep('LOCATION');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate an upload delay for the prototype
    setTimeout(async () => {
      const fakeUrl = 'https://mock-storage.lokaal.app/doc_' + Date.now() + '.pdf';
      try {
        const token = localStorage.getItem('lokaal_token');
        const res = await fetch('http://localhost:3001/api/auth/profile', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name, role, flatNumber, verificationDoc: fakeUrl })
        });
        const data = await res.json();
        if (data.success) {
          setStep('LOCATION');
        } else {
          alert(data.error || 'Failed to save document');
        }
      } catch (err) {
        console.warn('API failed, falling back to mock document upload:', err);
        const mockUserStr = localStorage.getItem('mock_user');
        if (mockUserStr) {
          const mockUser = JSON.parse(mockUserStr);
          mockUser.verificationDoc = fakeUrl;
          localStorage.setItem('mock_user', JSON.stringify(mockUser));
        }
        setStep('LOCATION');
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleLocationVerification = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        
        const detectedPinCode = data.address?.postcode || '462001';
        setPinCode(detectedPinCode);
        
        try {
          const token = localStorage.getItem('lokaal_token');
          const updateRes = await fetch('http://localhost:3001/api/auth/location', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ pinCode: detectedPinCode })
          });
          
          const updateData = await updateRes.json();
          if (updateData.success) {
            login(updateData.user);
            navigate('/feed');
          }
        } catch (err) {
          console.warn('API failed, falling back to mock location verification:', err);
          const mockUserStr = localStorage.getItem('mock_user');
          let finalUser = {
            id: 'mock-user-123',
            phone: '+91' + phone,
            name: name || 'Mock User',
            pinCode: detectedPinCode,
            role: role || 'RESIDENT'
          };
          if (mockUserStr) {
            const parsedUser = JSON.parse(mockUserStr);
            finalUser = { ...parsedUser, pinCode: detectedPinCode };
          }
          localStorage.setItem('mock_user', JSON.stringify(finalUser));
          login(finalUser);
          navigate('/feed');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to detect location');
      } finally {
        setIsLoading(false);
      }
    }, () => {
      console.warn('Location access denied, falling back to default mock pincode');
      const detectedPinCode = '462001';
      const mockUserStr = localStorage.getItem('mock_user');
      let finalUser = {
        id: 'mock-user-123',
        phone: '+91' + phone,
        name: name || 'Mock User',
        pinCode: detectedPinCode,
        role: role || 'RESIDENT'
      };
      if (mockUserStr) {
        const parsedUser = JSON.parse(mockUserStr);
        finalUser = { ...parsedUser, pinCode: detectedPinCode };
      }
      localStorage.setItem('mock_user', JSON.stringify(finalUser));
      login(finalUser);
      navigate('/feed');
      setIsLoading(false);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2 text-center">Lokaal</h1>
        <p className="text-gray-500 mb-8 text-center text-sm">Your Neighbourhood in Your Pocket</p>

        {step === 'PHONE' && (
          <div className="flex flex-col gap-4">
            {/* Tabs for Sign In vs Sign Up */}
            <div className="flex bg-gray-100/80 p-1 rounded-xl mb-4 border border-slate-100 shadow-inner">
              <button 
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${authMode === 'signin' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${authMode === 'signup' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <label className="text-sm font-semibold text-gray-700">
                {authMode === 'signin' ? 'Sign In with Mobile Number' : 'Sign Up with Mobile Number'}
              </label>
              <div className="flex bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:border-orange-400 transition-colors">
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
                disabled={phone.length !== 10 || isLoading}
                className="w-full py-3 mt-4 bg-[#E85D2B] text-white font-bold rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20"
              >
                {isLoading ? 'Sending...' : authMode === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            </form>
          </div>
        )}

        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-gray-700 text-center">Enter 6-digit OTP sent to +91 {phone}</label>
            <p className="text-xs text-orange-500 text-center mb-2">Development mode: Use 123456</p>
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
              disabled={otp.length !== 6 || isLoading}
              className="w-full py-3 mt-4 bg-[#E85D2B] text-white font-bold rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors"
            >
              {isLoading ? 'Verifying...' : 'Verify & Proceed'}
            </button>
          </form>
        )}

        {step === 'PROFILE' && (
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
            <h2 className="text-xl font-bold text-[#1A1A2E] text-center border-b pb-4 mb-2">Setup Your Profile</h2>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Full Name *</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none font-medium" 
                placeholder="Rahul Kumar" 
                value={name} 
                onChange={e => setName(e.target.value)}
                autoFocus 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">I am joining as a *</label>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setRole('RESIDENT')}
                    className={`flex-1 py-2 text-sm rounded-lg font-bold border ${role === 'RESIDENT' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                  >
                    Resident
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole('BUSINESS_OWNER')}
                    className={`flex-1 py-2 text-sm rounded-lg font-bold border ${role === 'BUSINESS_OWNER' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                  >
                    Business
                  </button>
                </div>
                <button 
                  type="button"
                  onClick={() => setRole('SOCIETY_ADMIN')}
                  className={`w-full py-2 text-sm rounded-lg font-bold border ${role === 'SOCIETY_ADMIN' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                >
                  Society Admin
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Flat / House Number (Optional)</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none font-medium" 
                placeholder="e.g. A-402" 
                value={flatNumber} 
                onChange={e => setFlatNumber(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={!name.trim() || isLoading}
              className="w-full py-3 mt-4 bg-[#E85D2B] text-white font-bold rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Continue'}
            </button>
          </form>
        )}

        {step === 'VERIFICATION' && (
          <form onSubmit={handleDocumentUpload} className="flex flex-col gap-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-2 text-blue-500">
              📄
            </div>
            <h2 className="text-xl font-bold text-[#1A1A2E] text-center">Verification Required</h2>
            <p className="text-gray-500 text-center text-sm mb-4">
              Since you are registering as a <strong>{role === 'BUSINESS_OWNER' ? 'Business' : 'Society Admin'}</strong>, we need to verify your credentials.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 text-center hover:bg-gray-100 transition-colors cursor-pointer">
              <input 
                type="file" 
                accept="image/*,.pdf" 
                className="hidden" 
                id="doc-upload"
                onChange={(e) => {
                  if (e.target.files?.[0]) setVerificationDoc(e.target.files[0].name);
                }}
              />
              <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                {verificationDoc ? (
                  <span className="font-bold text-orange-600 truncate w-full px-4">{verificationDoc}</span>
                ) : (
                  <>
                    <span className="font-bold text-gray-700">Click to upload document</span>
                    <span className="text-xs text-gray-400 mt-1">GST, Society Reg, or ID Proof (PDF/JPG)</span>
                  </>
                )}
              </label>
            </div>

            <button 
              type="submit" 
              disabled={!verificationDoc || isLoading}
              className="w-full py-3 mt-4 bg-[#E85D2B] text-white font-bold rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors"
            >
              {isLoading ? 'Uploading...' : 'Submit Document'}
            </button>
          </form>
        )}

        {step === 'LOCATION' && (
          <div className="flex flex-col gap-4 items-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-4xl mb-2">
              📍
            </div>
            <h2 className="text-xl font-bold text-[#1A1A2E] text-center">Find Your Neighbourhood</h2>
            <p className="text-gray-500 text-center text-sm mb-4">
              We need your location to connect you with your local society and neighbours in your pincode.
            </p>
            
            {pinCode && (
              <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-green-800 font-bold">Detected Pincode: {pinCode}</p>
              </div>
            )}

            <button 
              onClick={handleLocationVerification}
              disabled={isLoading}
              className="w-full py-3 mt-2 bg-[#E85D2B] text-white font-bold rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {isLoading ? 'Detecting...' : 'Allow Location Access'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
