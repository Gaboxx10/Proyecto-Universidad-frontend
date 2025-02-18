import React, { useState, useEffect } from "react";
import useGetVehicle from "../hooks/vehicles/useGetVehicles.hook";
import ClipLoader from "react-spinners/ClipLoader";
import useCreateVehicleForm from "../hooks/vehicles/useSaveNewVehicle.hook";
import { showAlert, showConfirmDialog } from "../utils/alerts";
import useUpdateVehicleForm from "../hooks/vehicles/useEditVehicle.hook";
import useDeleteVehicle from "../hooks/vehicles/useDeleteVehicle.hook";
import { useLocation } from "react-router-dom";

const estadoConfig = {
  REGISTRADO: {
    label: "Registrado",
    color: "bg-blue-100 text-blue-800",
  },
  EN_DIAGNOSTICO: {
    label: "En diagnóstico",
    color: "bg-yellow-100 text-yellow-800",
  },
  EN_REPARACION: {
    label: "En reparación",
    color: "bg-orange-100 text-orange-800",
  },
  EN_MANTENIMIENTO: {
    label: "En mantenimiento",
    color: "bg-green-100 text-green-800",
  },
  EN_ESPERA: {
    label: "En espera",
    color: "bg-gray-100 text-gray-800",
  },
  REPARADO: {
    label: "Reparado",
    color: "bg-teal-100 text-teal-800",
  },
  NO_REPARABLE: {
    label: "No reparable",
    color: "bg-red-100 text-red-800",
  },
  ENTREGADO: {
    label: "Entregado",
    color: "bg-indigo-100 text-indigo-800",
  },
};

