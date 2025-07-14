// Verificar si hay sesión activa
const session = JSON.parse(localStorage.getItem("session"));
if (!session) {
  window.location.href = "login.html";
}

const isAdmin = session.role === "admin";
const API_URL = "http://localhost:3000/students";

const tableBody = document.getElementById("table-body");
const modal = document.getElementById("modal");
const form = document.getElementById("student-form");
const modalTitle = document.getElementById("modal-title");
const addBtn = document.getElementById("addBtn");

let editId = null;

if (!isAdmin && addBtn) {
  addBtn.style.display = "none";
}

// Mostrar nombre de usuario en el perfil
const usernameDisplay = document.getElementById("username");
if (usernameDisplay && session) {
  usernameDisplay.textContent = session.username;
}

// ==============================
// RENDERIZAR TABLA
// ==============================
async function renderTable() {
  tableBody.innerHTML = "";
  const res = await fetch(API_URL);
  const events = await res.json();

  events.forEach((event) => {
    const row = document.createElement("div");
    row.className = "table-row";
    row.innerHTML = `
      <div class="profile-cell">
        <img src="./500_333.jpeg" alt="${event.name}" />
        <strong>${event.name}</strong>
      </div>
      <div>${event.email}</div>
      <div>${event.phone}</div>
      <div>${event.enroll}</div>
      <div>${event.admission}</div>
      <div class="actions-cell">
        ${
          isAdmin
            ? `
          <i class="fa-solid fa-pen-to-square edit" onclick="editEvent(${event.id})"></i>
          <i class="fa-solid fa-trash delete" onclick="deleteEvent(${event.id})"></i>
        `
            : `<span style="color: gray; font-size: 0.9em;">Solo lectura</span>`
        }
      </div>
    `;
    tableBody.appendChild(row);
  });
}

// ==============================
// ABRIR / CERRAR MODAL
// ==============================
function openModal() {
  modal.style.display = "flex";
  form.reset();
  editId = null;
  modalTitle.textContent = "Add Student";
}

function closeModal() {
  modal.style.display = "none";
}

// ==============================
// EDITAR
// ==============================
async function editStudent(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const student = await res.json();

  document.getElementById("name").value = student.name;
  document.getElementById("email").value = student.email;
  document.getElementById("phone").value = student.phone;
  document.getElementById("enroll").value = student.enroll;
  document.getElementById("admission").value = student.admission;

  editId = id;
  modalTitle.textContent = "Edit Student";
  modal.style.display = "flex";
}

// ==============================
// BORRAR
// ==============================
async function deleteStudent(id) {
  if (confirm("Are you sure you want to delete this student?")) {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    renderTable();
  }
}

// ==============================
// GUARDAR NUEVO O ACTUALIZADO
// ==============================
form.onsubmit = async (e) => {
  e.preventDefault();

  const student = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    enroll: document.getElementById("enroll").value,
    admission: document.getElementById("admission").value,
  };

  if (editId !== null) {
    // PUT - actualizar
    await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });
  } else {
    // POST - nuevo
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });
  }

  closeModal();
  renderTable();
};

// ==============================
// CLICK FUERA DEL MODAL
// ==============================
window.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }
};

// ==============================
// LOGOUT
// ==============================
function logout() {
  localStorage.removeItem("session");
  window.location.href = "login.html";
}

// ==============================
// INICIALIZAR TABLA
// ==============================
renderTable();
