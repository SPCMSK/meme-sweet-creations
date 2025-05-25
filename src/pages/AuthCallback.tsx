
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Processing auth callback...');
        console.log('Current URL:', window.location.href);
        
        // Usar getSession para obtener la sesión después del OAuth
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error.message);
          navigate('/', { replace: true });
          return;
        }

        if (session) {
          console.log('Authentication successful:', session.user.email);
          console.log('Redirecting to home...');
          navigate('/', { replace: true });
        } else {
          console.log('No session found, checking URL params...');
          // Si no hay sesión, intentar procesar los parámetros de la URL
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          
          if (accessToken) {
            console.log('Found access token in URL, waiting for session...');
            // Esperar un momento para que Supabase procese la sesión
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 1000);
          } else {
            console.log('No access token found, redirecting to home');
            navigate('/', { replace: true });
          }
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
