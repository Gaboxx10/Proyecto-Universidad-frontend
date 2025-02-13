import React, { useState, useEffect } from 'react';
import { showConfirmDialog, showAlert } from '../utils/alerts';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Quote {
  id: string;
  number: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  vehiclePlate: string;
  items: QuoteItem[];
  total: number;
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
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [newQuote, setNewQuote] = useState({
    vehiclePlate: '',
    items: [] as QuoteItem[]
  });

  useEffect(() => {
    // Simular carga de datos
    const mockQuotes: Quote[] = [
      {
        id: '1',
        number: 'P-001',
        date: '2024-03-15',
        status: 'pending',
        vehiclePlate: 'ABC123',
        items: [
          {
            id: '1',
            description: 'Cambio de aceite',
            quantity: 1,
            unitPrice: 50.00,
            total: 50.00
          }
        ],
        total: 50.00,
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
        }
      }
    ];
    setQuotes(mockQuotes);
  }, []);

  const addNewItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 0,
      unitPrice: 0,
      total: 0
    };
    setNewQuote({
      ...newQuote,
      items: [...newQuote.items, newItem]
    });
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    const updatedItems = newQuote.items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
        }
        return updatedItem;
      }
      return item;
    });
    setNewQuote({
      ...newQuote,
      items: updatedItems
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quoteId = Math.random().toString(36).substr(2, 9);
    const quoteNumber = `P-${String(quotes.length + 1).padStart(3, '0')}`;
    
    // Simular búsqueda de vehículo
    const mockVehicle = {
      id: '1',
      plate: newQuote.vehiclePlate,
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

    const total = newQuote.items.reduce((sum, item) => sum + item.total, 0);

    const newQuoteEntry: Quote = {
      id: quoteId,
      number: quoteNumber,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      vehiclePlate: newQuote.vehiclePlate,
      items: newQuote.items,
      total,
      vehicle: mockVehicle
    };

    setQuotes([newQuoteEntry, ...quotes]);
    setShowAddForm(false);
    setNewQuote({
      vehiclePlate: '',
      items: []
    });
    showAlert('Presupuesto creado exitosamente', 'success');
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirmDialog(
      '¿Está seguro que desea eliminar este presupuesto? Esta acción no se puede deshacer.'
    );
    if (confirmed) {
      setQuotes(quotes.filter(quote => quote.id !== id));
      setSelectedQuote(null);
      showAlert('Presupuesto eliminado exitosamente', 'success');
    }
  };

  const getStatusLabel = (status: Quote['status']) => {
    const statusMap = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado'
    };
    return statusMap[status];
  };

  const getStatusColor = (status: Quote['status']) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colorMap[status];
  };

  const filteredQuotes = quotes
    .filter(quote =>
      quote.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Presupuestos</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <i className="bi bi-plus-lg me-2"></i>
          Nuevo Presupuesto
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
              <h3 className="text-lg font-semibold">Nuevo Presupuesto</h3>
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
                  value={newQuote.vehiclePlate}
                  onChange={(e) => setNewQuote({ ...newQuote, vehiclePlate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Precio Unitario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {newQuote.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Descripción"
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={item.quantity || ''}
                            onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                            placeholder="Cantidad"
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={item.unitPrice || ''}
                            onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                            placeholder="Precio unitario"
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          ${item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right font-bold">
                        Total:
                      </td>
                      <td className="px-6 py-4 text-right font-bold">
                        ${newQuote.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={addNewItem}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 border border-blue-600 rounded-md"
                >
                  <i className="bi bi-plus-lg me-2"></i>
                  Agregar Item
                </button>
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
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotes.map((quote) => (
                <tr
                  key={quote.id}
                  onClick={() => setSelectedQuote(quote)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {quote.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quote.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quote.vehiclePlate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quote.vehicle.client.firstName} {quote.vehicle.client.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                      {getStatusLabel(quote.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${quote.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedQuote(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <i className="bi bi-x-lg"></i>
            </button>
            
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Presupuesto #{selectedQuote.number}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Fecha: {selectedQuote.date}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedQuote.status)}`}>
                  {getStatusLabel(selectedQuote.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Información del Vehículo</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Placa:</span> {selectedQuote.vehicle.plate}</p>
                    <p><span className="font-medium">Marca:</span> {selectedQuote.vehicle.brand}</p>
                    <p><span className="font-medium">Modelo:</span> {selectedQuote.vehicle.model}</p>
                    <p><span className="font-medium">Año:</span> {selectedQuote.vehicle.year}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Información del Cliente</h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Nombre:</span>{' '}
                      {selectedQuote.vehicle.client.firstName} {selectedQuote.vehicle.client.lastName}
                    </p>
                    <p>
                      <span className="font-medium">Cédula/RIF:</span>{' '}
                      {selectedQuote.vehicle.client.identityDoc}
                    </p>
                    <p>
                      <span className="font-medium">Teléfono:</span>{' '}
                      {selectedQuote.vehicle.client.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Precio Unitario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedQuote.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">{item.description}</td>
                        <td className="px-6 py-4">{item.quantity}</td>
                        <td className="px-6 py-4">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right font-bold">
                        Total:
                      </td>
                      <td className="px-6 py-4 text-right font-bold">
                        ${selectedQuote.total.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                    onClick={() => {/* Implementar generación de orden */}}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 border border-blue-600 rounded-md"
                  >
                    <i className="bi bi-clipboard me-2"></i>
                    Generar Orden
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
                    onClick={() => handleDelete(selectedQuote.id)}
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