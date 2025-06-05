
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Save, X, Video, FileText, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ImageUpload from './ImageUpload';

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  tier_required: string;
}

interface RecipeFormData {
  title: string;
  description: string;
  content: string;
  image_url: string;
  video_url: string;
  tier_required: string;
}

const RecipeManager = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    description: '',
    content: '',
    image_url: '',
    video_url: '',
    tier_required: 'free'
  });

  const tiers = [
    { value: 'free', label: 'Gratis', color: 'bg-green-100 text-green-800' },
    { value: 'basic', label: 'Básico', color: 'bg-blue-100 text-blue-800' },
    { value: 'premium', label: 'Premium', color: 'bg-purple-100 text-purple-800' },
    { value: 'vip', label: 'VIP', color: 'bg-yellow-100 text-yellow-800' }
  ];

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
        toast.error('Error al cargar recetas');
      } else {
        setRecipes(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      image_url: '',
      video_url: '',
      tier_required: 'free'
    });
    setEditingRecipe(null);
    setShowForm(false);
  };

  const handleEdit = (recipe: Recipe) => {
    setFormData({
      title: recipe.title,
      description: recipe.description || '',
      content: recipe.content || '',
      image_url: recipe.image_url || '',
      video_url: recipe.video_url || '',
      tier_required: recipe.tier_required || 'free'
    });
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('El título es requerido');
      return;
    }

    try {
      const recipeData = {
        title: formData.title,
        description: formData.description || null,
        content: formData.content || null,
        image_url: formData.image_url || null,
        video_url: formData.video_url || null,
        tier_required: formData.tier_required
      };

      if (editingRecipe) {
        // Actualizar receta existente
        const { error } = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', editingRecipe.id);

        if (error) {
          console.error('Error updating recipe:', error);
          toast.error('Error al actualizar receta');
          return;
        }

        toast.success('Receta actualizada exitosamente');
      } else {
        // Crear nueva receta
        const { error } = await supabase
          .from('recipes')
          .insert([recipeData]);

        if (error) {
          console.error('Error creating recipe:', error);
          toast.error('Error al crear receta');
          return;
        }

        toast.success('Receta creada exitosamente');
      }

      resetForm();
      fetchRecipes();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    }
  };

  const handleDelete = async (recipeId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId);

      if (error) {
        console.error('Error deleting recipe:', error);
        toast.error('Error al eliminar receta');
        return;
      }

      toast.success('Receta eliminada exitosamente');
      fetchRecipes();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    }
  };

  const getTierInfo = (tier: string) => {
    return tiers.find(t => t.value === tier) || tiers[0];
  };

  if (loading) {
    return <div>Cargando recetas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-charcoal">Gestión de Recetas</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-pastel-purple hover:bg-pastel-purple/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Receta
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingRecipe ? 'Editar Receta' : 'Nueva Receta'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título de la receta"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descripción de la receta"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="content">Contenido/Instrucciones</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Instrucciones detalladas de la receta"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="video_url">URL de Video</Label>
                  <Input
                    id="video_url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <Label htmlFor="tier_required">Nivel de Acceso</Label>
                  <Select value={formData.tier_required} onValueChange={(value) => setFormData({ ...formData, tier_required: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiers.map((tier) => (
                        <SelectItem key={tier.value} value={tier.value}>
                          <div className="flex items-center space-x-2">
                            {tier.value !== 'free' && <Crown className="h-4 w-4" />}
                            <span>{tier.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <ImageUpload
                  currentImage={formData.image_url}
                  onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                  onImageRemoved={() => setFormData({ ...formData, image_url: '' })}
                  label="Imagen de la Receta"
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Save className="mr-2 h-4 w-4" />
                  {editingRecipe ? 'Actualizar' : 'Crear'} Receta
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {recipes.map((recipe) => {
          const tierInfo = getTierInfo(recipe.tier_required);
          
          return (
            <Card key={recipe.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      {recipe.image_url && (
                        <img
                          src={recipe.image_url}
                          alt={recipe.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{recipe.title}</h3>
                        
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`text-sm px-2 py-1 rounded ${tierInfo.color}`}>
                            {tierInfo.value !== 'free' && <Crown className="inline w-3 h-3 mr-1" />}
                            {tierInfo.label}
                          </span>

                          {recipe.video_url && (
                            <span className="flex items-center text-sm text-gray-500">
                              <Video className="w-4 h-4 mr-1" />
                              Video
                            </span>
                          )}

                          {recipe.content && (
                            <span className="flex items-center text-sm text-gray-500">
                              <FileText className="w-4 h-4 mr-1" />
                              Instrucciones
                            </span>
                          )}
                        </div>

                        {recipe.description && (
                          <p className="text-gray-600 mt-2 text-sm">{recipe.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(recipe)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(recipe.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {recipes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay recetas registradas</p>
        </div>
      )}
    </div>
  );
};

export default RecipeManager;
