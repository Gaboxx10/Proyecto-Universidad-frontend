import React, { useState, useEffect } from 'react';
import { showConfirmDialog, showAlert } from '../utils/alerts';

interface Supplier {
  id: string;
  name: string;
  rif?: string;
  phone: string;
  address: string;
  notes?: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    rif: '',
    phone: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    // Simular carga de datos
    const mockSuppliers: Supplier[] = [
      {
        id: '1',
        name: 'Repuestos Originales C.A.',
        rif: 'J-12345678-9',
        phone: '0212-1234567',
        address: 'Calle Principal, Local 123',
        notes: 'Distribuidor oficial de repuestos Toyota'
      }
    ];
    setSuppliers(mockSuppliers);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedSupplier) {
      setSuppliers(suppliers.map(supplier => 
        supplier.id === selectedSupplier.id 
          ? { ...selectedSupplier, ...newSupplier }
          : supplier
      ));
      showAlert('Proveedor actualizado exitosamente', 'success');
    } else {
      const supplierId = Math.random().toString(36).substr(2, 9);
      setSuppliers([...suppliers, { id: supplierId, ...newSupplier }]);
      showAlert('Proveedor registrado exitosamente', 'success');
    }
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedSupplier(null);
    setNewSupplier({
      name: '',
      rif: '',
      phone: '',
      address: '',
      notes: ''
    });
  };

  const handleEdit = (supplier: Supplier) => {
    setNewSupplier({
      name: supplier.name,
      rif: supplier.rif || '',
      phone: supplier.phone,
      address: supplier.address,
      notes: supplier.notes || ''
    });
    setSelectedSupplier(supplier);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirmDialog(
      '¿Está seguro que desea eliminar este proveedor? Esta acción no se puede deshacer.'
    );
    if (confirmed) {
      setSuppliers(suppliers.filter(supplier => supplier.id !== id));
      setSelectedSupplier(null);
      showAlert('Proveedor eliminado exitosamente', 'success');
    }
  };

  const filteredSuppliers = suppliers
    .filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.rif?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Proveedores</h2>
        <button
          onClick={() => {
            setIsEditing(false);
            setNewSupplier({
              name: '',
              rif: '',
              phone: '',
              address: '',
              notes: ''
            });
            setShowAddForm(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <i className="bi bi-plus-lg me-2"></i>
          Nuevo Proveedor
        </button>
      </div>

      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <i className="bi bi-search text-gray-400"></i>
        <input
          type="text"
          placeholder="Buscar por nombre o RIF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-none focus:ring-0 text-sm"
        />
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {isEditing ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setIsEditing(false);
                  setNewSupplier({
                    name: '',
                    rif: '',
                    phone: '',
                    address: '',
                    notes: ''
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  RIF (Opcional)
                </label>
                <input
                  type="text"
                  value={newSupplier.rif}
                  onChange={(e) => setNewSupplier({ ...newSupplier, rif: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  required
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <textarea
                  required
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notas (Opcional)
                </label>
                <textarea
                  value={newSupplier.notes}
                  onChange={(e) => setNewSupplier({ ...newSupplier, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setIsEditing(false);
                    setNewSupplier({
                      name: '',
                      rif: '',
                      phone: '',
                      address: '',
                      notes: ''
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  {isEditing ? 'Guardar Cambios' : 'Guardar'}
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
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RIF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  onClick={() => setSelectedSupplier(supplier)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {supplier.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {supplier.rif || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {supplier.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {supplier.address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <button
              onClick={() => setSelectedSupplier(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <i className="bi bi-x-lg"></i>
            </button>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Detalles del Proveedor
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre</p>
                  <p className="mt-1">{selectedSupplier.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">RIF</p>
                  <p className="mt-1">{selectedSupplier.rif || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Teléfono</p>
                  <p className="mt-1">{selectedSupplier.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Dirección</p>
                  <p className="mt-1">{selectedSupplier.address}</p>
                </div>
                {selectedSupplier.notes && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Notas</p>
                    <p className="mt-1">{selectedSupplier.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleEdit(selectedSupplier)}
                className="px-4 py-2 text-sm font-medium text-yellow-600 hover:bg-yellow-50 border border-yellow-600 rounded-md"
              >
                <i className="bi bi-pencil me-2"></i>
                Editar
              </button>
              <button
                onClick={() => handleDelete(selectedSupplier.id)}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-600 rounded-md"
              >
                <i className="bi bi-trash me-2"></i>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}