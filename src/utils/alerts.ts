export const showConfirmDialog = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Creamos el contenedor del modal
    const modal = document.createElement("div");
    modal.classList.add(
      "fixed",
      "top-0",
      "left-0",
      "w-full",
      "h-full",
      "flex",
      "items-center",
      "justify-center",
      "bg-gray-600",
      "bg-opacity-50",
      "z-50"
    );

    // Creamos el contenido del modal
    const modalContent = document.createElement("div");
    modalContent.classList.add(
      "bg-white",
      "p-6",
      "rounded-lg",
      "w-96",
      "text-center"
    );
    modalContent.innerHTML = `
      <p class="text-lg mb-4">${message}</p>
      <div class="flex justify-around">
        <button id="confirm" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Confirmar</button>
        <button id="cancel" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Cancelar</button>
      </div>
    `;

    // Agregar el contenido al modal
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Controladores de evento para los botones
    document.getElementById("confirm")?.addEventListener("click", () => {
      resolve(true);
      document.body.removeChild(modal);
    });

    document.getElementById("cancel")?.addEventListener("click", () => {
      resolve(false);
      document.body.removeChild(modal);
    });
  });
};

export const showAlert = (
  message: string,
  type: "success" | "error" | "warning" = "success"
) => {
  // Crear el contenedor del alerta
  const alert = document.createElement("div");
  alert.classList.add(
    "fixed",
    "top-4",
    "left-1/2",
    "transform",
    "-translate-x-1/2",
    "p-4",
    "w-96",
    "rounded-lg",
    "shadow-lg",
    "text-white",
    "z-50"
  );

  // Asignar estilos según el tipo
  switch (type) {
    case "success":
      alert.classList.add("bg-green-500", "border-green-700"); // Fondo verde para éxito
      break;
    case "error":
      alert.classList.add("bg-red-500", "border-red-700"); // Fondo rojo para error
      break;
    case "warning":
      alert.classList.add("bg-yellow-500", "border-yellow-700"); // Fondo amarillo para advertencia
      break;
  }

  // Agregar el borde y sombra para destacar más la alerta
  alert.classList.add("border-2", "border-solid", "rounded-lg");

  // Contenido del alerta
  alert.innerHTML = `
    <p class="font-bold">${message}</p>
  `;

  // Agregar el alerta al DOM
  document.body.appendChild(alert);

  // Remover el alerta después de 3 segundos
  setTimeout(() => {
    document.body.removeChild(alert);
  }, 3000);
};
