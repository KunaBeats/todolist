"use strict";

const elements = {};
let notes = [];

const domMapping = () => {
  elements.inputEl = document.querySelector("input");
  elements.addBtn = document.querySelector("#add-button");
  elements.clearBtn = document.querySelector("#clear-all");
  elements.noteEl = document.querySelector(".note-container");
};

const appendEventListeners = () => {
  elements.addBtn.addEventListener("click", () => {
    if (elements.inputEl.value.length != 0) {
      createObject();
      domMapping();
      elements.inputEl.value = "";
      saveToLocalStorage();
      loadFromLocalStorage();
      renderNotes();
    }
  });

  elements.clearBtn.addEventListener("click", () => {
    clearAllNotes();
  });
};

const createObject = () => {
  let contentObject = new Object();

  contentObject = {
    content: elements.inputEl.value,
    isChecked: false,
  };

  notes.push(contentObject);
};

const renderNotes = () => {
  elements.noteEl.innerHTML = "";
  notes.forEach((element, index) => {
    const container = document.createElement("div");
    container.className = "note";

    const content = document.createElement("p");
    content.innerHTML = element.content;
    container.append(content);

    const handleNote = document.createElement("div");
    handleNote.className = "handle-note";
    container.append(handleNote);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = element.isChecked;
    handleNote.append(checkbox);

    checkbox.addEventListener("change", (e) => {
      element.isChecked = e.currentTarget.checked;
      saveToLocalStorage();
      renderNotes();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.value = index;
    handleNote.append(deleteBtn);

    if (element.isChecked) {
      deleteBtn.style.backgroundColor = "red";
    }

    deleteBtn.addEventListener("click", () => {
      if (element.isChecked) {
        notes.splice(index, 1);
        saveToLocalStorage();
        loadFromLocalStorage();
        renderNotes();
        if (notes.length <= 0) {
          elements.clearBtn.disabled = true;
        }
      }
    });

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "images/bin.svg";
    deleteIcon.className = "delete-icon";
    deleteBtn.append(deleteIcon);

    elements.noteEl.append(container);
  });

  if (notes.length > 0) {
    elements.clearBtn.disabled = false;
  }
};

const clearAllNotes = () => {
  let newArr = [];
  notes.forEach((element) => {
    if (!element.isChecked === true) {
      newArr.push(element);
    }
  });
  notes = newArr;
  if (notes.length <= 0) {
    elements.clearBtn.disabled = true;
  }
  saveToLocalStorage();
  renderNotes();
};

function saveToLocalStorage() {
  let notesAsText = JSON.stringify(notes);
  localStorage.setItem("notes", notesAsText);
}

function loadFromLocalStorage() {
  let notesAsText = localStorage.getItem("notes");
  if (notesAsText) {
    notes = JSON.parse(notesAsText);
  }
}

const init = () => {
  domMapping();
  appendEventListeners();
  renderNotes(loadFromLocalStorage());
};

init();
