
import { supabase } from '../lib/supabaseClient';

export const signInWithGoogle = async () => {
  console.log('Starting Google sign in...');
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    },
  });
  
  if (error) {
    console.error('Error signing in with Google:', error.message);
    throw error;
  }
  
  console.log('Google sign in initiated successfully');
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
};
