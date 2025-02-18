import axios from "axios";
import { useEffect, useState } from "react";
import { usePagination } from "../usePagination.hook";

const useGetDiagnostic = (searchTerm) => {
  const [diagnosticSearch, setDiagnosticSearch] = useState([]);
  const [isLoadingDiagnostic, setIsLoadingDiagnostic] = useState(false);
  const [errorDiagnostic, setErrorDiagnostic] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const { pagOffSet, page, next, prev, resetPag, LIMIT } = usePagination();

  const refresh = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/diagnostic/diagnostics/search/",
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
      const diagnostics = response.data.data;
      const totalDiagnostics = response.data.totalCount;

      //console.log("response", response);

      if (response.data.statusCode !== 200) {
        throw new Error(
          response.data.message || "Hubo un error al enviar los datos"
        );
      }

      if (page >= totalDiagnostics) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setDiagnosticSearch(diagnostics);
    } catch (err) {
      setErrorDiagnostic(
        err.response?.data?.message ||
          err.response?.message ||
          err.message ||
          err ||
          "Hubo un error al enviar los datos"
      );
    } finally {
      setIsLoadingDiagnostic(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [searchTerm, pagOffSet]);

  return {
    diagnosticSearch,
    isLoadingDiagnostic,
    errorDiagnostic,

    resetPag,
    pagOffSet,
    next,
    prev,
    LIMIT,
    page,
    hasMore,
    refresh,
  };
};

export default useGetDiagnostic;