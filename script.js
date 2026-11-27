import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getDatabase, onValue, push, ref, remove, update } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const todosRef = ref(db, "todos");

const form = document.querySelector("#add-form");
const input = document.querySelector("#new-todo");
const list = document.querySelector("#list");
const empty = document.querySelector("#empty");
const summary = document.querySelector("#summary");
const status = document.querySelector("#status");
const filters = document.querySelectorAll(".filter");

let todos = [];
let filter = "all";
let editingId = null;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  try {
    await push(todosRef, { text, done: false });
    clearStatus();
  } catch (error) {
    showError(error);
  }
  input.focus();
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    filters.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    render();
  });
});

list.addEventListener("click", (event) => {
  const item = event.target.closest(".item");
  if (!item) return;
  const id = item.dataset.id;

  if (event.target.closest(".edit")) {
    startEdit(item, id);
    return;
  }

  if (event.target.closest(".remove")) {
    editingId = null;
    remove(ref(db, `todos/${id}`)).then(clearStatus).catch(showError);
  }
});

list.addEventListener("change", (event) => {
  if (!event.target.classList.contains("check")) return;
  const id = event.target.closest(".item").dataset.id;
  const todo = todos.find((entry) => entry.id === id);
  if (!todo) return;
  update(ref(db, `todos/${id}`), { done: event.target.checked })
    .then(clearStatus)
    .catch((error) => {
      event.target.checked = todo.done;
      showError(error);
    });
});

function startEdit(item, id) {
  const todo = todos.find((entry) => entry.id === id);
  if (!todo || item.querySelector(".edit-input")) return;

  editingId = id;
  const text = item.querySelector(".task-text");
  const field = document.createElement("input");
  field.className = "edit-input";
  field.type = "text";
  field.value = todo.text;
  field.maxLength = 200;
  field.setAttribute("aria-label", "Edit task");
  text.replaceWith(field);
  field.focus();
  field.setSelectionRange(field.value.length, field.value.length);

  let closed = false;

  const finish = (save) => {
    if (closed) return;
    closed = true;
    field.removeEventListener("keydown", onKeydown);
    field.removeEventListener("blur", onBlur);
    const next = field.value.trim();
    editingId = null;

    if (!save || !next || next === todo.text) {
      render();
      return;
    }

    update(ref(db, `todos/${id}`), { text: next }).then(clearStatus).catch((error) => {
      showError(error);
      render();
    });
  };

  const onKeydown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      finish(true);
    }
    if (event.key === "Escape") finish(false);
  };

  const onBlur = (event) => {
    const next = event.relatedTarget;
    if (next && next.closest(".item-actions")) {
      const updated = field.value.trim();
      if (updated) todo.text = updated;
      closed = true;
      editingId = null;
      return;
    }
    finish(true);
  };

  field.addEventListener("keydown", onKeydown);
  field.addEventListener("blur", onBlur);
}

function visibleTodos() {
  if (filter === "active") return todos.filter((todo) => !todo.done);
  if (filter === "done") return todos.filter((todo) => todo.done);
  return todos;
}

function render() {
  const shown = visibleTodos();
  list.innerHTML = shown
    .map(
      (todo) => `
      <li class="item${todo.done ? " is-done" : ""}" data-id="${todo.id}">
        <input class="check" type="checkbox" ${todo.done ? "checked" : ""} aria-label="Mark done" />
        <p class="task-text">${escapeHtml(todo.text)}</p>
        <div class="item-actions">
          <button type="button" class="edit">Edit</button>
          <button type="button" class="remove">Remove</button>
        </div>
      </li>`
    )
    .join("");

  const remaining = todos.filter((todo) => !todo.done).length;
  const total = todos.length;
  if (total === 0) {
    summary.textContent = "No tasks yet";
  } else if (remaining === 0) {
    summary.textContent = "All caught up";
  } else {
    summary.textContent = `${remaining} open · ${total - remaining} done`;
  }

  const emptyMessage =
    total === 0
      ? "Add a task above to start the list."
      : filter === "active"
        ? "No open tasks."
        : "No finished tasks yet.";
  empty.textContent = emptyMessage;
  empty.hidden = shown.length > 0;
}

onValue(
  todosRef,
  (snapshot) => {
    const value = snapshot.val() || {};
    todos = Object.entries(value)
      .map(([id, item]) => ({
        id,
        text: typeof item?.text === "string" ? item.text : "",
        done: item?.done === true,
      }))
      .filter((todo) => todo.text)
      .reverse();
    clearStatus();
    if (!editingId) render();
  },
  (error) => showError(error)
);

function showError(error) {
  console.error(error);
  status.hidden = false;
  status.textContent =
    "Firebase could not save the task. Allow read and write on todos in the Realtime Database rules.";
}

function clearStatus() {
  status.hidden = true;
  status.textContent = "";
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
