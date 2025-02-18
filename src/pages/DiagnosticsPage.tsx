import React, { useState, useEffect } from "react";
import useGetDiagnostic from "../hooks/diagnostics/useGetDiagnostics.hook";
import usePrintDiagnostic from "../hooks/diagnostics/usePrintDiagnostic.hook";
import { showAlert, showConfirmDialog } from "../utils/alerts";
import { ClipLoader } from "react-spinners";
import useDeleteDiagnostic from "../hooks/diagnostics/useDeleteDiagnostic.hook";
import useCreateDiagnosticForm from "../hooks/diagnostics/useCreateDiagnostic.hook";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiagnostic, setSelectedDiagnostic] = useState(null);

  const {
    newDiagnostic,
    setNewDiagnostic,
    handleSubmitCreate,
    handleChangeCreate,
    errorCreate,
    isLoadingCreate,
    successCreate,

    addNewObservation,
    updateObservation,
    deleteObservation,
  } = useCreateDiagnosticForm();

  let debounceTimeout;

  const {
    diagnosticSearch,
    isLoadingDiagnostic,
    errorDiagnostic,
    resetPag,
    pagOffSet,
    next,
    prev,
    LIMIT,
    page,
    hasMore,
    refresh,
  } = useGetDiagnostic(searchTerm);

  const {
    deleteDiagnostic,
    isLoadingDelete,
    errorDelete,
    successDelete,
    handleDeleteDiagnostic,
  } = useDeleteDiagnostic();

  const { printDiagnostic } = usePrintDiagnostic();

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      console.log("Buscando con el término:", value);
    }, 4000);
    resetPag();
  };

  const handleDelete = async (diagnostic) => {
    const confirmed = await showConfirmDialog(
      "¿Estás seguro de que deseas eliminar este diagnóstico? Esta acción no se puede deshacer"
    );
    if (confirmed) {
      await handleDeleteDiagnostic(diagnostic.id);
      setSelectedDiagnostic(null);
      showAlert("Diagnóstico eliminado exitosamente 🗑", "success");
    }
  };

  const handlePrint = (diagnostic) => {
    printDiagnostic(diagnostic);
  };


  useEffect(() => {
    if (successCreate) {
      setShowAddForm(false);
      setSearchTerm("");
      resetPag();
      refresh();
    }
  }, [successCreate]);

  useEffect(() => {
    if (successDelete) {
      setSelectedDiagnostic(null);
      setSearchTerm("");
      resetPag();
      refresh();
    }
  }, [successDelete]);

  useEffect(() => {
    if (searchTerm === "") {
      resetPag();
    }
  }, [searchTerm]);

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
          onChange={handleSearchInput}
          className="flex-1 border-none focus:ring-0 text-sm outline-none "
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
            <form onSubmit={handleSubmitCreate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Placa del Vehículo
                </label>
                <input
                  type="text"
                  name="placa_vehiculo"
                  required
                  value={newDiagnostic.placa_vehiculo}
                  onChange={handleChangeCreate}
                  className="mt-1 block w-80 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-center uppercase">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-center uppercase">
                        Causa Probable
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-center uppercase">
                        Solución
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-center uppercase"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {newDiagnostic.observaciones.map((observation, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={observation.observacion}
                            onChange={(e) =>
                              updateObservation(
                                index,
                                "observacion",
                                e.target.value
                              )
                            }
                            placeholder="Descripción"
                            className="w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 text-center outline-none "
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={observation.causa_prob}
                            onChange={(e) =>
                              updateObservation(
                                index,
                                "causa_prob",
                                e.target.value
                              )
                            }
                            placeholder="Causa Probable"
                            className="w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 text-center outline-none "
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={observation.solucion}
                            onChange={(e) =>
                              updateObservation(
                                index,
                                "solucion",
                                e.target.value
                              )
                            }
                            placeholder="Solución"
                            className="w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 text-center outline-none "
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          {newDiagnostic.observaciones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => deleteObservation(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <i className="bi bi-trash"></i> Eliminar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={addNewObservation}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 border border-blue-600 rounded-md"
                >
                  <i className="bi bi-plus-lg me-2"></i>
                  Agregar Observación
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
                  {isLoadingCreate ? "Guardando..." : "Guardar Diagnóstico"}
                </button>
              </div>
            </form>
            {errorCreate && showAlert(`${errorCreate}`, "error")}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                  Nº
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                  Placa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                  Observaciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                  Cliente
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {diagnosticSearch.length === 0 && !isLoadingDiagnostic && (
                <tr className="text-center">
                  <td colSpan={8} className="px-6 py-4 text-sm text-gray-500">
                    <div className="py-4 px-6 text-lg font-medium text-gray-500">
                      No se encontraron diagnósticos
                    </div>
                  </td>
                </tr>
              )}

              {isLoadingDiagnostic && (
                <tr>
                  <td colSpan={8} className="px-6 text-center py-4">
                    <ClipLoader
                      color="#3498db"
                      loading={isLoadingDiagnostic}
                      size={50}
                    />
                  </td>
                </tr>
              )}
              {diagnosticSearch.map((diagnostic) => (
                <tr
                  key={diagnostic.id}
                  onClick={() => setSelectedDiagnostic(diagnostic)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500  text-center">
                    {diagnostic.num_diagnostico}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500  text-center">
                    {new Date(diagnostic.created_at).toLocaleDateString(
                      "es-ES"
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900  text-center">
                    {diagnostic.vehiculo.placa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500  text-center">
                    {diagnostic.vehiculo.marca} {diagnostic.vehiculo.modelo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center  text-center">
                    {diagnostic.revisiones.length}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500  text-center">
                    {diagnostic.vehiculo.cliente.datos.nombres}{" "}
                    {diagnostic.vehiculo.cliente.datos.apellidos}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center items-center gap-4">
        {page >= LIMIT && pagOffSet > 1 && (
          <button
            onClick={prev}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <i className="bi bi-chevron-left w-5 h-5"></i>
            Previous
          </button>
        )}
        {diagnosticSearch.length === LIMIT && hasMore === true && (
          <button
            onClick={next}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Next
            <i className="bi bi-chevron-right w-5 h-5"></i>
          </button>
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
                Diagnóstico N° {selectedDiagnostic.num_diagnostico}
              </h3>
              <span>
                {new Date(selectedDiagnostic.created_at).toLocaleDateString(
                  "es-ES"
                )}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Información del Vehículo
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Placa:</span>{" "}
                      {selectedDiagnostic.vehiculo.placa}
                    </p>
                    <p>
                      <span className="font-medium">Marca:</span>{" "}
                      {selectedDiagnostic.vehiculo.marca}
                    </p>
                    <p>
                      <span className="font-medium">Modelo:</span>{" "}
                      {selectedDiagnostic.vehiculo.modelo}
                    </p>
                    <p>
                      <span className="font-medium">Año:</span>{" "}
                      {selectedDiagnostic.vehiculo.año}
                    </p>
                    <p>
                      <span className="font-medium">Color:</span>{" "}
                      {selectedDiagnostic.vehiculo.color}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Información del Cliente
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Nombre:</span>{" "}
                      {selectedDiagnostic.vehiculo.cliente.datos.nombres}{" "}
                      {selectedDiagnostic.vehiculo.cliente.datos.apellidos}
                    </p>
                    <p>
                      <span className="font-medium">Cédula/RIF:</span>{" "}
                      {
                        selectedDiagnostic.vehiculo.cliente.datos
                          .cedula_id_detalles
                      }
                    </p>
                    <p>
                      <span className="font-medium">Teléfono:</span>{" "}
                      {selectedDiagnostic.vehiculo.cliente.datos.telefono}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Observaciones
                </h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-center uppercase">
                          Descripción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-center uppercase">
                          Causa Probable
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-center uppercase">
                          Solución
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-center">
                      {selectedDiagnostic.revisiones.map(
                        (observation, index) => (
                          <tr key={observation.id}>
                            <td className="px-6 py-4">
                              {observation.observacion}
                            </td>
                            <td className="px-6 py-4">
                              {observation.causa_prob}
                            </td>
                            <td className="px-6 py-4">
                              {observation.solucion}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <div className="space-x-3">
                  <button
                    onClick={() => {
                      handlePrint(selectedDiagnostic);
                    }}
                    className="px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 border border-green-600 rounded-md"
                  >
                    <i className="bi bi-file-pdf me-2"></i>
                    Exportar PDF
                  </button>
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => handleDelete(selectedDiagnostic)}
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
