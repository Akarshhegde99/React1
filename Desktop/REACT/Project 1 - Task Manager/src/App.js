import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    // 1. STATE: The heart of React. We use useState to keep track of data that changes.
    // 'todos' is our list of items. 'setTodos' is the function to update it.
    // We initialize it by trying to read from localStorage, or an empty array if nothing is there.
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('react-todo-app-v1');
        if (savedTodos) {
            return JSON.parse(savedTodos);
        } else {
            return [];
        }
    });

    // 'inputValue' tracks what the user is currently typing in the input box.
    const [inputValue, setInputValue] = useState('');

    // 2. EFFECTS: useEffect lets us perform side effects.
    // Here, whenever 'todos' changes, we save the new list to localStorage.
    // This ensures your data persists even if you refresh the page!
    useEffect(() => {
        localStorage.setItem('react-todo-app-v1', JSON.stringify(todos));
    }, [todos]);

    // 3. HANDLERS: Functions to handle user interactions.

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleAddTodo = (e) => {
        e.preventDefault(); // Prevent form submission from reloading the page
        if (!inputValue.trim()) return; // Don't add empty todos

        const newTodo = {
            id: Date.now(), // Unique ID based on timestamp
            text: inputValue,
            completed: false
        };

        // Update state immutably: create a new array with the new item added
        setTodos([...todos, newTodo]);
        setInputValue(''); // Clear input
    };

    const toggleTodo = (id) => {
        // Map through todos and flip the 'completed' status for the matching ID
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        // Filter out the todo with the matching ID
        setTodos(todos.filter(todo => todo.id !== id));
    };

    // Calculate task statistics
    const completedCount = todos.filter(todo => todo.completed).length;
    const totalCount = todos.length;

    // 4. JSX: The UI structure. It looks like HTML but is actually JavaScript.
    return (
        <div className="App">
            <h1>✨ Task Master Pro</h1>
            <p className="subtitle">Organize your tasks efficiently</p>
            
            <div className="task-stats">
                <span className="stat-item">Total: {totalCount}</span>
                <span className="stat-item">Completed: {completedCount}</span>
                <span className="stat-item">Remaining: {totalCount - completedCount}</span>
            </div>

            <form className="todo-form" onSubmit={handleAddTodo}>
                <input
                    type="text"
                    className="todo-input"
                    placeholder="What needs to be done?"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button type="submit" className="todo-btn">Add</button>
            </form>

            <ul className="todo-list">
                {todos.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No tasks yet. Add one above!
                    </p>
                )}

                {todos.map(todo => (
                    <li key={todo.id} className="todo-item">
                        <div className="todo-content" onClick={() => toggleTodo(todo.id)}>
                            {/* Conditional rendering for the checkmark */}
                            <span style={{
                                fontSize: '1.2rem',
                                opacity: todo.completed ? 1 : 0.3
                            }}>
                                {todo.completed ? '🟣' : '⚪'}
                            </span>
                            <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                                {todo.text}
                            </span>
                        </div>
                        <button
                            className="delete-btn"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the toggle click
                                deleteTodo(todo.id);
                            }}
                        >
                            🗑️
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;