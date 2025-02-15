import { useState, useEffect } from "react";
import axios from "axios";
import { usePagination } from "../usePagination.hook";

const getClients = async (offset: number) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:3000/client/clients/?offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error fetching clients: " + error.message);
  }
};

const useGetClients = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorClient, setErrorClient] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const { route, setRoute, pagOffSet, page, next, prev, LIMIT, resetPag } =
    usePagination();

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setErrorClient(null);

      try {
        const data = await getClients(pagOffSet);
        const totalClients = data.totalCount;
        setClients(data.data);
        if (page >= totalClients) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (err: any) {
        setErrorClient(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [pagOffSet]);

  const refreshClients = async () => {
    setIsLoading(true);
    try {
      const data = await getClients(pagOffSet);
      const totalClients = data.totalCount;
      setClients(data.data);
      if (page >= totalClients) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      setErrorClient(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    clients,
    isLoading,
    errorClient,
    hasMore,
    refreshClients,

    route,
    setRoute,
    pagOffSet,
    page,
    next,
    prev,
    LIMIT,
    resetPag,
  };
};

export default useGetClients;
