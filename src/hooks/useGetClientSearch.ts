import { useState, useEffect } from "react";
import axios from "axios";
import { usePagination } from "./usePagination.hook";

const fetchClients = async (query, offset) => {
  try {
    console.log("Fetching clients with query:", query, "and offset:", offset);

    const response = await axios.get(
      `http://localhost:3000/client/clients/search/search`,
      {
        params: {
          query,
          offset,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

const useGetClientSearch = (query, offset) => {
  const [clienteSearch, setClienteSearch] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isErrorSearch, setIsErrorSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const {
    offset: paginateOffset,
    next,
    prev,
    resetOffset,
    LIMIT,
    page,
  } = usePagination();

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      setIsLoadingSearch(true);
      setIsErrorSearch(false);
      setErrorSearch(null);

      try {
        const data = await fetchClients(query, offset);
        const clients = data.clients || [];
        const total = data.totalCount || 0;
        setClienteSearch(clients);
        if (page >= total) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (err) {
        setIsErrorSearch(true);
        setErrorSearch(err.message);
      } finally {
        setIsLoadingSearch(false);
      }
    };

    fetchData();
  }, [query]);

  return {
    clienteSearch,
    isLoadingSearch,
    isErrorSearch,
    errorSearch,
    next,
    prev,
    paginateOffset,
    resetOffset,
    LIMIT,
    page,
    hasMore,
  };
};

export default useGetClientSearch;
