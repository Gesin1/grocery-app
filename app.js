// DOM
const form = document.querySelector(".grocery-form");
const alart = document.querySelector(".alert");
const inputgrocery = document.querySelector(".input-value");
const groceryContainer = document.querySelector(".grocery-container");
const groceryitem = document.querySelector(".grocery-item");
const clearList = document.querySelector(".clear-btn");
const groceryList = document.querySelector(".grocery-list");
const submitBtn = document.querySelector(".submit-Btn");

//  Preset value for edit
let editID = "";
let editElement;
let editgrocery = false;

// Form
const addItems = (e) => {
  e.preventDefault();

  const value = inputgrocery.value;
  id = `${value.split("").join(" ").toLowerCase()}-${new Date().getTime()}`;
  if (value && !editgrocery) {
    createItems(id, value);
    groceryContainer.classList.add("show-container");
    getAlart("You have enter value", "success");
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editgrocery) {
    editElement.innerHTML = value;
    getAlart("value has change", "success");
    editLocalStorage(editID, value);
    setBackToDefault();
    console.log("Edit optuon is now processing");
  } else {
    getAlart("Please enter value", "danger");
  }
};

// EditItem function
const editItems = (e) => {
  const element = e.currentTarget.parentElement.parentElement;

  editElement = e.currentTarget.parentElement.previousElementSibling;

  inputgrocery.value = editElement.innerHTML;
  editgrocery = true;
  editID = element.dataset.id;
  submitBtn.innerHTML = "edit";
};

// Delete Items function
const deleteItems = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  groceryList.removeChild(element);
  if (groceryList.children.length === 0) {
    groceryContainer.classList.remove("show-container");
  }
  getAlart("You have delete value", "danger");
  removeFromLocalStorage(id);
  setBackToDefault();
};

// clear Button function
const cleargrocery = () => {
  const lists = document.querySelectorAll(".list-container");

  if (lists.length > 0) {
    lists.forEach((item) => {
      groceryList.removeChild(item);
    });
  }

  getAlart("List empty", "danger");

  groceryContainer.classList.remove("show-container");
  setBackToDefault();
};

// set back to default
const setBackToDefault = () => {
  inputgrocery.value = "";
  editID = "";
  editgrocery = false;
  submitBtn.innerHTML = "submit";
};

// Alert Function and set alert timeout
const getAlart = (text, action) => {
  alart.textContent = text;
  alart.classList.add(`${action}`);

  setTimeout(() => {
    alart.textContent = "";
    alart.classList.remove(`${action}`);
  }, 1000);
};

form.addEventListener("submit", addItems);
clearList.addEventListener("click", cleargrocery);

// Function to get Add to local storage
const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("key", JSON.stringify(items));
};
// Function to get local storage for and return array if it's single items
const getLocalStorage = () => {
  return localStorage.getItem("key")
    ? JSON.parse(localStorage.getItem("key"))
    : [];
};
// function to remove local storage
const removeFromLocalStorage = (id) => {
  let items = getLocalStorage();
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("key", JSON.stringify(items));
};
// function for edit local storage
const editLocalStorage = (id, value) => {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      items.value = value;
    }
    return item;
  });
  localStorage.setItem("key", JSON.stringify(items));
};

// Set localstorage to display
const setupItem = () => {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createItems(item.id, item.value);
    });
    groceryContainer.classList.add("show-container");
  }
};
// load item
window.addEventListener("DOMContentLoaded", setupItem);

// fuction for dynamic list
const createItems = (id, value) => {
  const element = document.createElement("article");
  element.classList.add("list-container");
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `
   <p class="title">${value}</p>
   <div class="button-list">
   <button class="edit-btn">
       <i class="fas fa-edit"></i>
   </button>
   <button class="delete-btn">
       <i class="fas fa-trash"></i>
   </button>
</div>`;
  const editBtn = element.querySelector(".edit-btn");
  const deleteBtn = element.querySelector(".delete-btn");
  editBtn.addEventListener("click", editItems);
  deleteBtn.addEventListener("click", deleteItems);
  groceryList.appendChild(element);
};
