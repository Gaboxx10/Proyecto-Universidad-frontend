import axios from "axios";
import { useState } from "react";
import { showAlert } from "../../utils/alerts";

const useCreateVehicleForm = () => {
  const [newVehicle, setNewVehicle] = useState({
    placa: "",
    marca: "",
    modelo: "",
    año: new Date().getFullYear(),
    kilometraje: 0,
    color: "",
    tipo: "sedan",
    cedula_cliente: "",
    estado: ""
  });
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [errorCreate, setErrorCreate] = useState(null);
  const [successCreate, setSuccessCreate] = useState(false);

  const handleSubmitCreate = async (e) => {
    e.preventDefault();

    setIsLoadingCreate(true);
    setErrorCreate(null);
    setSuccessCreate(false);
    
    const km = parseInt(newVehicle.kilometraje, 10);
    const year = parseInt(newVehicle.año, 10);
    newVehicle.kilometraje = km;
    newVehicle.año = year;

    try {
      const response = await axios.post(
        "http://localhost:3000/vehicle/create-vehicle",
        newVehicle,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.data.statusCode !== 201) {
        throw new Error(
          response.data.message || "Hubo un error al enviar los datos"
        );
      }

      setSuccessCreate(true);
      setNewVehicle({
        placa: "",
        marca: "",
        modelo: "",
        año: new Date().getFullYear(),
        kilometraje: 0,
        color: "",
        tipo: "Sedan",
        cedula_cliente: "",
        estado: ""
      });
      setIsLoadingCreate(false);
      showAlert("Vehículo creado exitosamente 🚙", "success");
    } catch (err) {
      console.error("Error en la solicitud:", err);
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
    setNewVehicle((prev) => ({ ...prev, [name]: value }));
  };

  return {
    newVehicle,
    setNewVehicle,
    isLoadingCreate,
    errorCreate,
    successCreate,
    handleSubmitCreate,
    handleChangeCreate,
  };
};

export default useCreateVehicleForm;
