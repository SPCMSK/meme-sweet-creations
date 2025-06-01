
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirigir si ya está autenticado
  React.useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasMinLength = password.length >= 6;
    
    if (!hasMinLength) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!hasUpperCase) {
      return 'La contraseña debe tener al menos una letra mayúscula';
    }
    if (!hasNumbers) {
      return 'La contraseña debe tener al menos un número';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!isLogin) {
      // Validaciones para registro
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        setLoading(false);
        return;
      }

      if (!username || !firstName || !lastName) {
        setError('Todos los campos son obligatorios');
        setLoading(false);
        return;
      }

      if (username.length < 3) {
        setError('El nombre de usuario debe tener al menos 3 caracteres');
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        // Iniciar sesión
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Credenciales incorrectas. Verifica tu email y contraseña.');
          } else if (error.message.includes('Email not confirmed')) {
            setError('Por favor verifica tu email antes de iniciar sesión.');
          } else {
            setError(error.message);
          }
        } else {
          console.log('Login successful');
          navigate('/', { replace: true });
        }
      } else {
        // Registrarse
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              username,
              first_name: firstName,
              last_name: lastName,
            }
          }
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            setError('Este email ya está registrado. Intenta iniciar sesión.');
          } else {
            setError(error.message);
          }
        } else {
          setSuccess('¡Cuenta creada exitosamente! Se ha enviado un correo de verificación a tu email desde deliciasdememe.cl@gmail.com. Por favor revisa tu bandeja de entrada y haz clic en el enlace de verificación. El enlace expirará en 5 minutos.');
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
          setUsername('');
          setFirstName('');
          setLastName('');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Ha ocurrido un error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-playfair text-2xl text-charcoal">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </CardTitle>
          <CardDescription className="font-inter text-charcoal/70">
            {isLogin 
              ? 'Ingresa a tu cuenta de Delicias de Meme' 
              : 'Únete a la comunidad de Delicias de Meme'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-charcoal">Nombre de Usuario</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="usuario123"
                    required
                    className="border-pastel-pink/30 focus:border-pastel-purple"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-charcoal">Nombre</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Juan"
                      required
                      className="border-pastel-pink/30 focus:border-pastel-purple"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-charcoal">Apellido</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Pérez"
                      required
                      className="border-pastel-pink/30 focus:border-pastel-purple"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-charcoal">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="border-pastel-pink/30 focus:border-pastel-purple"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-charcoal">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="border-pastel-pink/30 focus:border-pastel-purple"
              />
              {!isLogin && (
                <p className="text-xs text-charcoal/60">
                  Debe tener al menos 6 caracteres, una mayúscula y un número
                </p>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-charcoal">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="border-pastel-pink/30 focus:border-pastel-purple"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-pastel-purple hover:bg-pastel-purple/90 text-white"
            >
              {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
                setPassword('');
                setConfirmPassword('');
                setUsername('');
                setFirstName('');
                setLastName('');
              }}
              className="text-pastel-purple hover:text-pastel-purple/80 font-inter text-sm"
            >
              {isLogin 
                ? '¿No tienes cuenta? Regístrate aquí' 
                : '¿Ya tienes cuenta? Inicia sesión aquí'
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
