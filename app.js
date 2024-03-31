//call the style sheet


const dbManager = new IndexedDBManager('todoDB', 'todos');
window.onload = () => {
    dbManager.init().catch(error => {
        console.error('IndexedDB initialization failed:', error);
    });
};

document.getElementById('todo-form').addEventListener('submit', event => {
    event.preventDefault();
    const newTodoInput = document.getElementById('new-todo');
    const text = newTodoInput.value.trim();
    if (text) {
        addTodo(text);
        newTodoInput.value = '';
    }
});

async function addTodo(text) {
    try {
        await dbManager.add({ text });
        refreshTodoList();
    } catch (error) {
        console.error('Failed to add todo:', error);
    }
    //provide feedback after the user adds a todo
    alert(text + ' added successfully!');
}

async function refreshTodoList() {
    try {
        const todos = await dbManager.getAll();
        renderTodos(todos);
    } catch (error) {
        console.error('Failed to refresh todo list:', error);
    }
}

async function deleteTodo(todo) {


    try {
        await dbManager.delete(todo.id);
        refreshTodoList();
    } catch (error) {
        console.error('Failed to delete todo:', error);
    }
    alert(todo.text + ' deleted successfully!');


}

async function toggleTodoComplete(todo){
    try {
        await dbManager.update({todo});
        refreshTodoList();
    } catch (error) {
        console.error('Failed to toggle todo complete:', error);
    }
    alert(todo.text + ' marked as complete!');   
 
}

async function editTodo(todo,updatedText,){
    //let the item as before if the user cancels the prompt
    if (!updatedText) {
        return;
    }
    try {
        await dbManager.update(todo.id, {text: updatedText});
        refreshTodoList();
    } catch (error) {
        console.error('Failed to edit todo:', error);
    }
    alert(todo.text + ' edited successfully to ' + updatedText + '!');

}

function renderTodos(todos) {
    
    const listElement = document.getElementById('todo-list');
    listElement.innerHTML = ''; 
    todos.forEach(todo => {        
        // button for add todo
        const li = document.createElement('li');
        li.textContent = todo.text;
        listElement.appendChild(li);
        //button for delete todo
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTodo(todo);
        li.appendChild(deleteButton);
    
        deleteButton.style.backgroundColor = 'red';
        deleteButton.style.color = 'white';
        deleteButton.style.marginLeft = '80%';
        deleteButton.style.marginTop = '10px';
        deleteButton.style.position = 'absolute';
      
        //button for edit todo
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editTodo(todo, prompt('Edit todo', todo.text));
        li.appendChild(editButton);

        editButton.style.backgroundColor = 'blue';
        editButton.style.color = 'white';
        editButton.style.marginLeft = '90%';
        editButton.style.marginTop = '10px';
        editButton.style.position = 'absolute';
        //use a checkbox for the toggle function
        const toggleButton = document.createElement('input');
        toggleButton.type = 'checkbox';
        toggleButton.onclick = () => toggleTodoComplete(todo);
    
        toggleButton.style.marginLeft = '70%';
        toggleButton.style.marginTop = '10px';
        toggleButton.style.position = 'absolute';
        toggleButton.style.width = '100px';
        li.appendChild(toggleButton);
        
       
    });
} 