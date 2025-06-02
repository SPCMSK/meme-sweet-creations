
import React, { useState } from 'react';
import { User, Settings, Heart, Tag, ShoppingBag, LogOut, Crown, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleClubDiscounts = () => {
    if (profile?.is_club_member) {
      navigate('/profile/discounts');
    } else {
      navigate('/club-subscriptions');
    }
  };

  if (!user || !profile) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 text-charcoal hover:text-pastel-purple"
        >
          <User size={16} />
          <span className="font-inter text-sm">
            {profile.username}
          </span>
          {profile.is_club_member && (
            <Crown size={14} className="text-pastel-purple" />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem onClick={() => navigate('/mi-cuenta')}>
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Mi Cuenta</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Ver y Editar Perfil</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/profile/recipes')}>
          <Heart className="mr-2 h-4 w-4" />
          <span>Recetas Guardadas</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/profile/favorites')}>
          <Heart className="mr-2 h-4 w-4" />
          <span>Productos Favoritos</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleClubDiscounts}>
          <Tag className="mr-2 h-4 w-4" />
          <span>
            {profile.is_club_member ? 'Mis Descuentos' : 'Únete al Club'}
          </span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/profile/orders')}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          <span>Mis Pedidos</span>
        </DropdownMenuItem>

        {profile.role === 'admin' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin')}>
              <Crown className="mr-2 h-4 w-4" />
              <span>Panel de Admin</span>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
