import axios from "axios";
import { useState } from "react";
import { showAlert } from "../../utils/alerts";

const useCreateDiagnosticForm = () => {
  const [newDiagnostic, setNewDiagnostic] = useState({
    placa_vehiculo: "",
    observaciones: [
      {
        observacion: "",
        causa_prob: "",
        solucion: "",
      },
    ],
  });
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [errorCreate, setErrorCreate] = useState(null);
  const [successCreate, setSuccessCreate] = useState(false);

  const handleSubmitCreate = async (e) => {
    e.preventDefault();

    const diagnostic = {
      placa_vehiculo: newDiagnostic.placa_vehiculo,
      observaciones: newDiagnostic.observaciones.map((observation) => ({
        observacion: observation.observacion,
        causa_prob: observation.causa_prob,
        solucion: observation.solucion,
      })),
    };
    setIsLoadingCreate(true);
    setErrorCreate(null);
    setSuccessCreate(false);

    try {
      const response = await axios.post(
        "http://localhost:3000/diagnostic/create-diagnostic/",
        diagnostic,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      console.log("Respuesta de la API:", response);

      if (response.data.statusCode !== 201) {
        throw new Error(
          response.data.message || "Hubo un error al enviar los datos"
        );
      }

      setSuccessCreate(true);
      setNewDiagnostic({
        placa_vehiculo: "",
        observaciones: [{ observacion: "", causa_prob: "", solucion: "" }],
      });
      showAlert("Diagnóstico creado exitosamente 🔎", "success");
    } catch (err) {
      console.log(err);
      setErrorCreate(
        err.response?.data?.message ||
          err.message ||
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
    setNewDiagnostic((prev) => ({ ...prev, [name]: value }));
  };

  const addNewObservation = () => {
    setNewDiagnostic((prev) => ({
      ...prev,
      observaciones: [
        ...prev.observaciones,
        { observacion: "", causa_prob: "", solucion: "" },
      ],
    }));
  };

  const updateObservation = (index, field, value) => {
    setNewDiagnostic((prev) => {
      const updatedObservations = [...prev.observaciones];
      updatedObservations[index][field] = value;
      return { ...prev, observaciones: updatedObservations };
    });
  };

  const deleteObservation = (index) => {
    setNewDiagnostic((prev) => {
      const updatedObservations = [...prev.observaciones];
      updatedObservations.splice(index, 1);
      return { ...prev, observaciones: updatedObservations };
    });
  };

  return {
    newDiagnostic,
    setNewDiagnostic,
    isLoadingCreate,
    errorCreate,
    successCreate,
    handleSubmitCreate,
    handleChangeCreate,
    addNewObservation,
    updateObservation,
    deleteObservation,
  };
};

export default useCreateDiagnosticForm;
