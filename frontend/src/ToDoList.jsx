import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function ToDoList() {
    const [todos, setTodos] = useState([]);
    const [editing, setEditing] = useState(null);
    const [editingText, setEditingText] = useState("");

    useEffect(() => {
        fetch('http://localhost:5000/api/todos')
            .then(res => res.json())
            .then(data => setTodos(data));
    }, []);

    const formik = useFormik({
        initialValues: { title: "" },
        validationSchema: Yup.object({
            title: Yup.string()
                .min(5, "Must be at least 5 characters")
                .required("Required")
        }),
        onSubmit: (values, { resetForm }) => {
            fetch('http://localhost:5000/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: values.title })
            })
                .then(res => res.json())
                .then(newTodo => {
                    setTodos([...todos, newTodo]);
                    resetForm();
                });
        }
    });

    const deleteTodo = (id) => {
        fetch(`http://localhost:5000/api/todos/${id}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(() => {
                setTodos(todos.filter((todo) => todo._id !== id));
            });
    };

    const updateTodo = (id) => {
        fetch(`http://localhost:5000/api/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: editingText }),
        })
            .then(res => res.json())
            .then(updatedTodo => {
                setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
                setEditing(null);
                setEditingText("");
            });
    };

    return (
        <div>
            <h1>TODOLIST</h1>

            <form onSubmit={formik.handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Write some text here..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title}
                />
                <button type="submit">Add</button>
                {formik.touched.title && formik.errors.title ? (
                    <div style={{ color: 'red' }}>{formik.errors.title}</div>
                ) : null}
            </form>

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
                                <button onClick={() => {
                                    setEditing(null);
                                    setEditingText("");
                                }}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span className="text">{todo.title}</span>
                                <button onClick={() => deleteTodo(todo._id)} className="delete-btn">Delete</button>
                                <button onClick={() => {
                                    setEditing(todo._id);
                                    setEditingText(todo.title);
                                }} className="edit-btn">Edit</button>
                            </>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default ToDoList;
