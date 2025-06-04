
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Calendar, User, Package, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Order {
  id: string;
  user_id: string;
  products: any[];
  total_price: number;
  status: string;
  created_at: string;
  external_reference?: string;
  mp_payment_id?: string;
  mp_status?: string;
  payer_email?: string;
}

const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast.error('Error al cargar los pedidos');
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order:', error);
        toast.error('Error al actualizar el estado del pedido');
      } else {
        toast.success('Estado del pedido actualizado');
        fetchOrders(); // Refresh the list
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'approved':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
      case 'rejected':
        return 'Cancelado';
      default:
        return status || 'Desconocido';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status?.toLowerCase() === selectedStatus.toLowerCase());

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-6 w-6" />
            Gestión de Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div>Cargando pedidos...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="mr-2 h-6 w-6" />
            Gestión de Pedidos ({filteredOrders.length})
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="completed">Completados</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {selectedStatus === 'all' ? 'No hay pedidos registrados' : `No hay pedidos con estado "${getStatusLabel(selectedStatus)}"`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      #{order.id.slice(0, 8)}
                    </span>
                    {order.external_reference && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        Ref: {order.external_reference}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-lg">
                      {formatPrice(order.total_price)}
                    </span>
                    <Select
                      value={order.status || 'pending'}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                  
                  {order.payer_email && (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {order.payer_email}
                      </span>
                    </div>
                  )}

                  {order.mp_payment_id && (
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        MP: {order.mp_payment_id}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Productos:</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {order.products?.map((product: any, index: number) => (
                      <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                        <div className="font-medium">{product.name || product.title}</div>
                        <div className="text-gray-600">
                          Cantidad: {product.quantity} × {formatPrice(product.price || product.unit_price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderManager;
