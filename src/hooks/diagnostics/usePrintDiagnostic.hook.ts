import axios from "axios";
import { showAlert } from "../../utils/alerts";

const usePrintDiagnostic = () => {
  const printDiagnostic = async (diagnostic) => {

    const date = new Date(diagnostic.created_at).toLocaleDateString(
      "es-ES"
    );

    const filename = `Diagnóstico Nº${diagnostic.num_diagnostico}, ${diagnostic.vehiculo.placa}, ${diagnostic.vehiculo.cliente.datos.cedula_id_detalles}, ${date}.pdf`;
    const id = diagnostic.id

    try {
      const response = await axios.get(
        `http://localhost:3000/diagnostic/diagnostics/id/${id}/print`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob", 
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showAlert(`Exportando Diagnóstico Nº${diagnostic.num_diagnostico} 📄...`, "success")
    } catch (error) {
      console.error("Error al imprimir diagnóstico:", error);
    }
  };

  return {
    printDiagnostic,
  };
};

export default usePrintDiagnostic;
