import axios from "axios";
import { useState } from "react";
import { showAlert } from "../../utils/alerts";

const useDeleteClient = () => {
  const [deleteClient, setDeleteClient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDelete, setErrorDelete] = useState(null);
  const [successDelete, setSuccessDelete] = useState(false);

  const handleDeleteClient = async (id) => {
    setIsLoading(true);
    setErrorDelete(null); 
    setSuccessDelete(false); 

    console.log("Eliminando cliente...", id);
    try {
      const response = await axios.delete(
        `http://localhost:3000/client/clients/id/${id}/delete`,
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
      setDeleteClient(true);
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
      setIsLoading(false);
    }
  };

  return {
    deleteClient,
    isLoadingDelete: isLoading,
    errorDelete,
    successDelete,
    handleDeleteClient,
  };
};

export default useDeleteClient;
