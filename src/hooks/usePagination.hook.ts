import { useState, useEffect } from "react";

const LIMIT = 10;

export const usePagination = () => {
  const [pagOffSet, setPagOffSet] = useState(1);
  const [page, setPage] = useState(10);
  const [ route, setRoute ] = useState("");

  const next = () => {
    setPagOffSet((prevOffset) => prevOffset + 1);
    setPage((prevPage) => prevPage + LIMIT);
  };

  const prev = () => {
    setPagOffSet((prevOffset) => Math.max(prevOffset - 1, 0));
    setPage((prevPage) => Math.max(prevPage - LIMIT, 0));
  };

  const resetPag = () => {
    setPagOffSet(1);
    setPage(10);
    setRoute("");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pagOffSet, page]);

  return { pagOffSet, page, setPage,next, prev, resetPag, LIMIT, route, setRoute };
};
