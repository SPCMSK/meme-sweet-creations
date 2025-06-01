
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (profile) {
      setFormData({
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name
      });
    }
  }, [user, profile, navigate]);

  const handleSave = async () => {
    setError('');
    setSuccess('');
    
    const success = await updateProfile(formData);
    if (success) {
      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
    } else {
      setError('Error al actualizar el perfil');
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <div>Cargando perfil...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <div>Error al cargar el perfil</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      <div className="pt-20 max-w-2xl mx-auto p-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 text-charcoal hover:text-pastel-purple"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="font-playfair text-2xl text-charcoal">
              Mi Perfil
            </CardTitle>
            <CardDescription className="font-inter">
              Gestiona tu información personal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-charcoal">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-charcoal/60">
                  El email no se puede modificar
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-charcoal">Nombre de Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? "border-pastel-pink/30 focus:border-pastel-purple" : "bg-gray-50"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-charcoal">Nombre</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    disabled={!isEditing}
                    className={isEditing ? "border-pastel-pink/30 focus:border-pastel-purple" : "bg-gray-50"}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-charcoal">Apellido</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    disabled={!isEditing}
                    className={isEditing ? "border-pastel-pink/30 focus:border-pastel-purple" : "bg-gray-50"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-charcoal">Estado del Club</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  {profile.is_club_member ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-semibold">✓ Miembro del Club</span>
                      {profile.subscription_tier && (
                        <span className="bg-pastel-purple text-white px-2 py-1 rounded text-xs">
                          {profile.subscription_tier.toUpperCase()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-600">No eres miembro del club</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-pastel-purple hover:bg-pastel-purple/90 text-white"
                >
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    className="bg-pastel-purple hover:bg-pastel-purple/90 text-white"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Guardar
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-pastel-pink text-charcoal hover:bg-pastel-pink/10"
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
