
import React, { useState } from 'react';
import Button from '../components/Button';
import { ShieldIcon } from '../components/icons';
import { useToasts } from '../context/ToastContext';
import Modal from '../components/Modal';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const { addToast } = useToasts();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'analyst@soc.com' && password === 'password') {
        setShowOtpModal(true);
    } else {
        addToast('Invalid credentials. Please try again.', 'error');
    }
  };
  
  const handleOtpSubmit = () => {
      // Mock OTP validation
      setShowOtpModal(false);
      addToast('Logged in successfully!', 'success');
      onLoginSuccess();
  }

  const handleForgotPassword = () => {
    setShowResetModal(true);
    // In a real app, you would trigger an API call here.
    setTimeout(() => {
        setShowResetModal(false);
        addToast('Password reset email sent.', 'info');
    }, 1500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full p-8 space-y-8">
        <div className="text-center">
            <ShieldIcon className="w-16 h-16 text-[#035865] mx-auto" />
            <h2 className="mt-6 text-3xl font-extrabold text-[#035865]">
                Cyber-Shield Login
            </h2>
            <p className="mt-2 text-sm text-gray-600">
                Access your Security Operations Center
            </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#17D6C9] focus:border-[#17D6C9] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#17D6C9] focus:border-[#17D6C9] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" onClick={handleForgotPassword} className="font-medium text-[#035865] hover:text-[#17D6C9]">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button type="submit" variant="primary" className="w-full justify-center py-3">
              Sign in
            </Button>
          </div>
        </form>
      </div>

      <Modal isOpen={showOtpModal} onClose={() => setShowOtpModal(false)} title="2FA Verification">
        <p className="text-gray-600 mb-4">An OTP has been sent to your registered device. Please enter it below.</p>
        <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#17D6C9] focus:border-[#17D6C9]"
            placeholder="Enter OTP"
        />
        <div className="mt-6 flex justify-end">
            <Button variant="accent" onClick={handleOtpSubmit}>Verify</Button>
        </div>
      </Modal>

      <Modal isOpen={showResetModal} onClose={() => {}} title="Reset Password">
        <div className="text-center">
            <p className="text-gray-600">Sending password reset instructions...</p>
        </div>
      </Modal>

    </div>
  );
};

export default Login;
