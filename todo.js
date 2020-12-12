function setDate(){
    const today=new Date().toLocaleDateString('en',{
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).split(',');
    document.querySelector('.today').firstElementChild.textContent=today[0];
    document.querySelector('.today').childNodes[1].textContent=today[1].replace(/\//g,'-');
}

function importTodoList(){
    const todoListObject = JSON.parse(localStorage.getItem(myStorageKey));
    return todoListObject===null ? {} : todoListObject;
}

function exportTodoList(){
    localStorage.setItem(myStorageKey,JSON.stringify(todoListObject));
}

function addTodoItem(str){
    const date = new Date();
    if (date.getDay('long') !== document.querySelector('.today').firstElementChild.textContent) setDate();
    const key = date.toISOString();
    todoListObject[key] = str;
    exportTodoList();
    NumberOfPendingTodos += 1;
    setChill();
    setCompletedPercent();
    showTodoItem(key);
}

function showTodoItem(key){
    const parent = document.querySelector('.todo-list.pending');
    const newTodoElement = document.createElement('div');
    newTodoElement.setAttribute('class','todo pending');
    newTodoElement.setAttribute('id',key);
    const newDiv = document.createElement('div');
    const newCheckbox = document.createElement('input');
    newCheckbox.setAttribute('type','checkbox');
    const newSpanElement = document.createElement('span');
    newSpanElement.setAttribute('class','description');
    newSpanElement.textContent = todoListObject[key];
    parent.insertBefore(newTodoElement, parent.firstChild);
    newTodoElement.appendChild(newDiv);
    newDiv.appendChild(newCheckbox);
    newCheckbox.addEventListener('change',()=>{completeTodoItem(key)});
    newDiv.appendChild(newSpanElement);
    addDeleteIcon(key);
    const img = document.querySelector(`.pending [id="${key}"]>div>img`);
    newTodoElement.addEventListener('mouseover',()=>{AddClassName(img,' fade-in');RemoveClassName(img,'hidden')});
    newTodoElement.addEventListener('mouseout',()=>{AddClassName(img,' hidden');RemoveClassName(img,'fade-in')});
}

function showCompletedTodoItem(key){
    const parent = document.querySelector('.todo-list.completed');
    const newTodoElement = document.createElement('div');
    newTodoElement.setAttribute('class','todo completed');
    const newDiv = document.createElement('div');
    const newCheckbox = document.createElement('input');
    newCheckbox.setAttribute('type','checkbox');
    newCheckbox.checked = true;
    const newSpanElement = document.createElement('span');
    newSpanElement.setAttribute('class','description');
    newSpanElement.textContent = completedTodos[key];
    parent.insertBefore(newTodoElement, parent.firstChild);
    newTodoElement.appendChild(newDiv);
    newDiv.appendChild(newCheckbox);
    newDiv.appendChild(newSpanElement);
}

function completeTodoItem(key){
    completedTodos[key] = todoListObject[key];
    removeTodoItem(key);
    showCompletedTodoItem(key);
}

function removeTodoItem(key){
    delete todoListObject[key];
    exportTodoList();
    NumberOfPendingTodos -= 1;
    setChill();
    setCompletedPercent();
    document.querySelector(`.pending [id="${key}"]`).remove();
    setDate();
}

function addDeleteIcon(key){
    const parent = document.querySelector(`.pending [id="${key}"]`);
    const newTrashDiv = document.createElement('div');
    newTrashDiv.setAttribute('class','trash');
    const newTrashImg = document.createElement('img');
    newTrashImg.setAttribute('src','trash-icon.jpg');
    newTrashImg.setAttribute('alt','click image to delete this todo');
    newTrashImg.setAttribute('class','trash hidden');
    newTrashImg.addEventListener('click',()=>{removeTodoItem(key)}); 
    parent.appendChild(newTrashDiv);
    newTrashDiv.appendChild(newTrashImg);
}

function AddClassName(node,str){
    const patt = new RegExp(`(?:^|\\s)${str}(?!\\S)`,'');
    if (!patt.test(node.className)){
        node.className+=' '+str;
    }
}

function RemoveClassName(node,str){
    const patt = new RegExp(`(?:^|\\s)${str}(?!\\S)`,'g');
        node.className = node.className.replace(patt,'').replace(/  /g, ' ').replace(/^ /, '');
}

function ToggleClassName(node,str){
    const patt = new RegExp(`(?:^|\\s)${str}(?!\\S)`,'');
    if (patt.test(node.className)){
        RemoveClassName(node,str);
    }
    else {
        AddClassName(node,str);
    }
}

function showHide(){
    ToggleClassName(document.querySelector('.todo-list.completed'),'none');
    button.value = (button.value === 'Hide Completed') ? 'Show Completed' : 'Hide Completed';
}

function ClearAll(){
    const pending = document.querySelector('.todo-list.pending');
    Object.values(pending.children).map((node)=>removeTodoItem(node.id));
}

function setChill(){
    document.querySelector('.number-of-pending-items').textContent =
        NumberOfPendingTodos === 1 ? 'You have one pending item' : `You have ${NumberOfPendingTodos} pending items`;
        const section = document.querySelector('section.todos');
        const chill = Object.values(document.querySelectorAll('.chill'));
        const footer = document.querySelector('footer');
        if (NumberOfPendingTodos === 0) {
            AddClassName(section,'none');
            AddClassName(footer,'none');
            chill.map(node=>RemoveClassName(node,'none'));
        }
        else {
            RemoveClassName(section,'none');
            RemoveClassName(footer,'none');
            chill.map(node=>AddClassName(node,'none'));
        }
}

function setCompletedPercent(){
    NumberOfCompletedTodos = Object.keys(completedTodos).length;
    completedPercent = (NumberOfCompletedTodos === 0) ? 0 : Math.floor(100*NumberOfCompletedTodos/(NumberOfPendingTodos+NumberOfCompletedTodos));
    completed.textContent = `Completed: ${completedPercent}%`
}

function init(){
    setDate();
    const pending = document.querySelector('.todo-list.pending');
    Object.values(pending.children).map((node)=>node.remove());
    Object.keys(todoListObject).map(key=>showTodoItem(key));
    const completed = document.querySelector('.todo-list.completed');
    Object.values(completed.children).map((node)=>node.remove());
    showHide();
    setChill();
    setCompletedPercent();
    const addButton = document.querySelector('[name~="add"]');
    addButton.addEventListener('click',()=>{
        const input = document.querySelector('[name~="new-todo"]');
        if (input.value !== ''){
            addTodoItem(input.value);
            input.value = '';
        }
        else (addTodoItem('Cook'));
    });
    button.addEventListener('click', showHide);
    clearAllButton.addEventListener('click',ClearAll);
}


const myStorageKey = 'todoList';
let todoListObject = importTodoList();
let NumberOfPendingTodos = Object.keys(todoListObject).length;
const completedTodos = {};
let completedPercent = 0;
const completed = document.querySelector('.completed>header>h4');
const button = document.querySelector('.toggle-completed');
const clearAllButton = document.querySelector('[value="Clear All"]');
init();

