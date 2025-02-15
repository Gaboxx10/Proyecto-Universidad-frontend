import axios from "axios";
import { useState } from "react";
import { showAlert } from "../../utils/alerts";

const useCreateClienteForm = () => {
  const [newClient, setNewClient] = useState({
    nombres: "",
    apellidos: "",
    cedula_identidad: "",
    tipo_cliente: "PERSONA_NATURAL",
    telefono: "",
    direccion: "",
    email: "",
  });
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [errorCreate, setErrorCreate] = useState(null);
  const [successCreate, setSuccessCreate] = useState(false);

  const handleSubmitCreate = async (e) => {
    e.preventDefault();

    setIsLoadingCreate(true);
    setErrorCreate(null);
    setSuccessCreate(false);

    try {
      const response = await axios.post(
        "http://localhost:3000/client/create-client",
        newClient,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log("Respuesta de la API:", response.data);

      if (response.data.statusCode !== 201) {
        throw new Error(
          response.data.message || "Hubo un error al enviar los datos"
        );
      }

      setSuccessCreate(true);
      setNewClient({
        nombres: "",
        apellidos: "",
        cedula_identidad: "",
        tipo_cliente: "PERSONA_NATURAL",
        telefono: "",
        direccion: "",
        email: "",
      });
      setIsLoadingCreate(false);
      showAlert("Cliente creado exitosamente", "success");
    } catch (err) {
      console.error("Error en la solicitud:", err);
      console.error("Error en la solicitud:", err) 
      setErrorCreate(
        err.response?.data?.message ||
          err.response?.message ||
          err.message ||
          err ||
          "Hubo un error al enviar los datos"
      );
      setTimeout(() => {
        setErrorCreate(null);
      }, 5000);
    } finally {
      setIsLoadingCreate(false);
    }
  };

  const handleChangeCreate = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  return {
    newClient,
    setNewClient,
    isLoadingCreate,
    errorCreate,
    successCreate,
    handleSubmitCreate,
    handleChangeCreate,
  };
};

export default useCreateClienteForm;
