const d = document;
const $dataForm = d.getElementById("dataForm");
const $tbody = d.querySelector(".tbody");

const getAll = async () => {
  try {
    const res = await axios("http://localhost:3000/alumnos");
    const json = await res.data;

    if (!res.statusText === "OK") {
      throw { status: res.status, statusText: res.statusText };
    }

    console.log(res);
    console.log(json);
    json.forEach((el) => {
      //Creando una nueva Fila
      const $newRow = document.createElement("tr");
      $newRow.classList.add("row");

      // Crear y agregar el nombre
      const $newName = d.createElement("td");
      $newName.textContent = el.nombre;
      $newRow.appendChild($newName);

      //Crear y agregar el apellido
      const $newLastname = d.createElement("td");
      $newLastname.textContent = el.apellido;
      $newRow.appendChild($newLastname);

      // Crear y agregar el DNI
      const $newDni = d.createElement("td");
      $newDni.textContent = el.dni;
      $newRow.appendChild($newDni);

      //Crear y agregar el grado
      const $newGrade = d.createElement("td");
      $newGrade.textContent = el.grado;
      $newRow.appendChild($newGrade);

      //Creando Botones
      const $tdButtons = d.createElement("td");

      //Boton Edit
      const $buttonEdit = d.createElement("button");
      $buttonEdit.dataset.id = el.id;
      $buttonEdit.dataset.name = el.nombre;
      $buttonEdit.dataset.lastName = el.apellido;
      $buttonEdit.dataset.dni = el.dni;
      $buttonEdit.dataset.grade = el.grado;
      $buttonEdit.textContent = "Editar";
      $buttonEdit.classList.add("edit");

      //Boton Delete

      const $buttonDelete = d.createElement("button");
      $buttonDelete.textContent = "Eliminar";
      $buttonDelete.classList.add("delete");
      $buttonDelete.dataset.id = el.id;
      $buttonDelete.dataset.name = el.nombre;
      $buttonDelete.dataset.lastName = el.apellido;

      $tdButtons.appendChild($buttonEdit);
      $tdButtons.appendChild($buttonDelete);
      $newRow.appendChild($tdButtons);

      //agregar el row al tbody
      $tbody.appendChild($newRow);
    });
  } catch (err) {
    console.log("Error:", err);
  }
};

d.addEventListener("DOMContentLoaded", getAll);
d.addEventListener("submit", async (e) => {
  if (!e.target === $dataForm) return;

  e.preventDefault();
  //POST--Create
  if (!e.target.id.value) {
    try {
      const options = {
        nombre: e.target.name.value,
        apellido: e.target.lastName.value,
        dni: e.target.dni.value,
        grado: e.target.grade.value,
      };
      const res = await axios.post("http://localhost:3000/alumnos", options);
      const json = await res.data;

      if (!res.ok) {
        throw new Error("Error en la Creacion de un nuevo alumno");
      }
    } catch (error) {}
    return;
  }

  try {
    const options = {
      nombre: e.target.name.value,
      apellido: e.target.lastName.value,
      dni: e.target.dni.value,
      grado: e.target.grade.value,
    };

    const res = await axios.put(
      `http://localhost:3000/alumnos/${e.target.id.value}`,
      options
    );
    const json = await res.data;
  } catch (error) {}
});
d.addEventListener("click", async (e) => {
  const $modal = d.getElementById("myModal");
  const $inputSubmit = d.querySelector(".input-submit");
  const { id, name, lastName, dni, grade } = $dataForm;

  if (e.target.id === "openModalBtn") {
    name.value = "";
    lastName.value = "";
    dni.value = "";
    grade.value = "";

    $modal.style.display = "flex";
  }

  if (e.target.matches(".closeBtn")) {
    $modal.style.display = "none";
  }

  if (e.target == $modal) {
    $modal.style.display = "none";
  }

  //Editar Alumno
  if (e.target.matches(".edit")) {
    const $titleForm = d.querySelector(".change-title");

    $titleForm.textContent = "Editar Matricula";
    id.value = e.target.dataset.id;
    name.value = e.target.dataset.name;
    lastName.value = e.target.dataset.lastName;
    dni.value = e.target.dataset.dni;
    grade.value = e.target.dataset.grade;

    $modal.style.display = "flex";
  }

  if (e.target.matches(".delete")) {
    const isDelete = confirm(
      `Estas Seguro que quieres eliminar el alumno ${e.target.dataset.name} ${e.target.dataset.lastName}`
    );

    if (!isDelete === true) return;

    try {
      const options = {
        method: "DELETE",
        headers: {
          "Content-type": "application/json;charset=utf-8",
        },
      };
      const res = await axios.delete(
        `http://localhost:3000/alumnos/${e.target.dataset.id}`
      );
      const json = await res.data;
    } catch (error) {}

    console.log("boton con clase delete");
  }
});
