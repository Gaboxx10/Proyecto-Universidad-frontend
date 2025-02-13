import { useState, useEffect } from 'react';
import axios from 'axios';
import { usePagination } from './usePagination.hook';

const getClients = async (offset) => {
  try {
    const token = localStorage.getItem('token');
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
    throw new Error('Error fetching clients: ' + error.message);
  }
};

const getTotalClients = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      'http://localhost:3000/dashboard/',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.clients || 0;
  } catch (error) {
    throw new Error('Error fetching total clients: ' + error.message);
  }
};

const useGetClients = () => {
  const [clients, setClients] = useState([]); 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const { offset, next, prev, resetOffset, LIMIT, page } = usePagination();

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null); 

      try {
        const data = await getClients(offset);
        const totalClients = await getTotalClients();
        setClients(data.data); 
        if(page >= totalClients) {
          setHasMore(false);
        }else{
          setHasMore(true);
        }
      } catch (err: any) {
        setIsError(true);
        setError(err.message); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [offset]);  

  return {
    clients,
    isLoading,
    isError,
    error,
    next,
    prev,
    offset,
    resetOffset,
    LIMIT,
    page,
    hasMore
  };
};

export default useGetClients;
