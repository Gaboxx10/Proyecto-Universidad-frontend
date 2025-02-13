import React, { useState, useEffect } from 'react';

interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  color: string;
  transmission: 'manual' | 'automatic';
  type: 'sedan' | 'hatchback' | 'suv' | 'pickup' | 'van' | 'coupe' | 'wagon';
  clientId: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    identityDoc: string;
    phone: string;
  };
  notes?: string;
  image?: string;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [newVehicle, setNewVehicle] = useState({
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    color: '',
    transmission: 'manual',
    type: 'sedan',
    clientId: '',
    notes: '',
    image: ''
  });
  const [clientIdentityDoc, setClientIdentityDoc] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Simular carga de datos
    const mockVehicles: Vehicle[] = [
      {
        id: '1',
        plate: 'ABC123',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        mileage: 45000,
        color: 'Plata',
        transmission: 'automatic',
        type: 'sedan',
        clientId: '1',
        client: {
          id: '1',
          firstName: 'Juan',
          lastName: 'Pérez',
          identityDoc: 'V12345678',
          phone: '0414-1234567'
        },
        notes: 'Mantenimiento regular al día'
      }
    ];
    setVehicles(mockVehicles);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicleId = Math.random().toString(36).substr(2, 9);
    // Simulando la asociación con un cliente
    const mockClient = {
      id: '1',
      firstName: 'Juan',
      lastName: 'Pérez',
      identityDoc: clientIdentityDoc,
      phone: '0414-1234567'
    };

    setVehicles([...vehicles, {
      ...newVehicle,
      id: vehicleId,
      client: mockClient
    } as Vehicle]);
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setNewVehicle({
      plate: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: 0,
      color: '',
      transmission: 'manual',
      type: 'sedan',
      clientId: '',
      notes: '',
      image: ''
    });
    setClientIdentityDoc('');
    setError('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este vehículo? Esta acción eliminará también todos los registros asociados y no se puede deshacer.')) {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
      setSelectedVehicle(null);
    }
  };

  const filteredVehicles = vehicles
    .filter(vehicle =>
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.plate.localeCompare(b.plate));

  const getVehicleTypeLabel = (type: string) => {
    const types = {
      sedan: 'Sedán',
      hatchback: 'Hatchback',
      suv: 'SUV',
      pickup: 'Pickup',
      van: 'Van/Minivan',
      coupe: 'Coupé',
      wagon: 'Wagon'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Vehículos</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <i className="bi bi-plus-lg me-2"></i>
          Nuevo Vehículo
        </button>
      </div>

      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <i className="bi bi-search text-gray-400"></i>
        <input
          type="text"
          placeholder="Buscar por placa, marca o modelo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-none focus:ring-0 text-sm"
        />
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Registrar Nuevo Vehículo</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500">
                  {newVehicle.image ? (
                    <img src={newVehicle.image} alt="Vehículo" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <>
                      <i className="bi bi-camera text-4xl text-gray-400"></i>
                      <span className="mt-2 text-sm text-gray-500">Subir Foto del Vehículo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewVehicle({ ...newVehicle, image: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cédula/RIF del Cliente
                  </label>
                  <input
                    type="text"
                    required
                    value={clientIdentityDoc}
                    onChange={(e) => setClientIdentityDoc(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Placa</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.plate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Marca</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.brand}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Modelo</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Año</label>
                  <input
                    type="number"
                    required
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Kilometraje</label>
                  <input
                    type="number"
                    required
                    value={newVehicle.mileage}
                    onChange={(e) => setNewVehicle({ ...newVehicle, mileage: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Color</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.color}
                    onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo de Carrocería</label>
                  <select
                    value={newVehicle.type}
                    onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value as Vehicle['type'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="sedan">Sedán</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="suv">SUV</option>
                    <option value="pickup">Pickup</option>
                    <option value="van">Van/Minivan</option>
                    <option value="coupe">Coupé</option>
                    <option value="wagon">Wagon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Transmisión</label>
                  <select
                    value={newVehicle.transmission}
                    onChange={(e) => setNewVehicle({ ...newVehicle, transmission: e.target.value as 'manual' | 'automatic' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="manual">Manual</option>
                    <option value="automatic">Automática</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notas Adicionales</label>
                <textarea
                  value={newVehicle.notes}
                  onChange={(e) => setNewVehicle({ ...newVehicle, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kilometraje</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.plate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.mileage.toLocaleString()} km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedVehicle(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <i className="bi bi-x-lg"></i>
            </button>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Detalles del Vehículo
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg flex items-center justify-center h-48">
                    <i className="bi bi-car-front text-6xl text-gray-400"></i>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Cliente Asociado</h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Nombre:</span>{' '}
                        {selectedVehicle.client.firstName} {selectedVehicle.client.lastName}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Cédula/RIF:</span>{' '}
                        {selectedVehicle.client.identityDoc}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Teléfono:</span>{' '}
                        {selectedVehicle.client.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Placa</p>
                    <p className="mt-1">{selectedVehicle.plate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tipo</p>
                    <p className="mt-1">{getVehicleTypeLabel(selectedVehicle.type)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Marca</p>
                    <p className="mt-1">{selectedVehicle.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Modelo</p>
                    <p className="mt-1">{selectedVehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Año</p>
                    <p className="mt-1">{selectedVehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Color</p>
                    <p className="mt-1">{selectedVehicle.color}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Kilometraje</p>
                    <p className="mt-1">{selectedVehicle.mileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Transmisión</p>
                    <p className="mt-1">{selectedVehicle.transmission === 'automatic' ? 'Automática' : 'Manual'}</p>
                  </div>
                </div>
              </div>

              {selectedVehicle.notes && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Notas</p>
                  <p className="mt-1 text-sm text-gray-600">{selectedVehicle.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <div className="space-x-3">
                <button
                  onClick={() => {/* Implementar vista de diagnósticos */}}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 border border-blue-600 rounded-md"
                >
                  <i className="bi bi-wrench me-2"></i>
                  Diagnósticos
                </button>
                <button
                  onClick={() => {/* Implementar vista de presupuestos */}}
                  className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 border border-purple-600 rounded-md"
                >
                  <i className="bi bi-file-text me-2"></i>
                  Presupuestos
                </button>
                <button
                  onClick={() => {/* Implementar vista de órdenes */}}
                  className="px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 border border-green-600 rounded-md"
                >
                  <i className="bi bi-clipboard me-2"></i>
                  Órdenes de Trabajo
                </button>
                <button
                  onClick={() => {/* Implementar vista de facturas */}}
                  className="px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 border border-orange-600 rounded-md"
                >
                  <i className="bi bi-receipt me-2"></i>
                  Facturas
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
                  onClick={() => handleDelete(selectedVehicle.id)}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-600 rounded-md"
                >
                  <i className="bi bi-trash me-2"></i>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}