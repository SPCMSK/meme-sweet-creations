
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserPoints {
  points: number;
  total_earned: number;
  total_redeemed: number;
}

interface PointsTransaction {
  id: string;
  points: number;
  type: string;
  description: string;
  created_at: string;
}

export const useUserPoints = () => {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserPoints = async () => {
    if (!user) {
      setUserPoints(null);
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // For now, we'll mock the points system since the tables aren't in the type system yet
      // In production, uncomment the real queries once the database types are updated
      
      // Mock user points
      setUserPoints({ points: 150, total_earned: 500, total_redeemed: 350 });
      
      // Mock transactions
      setTransactions([
        {
          id: '1',
          points: 50,
          type: 'earned',
          description: 'Compra de torta de chocolate',
          created_at: new Date().toISOString()
        },
        {
          id: '2', 
          points: -100,
          type: 'redeemed',
          description: 'Canje por descuento',
          created_at: new Date().toISOString()
        }
      ]);

      /* Real implementation (uncomment when database types are updated):
      
      // Obtener puntos del usuario
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (pointsError && pointsError.code !== 'PGRST116') {
        console.error('Error fetching user points:', pointsError);
      } else {
        setUserPoints(pointsData || { points: 0, total_earned: 0, total_redeemed: 0 });
      }

      // Obtener transacciones
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
      } else {
        setTransactions(transactionsData || []);
      }
      */

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPointsTransaction = async (points: number, type: string, description: string) => {
    if (!user) return false;

    try {
      // Mock implementation for now
      console.log('Adding points transaction:', { points, type, description });
      
      /* Real implementation (uncomment when database types are updated):
      
      const { error } = await supabase
        .from('points_transactions')
        .insert({
          user_id: user.id,
          points,
          type,
          description
        });

      if (error) {
        console.error('Error adding points transaction:', error);
        return false;
      }

      // Refrescar datos después de la transacción
      await fetchUserPoints();
      */
      
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchUserPoints();
  }, [user]);

  return {
    userPoints,
    transactions,
    loading,
    refetch: fetchUserPoints,
    addPointsTransaction
  };
};
