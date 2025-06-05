import {useEffect, useState} from "react";

function ToDoList() {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");
    const [editing, setEditing] = useState(null);
    const [editingText, setEditingText] = useState("");
    useEffect(() => {
        fetch('http://localhost:5000/api/todos')
            .then(res => res.json())
            .then(data => setTodos(data))
    }, [])

    const addTodo = () => {
        fetch('http://localhost:5000/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title: text}),
        })
            .then(res => res.json())
            .then(newTodo => {
                setTodos([...todos, newTodo]);
                setText("")
            });
    }
    const deleteTodo = (id) => {
        fetch(`http://localhost:5000/api/todos/${id}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(() => {
                setTodos(todos.filter((todo) => todo._id !== id))
            })
    }
    const updateTodo = (id) => {
        fetch(`http://localhost:5000/api/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title: editingText}),
        }).then(res => res.json()).then((updateTodo) => {
            setTodos(todos.map(todo => todo._id === id ? updateTodo : todo))
            setEditing(null)
            setEditingText("")
        })
    }


    return (
        <div>
            <h1>TODOLIST</h1>
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write some text here..."
            />
            <button onClick={addTodo}>Add</button>
            <ol>
                {todos.map((todo) => (
                    <li key={todo._id}>
                        {editing === todo._id ? (
                            <>
                                <input
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                />
                                <button onClick={() => updateTodo(todo._id)}>Save</button>
                                <button onClick={() => { setEditing(null); setEditingText(""); }}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span className='text'>{todo.title}</span>
                                <button onClick={() => deleteTodo(todo._id)} className='delete-btn'>Delete</button>
                                <button onClick={() => {
                                    setEditing(todo._id);
                                    setEditingText(todo.title);
                                }} className='edit-btn'>Edit</button>
                            </>
                        )}

                    </li>
                ))}
            </ol>
        </div>
    )
}

export default ToDoList