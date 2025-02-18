import axios from "axios";
import { useState } from "react";
import { showAlert } from "../../utils/alerts";

const useDeleteVehicle = () => {
  const [deleteVehicle, setDeleteVehicle] = useState(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState(null);
  const [successDelete, setSuccessDelete] = useState(false);

  const handleDeleteVehicle = async (id) => {
    setIsLoadingDelete(true);
    setErrorDelete(null);
    setSuccessDelete(false);

    try {
      const response = await axios.delete(
        `http://localhost:3000/vehicle/vehicles/id/${id}/delete`,
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
      setDeleteVehicle(true);
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
    deleteVehicle,
    isLoadingDelete,
    errorDelete,
    successDelete,
    handleDeleteVehicle,
  };
};

export default useDeleteVehicle;
