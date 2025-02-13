import { useState, useEffect } from "react";

const LIMIT = 10;

export const usePagination = () => {
  const [offset, setOffset] = useState(1);
  const [page, setPage] = useState(10);

  const next = () => {
    setOffset((prevOffset) => prevOffset + 1);
    setPage((prevPage) => prevPage + LIMIT);
  };

  const prev = () => {
    setOffset((prevOffset) => Math.max(prevOffset - 1, 0));
    setPage((prevPage) => Math.max(prevPage - LIMIT, 0));
  };

  const resetOffset = () => {
    setOffset(0);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [offset, page]);

  return { offset, next, prev, resetOffset, LIMIT, page };
};