export default function VehiclesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [vehicleToUpdate, setVehicleToUpdate] = useState(null);

  let debounceTimeout;

  const location = useLocation();
  const state = location.state;

  const {
    newVehicle,
    setNewVehicle,
    handleSubmitCreate,
    handleChangeCreate,
    isLoadingCreate,
    errorCreate,
    successCreate,
  } = useCreateVehicleForm();

  const {
    vehiclesSearch,
    next,
    prev,
    hasMore,
    LIMIT,
    pagOffSet,
    page,
    refresh,
    isLoadingVehicle,
    resetPag,

    errorVehicleSearch,
    setErrorVehicleSearch,
    searchVehicleByCedula,
  } = useGetVehicle(searchTerm);

  const {
    updateVehicle,
    setUpdateVehicle,
    isLoadingUpdate,
    errorUpdate,
    successUpdate,
    handleSubmitUpdate,
    handleChangeUpdate,
  } = useUpdateVehicleForm(vehicleToUpdate ? vehicleToUpdate.id : null);

  const {
    deleteVehicle,
    isLoadingDelete,
    errorDelete,
    successDelete,
    handleDeleteVehicle,
  } = useDeleteVehicle();

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      console.log("Buscando con el término:", value);
    }, 4000);
    resetPag();
  };

  const handleEdit = (vehicle) => {
    setVehicleToUpdate(vehicle);
    setSelectedVehicle(null);
    setUpdateVehicle({
      placa: vehicle.placa,
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      año: vehicle.año,
      kilometraje: vehicle.kilometraje,
      color: vehicle.color,
      tipo: vehicle.tipo,
      cedula_cliente: vehicle.cliente.datos.cedula_identidad,
      estado: vehicle.estado,
    });
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setVehicleToUpdate(null);
    setUpdateVehicle({
      placa: "",
      marca: "",
      modelo: "",
      año: new Date().getFullYear(),
      kilometraje: 0,
      color: "",
      tipo: "sedan",
      cedula_cliente: "",
      estado: "",
    });
  };

  const handleDelete = async (client) => {
    const confirmed = await showConfirmDialog(
      "¿Estás seguro de que deseas eliminar este vehículo? Esta acción eliminará también todos los registros asociados al vehículo y no se puede deshacer"
    );
    if (confirmed) {
      await handleDeleteVehicle(client.id);
      setSelectedVehicle(null);
    }
  };

  useEffect(() => {
    if (state && state.cliente) {
      setSearchTerm(state.cliente);
      searchVehicleByCedula(state.cliente);
      resetPag();
    }
  }, [state]);

  useEffect(() => {
    if (successCreate) {
      setShowAddForm(false);
      setNewVehicle({
        placa: "",
        marca: "",
        modelo: "",
        año: new Date().getFullYear(),
        kilometraje: 0,
        color: "",
        tipo: "sedan",
        cedula_cliente: "",
        estado: "",
      });
      refresh();
    }
  }, [successCreate, setNewVehicle]);

  useEffect(() => {
    if (successUpdate) {
      handleCloseEditForm();
      refresh();
    }
  }, [successUpdate, setUpdateVehicle]);


  useEffect(() => {
    if (successDelete) {
      setSelectedVehicle(null);
      showAlert("Vehículo eliminado exitosamente 🗑", "success");
      resetPag();
      refresh();
    }
  }, [successDelete]);

  useEffect(() => {
    if (searchTerm === "") {
      setErrorVehicleSearch(null);
      resetPag();
    }
  }, [searchTerm]);

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
          placeholder="Buscar por placa, marca, o cédula de cliente..."
          value={searchTerm}
          onChange={handleSearchInput}
          className="flex-1 border-none focus:ring-0 outline-none text-sm"
        />
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Registrar Nuevo Vehículo
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewVehicle({
                    placa: "",
                    marca: "",
                    modelo: "",
                    año: new Date().getFullYear(),
                    kilometraje: 0,
                    color: "",
                    tipo: "sedan",
                    cedula_cliente: "",
                    estado: "",
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cédula/RIF del Cliente
                  </label>
                  <input
                    type="text"
                    name="cedula_cliente"
                    required
                    value={newVehicle.cedula_cliente}
                    onChange={handleChangeCreate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Placa
                  </label>
                  <input
                    type="text"
                    name="placa"
                    required
                    value={newVehicle.placa}
                    onChange={handleChangeCreate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Marca
                  </label>
                  <input
                    type="text"
                    required
                    name="marca"
                    value={newVehicle.marca}
                    onChange={handleChangeCreate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Modelo
                  </label>
                  <input
                    type="text"
                    name="modelo"
                    required
                    value={newVehicle.modelo}
                    onChange={handleChangeCreate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Año
                  </label>
                  <input
                    type="number"
                    name="año"
                    required
                    value={newVehicle.año}
                    onChange={handleChangeCreate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kilometraje
                  </label>
                  <input
                    type="number"
                    name="kilometraje"
                    required
                    value={newVehicle.kilometraje}
                    onChange={handleChangeCreate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    required
                    value={newVehicle.color}
                    onChange={handleChangeCreate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo de Carrocería
                  </label>
                  <select
                    value={newVehicle.tipo}
                    name="tipo"
                    onChange={handleChangeCreate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Sedan">Sedán</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="SUV">SUV</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Van">Van/Minivan</option>
                    <option value="Coupe">Coupé</option>
                    <option value="Wagon">Wagon</option>
                    <option value="Convertible">Convertible/Cabriolet</option>
                    <option value="Roadster">Roadster</option>
                    <option value="Targa">Targa</option>
                    <option value="Landaulet">Landaulet</option>
                    <option value="Limousine">Limusina</option>
                    <option value="Monovolumen">Monovolumen</option>
                    <option value="Berlina">Berlina</option>
                    <option value="Combi">Combi</option>
                    <option value="Furgon">Furgón</option>
                    <option value="Kombi">Kombi</option>
                    <option value="Pick up doble cabina">
                      Pick-up Doble Cabina
                    </option>
                    <option value="Chasis cabina">Chasis Cabina</option>
                    <option value="Monocasco">Monocasco</option>
                    <option value="Wagon luxury">Vagoneta de lujo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    value={newVehicle.estado}
                    name="estado"
                    onChange={handleChangeCreate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {Object.keys(estadoConfig).map((estado) => (
                      <option
                        key={estado}
                        value={estado}
                        className={estadoConfig[estado].color}
                      >
                        {estadoConfig[estado].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  {isLoadingCreate ? "Creando..." : "Crear Vehículo"}
                </button>
              </div>
              {errorCreate && showAlert(errorCreate, "error")}
            </form>
          </div>
        </div>
      )}

      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Actualizar Vehículo</h3>
              <button
                onClick={() => handleCloseEditForm()}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cédula/RIF del Cliente
                  </label>
                  <input
                    type="text"
                    name="cedula_cliente"
                    required
                    value={updateVehicle.cedula_cliente}
                    onChange={handleChangeUpdate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Placa
                  </label>
                  <input
                    type="text"
                    name="placa"
                    required
                    value={updateVehicle.placa}
                    onChange={handleChangeUpdate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Marca
                  </label>
                  <input
                    type="text"
                    required
                    name="marca"
                    value={updateVehicle.marca}
                    onChange={handleChangeUpdate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Modelo
                  </label>
                  <input
                    type="text"
                    name="modelo"
                    required
                    value={updateVehicle.modelo}
                    onChange={handleChangeUpdate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Año
                  </label>
                  <input
                    type="number"
                    name="año"
                    required
                    value={updateVehicle.año}
                    onChange={handleChangeUpdate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kilometraje
                  </label>
                  <input
                    type="number"
                    name="kilometraje"
                    required
                    value={updateVehicle.kilometraje}
                    onChange={handleChangeUpdate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    required
                    value={updateVehicle.color}
                    onChange={handleChangeUpdate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo de Carrocería
                  </label>
                  <select
                    value={updateVehicle.tipo}
                    name="tipo"
                    onChange={handleChangeUpdate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Sedan">Sedán</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="SUV">SUV</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Van">Van/Minivan</option>
                    <option value="Coupe">Coupé</option>
                    <option value="Wagon">Wagon</option>
                    <option value="Convertible">Convertible/Cabriolet</option>
                    <option value="Roadster">Roadster</option>
                    <option value="Targa">Targa</option>
                    <option value="Landaulet">Landaulet</option>
                    <option value="Limousine">Limusina</option>
                    <option value="Monovolumen">Monovolumen</option>
                    <option value="Berlina">Berlina</option>
                    <option value="Combi">Combi</option>
                    <option value="Furgon">Furgón</option>
                    <option value="Kombi">Kombi</option>
                    <option value="Pick up doble cabina">
                      Pick-up Doble Cabina
                    </option>
                    <option value="Chasis cabina">Chasis Cabina</option>
                    <option value="Monocasco">Monocasco</option>
                    <option value="Wagon luxury">Vagoneta de lujo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    value={updateVehicle.estado}
                    name="estado"
                    onChange={handleChangeUpdate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {Object.keys(estadoConfig).map((estado) => (
                      <option
                        key={estado}
                        value={estado}
                        className={estadoConfig[estado].color}
                      >
                        {estadoConfig[estado].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  {isLoadingCreate ? "Actualizando..." : "Actualizar Vehículo"}
                </button>
              </div>
              {errorUpdate && showAlert(errorUpdate, "error")}
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                  Placa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                  Modelo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                  Año
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                  Kilometraje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                  Cliente
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehiclesSearch.length === 0 && !isLoadingVehicle && (
                <tr className="text-center">
                  <td colSpan={8} className="px-6 py-4 text-sm text-gray-500">
                    <div className="py-4 px-6 text-lg font-medium text-gray-500">
                      No se encontraron vehículos
                    </div>
                  </td>
                </tr>
              )}
              {errorVehicleSearch && !isLoadingVehicle && (
                <tr className="text-center">
                  <td colSpan={6} className="px-6 py-4 text-sm text-gray-500">
                    <div className="py-4 px-6 text-lg font-medium text-gray-500">
                      No se encontraron vehículos
                    </div>
                  </td>
                </tr>
              )}

              {isLoadingVehicle && (
                <tr>
                  <td colSpan={8} className="px-6 text-center py-4">
                    <ClipLoader
                      color="#3498db"
                      loading={isLoadingVehicle}
                      size={50}
                    />
                  </td>
                </tr>
              )}
              {!errorVehicleSearch &&
                vehiclesSearch.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap  text-center text-sm font-medium text-gray-900">
                      {vehicle.placa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap  text-center text-sm text-gray-500">
                      {vehicle.marca}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap  text-center text-sm text-gray-500">
                      {vehicle.modelo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap  text-center text-sm text-gray-500">
                      {vehicle.año}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap  text-center text-sm text-gray-500">
                      {vehicle.kilometraje} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap  text-center text-sm">
                      <span
                        className={`
      ${estadoConfig[vehicle.estado]?.color} 
      px-2 py-1 rounded-full text-xs font-semibold
    `}
                      >
                        {estadoConfig[vehicle.estado]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.cliente.datos.nombres +
                        " " +
                        vehicle.cliente.datos.apellidos}{" "}
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
        {!errorVehicleSearch &&
          vehiclesSearch.length === LIMIT &&
          hasMore === true && (
            <button
              onClick={next}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Next
              <i className="bi bi-chevron-right w-5 h-5"></i>
            </button>
          )}
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
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Cliente Asociado
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Nombre:</span>{" "}
                        {selectedVehicle.cliente.datos.nombres}{" "}
                        {selectedVehicle.cliente.datos.apellidos}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Cédula/RIF:</span>{" "}
                        {selectedVehicle.cliente.datos.cedula_id_detalles}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Teléfono:</span>{" "}
                        {selectedVehicle.cliente.datos.telefono}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Placa</p>
                    <p className="mt-1">{selectedVehicle.placa}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tipo</p>
                    <p className="mt-1">{selectedVehicle.tipo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Marca</p>
                    <p className="mt-1">{selectedVehicle.marca}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">modelo</p>
                    <p className="mt-1">{selectedVehicle.modelo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Año</p>
                    <p className="mt-1">{selectedVehicle.año}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Color</p>
                    <p className="mt-1">{selectedVehicle.color}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Kilometraje
                    </p>
                    <p className="mt-1">
                      {selectedVehicle.kilometraje.toLocaleString()} km
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <div className="space-x-3">
                <button
                  onClick={() => {
                    /* Implementar vista de diagnósticos */
                  }}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 border border-blue-600 rounded-md"
                >
                  <i className="bi bi-wrench me-2"></i>
                  Diagnósticos
                </button>
                <button
                  onClick={() => {
                    /* Implementar vista de presupuestos */
                  }}
                  className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 border border-purple-600 rounded-md"
                >
                  <i className="bi bi-file-text me-2"></i>
                  Presupuestos
                </button>
                <button
                  onClick={() => {
                    /* Implementar vista de órdenes */
                  }}
                  className="px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 border border-green-600 rounded-md"
                >
                  <i className="bi bi-clipboard me-2"></i>
                  Órdenes de Trabajo
                </button>
                <button
                  onClick={() => {
                    /* Implementar vista de facturas */
                  }}
                  className="px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 border border-orange-600 rounded-md"
                >
                  <i className="bi bi-receipt me-2"></i>
                  Facturas
                </button>
              </div>
              <div className="space-x-3">
                <button
                  onClick={() => {
                    handleEdit(selectedVehicle);
                  }}
                  className="px-4 py-2 text-sm font-medium text-yellow-600 hover:bg-yellow-50 border border-yellow-600 rounded-md"
                >
                  <i className="bi bi-pencil me-2"></i>
                  Editar
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedVehicle);
                  }}
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
