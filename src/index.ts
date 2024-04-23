interface Todo {
  task: string,
  check: string,
  text: string,
  btn: boolean,
  opacity: string,
  intext: string,
  color:string
}
interface Mode{
  color:string,
  othercolor:string
}

function color(): string {
  const r: number = Math.floor(Math.random() * 255);
  const g: number = Math.floor(Math.random() * 255);
  const b: number = Math.floor(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
}

const todoForm = document.getElementById("todo") as HTMLFormElement;
const todoStorage: Todo[] = JSON.parse(localStorage.getItem("todos") ?? "[]");
const alertDiv = document.getElementById("alert") as HTMLElement;
const row = document.getElementsByClassName("row")[0] as HTMLDivElement;
const lightModeButton = document.getElementById("lightmode") as HTMLButtonElement;
const darkModeButton = document.getElementById("darkmode") as HTMLButtonElement;
const mode:Mode = JSON.parse(localStorage.getItem("mode")||"{}");
document.body.style.backgroundColor=mode.color;
todoForm.style.border=mode.othercolor;
(todoForm[0] as HTMLInputElement).style.border=mode.othercolor;

lightModeButton.addEventListener("click",()=>{
  localStorage.setItem("mode",JSON.stringify({color:"white",othercolor:"2px solid black"}));
  const mode:Mode = JSON.parse(localStorage.getItem("mode")||"{}");
  document.body.style.backgroundColor=mode.color;
  todoForm.style.border=mode.othercolor;
  (todoForm[0] as HTMLInputElement).style.border=mode.othercolor;
})

darkModeButton.addEventListener("click",()=>{
  localStorage.setItem("mode",JSON.stringify({color:"black",othercolor:"2px solid white"}));
  const mode:Mode = JSON.parse(localStorage.getItem("mode")||"{}");
  document.body.style.backgroundColor=mode.color;
  todoForm.style.border=mode.othercolor;
  (todoForm[0] as HTMLInputElement).style.border=mode.othercolor;
});

const listingTodo = (todo: Todo[]): string => {
  let listing: string = ``;
  todo.map(({ task, intext }, index) =>
    listing += `
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
  `
  )
  return row.innerHTML = listing;
}
listingTodo(todoStorage);

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let valueTodo = (todoForm[0] as HTMLInputElement).value;
  if (valueTodo === "") {
    alert(`Enter an valid todo`);
  } else {
    const todo: Todo = {
      task: valueTodo,
      check: "block",
      text: "none",
      btn: false,
      opacity: "1",
      intext: "Pending",
      color:color()
    }
    todoStorage.unshift(todo);
    localStorage.setItem("todos", JSON.stringify(todoStorage));
    alert(`Todo added successfully!`);
    location.reload();
  }
});

function deleteTodo(id: number): void {
  const deleted: Todo[] = todoStorage.filter((element, index) => index != id);
  localStorage.setItem("todos", JSON.stringify(deleted));
  alert(`Todo deleted successfully!`);
  location.reload();
}

const searchTodo = document.getElementsByName("search")[0] as HTMLFormElement;
searchTodo.addEventListener("keyup", (event) => {
  const search = (event.target as any).value;
  const searchTodo = todoStorage.filter(({ task }) => task.toLowerCase().includes(search.toLowerCase()));
  let listing: string = ``;
  searchTodo.map(({ task, intext }, index) =>
    listing += `
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
  `
  )
  row.innerHTML = listing;
  for (let i = 0; i < searchTodo.length; i++) {
    const check = document.getElementsByClassName("check")[i] as HTMLFormElement;
    const card = document.getElementsByClassName("card")[i] as HTMLElement;
    const title = document.getElementsByClassName("card-title")[i] as HTMLElement;
    const updateBtn = document.getElementsByClassName("btn btn-primary")[i] as HTMLButtonElement;
    const text = document.getElementsByClassName("text")[i] as HTMLSpanElement;
    card.style.backgroundColor = color();
    title.style.textDecoration = searchTodo[i].text;
    check.style.display = searchTodo[i].check;
    updateBtn.disabled = searchTodo[i].btn;
    updateBtn.style.opacity = searchTodo[i].opacity;
    text.innerHTML = searchTodo[i].intext;
  }
});

function updateTodo(id: number): void {
  (todoForm[0] as HTMLInputElement).value = todoStorage[id].task;
  const addBtn = document.getElementsByClassName("btn btn-success")[0] as HTMLButtonElement;
  addBtn.style.display = "none";
  const updateBtn = document.getElementsByClassName("btn btn-warning")[0] as HTMLButtonElement;
  updateBtn.style.display = "block";
  updateBtn.addEventListener('click', () => {
    todoStorage[id].task = (todoForm[0] as HTMLInputElement).value;
    localStorage.setItem("todos", JSON.stringify(todoStorage));
    alert(`Todo updated successfully!`);
    addBtn.style.display = "block";
    updateBtn.style.display = "none";
    location.reload();
  })
}

function completeTodo(id: number): void {
  const check = document.getElementsByClassName("check")[id] as HTMLFormElement;
  const title = document.getElementsByClassName("card-title")[id] as HTMLElement;
  const updateBtn = document.getElementsByClassName("btn btn-primary")[id] as HTMLButtonElement;
  const text = document.getElementsByClassName("text")[id] as HTMLSpanElement;
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

for (let i = 0; i < todoStorage.length; i++){
  const check = document.getElementsByClassName("check")[i] as HTMLFormElement;
  const card = document.getElementsByClassName("card")[i] as HTMLElement;
  const title = document.getElementsByClassName("card-title")[i] as HTMLElement;
  const updateBtn = document.getElementsByClassName("btn btn-primary")[i] as HTMLButtonElement;
  const text = document.getElementsByClassName("text")[i] as HTMLSpanElement;
  card.style.backgroundColor =todoStorage[i].color;
  title.style.textDecoration = todoStorage[i].text;
  check.style.display = todoStorage[i].check;
  updateBtn.disabled = todoStorage[i].btn;
  updateBtn.style.opacity = todoStorage[i].opacity;
  text.innerHTML = todoStorage[i].intext;
}
