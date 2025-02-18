import axios from "axios";
import { useState } from "react";
import { showAlert } from "../../utils/alerts";

const useUpdateVehicleForm = (id) => {
  const [updateVehicle, setUpdateVehicle] = useState({
    placa: "",
    marca: "",
    modelo: "",
    año: new Date().getFullYear(),
    kilometraje: 0,
    color: "",
    tipo: "sedan",
    cedula_cliente: "",
    estado: "",
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
        placa: updateVehicle.placa,
        marca: updateVehicle.marca,
        modelo: updateVehicle.modelo,
        año: parseInt(updateVehicle.año, 10),
        kilometraje: parseInt(updateVehicle.kilometraje, 10),
        color: updateVehicle.color,
        tipo: updateVehicle.tipo,
        cedula_cliente: updateVehicle.cedula_cliente,
        estado: updateVehicle.estado
      };
      const response = await axios.patch(
        "http://localhost:3000/vehicle/vehicles/id/" + id + "/update",
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
      setUpdateVehicle({
        placa: "",
        marca: "",
        modelo: "",
        año: new Date().getFullYear(),
        kilometraje: 0,
        color: "",
        tipo: "sedan",
        cedula_cliente: "",
        estado: "",
      });
      showAlert("Vehículo actualizado exitosamente ✔", "success");
    } catch (err) {
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
    setUpdateVehicle((prev) => ({ ...prev, [name]: value }));
  };

  return {
    updateVehicle,
    setUpdateVehicle,
    isLoadingUpdate,
    errorUpdate,
    successUpdate,
    handleSubmitUpdate,
    handleChangeUpdate,
  };
};

export default useUpdateVehicleForm;
