import React, { useState, useEffect } from 'react';
import { showConfirmDialog, showAlert } from '../utils/alerts';

interface OrderItem {
  id: string;
  description: string;
  observation: string;
  solution: string;
  quantity: number;
}

interface WorkOrder {
  id: string;
  number: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  vehiclePlate: string;
  items: OrderItem[];
  vehicle: {
    id: string;
    plate: string;
    brand: string;
    model: string;
    year: number;
    client: {
      id: string;
      firstName: string;
      lastName: string;
      identityDoc: string;
      phone: string;
    };
  };
  totalItems: number;
}

export default function WorkOrdersPage() {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newOrder, setNewOrder] = useState({
    vehiclePlate: '',
    items: [
      {
        id: '1',
        description: '',
        observation: '',
        solution: '',
        quantity: 1
      }
    ]
  });

  const itemsPerPage = 10;

  useEffect(() => {
    // Simular carga de datos
    const mockOrders: WorkOrder[] = [
      {
        id: '1',
        number: 'OT-001',
        date: '2024-03-15',
        status: 'in_progress',
        vehiclePlate: 'ABC123',
        items: [
          {
            id: '1',
            description: 'Cambio de aceite',
            observation: 'Aceite muy oscuro',
            solution: 'Cambio de aceite y filtro',
            quantity: 1
          }
        ],
        vehicle: {
          id: '1',
          plate: 'ABC123',
          brand: 'Toyota',
          model: 'Corolla',
          year: 2020,
          client: {
            id: '1',
            firstName: 'Juan',
            lastName: 'Pérez',
            identityDoc: 'V12345678',
            phone: '0414-1234567'
          }
        },
        totalItems: 1
      }
    ];
    setOrders(mockOrders);
    setTotalPages(Math.ceil(mockOrders.length / itemsPerPage));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = Math.random().toString(36).substr(2, 9);
    const orderNumber = `OT-${String(orders.length + 1).padStart(3, '0')}`;
    
    // Simular búsqueda de vehículo
    const mockVehicle = {
      id: '1',
      plate: newOrder.vehiclePlate,
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      client: {
        id: '1',
        firstName: 'Juan',
        lastName: 'Pérez',
        identityDoc: 'V12345678',
        phone: '0414-1234567'
      }
    };

    const newWorkOrder: WorkOrder = {
      id: orderId,
      number: orderNumber,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      vehiclePlate: newOrder.vehiclePlate,
      items: newOrder.items,
      vehicle: mockVehicle,
      totalItems: newOrder.items.length
    };

    setOrders([newWorkOrder, ...orders]);
    setShowAddForm(false);
    setNewOrder({
      vehiclePlate: '',
      items: [
        {
          id: '1',
          description: '',
          observation: '',
          solution: '',
          quantity: 1
        }
      ]
    });
    showAlert('Orden de trabajo creada exitosamente', 'success');
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirmDialog(
      '¿Está seguro que desea eliminar esta orden de trabajo? Esta acción no se puede deshacer.'
    );
    if (confirmed) {
      setOrders(orders.filter(order => order.id !== id));
      setSelectedOrder(null);
      showAlert('Orden de trabajo eliminada exitosamente', 'success');
    }
  };

  const addItem = () => {
    setNewOrder({
      ...newOrder,
      items: [
        ...newOrder.items,
        {
          id: Math.random().toString(36).substr(2, 9),
          description: '',
          observation: '',
          solution: '',
          quantity: 1
        }
      ]
    });
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setNewOrder({
      ...newOrder,
      items: updatedItems
    });
  };

  const removeItem = (index: number) => {
    if (newOrder.items.length > 1) {
      const updatedItems = newOrder.items.filter((_, i) => i !== index);
      setNewOrder({
        ...newOrder,
        items: updatedItems
      });
    }
  };

  const getStatusLabel = (status: WorkOrder['status']) => {
    const statusMap = {
      pending: 'Pendiente',
      in_progress: 'En Proceso',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };
    return statusMap[status];
  };

  const getStatusColor = (status: WorkOrder['status']) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colorMap[status];
  };

  const filteredOrders = orders
    .filter(order =>
      order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Órdenes de Trabajo</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <i className="bi bi-plus-lg me-2"></i>
          Nueva Orden
        </button>
      </div>

      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <i className="bi bi-search text-gray-400"></i>
        <input
          type="text"
          placeholder="Buscar por número o placa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-none focus:ring-0 text-sm"
        />
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nueva Orden de Trabajo</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Placa del Vehículo
                </label>
                <input
                  type="text"
                  required
                  value={newOrder.vehiclePlate}
                  onChange={(e) => setNewOrder({ ...newOrder, vehiclePlate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium text-gray-700">Items de Trabajo</h4>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 border border-blue-600 rounded-md"
                  >
                    <i className="bi bi-plus-lg me-1"></i>
                    Agregar Item
                  </button>
                </div>

                {newOrder.items.map((item, index) => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg relative">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Descripción
                        </label>
                        <textarea
                          required
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Observación
                        </label>
                        <textarea
                          required
                          value={item.observation}
                          onChange={(e) => updateItem(index, 'observation', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Solución
                        </label>
                        <textarea
                          required
                          value={item.solution}
                          onChange={(e) => updateItem(index, 'solution', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Placa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.vehiclePlate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.vehicle.client.firstName} {order.vehicle.client.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.totalItems}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-3 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              <i className="bi bi-chevron-left me-1"></i>
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              Siguiente
              <i className="bi bi-chevron-right ms-1"></i>
            </button>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <i className="bi bi-x-lg"></i>
            </button>
            
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Orden de Trabajo #{selectedOrder.number}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Fecha: {selectedOrder.date}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Información del Vehículo</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Placa:</span> {selectedOrder.vehicle.plate}</p>
                    <p><span className="font-medium">Marca:</span> {selectedOrder.vehicle.brand}</p>
                    <p><span className="font-medium">Modelo:</span> {selectedOrder.vehicle.model}</p>
                    <p><span className="font-medium">Año:</span> {selectedOrder.vehicle.year}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Información del Cliente</h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Nombre:</span>{' '}
                      {selectedOrder.vehicle.client.firstName} {selectedOrder.vehicle.client.lastName}
                    </p>
                    <p>
                      <span className="font-medium">Cédula/RIF:</span>{' '}
                      {selectedOrder.vehicle.client.identityDoc}
                    </p>
                    <p>
                      <span className="font-medium">Teléfono:</span>{' '}
                      {selectedOrder.vehicle.client.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Items de Trabajo</h4>
                {selectedOrder.items.map((item, index) => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Descripción</p>
                            <p className="mt-1">{item.description}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Observación</p>
                            <p className="mt-1">{item.observation}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Solución</p>
                            <p className="mt-1">{item.solution}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Cantidad</p>
                            <p className="mt-1">{item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <div className="space-x-3">
                  <button
                    onClick={() => {/* Implementar exportación a PDF */}}
                    className="px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 border border-green-600 rounded-md"
                  >
                    <i className="bi bi-file-pdf me-2"></i>
                    Exportar PDF
                  </button>
                  <button
                    onClick={() => {/* Implementar generación de factura */}}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 border border-blue-600 rounded-md"
                  >
                    <i className="bi bi-receipt me-2"></i>
                    Generar Factura
                  </button>
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => {/* Implementar edición */}}
                    className="px-4 py-2 text-sm font-medium text-yellow-600 hover:bg-yellow-50 border border-yellow-600 rounded-md"
                  >
                    <i className="bi bi-pencil me-2"></i>
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(selectedOrder.id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-600 rounded-md"
                  >
                    <i className="bi bi-trash me-2"></i>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}