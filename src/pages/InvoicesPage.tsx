import React, { useState, useEffect } from 'react';
import { showConfirmDialog, showAlert } from '../utils/alerts';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  entryDate: string;
  exitDate: string;
  dueDate: string;
  status: 'pending' | 'paid';
  vehiclePlate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
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

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [newInvoice, setNewInvoice] = useState({
    vehiclePlate: '',
    entryDate: new Date().toISOString().split('T')[0],
    exitDate: new Date().toISOString().split('T')[0],
    items: [] as InvoiceItem[]
  });

  useEffect(() => {
    // Simular carga de datos
    const mockInvoices: Invoice[] = [
      {
        id: '1',
        number: 'F-001',
        date: '2024-03-15',
        entryDate: '2024-03-15',
        exitDate: '2024-03-15',
        dueDate: '2024-04-15',
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
        subtotal: 50.00,
        tax: 8.00,
        total: 58.00,
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
    setInvoices(mockInvoices);
  }, []);

  const addNewItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 0,
      unitPrice: 0,
      total: 0
    };
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, newItem]
    });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = newInvoice.items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
        }
        return updatedItem;
      }
      return item;
    });
    setNewInvoice({
      ...newInvoice,
      items: updatedItems
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invoiceId = Math.random().toString(36).substr(2, 9);
    const invoiceNumber = `F-${String(invoices.length + 1).padStart(3, '0')}`;
    
    const subtotal = newInvoice.items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.16; // 16% IVA
    const total = subtotal + tax;

    // Simular búsqueda de vehículo
    const mockVehicle = {
      id: '1',
      plate: newInvoice.vehiclePlate,
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

    const newInvoiceEntry: Invoice = {
      id: invoiceId,
      number: invoiceNumber,
      date: new Date().toISOString().split('T')[0],
      entryDate: newInvoice.entryDate,
      exitDate: newInvoice.exitDate,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      vehiclePlate: newInvoice.vehiclePlate,
      items: newInvoice.items,
      subtotal,
      tax,
      total,
      vehicle: mockVehicle
    };

    setInvoices([newInvoiceEntry, ...invoices]);
    setShowAddForm(false);
    setNewInvoice({
      vehiclePlate: '',
      entryDate: new Date().toISOString().split('T')[0],
      exitDate: new Date().toISOString().split('T')[0],
      items: []
    });
    showAlert('Factura creada exitosamente', 'success');
  };

  const handlePaymentToggle = async (invoice: Invoice) => {
    if (invoice.status === 'paid') {
      showAlert('Esta factura ya está marcada como pagada y no se puede modificar', 'warning');
      return;
    }

    const confirmed = await showConfirmDialog(
      '¿Está seguro que desea marcar esta factura como pagada? Esta acción no se puede deshacer.'
    );
    
    if (confirmed) {
      setInvoices(invoices.map(inv => 
        inv.id === invoice.id 
          ? { ...inv, status: 'paid' as const }
          : inv
      ));
      showAlert('Factura marcada como pagada exitosamente', 'success');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirmDialog(
      '¿Está seguro que desea eliminar esta factura? Esta acción no se puede deshacer.'
    );
    if (confirmed) {
      setInvoices(invoices.filter(invoice => invoice.id !== id));
      setSelectedInvoice(null);
      showAlert('Factura eliminada exitosamente', 'success');
    }
  };

  const getStatusColor = (status: Invoice['status']) => {
    return status === 'paid' 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getStatusLabel = (status: Invoice['status']) => {
    return status === 'paid' ? 'Pagada' : 'Pendiente';
  };

  const filteredInvoices = invoices
    .filter(invoice =>
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Facturas</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <i className="bi bi-plus-lg me-2"></i>
          Nueva Factura
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
              <h3 className="text-lg font-semibold">Nueva Factura</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Placa del Vehículo
                  </label>
                  <input
                    type="text"
                    required
                    value={newInvoice.vehiclePlate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, vehiclePlate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha de Entrada
                  </label>
                  <input
                    type="date"
                    required
                    value={newInvoice.entryDate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, entryDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha de Salida
                  </label>
                  <input
                    type="date"
                    required
                    value={newInvoice.exitDate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, exitDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
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
                    {newInvoice.items.map((item) => (
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
                  </tbody>
                </table>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-end space-y-2">
                  <table className="text-right">
                    <tbody>
                      <tr>
                        <td className="px-4 py-2 font-medium">Subtotal:</td>
                        <td className="px-4 py-2">
                          ${newInvoice.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium">IVA (16%):</td>
                        <td className="px-4 py-2">
                          ${(newInvoice.items.reduce((sum, item) => sum + item.total, 0) * 0.16).toFixed(2)}
                        </td>
                      </tr>
                      <tr className="font-bold">
                        <td className="px-4 py-2">Total a Pagar:</td>
                        <td className="px-4 py-2">
                          ${(newInvoice.items.reduce((sum, item) => sum + item.total, 0) * 1.16).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  onClick={() => setSelectedInvoice(invoice)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.vehiclePlate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.vehicle.client.firstName} {invoice.vehicle.client.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {getStatusLabel(invoice.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${invoice.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <i className="bi bi-x-lg"></i>
            </button>
            
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Factura #{selectedInvoice.number}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Fecha: {selectedInvoice.date}
                  </p>
                  <p className="text-sm text-gray-500">
                    Entrada: {selectedInvoice.entryDate}
                  </p>
                  <p className="text-sm text-gray-500">
                    Salida: {selectedInvoice.exitDate}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={selectedInvoice.status === 'paid'}
                      onChange={() => handlePaymentToggle(selectedInvoice)}
                      disabled={selectedInvoice.status === 'paid'}
                    />
                    <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                      selectedInvoice.status === 'paid'
                        ? 'bg-green-600'
                        : 'bg-red-600'
                    }`}></div>
                  </label>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedInvoice.status)}`}>
                    {getStatusLabel(selectedInvoice.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Información del Vehículo</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Placa:</span> {selectedInvoice.vehicle.plate}</p>
                    <p><span className="font-medium">Marca:</span> {selectedInvoice.vehicle.brand}</p>
                    <p><span className="font-medium">Modelo:</span> {selectedInvoice.vehicle.model}</p>
                    <p><span className="font-medium">Año:</span> {selectedInvoice.vehicle.year}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Información del Cliente</h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Nombre:</span>{' '}
                      {selectedInvoice.vehicle.client.firstName} {selectedInvoice.vehicle.client.lastName}
                    </p>
                    <p>
                      <span className="font-medium">Cédula/RIF:</span>{' '}
                      {selectedInvoice.vehicle.client.identityDoc}
                    </p>
                    <p>
                      <span className="font-medium">Teléfono:</span>{' '}
                      {selectedInvoice.vehicle.client.phone}
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
                    {selectedInvoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">{item.description}</td>
                        <td className="px-6 py-4">{item.quantity}</td>
                        <td className="px-6 py-4">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right font-medium">
                        Subtotal:
                      </td>
                      <td className="px-6 py-4 text-right">
                        ${selectedInvoice.subtotal.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right font-medium">
                        IVA (16%):
                      </td>
                      <td className="px-6 py-4 text-right">
                        ${selectedInvoice.tax.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right font-bold">
                        Total a Pagar:
                      </td>
                      <td className="px-6 py-4 text-right font-bold">
                        ${selectedInvoice.total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
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
                    onClick={() => handlePaymentToggle(selectedInvoice)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 border border-blue-600 rounded-md"
                    disabled={selectedInvoice.status === 'paid'}
                  >
                    <i className="bi bi-check-lg me-2"></i>
                    Marcar como Pagada
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
                    onClick={() => handleDelete(selectedInvoice.id)}
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