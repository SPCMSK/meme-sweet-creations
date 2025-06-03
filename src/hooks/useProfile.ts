
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  is_club_member: boolean;
  subscription_tier: string | null;
  role: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setError(error.message);
      } else {
        // Asegurar que los campos requeridos estén presentes
        const profileWithDefaults: Profile = {
          ...data,
          role: data.role || 'user',
          avatar_url: data.avatar_url || null,
          subscription_tier: data.subscription_tier || null
        };
        setProfile(profileWithDefaults);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        setError(error.message);
        return false;
      } else {
        await fetchProfile(); // Refrescar datos
        return true;
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al actualizar el perfil');
      return false;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile
  };
};
