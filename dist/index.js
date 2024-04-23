"use strict";
var _a;
function color() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r},${g},${b})`;
}
const todoForm = document.getElementById("todo");
const todoStorage = JSON.parse((_a = localStorage.getItem("todos")) !== null && _a !== void 0 ? _a : "[]");
const alertDiv = document.getElementById("alert");
const row = document.getElementsByClassName("row")[0];
const lightModeButton = document.getElementById("lightmode");
const darkModeButton = document.getElementById("darkmode");
const mode = JSON.parse(localStorage.getItem("mode") || "{}");
document.body.style.backgroundColor = mode.color;
todoForm.style.border = mode.othercolor;
todoForm[0].style.border = mode.othercolor;
lightModeButton.addEventListener("click", () => {
    localStorage.setItem("mode", JSON.stringify({ color: "white", othercolor: "2px solid black" }));
    const mode = JSON.parse(localStorage.getItem("mode") || "{}");
    document.body.style.backgroundColor = mode.color;
    todoForm.style.border = mode.othercolor;
    todoForm[0].style.border = mode.othercolor;
});
darkModeButton.addEventListener("click", () => {
    localStorage.setItem("mode", JSON.stringify({ color: "black", othercolor: "2px solid white" }));
    const mode = JSON.parse(localStorage.getItem("mode") || "{}");
    document.body.style.backgroundColor = mode.color;
    todoForm.style.border = mode.othercolor;
    todoForm[0].style.border = mode.othercolor;
});
const listingTodo = (todo) => {
    let listing = ``;
    todo.map(({ task, intext }, index) => listing += `
  <div class="col-4">
  <div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">${task}</h5>
    <ul>
    <li class="text">${intext}</li>
    <li><input class="check" type="checkbox" onClick="completeTodo(${index})"></li>
    </ul>
    <button onclick="updateTodo(${index})" class="btn btn-primary">Update</button>
    <button onclick="deleteTodo(${index})" class="btn btn-danger">Delete</button>
  </div>
</div>
</div>
  `);
    return row.innerHTML = listing;
};
listingTodo(todoStorage);
todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let valueTodo = todoForm[0].value;
    if (valueTodo === "") {
        alert(`Enter an valid todo`);
    }
    else {
        const todo = {
            task: valueTodo,
            check: "block",
            text: "none",
            btn: false,
            opacity: "1",
            intext: "Pending",
            color: color()
        };
        todoStorage.unshift(todo);
        localStorage.setItem("todos", JSON.stringify(todoStorage));
        alert(`Todo added successfully!`);
        location.reload();
    }
});
function deleteTodo(id) {
    const deleted = todoStorage.filter((element, index) => index != id);
    localStorage.setItem("todos", JSON.stringify(deleted));
    alert(`Todo deleted successfully!`);
    location.reload();
}
const searchTodo = document.getElementsByName("search")[0];
searchTodo.addEventListener("keyup", (event) => {
    const search = event.target.value;
    const searchTodo = todoStorage.filter(({ task }) => task.toLowerCase().includes(search.toLowerCase()));
    let listing = ``;
    searchTodo.map(({ task, intext }, index) => listing += `
  <div class="col-4">
  <div class="card" style="width: 20rem;">
  <div class="card-body">
    <h5 class="card-title">${task}</h5>
    <ul>
    <li class="text">${intext}</li>
    <li><input class="check" type="checkbox" onClick="completeTodo(${index})"></li>
    </ul>
    <button onclick="updateTodo(${index})" class="btn btn-primary">Update</button>
    <button onclick="deleteTodo(${index})" class="btn btn-danger">Delete</button>
  </div>
</div>
</div>
  `);
    row.innerHTML = listing;
    for (let i = 0; i < searchTodo.length; i++) {
        const check = document.getElementsByClassName("check")[i];
        const card = document.getElementsByClassName("card")[i];
        const title = document.getElementsByClassName("card-title")[i];
        const updateBtn = document.getElementsByClassName("btn btn-primary")[i];
        const text = document.getElementsByClassName("text")[i];
        card.style.backgroundColor = color();
        title.style.textDecoration = searchTodo[i].text;
        check.style.display = searchTodo[i].check;
        updateBtn.disabled = searchTodo[i].btn;
        updateBtn.style.opacity = searchTodo[i].opacity;
        text.innerHTML = searchTodo[i].intext;
    }
});
function updateTodo(id) {
    todoForm[0].value = todoStorage[id].task;
    const addBtn = document.getElementsByClassName("btn btn-success")[0];
    addBtn.style.display = "none";
    const updateBtn = document.getElementsByClassName("btn btn-warning")[0];
    updateBtn.style.display = "block";
    updateBtn.addEventListener('click', () => {
        todoStorage[id].task = todoForm[0].value;
        localStorage.setItem("todos", JSON.stringify(todoStorage));
        alert(`Todo updated successfully!`);
        addBtn.style.display = "block";
        updateBtn.style.display = "none";
        location.reload();
    });
}
function completeTodo(id) {
    const check = document.getElementsByClassName("check")[id];
    const title = document.getElementsByClassName("card-title")[id];
    const updateBtn = document.getElementsByClassName("btn btn-primary")[id];
    const text = document.getElementsByClassName("text")[id];
    if (check.checked) {
        title.style.textDecoration = "line-through";
        todoStorage[id].text = "line-through";
        check.style.display = "none";
        todoStorage[id].check = "none";
        updateBtn.disabled = true;
        updateBtn.style.opacity = "0.5";
        todoStorage[id].btn = true;
        todoStorage[id].opacity = "0.5";
        text.innerHTML = "Completed";
        todoStorage[id].intext = "Completed";
        localStorage.setItem("todos", JSON.stringify(todoStorage));
    }
}
for (let i = 0; i < todoStorage.length; i++) {
    const check = document.getElementsByClassName("check")[i];
    const card = document.getElementsByClassName("card")[i];
    const title = document.getElementsByClassName("card-title")[i];
    const updateBtn = document.getElementsByClassName("btn btn-primary")[i];
    const text = document.getElementsByClassName("text")[i];
    card.style.backgroundColor = todoStorage[i].color;
    title.style.textDecoration = todoStorage[i].text;
    check.style.display = todoStorage[i].check;
    updateBtn.disabled = todoStorage[i].btn;
    updateBtn.style.opacity = todoStorage[i].opacity;
    text.innerHTML = todoStorage[i].intext;
}
