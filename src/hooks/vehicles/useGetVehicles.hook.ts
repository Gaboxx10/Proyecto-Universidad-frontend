import { useState, useEffect } from "react";
import axios from "axios";
import { usePagination } from "../usePagination.hook";

const useGetVehicle = (searchTerm) => {
  const [vehiclesSearch, setVehicleSearch] = useState([]);
  const [isLoadingVehicle, setIsLoadingVehicle] = useState(false);
  const [errorVehicle, setErrorVehicle] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [errorVehicleSearch, setErrorVehicleSearch] = useState("");

  const { pagOffSet, page, next, prev, resetPag, LIMIT } = usePagination();

  const searchVehicleByCedula = async (searchTerm) => {
    setIsLoadingVehicle(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/vehicle/vehicles/search/`,
        {
          params: {
            search: searchTerm,
            offset: pagOffSet,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const vehicles = response.data.data || [];
      const totalVehicles = response.data.totalCount;

      if (response.data.statusCode === 404) {
        setHasMore(false);
        throw new Error(
          response.data.message || "Hubo un error al enviar los datos"
        );
      }

      const vehicleSearch = vehicles.filter((vehicle) => {
        return vehicle.cliente.datos.cedula_identidad === searchTerm;
      });

      if (response.data.statusCode !== 200) {
        throw new Error(
          response.data.message || "Hubo un error al enviar los datos"
        );
      }

      if (LIMIT > vehicleSearch.length) {
        setHasMore(false);
      } else {
        if (page >= totalVehicles) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }

      setVehicleSearch(vehicles);
    } catch (err) {
      setErrorVehicleSearch(
        err.response?.data?.message ||
          err.response?.message ||
          err.message ||
          err ||
          "Hubo un error al enviar los datos"
      );
    } finally {
      setIsLoadingVehicle(false);
    }
  };

  const refresh = async () => {
    setIsLoadingVehicle(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/vehicle/vehicles/search/`,
        {
          params: {
            search: searchTerm,
            offset: pagOffSet,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const vehicles = response.data.data;
      const totalVehicles = response.data.totalCount;

      if (response.data.statusCode !== 200) {
        throw new Error(
          response.data.message || "Hubo un error al enviar los datos"
        );
      }

      if (page >= totalVehicles) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setVehicleSearch(vehicles);
    } catch (err) {
      setErrorVehicle(
        err.response?.data?.message ||
          err.response?.message ||
          err.message ||
          err ||
          "Hubo un error al enviar los datos"
      );
    } finally {
      setIsLoadingVehicle(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [searchTerm, pagOffSet]);

  return {
    vehiclesSearch,
    isLoadingVehicle,
    errorVehicle,
    pagOffSet,
    resetPag,
    next,
    prev,
    LIMIT,
    page,
    hasMore,
    refresh,

    searchVehicleByCedula,
    errorVehicleSearch,
    setErrorVehicleSearch,
  };
};
export default useGetVehicle;
