
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error.message);
          navigate('/', { replace: true });
          return;
        }

        if (data.session) {
          console.log('Authentication successful, redirecting to home');
          navigate('/', { replace: true });
        } else {
          console.log('No session found, redirecting to home');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        navigate('/', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pastel-purple mx-auto mb-4"></div>
        <p className="text-charcoal font-inter">Procesando autenticación...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
