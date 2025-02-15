import axios from "axios";
import { useState } from "react";
import { showAlert } from "../../utils/alerts";

const useUpdateClienteForm = (id) => {
  const [updateClient, setUpdateClient] = useState({
    nombres: "",
    apellidos: "",
    cedula_identidad: "",
    telefono: "",
    direccion: "",
    email: "",
  });
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);
  const [successUpdate, setSuccessUpdate] = useState(false);

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    setIsLoadingUpdate(true);
    setErrorUpdate(null);
    setSuccessUpdate(false);

    try {
      const update = {
        nombres: updateClient.nombres,
        apellidos: updateClient.apellidos,
        cedula_identidad: updateClient.cedula_identidad,
        telefono: updateClient.telefono,
        direccion: updateClient.direccion,
        email: updateClient.email,
      };
      const response = await axios.patch(
        "http://localhost:3000/client/clients/id/" + id + "/update",
        update,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.data.statusCode !== 200) {
        throw new Error(
          response.data.message || "Hubo un error al enviar los datos"
        );
      }

      setSuccessUpdate(true);
      setUpdateClient({
        nombres: "",
        apellidos: "",
        cedula_identidad: "",
        telefono: "",
        direccion: "",
        email: "",
      });
      showAlert("Cliente actualizado exitosamente", "success");
    } catch (err) {
      console.error("Error en la solicitud:", err);
      setErrorUpdate(
        err.response?.data?.message ||
          err.response?.message ||
          err.message ||
          err ||
          "Hubo un error al enviar los datos"
      );
      setTimeout(() => {
        setErrorUpdate(null);
      }, 5000);
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const handleChangeUpdate = (e) => {
    const { name, value } = e.target;
    setUpdateClient((prev) => ({ ...prev, [name]: value }));
  };

  return {
    updateClient,
    setUpdateClient,
    isLoadingUpdate,
    errorUpdate,
    successUpdate,
    handleSubmitUpdate,
    handleChangeUpdate,
  };
};

export default useUpdateClienteForm;
