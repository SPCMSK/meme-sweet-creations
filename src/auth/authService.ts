import { supabase } from '../lib/supabaseClient'; // Importa tu cliente Supabase inicializado

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin, // O tu URL de redirección específica post-login
    },
  });
  if (error) {
    console.error('Error signing in with Google:', error.message);
    // Aquí podrías mostrar una notificación al usuario
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
  }
  // Podrías redirigir al usuario a la página de inicio o actualizar el estado
};
