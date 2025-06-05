
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Save, X, MessageSquare, Gift, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ClubMessage {
  id: string;
  title: string;
  content: string;
  target_tier: string | null;
  created_at: string;
  is_active: boolean;
}

interface ClubDiscount {
  id: string;
  title: string;
  description: string | null;
  code: string;
  discount_percentage: number;
  tier_required: string | null;
  valid_until: string;
  is_active: boolean;
}

const ClubManager = () => {
  const [messages, setMessages] = useState<ClubMessage[]>([]);
  const [discounts, setDiscounts] = useState<ClubDiscount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [editingMessage, setEditingMessage] = useState<ClubMessage | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<ClubDiscount | null>(null);

  const [messageForm, setMessageForm] = useState({
    title: '',
    content: '',
    target_tier: '',
    is_active: true
  });

  const [discountForm, setDiscountForm] = useState({
    title: '',
    description: '',
    code: '',
    discount_percentage: '',
    tier_required: '',
    valid_until: '',
    is_active: true
  });

  const tiers = [
    { value: '', label: 'Todos los miembros' },
    { value: 'basic', label: 'Básico' },
    { value: 'premium', label: 'Premium' },
    { value: 'vip', label: 'VIP' }
  ];

  useEffect(() => {
    fetchMessages();
    fetchDiscounts();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('club_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        toast.error('Error al cargar mensajes');
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const { data, error } = await supabase
        .from('club_discounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching discounts:', error);
        toast.error('Error al cargar descuentos');
      } else {
        setDiscounts(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetMessageForm = () => {
    setMessageForm({
      title: '',
      content: '',
      target_tier: '',
      is_active: true
    });
    setEditingMessage(null);
    setShowMessageForm(false);
  };

  const resetDiscountForm = () => {
    setDiscountForm({
      title: '',
      description: '',
      code: '',
      discount_percentage: '',
      tier_required: '',
      valid_until: '',
      is_active: true
    });
    setEditingDiscount(null);
    setShowDiscountForm(false);
  };

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageForm.title || !messageForm.content) {
      toast.error('Título y contenido son requeridos');
      return;
    }

    try {
      const messageData = {
        title: messageForm.title,
        content: messageForm.content,
        target_tier: messageForm.target_tier || null,
        is_active: messageForm.is_active
      };

      if (editingMessage) {
        const { error } = await supabase
          .from('club_messages')
          .update(messageData)
          .eq('id', editingMessage.id);

        if (error) {
          console.error('Error updating message:', error);
          toast.error('Error al actualizar mensaje');
          return;
        }
        toast.success('Mensaje actualizado exitosamente');
      } else {
        const { error } = await supabase
          .from('club_messages')
          .insert([messageData]);

        if (error) {
          console.error('Error creating message:', error);
          toast.error('Error al crear mensaje');
          return;
        }
        toast.success('Mensaje creado exitosamente');
      }

      resetMessageForm();
      fetchMessages();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    }
  };

  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!discountForm.title || !discountForm.code || !discountForm.discount_percentage || !discountForm.valid_until) {
      toast.error('Todos los campos marcados son requeridos');
      return;
    }

    const percentage = parseFloat(discountForm.discount_percentage);
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      toast.error('El porcentaje debe ser un número válido entre 1 y 100');
      return;
    }

    try {
      const discountData = {
        title: discountForm.title,
        description: discountForm.description || null,
        code: discountForm.code.toUpperCase(),
        discount_percentage: percentage,
        tier_required: discountForm.tier_required || null,
        valid_until: discountForm.valid_until,
        is_active: discountForm.is_active
      };

      if (editingDiscount) {
        const { error } = await supabase
          .from('club_discounts')
          .update(discountData)
          .eq('id', editingDiscount.id);

        if (error) {
          console.error('Error updating discount:', error);
          toast.error('Error al actualizar descuento');
          return;
        }
        toast.success('Descuento actualizado exitosamente');
      } else {
        const { error } = await supabase
          .from('club_discounts')
          .insert([discountData]);

        if (error) {
          console.error('Error creating discount:', error);
          toast.error('Error al crear descuento');
          return;
        }
        toast.success('Descuento creado exitosamente');
      }

      resetDiscountForm();
      fetchDiscounts();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    }
  };

  const handleEditMessage = (message: ClubMessage) => {
    setMessageForm({
      title: message.title,
      content: message.content,
      target_tier: message.target_tier || '',
      is_active: message.is_active
    });
    setEditingMessage(message);
    setShowMessageForm(true);
  };

  const handleEditDiscount = (discount: ClubDiscount) => {
    setDiscountForm({
      title: discount.title,
      description: discount.description || '',
      code: discount.code,
      discount_percentage: discount.discount_percentage.toString(),
      tier_required: discount.tier_required || '',
      valid_until: discount.valid_until,
      is_active: discount.is_active
    });
    setEditingDiscount(discount);
    setShowDiscountForm(true);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('club_messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        console.error('Error deleting message:', error);
        toast.error('Error al eliminar mensaje');
        return;
      }

      toast.success('Mensaje eliminado exitosamente');
      fetchMessages();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    }
  };

  const handleDeleteDiscount = async (discountId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este descuento?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('club_discounts')
        .delete()
        .eq('id', discountId);

      if (error) {
        console.error('Error deleting discount:', error);
        toast.error('Error al eliminar descuento');
        return;
      }

      toast.success('Descuento eliminado exitosamente');
      fetchDiscounts();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    }
  };

  if (loading) {
    return <div>Cargando gestión del club...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-charcoal">Gestión del Club</h2>
      
      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="messages" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Mensajes</span>
          </TabsTrigger>
          <TabsTrigger value="discounts" className="flex items-center space-x-2">
            <Gift className="h-4 w-4" />
            <span>Descuentos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Mensajes del Club</h3>
            <Button onClick={() => setShowMessageForm(true)} className="bg-pastel-purple hover:bg-pastel-purple/90">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Mensaje
            </Button>
          </div>

          {showMessageForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingMessage ? 'Editar Mensaje' : 'Nuevo Mensaje'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMessageSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={messageForm.title}
                      onChange={(e) => setMessageForm({ ...messageForm, title: e.target.value })}
                      placeholder="Título del mensaje"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Contenido *</Label>
                    <Textarea
                      id="content"
                      value={messageForm.content}
                      onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                      placeholder="Contenido del mensaje"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="target_tier">Audiencia</Label>
                    <Select value={messageForm.target_tier} onValueChange={(value) => setMessageForm({ ...messageForm, target_tier: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar audiencia" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiers.map((tier) => (
                          <SelectItem key={tier.value} value={tier.value}>
                            {tier.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={messageForm.is_active}
                      onCheckedChange={(checked) => setMessageForm({ ...messageForm, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Mensaje activo</Label>
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      <Save className="mr-2 h-4 w-4" />
                      {editingMessage ? 'Actualizar' : 'Crear'} Mensaje
                    </Button>
                    <Button type="button" variant="outline" onClick={resetMessageForm}>
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{message.title}</h4>
                      <p className="text-gray-600 mt-2">{message.content}</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <span className={`text-sm px-2 py-1 rounded ${message.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {message.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {message.target_tier ? tiers.find(t => t.value === message.target_tier)?.label : 'Todos los miembros'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(message.created_at).toLocaleDateString('es-CL')}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditMessage(message)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteMessage(message.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay mensajes registrados</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="discounts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Descuentos del Club</h3>
            <Button onClick={() => setShowDiscountForm(true)} className="bg-pastel-purple hover:bg-pastel-purple/90">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Descuento
            </Button>
          </div>

          {showDiscountForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingDiscount ? 'Editar Descuento' : 'Nuevo Descuento'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDiscountSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="discount_title">Título *</Label>
                      <Input
                        id="discount_title"
                        value={discountForm.title}
                        onChange={(e) => setDiscountForm({ ...discountForm, title: e.target.value })}
                        placeholder="Título del descuento"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="code">Código *</Label>
                      <Input
                        id="code"
                        value={discountForm.code}
                        onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value.toUpperCase() })}
                        placeholder="CODIGO10"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount_percentage">Porcentaje de Descuento *</Label>
                      <Input
                        id="discount_percentage"
                        type="number"
                        min="1"
                        max="100"
                        value={discountForm.discount_percentage}
                        onChange={(e) => setDiscountForm({ ...discountForm, discount_percentage: e.target.value })}
                        placeholder="10"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="valid_until">Válido Hasta *</Label>
                      <Input
                        id="valid_until"
                        type="date"
                        value={discountForm.valid_until}
                        onChange={(e) => setDiscountForm({ ...discountForm, valid_until: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="discount_description">Descripción</Label>
                    <Textarea
                      id="discount_description"
                      value={discountForm.description}
                      onChange={(e) => setDiscountForm({ ...discountForm, description: e.target.value })}
                      placeholder="Descripción del descuento"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="discount_tier">Tier Requerido</Label>
                    <Select value={discountForm.tier_required} onValueChange={(value) => setDiscountForm({ ...discountForm, tier_required: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tier requerido" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiers.map((tier) => (
                          <SelectItem key={tier.value} value={tier.value}>
                            {tier.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="discount_active"
                      checked={discountForm.is_active}
                      onCheckedChange={(checked) => setDiscountForm({ ...discountForm, is_active: checked })}
                    />
                    <Label htmlFor="discount_active">Descuento activo</Label>
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      <Save className="mr-2 h-4 w-4" />
                      {editingDiscount ? 'Actualizar' : 'Crear'} Descuento
                    </Button>
                    <Button type="button" variant="outline" onClick={resetDiscountForm}>
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {discounts.map((discount) => (
              <Card key={discount.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{discount.title}</h4>
                      <p className="text-gray-600 mt-1">{discount.description}</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                          {discount.code}
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                          {discount.discount_percentage}% OFF
                        </span>
                        <span className={`text-sm px-2 py-1 rounded ${discount.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {discount.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {discount.tier_required ? tiers.find(t => t.value === discount.tier_required)?.label : 'Todos los miembros'}
                        </span>
                        <span className="text-sm text-gray-500">
                          Válido hasta: {new Date(discount.valid_until).toLocaleDateString('es-CL')}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditDiscount(discount)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteDiscount(discount.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {discounts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay descuentos registrados</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClubManager;
