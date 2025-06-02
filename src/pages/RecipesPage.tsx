
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown, Clock, Users, Filter, Heart, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import Navbar from '@/components/Navbar';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  video_url?: string;
  is_free: boolean;
  category: string;
  difficulty_level: string;
  prep_time: number;
  cook_time: number;
  servings: number;
}

const RecipesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);

  useEffect(() => {
    fetchRecipes();
    if (user) {
      fetchSavedRecipes();
    }
  }, [user, profile]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
        return;
      }

      setRecipes(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedRecipes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_recipes')
        .select('recipe_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching saved recipes:', error);
        return;
      }

      setSavedRecipes(data?.map(item => item.recipe_id) || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleSaveRecipe = async (recipeId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const isSaved = savedRecipes.includes(recipeId);
      
      if (isSaved) {
        const { error } = await supabase
          .from('user_recipes')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);

        if (error) {
          console.error('Error removing saved recipe:', error);
          return;
        }

        setSavedRecipes(prev => prev.filter(id => id !== recipeId));
      } else {
        const { error } = await supabase
          .from('user_recipes')
          .insert({
            user_id: user.id,
            recipe_id: recipeId
          });

        if (error) {
          console.error('Error saving recipe:', error);
          return;
        }

        setSavedRecipes(prev => [...prev, recipeId]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (filter === 'free') return recipe.is_free;
    if (filter === 'premium') return !recipe.is_free;
    return true;
  });

  const canViewPremium = profile?.is_club_member;

  const handleRecipeClick = (recipe: Recipe) => {
    if (!recipe.is_free && !canViewPremium) {
      navigate('/club-subscriptions');
      return;
    }
    navigate(`/recetas/${recipe.id}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'fácil': return 'bg-green-100 text-green-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'difícil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pastel-purple mx-auto mb-4"></div>
            <p className="font-inter text-charcoal/70">Cargando recetas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto p-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/club-delicias')}
          className="mb-4 text-charcoal hover:text-pastel-purple"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Club
        </Button>

        <div className="mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Recetario del Club
          </h1>
          <p className="font-inter text-charcoal/70 text-lg max-w-2xl">
            Descubre nuestras recetas cuidadosamente seleccionadas, desde básicas gratuitas 
            hasta técnicas premium exclusivas para miembros.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-pastel-purple hover:bg-pastel-purple/90' : 'border-pastel-purple text-pastel-purple hover:bg-pastel-purple hover:text-white'}
          >
            <Filter className="mr-2 h-4 w-4" />
            Todas
          </Button>
          <Button
            variant={filter === 'free' ? 'default' : 'outline'}
            onClick={() => setFilter('free')}
            className={filter === 'free' ? 'bg-pastel-purple hover:bg-pastel-purple/90' : 'border-pastel-purple text-pastel-purple hover:bg-pastel-purple hover:text-white'}
          >
            Gratuitas
          </Button>
          <Button
            variant={filter === 'premium' ? 'default' : 'outline'}
            onClick={() => setFilter('premium')}
            className={filter === 'premium' ? 'bg-pastel-purple hover:bg-pastel-purple/90' : 'border-pastel-purple text-pastel-purple hover:bg-pastel-purple hover:text-white'}
          >
            <Crown className="mr-2 h-4 w-4" />
            Premium
          </Button>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-inter text-charcoal/70 text-lg">
              No se encontraron recetas con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card 
                key={recipe.id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => handleRecipeClick(recipe)}
              >
                <div className="relative">
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                    <img 
                      src={recipe.image_url || '/placeholder.svg'} 
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Recipe Type Badge */}
                  <div className="absolute top-3 left-3">
                    {recipe.is_free ? (
                      <Badge className="bg-green-100 text-green-800">
                        Gratis
                      </Badge>
                    ) : (
                      <Badge className="bg-pastel-purple text-white">
                        <Crown className="mr-1 h-3 w-3" />
                        Premium
                      </Badge>
                    )}
                  </div>

                  {/* Video Indicator */}
                  {recipe.video_url && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-black/70 text-white p-2 rounded-full">
                        <Play className="h-4 w-4" />
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  {user && (recipe.is_free || canViewPremium) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveRecipe(recipe.id);
                      }}
                      className="absolute bottom-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                    >
                      <Heart 
                        className={`h-4 w-4 ${savedRecipes.includes(recipe.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                      />
                    </button>
                  )}

                  {/* Premium Lock Overlay */}
                  {!recipe.is_free && !canViewPremium && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                      <div className="text-center text-white">
                        <Crown className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-semibold">Solo para miembros</p>
                      </div>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="font-playfair text-xl text-charcoal group-hover:text-pastel-purple transition-colors">
                      {recipe.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="font-inter text-charcoal/70">
                    {recipe.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-charcoal/60 mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {recipe.prep_time + recipe.cook_time} min
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {recipe.servings} porciones
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={getDifficultyColor(recipe.difficulty_level)}>
                      {recipe.difficulty_level}
                    </Badge>
                    <Badge variant="outline" className="text-pastel-purple border-pastel-purple">
                      {recipe.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipesPage;
