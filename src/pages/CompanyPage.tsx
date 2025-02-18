import React, { useState } from "react";

export default function CompanyPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: "Taller Mecánico Default",
    address: "",
    phone: "",
    email: "",
    nif: "",
    logo: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Aquí podrías guardar los cambios en una base de datos o hacer alguna otra acción.
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <i className="bi bi-building text-2xl text-blue-600 mr-2"></i>
        <h1 className="text-2xl font-bold">Información de la Empresa</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form className="space-y-6" onSubmit={handleSaveChanges}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Taller
            </label>
            {isEditing ? (
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                name="name"
                value={companyInfo.name}
                onChange={handleInputChange}
              />
            ) : (
              <p>{companyInfo.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            {isEditing ? (
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                name="address"
                value={companyInfo.address}
                onChange={handleInputChange}
              />
            ) : (
              <p>{companyInfo.address || "No proporcionada"}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  name="phone"
                  value={companyInfo.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{companyInfo.phone || "No proporcionado"}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  name="email"
                  value={companyInfo.email}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{companyInfo.email || "No proporcionado"}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIF/CIF
            </label>
            {isEditing ? (
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                name="nif"
                value={companyInfo.nif}
                onChange={handleInputChange}
              />
            ) : (
              <p>{companyInfo.nif || "No proporcionado"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo
            </label>
            {isEditing ? (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <i className="bi bi-building text-4xl text-gray-400"></i>
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Subir un archivo</span>
                      <input type="file" className="sr-only" accept="image/*" />
                    </label>
                    <p className="pl-1">o arrastrar y soltar</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF hasta 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <i className="bi bi-image text-4xl text-gray-400"></i>
                {companyInfo.logo ? (
                  <img
                    src={companyInfo.logo}
                    alt="Logo"
                    className="mt-2"
                    style={{ width: "100px", height: "100px" }}
                  />
                ) : (
                  <p>No se ha subido un logo.</p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              onClick={handleEditClick}
            >
              <i className="bi bi-pencil"></i>
              <span>Editar</span>
            </button>

            {isEditing && (
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 ml-4"
              >
                <i className="bi bi-save"></i>
                <span>Guardar Cambios</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
