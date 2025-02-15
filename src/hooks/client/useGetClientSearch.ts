import { useState, useEffect } from "react";
import axios from "axios";
import { usePagination } from "../usePagination.hook";

const useGetClientSearch = (searchTerm) => {
  const [clienteSearch, setClienteSearch] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const { pagOffSet, page, next, prev, resetPag, LIMIT, route, setRoute } =
    usePagination();

    const refresh = async () => {
      setIsLoadingSearch(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/client/clients/search/`,
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
        const clients = response.data.data;
        const totalClients = response.data.totalCount;
  
        if (response.data.statusCode !== 200) {
          throw new Error(
            response.data.message || "Hubo un error al enviar los datos"
          );
        }
  
        if (page >= totalClients) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
  
        setClienteSearch(clients);
      } catch (err) {
        setErrorSearch(
          err.response?.data?.message ||
            err.response?.message ||
            err.message ||
            err ||
            "Hubo un error al enviar los datos"
        );
      } finally {
        setIsLoadingSearch(false);
      }
    };

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoadingSearch(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/client/clients/search/`,
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
        const clients = response.data.data;
        const totalClients = response.data.totalCount;

        if (response.data.statusCode !== 200) {
          throw new Error(
            response.data.message || "Hubo un error al enviar los datos"
          );
        }

        if (page >= totalClients) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setClienteSearch(clients);
      } catch (err) {
        setErrorSearch(
          err.response?.data?.message ||
            err.response?.message ||
            err.message ||
            err ||
            "Hubo un error al enviar los datos"
        );
      } finally {
        setIsLoadingSearch(false);
      }
    };

    if (searchTerm !== undefined) {
      fetchClients();
    }
  }, [searchTerm, pagOffSet]);

  return {
    clienteSearch,
    isLoadingSearch,
    errorSearch,
    pagOffSet,
    resetPag,
    next,
    prev,
    LIMIT,
    page,
    hasMore,
    refresh
  };
};
export default useGetClientSearch;
