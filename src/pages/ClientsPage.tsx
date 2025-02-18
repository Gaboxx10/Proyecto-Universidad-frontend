import React, { useEffect, useState } from "react";
import { showConfirmDialog, showAlert } from "../utils/alerts";
import useGetClientSearch from "../hooks/client/useGetClientSearch";
import useCreateClienteForm from "../hooks/client/useSaveNewClient.hook";
import useUpdateClienteForm from "../hooks/client/useEditClient.hook";
import useDeleteClient from "../hooks/client/useDeleteClient.hook";
import { useAuthStore } from "../store/authStore";
import { ClipLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";

export default function ClientsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedClient, setSelectedClient] = useState(null);
  const [clientToUpdate, setClientToUpdate] = useState(null);

  let debounceTimeout;

  const handleClienteVehiculos = () => {
    navigate("/dashboard/vehiculos", {
      state: {
        cliente: selectedClient.datos.cedula_identidad,
      },
    });
  };

  const {
    newClient,
    setNewClient,
    isLoadingCreate,
    errorCreate,
    successCreate,
    handleSubmitCreate,
    handleChangeCreate,
  } = useCreateClienteForm();

  const {
    updateClient,
    setUpdateClient,
    isLoadingUpdate,
    errorUpdate,
    successUpdate,
    handleSubmitUpdate,
    handleChangeUpdate,
  } = useUpdateClienteForm(clientToUpdate ? clientToUpdate.id : null);

  const {
    clienteSearch,
    isLoadingSearch,
    errorSearch,
    pagOffSet,
    next,
    prev,
    page,
    LIMIT,
    hasMore,
    refresh,
    resetPag,
  } = useGetClientSearch(searchTerm);

  const {
    deleteClient,
    isLoadingDelete,
    errorDelete,
    successDelete,
    handleDeleteClient,
  } = useDeleteClient();

  const handleEdit = (client) => {
    setClientToUpdate(client);
    setSelectedClient(null);
    setUpdateClient({ ...client.datos });
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setClientToUpdate(null);
    setUpdateClient({
      nombres: "",
      apellidos: "",
      cedula_identidad: "",
      tipo_cliente: "PERSONA_NATURAL",
      telefono: "",
      direccion: "",
      email: "",
    });
  };

  const handleDelete = async (client) => {
    const confirmed = await showConfirmDialog(
      "¿Está seguro que desea eliminar este cliente? Esta acción eliminará también todos los vehículos asociados y no se puede deshacer."
    );
    if (confirmed) {
      await handleDeleteClient(client.id);
      setSelectedClient(null);
      showAlert("Cliente eliminado exitosamente 🗑", "success");
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {}, 4000);
    resetPag();
  };

  useEffect(() => {
    if (successUpdate) {
      handleCloseEditForm();
      refresh();
    }
  }, [successUpdate, setUpdateClient]);

  useEffect(() => {
    if (successDelete) {
      setSelectedClient(null);
      setSearchTerm("");
      resetPag();
      refresh();
    }
  }, [successDelete]);

  useEffect(() => {
    if (successCreate) {
      setShowAddForm(false);
      setNewClient({
        nombres: "",
        apellidos: "",
        cedula_identidad: "",
        tipo_cliente: "PERSONA_NATURAL",
        telefono: "",
        direccion: "",
        email: "",
      });
      refresh();
    }
  }, [successCreate, setNewClient]);

  useEffect(() => {
    if (errorDelete) {
      showAlert(`Error al eliminar el cliente: ${errorDelete}`, "error");
    }
  }, [errorDelete]);

  useEffect(() => {
    if (searchTerm === "") {
      resetPag();
      refresh();
    }
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
        {user && (user.rol === "ADMIN" || user.rol === "ASISTENTE") && (
          <button
            onClick={() => {
              setNewClient({
                nombres: "",
                apellidos: "",
                cedula_identidad: "",
                tipo_cliente: "PERSONA_NATURAL",
                telefono: "",
                direccion: "",
                email: "",
              });
              setShowAddForm(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <i className="bi bi-plus-lg me-2"></i>
            Nuevo Cliente
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <i className="bi bi-search text-gray-400"></i>
        <input
          type="text"
          placeholder="Buscar por cédula/RIF o nombre..."
          value={searchTerm}
          onChange={handleSearchInput}
          className="flex-1 border-none focus:ring-0 outline-none text-sm"
        />
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Crear Cliente</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewClient({
                    nombres: "",
                    apellidos: "",
                    cedula_identidad: "",
                    tipo_cliente: "PERSONA_NATURAL",
                    telefono: "",
                    direccion: "",
                    email: "",
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmitCreate} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {newClient.tipo_cliente === "PERSONA_NATURAL"
                      ? "Cédula"
                      : "RIF"}
                  </label>
                  <input
                    type="text"
                    required
                    name="cedula_identidad"
                    value={newClient.cedula_identidad}
                    onChange={handleChangeCreate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {newClient.tipo_cliente === "PERSONA_NATURAL"
                      ? "Nombres"
                      : "Nombre de la Empresa"}
                  </label>
                  <input
                    type="text"
                    name="nombres"
                    required
                    value={newClient.nombres}
                    onChange={handleChangeCreate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {newClient.tipo_cliente === "PERSONA_NATURAL"
                      ? "Apellidos"
                      : "Razón Social"}
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    required
                    value={newClient.apellidos}
                    onChange={handleChangeCreate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    required
                    value={newClient.telefono}
                    onChange={handleChangeCreate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Dirección
                  </label>
                  <textarea
                    name="direccion"
                    value={newClient.direccion}
                    required
                    onChange={handleChangeCreate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={newClient.email}
                    onChange={handleChangeCreate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewClient({
                      nombres: "",
                      apellidos: "",
                      cedula_identidad: "",
                      tipo_cliente: "PERSONA_NATURAL",
                      telefono: "",
                      direccion: "",
                      email: "",
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
                  {isLoadingCreate ? "Creando..." : "Crear Cliente"}
                </button>
              </div>
            </form>

            {errorCreate && showAlert(`${errorCreate}`, "error")}
          </div>
        </div>
      )}

      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Actualizar Cliente</h3>
              <button
                onClick={handleCloseEditForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmitUpdate} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {updateClient.tipo_cliente === "PERSONA_NATURAL"
                      ? "Cédula"
                      : "RIF"}
                  </label>
                  <input
                    type="text"
                    name="cedula_identidad"
                    value={updateClient.cedula_identidad}
                    onChange={handleChangeUpdate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {updateClient.tipo_cliente === "PERSONA_NATURAL"
                      ? "Nombres"
                      : "Nombre de la Empresa"}
                  </label>
                  <input
                    type="text"
                    name="nombres"
                    value={updateClient.nombres}
                    onChange={handleChangeUpdate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {updateClient.tipo_cliente === "PERSONA_NATURAL"
                      ? "Apellidos"
                      : "Razón Social"}
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    value={updateClient.apellidos}
                    onChange={handleChangeUpdate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={updateClient.telefono}
                    onChange={handleChangeUpdate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Dirección
                  </label>
                  <textarea
                    name="direccion"
                    value={updateClient.direccion}
                    onChange={handleChangeUpdate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={updateClient.email}
                    onChange={handleChangeUpdate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseEditForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  {isLoadingUpdate ? "Actualizando..." : "Actualizar Cliente"}
                </button>
              </div>
            </form>

            {errorUpdate && showAlert(`${errorUpdate}`, "error")}
          </div>
        </div>
      )}

      <>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                    Cédula/RIF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                    Correo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clienteSearch.length === 0 && !isLoadingSearch && (
                  <tr className="text-center">
                    <td colSpan={6} className="px-6 py-4 text-sm text-gray-500">
                      <div className="py-4 px-6 text-lg font-medium text-gray-500">
                        No se encontraron clientes
                      </div>
                    </td>
                  </tr>
                )}
                {isLoadingSearch && (
                  <tr>
                    <td colSpan={4} className="px-6 text-center py-4">
                      <ClipLoader
                        color="#3498db"
                        loading={isLoadingSearch}
                        size={50}
                      />
                    </td>
                  </tr>
                )}
                {clienteSearch.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap  text-center text-sm font-medium text-gray-900">
                      {client.datos.cedula_id_detalles}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap  text-center text-sm text-gray-500">
                      {client.datos.nombres} {client.datos.apellidos}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap  text-center text-sm text-gray-500">
                      {client.datos.telefono}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap  text-center text-sm text-gray-500">
                      {client.datos.email || "-"}
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
          {clienteSearch.length === LIMIT && hasMore === true && (
            <button
              onClick={next}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Next
              <i className="bi bi-chevron-right w-5 h-5"></i>
            </button>
          )}
        </div>
      </>

      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              key={selectedClient.id}
              onClick={() => setSelectedClient(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Detalles del Cliente
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Tipo de Cliente
                  </p>
                  <p className="mt-1">
                    {selectedClient.tipo_cliente === "PERSONA_NATURAL"
                      ? "Persona Natural"
                      : "Empresa"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {selectedClient.tipo_cliente === "PERSONA_NATURAL"
                      ? "Cédula"
                      : "RIF"}
                  </p>
                  <p className="mt-1">
                    {selectedClient.datos.cedula_id_detalles}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {selectedClient.tipo_cliente === "PERSONA_NATURAL"
                      ? "Nombres"
                      : "Nombre de la Empresa"}
                  </p>
                  <p className="mt-1">{selectedClient.datos.nombres}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {selectedClient.tipo_cliente === "PERSONA_NATURAL"
                      ? "Apellidos"
                      : "Razón Social"}
                  </p>
                  <p className="mt-1">{selectedClient.datos.apellidos}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Teléfono</p>
                  <p className="mt-1">{selectedClient.datos.telefono}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Correo Electrónico
                  </p>
                  <p className="mt-1">{selectedClient.datos.email || "-"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Dirección</p>
                  <p className="mt-1">{selectedClient.datos.direccion}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <div className="space-x-3">
                <button
                  onClick={handleClienteVehiculos}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 border border-blue-600 rounded-md"
                >
                  <i className="bi bi-car-front me-2"></i>
                  Vehículos Asociados
                </button>

                <Link to="/dashboard/facturas">
                  <button
                    onClick={() => {}}
                    className="px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 border border-green-600 rounded-md"
                  >
                    <i className="bi bi-receipt me-2"></i>
                    Facturas del Cliente
                  </button>
                </Link>
              </div>
              {user && (user.rol === "ADMIN" || user.rol === "ASISTENTE") && (
                <div className="space-x-3">
                  <button
                    onClick={() => handleEdit(selectedClient)}
                    className="px-4 py-2 text-sm font-medium text-yellow-600 hover:bg-yellow-50 border border-yellow-600 rounded-md"
                  >
                    <i className="bi bi-pencil me-2"></i>
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(selectedClient)}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-600 rounded-md"
                  >
                    <i className="bi bi-trash me-2"></i>
                    {isLoadingDelete ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
