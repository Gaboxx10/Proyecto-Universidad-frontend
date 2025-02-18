import axios from "axios";
import { useState } from "react";
import { showAlert } from "../../utils/alerts";

const useDeleteDiagnostic = () => {
  const [deleteDiagnostic, setDeleteDiagnostic] = useState(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [successDelete, setSuccessDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState(null);

  const handleDeleteDiagnostic = async (id) => {
    setIsLoadingDelete(true);
    setSuccessDelete(false);
    setErrorDelete(null);

    try {
      const response = await axios.delete(
        `http://localhost:3000/diagnostic/diagnostics/id/${id}/delete`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.data.statusCode !== 200) {
        throw new Error(
          response.data.message || "Hubo un error al eliminar los datos"
        );
      }

      setSuccessDelete(true);
      setDeleteDiagnostic(true);
      showAlert("Cliente eliminado exitosamente", "success");
    } catch (error) {
      setErrorDelete(
        error.response?.data?.message ||
          error.message ||
          "Hubo un error al enviar los datos"
      );
      setTimeout(() => {
        setErrorDelete(null);
      }, 5000);
    } finally {
      setIsLoadingDelete(false);
    }
  };

  return {
    deleteDiagnostic,
    isLoadingDelete,
    errorDelete,
    successDelete,
    handleDeleteDiagnostic,
  };
};

export default useDeleteDiagnostic;
