import React, { useState, useEffect } from 'react';

interface Observation {
  id: string;
  description: string;
  probableCause: string;
  solution: string;
}

interface Diagnostic {
  id: string;
  date: string;
  vehiclePlate: string;
  observations: Observation[];
  vehicle: {
    id: string;
    plate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    client: {
      id: string;
      firstName: string;
      lastName: string;
      identityDoc: string;
      phone: string;
    };
  };
}

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<Diagnostic | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newDiagnostic, setNewDiagnostic] = useState({
    vehiclePlate: '',
    observations: [{ id: '1', description: '', probableCause: '', solution: '' }]
  });

  const itemsPerPage = 5;

  useEffect(() => {
    // Simular carga de datos
    const mockDiagnostics: Diagnostic[] = [
      {
        id: '1',
        date: '2024-03-15',
        vehiclePlate: 'ABC123',
        observations: [
          {
            id: '1',
            description: 'Ruido en suspensión delantera',
            probableCause: 'Amortiguadores desgastados',
            solution: 'Reemplazo de amortiguadores delanteros'
          }
        ],
        vehicle: {
          id: '1',
          plate: 'ABC123',
          brand: 'Toyota',
          model: 'Corolla',
          year: 2020,
          color: 'Plata',
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
    setDiagnostics(mockDiagnostics);
    setTotalPages(Math.ceil(mockDiagnostics.length / itemsPerPage));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const diagnosticId = Math.random().toString(36).substr(2, 9);
    const mockVehicle = {
      id: '1',
      plate: newDiagnostic.vehiclePlate,
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      color: 'Plata',
      client: {
        id: '1',
        firstName: 'Juan',
        lastName: 'Pérez',
        identityDoc: 'V12345678',
        phone: '0414-1234567'
      }
    };

    const newDiagnosticEntry: Diagnostic = {
      id: diagnosticId,
      date: new Date().toISOString().split('T')[0],
      vehiclePlate: newDiagnostic.vehiclePlate,
      observations: newDiagnostic.observations,
      vehicle: mockVehicle
    };

    setDiagnostics([newDiagnosticEntry, ...diagnostics]);
    setShowAddForm(false);
    setNewDiagnostic({
      vehiclePlate: '',
      observations: [{ id: '1', description: '', probableCause: '', solution: '' }]
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este diagnóstico?')) {
      setDiagnostics(diagnostics.filter(diagnostic => diagnostic.id !== id));
      setSelectedDiagnostic(null);
    }
  };

  const addObservation = () => {
    setNewDiagnostic({
      ...newDiagnostic,
      observations: [
        ...newDiagnostic.observations,
        {
          id: Math.random().toString(36).substr(2, 9),
          description: '',
          probableCause: '',
          solution: ''
        }
      ]
    });
  };

  const updateObservation = (index: number, field: keyof Observation, value: string) => {
    const updatedObservations = [...newDiagnostic.observations];
    updatedObservations[index] = {
      ...updatedObservations[index],
      [field]: value
    };
    setNewDiagnostic({
      ...newDiagnostic,
      observations: updatedObservations
    });
  };

  const removeObservation = (index: number) => {
    if (newDiagnostic.observations.length > 1) {
      const updatedObservations = newDiagnostic.observations.filter((_, i) => i !== index);
      setNewDiagnostic({
        ...newDiagnostic,
        observations: updatedObservations
      });
    }
  };

  const filteredDiagnostics = diagnostics
    .filter(diagnostic =>
      diagnostic.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.vehiclePlate.localeCompare(b.vehiclePlate));

  const paginatedDiagnostics = filteredDiagnostics.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Diagnósticos</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <i className="bi bi-plus-lg me-2"></i>
          Nuevo Diagnóstico
        </button>
      </div>

      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <i className="bi bi-search text-gray-400"></i>
        <input
          type="text"
          placeholder="Buscar por placa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-none focus:ring-0 text-sm"
        />
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nuevo Diagnóstico</h3>
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
                  value={newDiagnostic.vehiclePlate}
                  onChange={(e) => setNewDiagnostic({ ...newDiagnostic, vehiclePlate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium text-gray-700">Observaciones</h4>
                  <button
                    type="button"
                    onClick={addObservation}
                    className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 border border-blue-600 rounded-md"
                  >
                    <i className="bi bi-plus-lg me-1"></i>
                    Agregar Observación
                  </button>
                </div>

                {newDiagnostic.observations.map((observation, index) => (
                  <div key={observation.id} className="bg-gray-50 p-4 rounded-lg relative">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeObservation(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Descripción
                        </label>
                        <textarea
                          required
                          value={observation.description}
                          onChange={(e) => updateObservation(index, 'description', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Causa Probable
                        </label>
                        <textarea
                          required
                          value={observation.probableCause}
                          onChange={(e) => updateObservation(index, 'probableCause', e.target.value)}
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
                          value={observation.solution}
                          onChange={(e) => updateObservation(index, 'solution', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={2}
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
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Placa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedDiagnostics.map((diagnostic) => (
                <tr
                  key={diagnostic.id}
                  onClick={() => setSelectedDiagnostic(diagnostic)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {diagnostic.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {diagnostic.vehiclePlate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {diagnostic.vehicle.brand} {diagnostic.vehicle.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {diagnostic.vehicle.client.firstName} {diagnostic.vehicle.client.lastName}
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

      {selectedDiagnostic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedDiagnostic(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Diagnóstico - {selectedDiagnostic.date}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Información del Vehículo</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Placa:</span> {selectedDiagnostic.vehicle.plate}</p>
                    <p><span className="font-medium">Marca:</span> {selectedDiagnostic.vehicle.brand}</p>
                    <p><span className="font-medium">Modelo:</span> {selectedDiagnostic.vehicle.model}</p>
                    <p><span className="font-medium">Año:</span> {selectedDiagnostic.vehicle.year}</p>
                    <p><span className="font-medium">Color:</span> {selectedDiagnostic.vehicle.color}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Información del Cliente</h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Nombre:</span>{' '}
                      {selectedDiagnostic.vehicle.client.firstName} {selectedDiagnostic.vehicle.client.lastName}
                    </p>
                    <p>
                      <span className="font-medium">Cédula/RIF:</span>{' '}
                      {selectedDiagnostic.vehicle.client.identityDoc}
                    </p>
                    <p>
                      <span className="font-medium">Teléfono:</span>{' '}
                      {selectedDiagnostic.vehicle.client.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Observaciones</h4>
                {selectedDiagnostic.observations.map((observation, index) => (
                  <div key={observation.id} className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Descripción</p>
                      <p className="mt-1">{observation.description}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Causa Probable</p>
                      <p className="mt-1">{observation.probableCause}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Solución</p>
                      <p className="mt-1">{observation.solution}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <div className="space-x-3">
                  <button
                    onClick={() => {
                      // Implement PDF export
                      window.alert('Exportando diagnóstico a PDF...');
                    }}
                    className="px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 border border-green-600 rounded-md"
                  >
                    <i className="bi bi-file-pdf me-2"></i>
                    Exportar PDF
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
                    onClick={() => handleDelete(selectedDiagnostic.id)}
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