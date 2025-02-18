import { useState, useEffect } from "react";
import axios from "axios";
import { usePagination } from "../usePagination.hook";

const useGetUsers = (searchTerm) => {
  const [usersSearch, setUsersSearch] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const { pagOffSet, page, next, prev, resetPag, LIMIT } = usePagination();

  const refresh = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/usuario/users/search/`,
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
      const users = response.data.data;
      const totalUsers = response.data.totalCount;

      if (response.data.statusCode !== 200) {
        throw new Error(
          response.data.message || "Hubo un error al enviar los datos"
        );
      }

      if (page >= totalUsers) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setUsersSearch(users);
    } catch (err) {
      setErrorUsers(
        err.response?.data?.message ||
          err.response?.message ||
          err.message ||
          err ||
          "Hubo un error al enviar los datos"
      );
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/usuario/users/search/`,
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
        const users = response.data.data;
        const totalUsers = response.data.totalCount;

        if (response.data.statusCode !== 200) {
          throw new Error(
            response.data.message || "Hubo un error al enviar los datos"
          );
        }

        if (page >= totalUsers) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setUsersSearch(users);
      } catch (err) {
        setErrorUsers(
          err.response?.data?.message ||
            err.response?.message ||
            err.message ||
            err ||
            "Hubo un error al enviar los datos"
        );
      } finally {
        setIsLoadingUsers(false);
      }
    };

    if (searchTerm !== undefined) {
      fetchUsers();
    }
  }, [searchTerm, pagOffSet]);

  return {
    usersSearch,
    isLoadingUsers,
    errorUsers,
    pagOffSet,
    resetPag,
    next,
    prev,
    LIMIT,
    page,
    hasMore,
    refresh,
  };
};
export default useGetUsers;
