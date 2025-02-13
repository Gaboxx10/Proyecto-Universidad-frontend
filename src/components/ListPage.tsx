import React from 'react';
import { Search, Plus } from 'lucide-react';

interface ListPageProps {
  title: string;
  onAdd?: () => void;
  showAddButton?: boolean;
}

export default function ListPage({ title, onAdd, showAddButton = true }: ListPageProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <i className="bi bi-search absolute left-3 top-2.5 text-gray-400"></i>
          </div>
          {showAddButton && (
            <button
              onClick={onAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            >
              <i className="bi bi-plus-lg"></i>
              <span>Agregar</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-gray-600">No hay datos para mostrar</p>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">Mostrando 0 resultados</p>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center space-x-2" disabled>
              <i className="bi bi-chevron-left"></i>
              <span>Anterior</span>
            </button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center space-x-2" disabled>
              <span>Siguiente</span>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}