"use strict";

const storageKey = "todo-list";
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyMessage = document.querySelector("#empty-message");
const remainingCount = document.querySelector("#remaining-count");
const storageMessage = document.querySelector("#storage-message");

let todos = [];
let canSave = true;

function showStorageError(message) {
  storageMessage.textContent = message;
  storageMessage.hidden = false;
}

function loadTodos() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === null) return;

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.every(
      (todo) => todo && typeof todo.text === "string" && typeof todo.completed === "boolean"
    )) {
      throw new Error("待辦資料格式不正確");
    }
    todos = parsed;
  } catch (error) {
    canSave = false;
    console.error("無法讀取待辦資料：", error);
    showStorageError("無法讀取儲存的待辦資料，此次變更不會儲存。請檢查瀏覽器儲存設定。");
  }
}

function saveTodos() {
  if (!canSave) return;

  try {
    localStorage.setItem(storageKey, JSON.stringify(todos));
    storageMessage.hidden = true;
  } catch (error) {
    console.error("無法儲存待辦資料：", error);
    showStorageError("無法儲存待辦資料，重新整理後變更可能會遺失。請檢查瀏覽器儲存設定。");
  }
}

function renderTodos() {
  list.replaceChildren();
  emptyMessage.hidden = todos.length > 0;
  remainingCount.textContent = `未完成:${todos.filter((todo) => !todo.completed).length} 項`;

  todos.forEach((todo, index) => {
    const item = document.createElement("li");
    item.className = "todo-item";
    item.classList.toggle("completed", todo.completed);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `完成：${todo.text}`);
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "刪除";
    deleteButton.setAttribute("aria-label", `刪除：${todo.text}`);
    deleteButton.addEventListener("click", () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.push({ text, completed: false });
  saveTodos();
  renderTodos();
  input.value = "";
  input.focus();
});

loadTodos();
renderTodos();
