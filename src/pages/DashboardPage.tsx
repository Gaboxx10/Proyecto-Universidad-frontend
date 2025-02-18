import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface VehicleInShop {
  id: string;
  plate: string;
  brand: string;
  model: string;
  clientName: string;
  entryDate: string;
  status: string;
}

interface PendingInvoice {
  id: string;
  num_factura: string;
  clientName: string;
  amount: number;
  vehicle: string;
  status: string;
}

export default function DashboardPage() {
  const [data, setData] = useState({
    clients: 0,
    vehicles: 0,
    diagnostics: 0,
    quotes: 0,
    workOrders: 0,
    invoices: 0,
    suppliers: 0,
  });
  const [vehiclesInShop, setVehiclesInShop] = useState<VehicleInShop[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<PendingInvoice[]>([]);
  const [loading, setLoading] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = response.data;
        setData({
          clients: data.clients || 0,
          vehicles: data.vehicles || 0,
          diagnostics: data.diagnostic || 0,
          quotes: data.presupuestos || 0,
          workOrders: data.ordenes || 0,
          invoices: data.facturas || 0,
          suppliers: data.providers || 0,
        });

        setVehiclesInShop(
          data.vehiculostaller.map((vehicle: any) => ({
            id: vehicle.id,
            plate: vehicle.placa,
            brand: vehicle.marca,
            model: vehicle.modelo,
            status: vehicle.estado,
          }))
        );

        setPendingInvoices(
          data.facturasPendientes.map((invoice) => ({
            id: invoice.id,
            num_factura: invoice.num_factura,
            clientName:
              invoice.cliente.datos.nombres +
              " " +
              invoice.cliente.datos.apellidos,
            amount: invoice.total_pagar,
            status: invoice.pago ? "Pagado" : "Pendiente",
            vehicle: invoice.Vehiculo.placa,
          }))
        );
        console.log(pendingInvoices);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData(); // Don't forget to call the fetchData function
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Panel de Control</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/dashboard/clientes"
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.clients}
              </p>{" "}
              {/* Changed to 'data' */}
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="bi bi-people text-2xl text-blue-600"></i>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard/vehiculos"
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vehículos</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.vehicles}
              </p>{" "}

            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="bi bi-car-front text-2xl text-green-600"></i>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard/diagnosticos"
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Diagnósticos</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.diagnostics}
              </p>{" "}
              {/* Changed to 'data' */}
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="bi bi-wrench text-2xl text-purple-600"></i>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard/presupuestos"
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Presupuestos</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.quotes}
              </p>{" "}
              {/* Changed to 'data' */}
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <i className="bi bi-file-text text-2xl text-yellow-600"></i>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard/ordenes"
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Órdenes de Trabajo
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {data.workOrders}
              </p>{" "}
              {/* Changed to 'data' */}
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <i className="bi bi-clipboard text-2xl text-indigo-600"></i>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard/facturas"
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Facturas</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.invoices}
              </p>{" "}
              {/* Changed to 'data' */}
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <i className="bi bi-receipt text-2xl text-red-600"></i>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard/proveedores"
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Proveedores</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.suppliers}
              </p>{" "}
              {/* Changed to 'data' */}
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <i className="bi bi-shop text-2xl text-orange-600"></i>
            </div>
          </div>
        </Link>
      </div>

      {/* Other components (Vehicles in Shop and Pending Invoices) */}
      {/* Contenedor principal con flex */}
      <div className="flex space-x-4">
        {/* Vehículos en Taller */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-1/2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Vehículos en Taller
            </h3>
            <Link
              to="/dashboard/ordenes"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {vehiclesInShop.length === 0 ? (
              <p className="text-center text-gray-500">
                No hay vehículos en taller
              </p>
            ) : (
              vehiclesInShop.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="bi bi-car-front text-blue-600"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {vehicle.plate}
                      </p>
                      <p className="text-sm text-gray-500">
                        {vehicle.brand} {vehicle.model}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {vehicle.status}
                    </p>
                    <p className="text-sm text-gray-500">
                        {vehicle.clientName} 
                      </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Facturas Pendientes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-1/2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Facturas Pendientes
            </h3>
            <Link
              to="/dashboard/facturas"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {pendingInvoices.length === 0 ? (
              <p className="text-center text-gray-500">
                No hay facturas pendientes
              </p>
            ) : (
              pendingInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <i className="bi bi-receipt text-red-600"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        N°{invoice.num_factura}
                      </p>
                      <p className="font-medium text-gray-900">
                        {invoice.vehicle}
                      </p>
                      <p className="text-sm text-gray-500">
                        {invoice.clientName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      $
                      {parseFloat(invoice.amount).toLocaleString("es-VE", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p
                      className={`text-sm ${
                        invoice.status === "Pendiente"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {invoice.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
