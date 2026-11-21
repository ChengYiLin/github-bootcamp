"use strict";

const storageKey = "todo-list";
const themeStorageKey = "todo-theme";
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyMessage = document.querySelector("#empty-message");
const remainingCount = document.querySelector("#remaining-count");
const storageMessage = document.querySelector("#storage-message");
const themeMessage = document.querySelector("#theme-message");
const themeToggle = document.querySelector("#theme-toggle");
const filterButtons = document.querySelectorAll(".filter-button");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

let todos = [];
let canSave = true;
let selectedFilter = "all";
let manualTheme = null;

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === "dark" ? "☀️ 淺色模式" : "🌙 深色模式";
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
}

function loadTheme() {
  try {
    const savedTheme = localStorage.getItem(themeStorageKey);
    if (savedTheme !== null && savedTheme !== "light" && savedTheme !== "dark") {
      throw new Error("主題資料格式不正確");
    }
    manualTheme = savedTheme;
  } catch (error) {
    console.error("無法讀取主題設定：", error);
    themeMessage.textContent = "無法讀取主題設定，將使用系統的深淺色設定。";
    themeMessage.hidden = false;
  }
  applyTheme(manualTheme || (systemTheme.matches ? "dark" : "light"));
}

themeToggle.addEventListener("click", () => {
  manualTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(manualTheme);
  try {
    localStorage.setItem(themeStorageKey, manualTheme);
    themeMessage.hidden = true;
  } catch (error) {
    console.error("無法儲存主題設定：", error);
    themeMessage.textContent = "無法儲存主題設定，重新整理後可能會恢復原本的設定。";
    themeMessage.hidden = false;
  }
});

systemTheme.addEventListener("change", (event) => {
  if (manualTheme === null) applyTheme(event.matches ? "dark" : "light");
});

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
  const visibleTodos = todos
    .map((todo, index) => ({ todo, index }))
    .filter(({ todo }) =>
      selectedFilter === "all" || (selectedFilter === "completed" ? todo.completed : !todo.completed)
    );
  emptyMessage.hidden = visibleTodos.length > 0;
  emptyMessage.textContent = {
    all: "還沒有任何待辦事項,新增一個吧!",
    active: "沒有未完成的待辦事項。",
    completed: "沒有已完成的待辦事項。"
  }[selectedFilter];
  remainingCount.textContent = `未完成:${todos.filter((todo) => !todo.completed).length} 項`;

  visibleTodos.forEach(({ todo, index }) => {
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

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      filterButton.setAttribute("aria-pressed", String(filterButton === button));
    });
    renderTodos();
  });
});

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

loadTheme();
loadTodos();
renderTodos();
