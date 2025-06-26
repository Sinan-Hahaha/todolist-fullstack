import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      fetchTodos();
    }
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/todos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(res.data);
    } catch (err) {
      alert('Görevler alınamadı.');
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await axios.post('http://localhost:3001/todos', { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos([...todos, res.data]);
      setText('');
    } catch (err) {
      alert('Görev eklenemedi.');
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.put(`http://localhost:3001/todos/${id}`, { completed: completed ? 0 : 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTodos();
    } catch (err) {
      alert('Güncelleme başarısız.');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      alert('Silinemedi.');
    }
  };

  const editTodo = async (id) => {
    if (!editText.trim()) return;

    try {
      await axios.put(`http://localhost:3001/todos/${id}`, { text: editText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      setEditText('');
      fetchTodos();
    } catch (err) {
      alert('Düzenleme başarısız.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Görev Listesi</h2>
        <form onSubmit={addTodo} style={styles.form}>
          <input
            type="text"
            placeholder="Yeni görev yaz..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Ekle</button>
        </form>

        <ul style={styles.list}>
          {todos.map((todo) => (
            <li key={todo.id} style={styles.todoItem}>
              <input
                type="checkbox"
                checked={!!todo.completed}
                onChange={() => toggleComplete(todo.id, todo.completed)}
              />
              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={styles.inputSmall}
                  />
                  <button onClick={() => editTodo(todo.id)} style={styles.smallButton}>Kaydet</button>
                  <button onClick={() => setEditingId(null)} style={styles.smallButton}>İptal</button>
                </>
              ) : (
                <>
                  <span style={{
                    ...styles.todoText,
                    textDecoration: todo.completed ? 'line-through' : 'none'
                  }}>
                    {todo.text}
                  </span>
                  <button onClick={() => {
                    setEditingId(todo.id);
                    setEditText(todo.text);
                  }} style={styles.smallButton}>
                    Düzenle
                  </button>
                  <button onClick={() => deleteTodo(todo.id)} style={styles.smallButton}>
                    Sil
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>

        <button onClick={handleLogout} style={styles.logoutButton}>🚪 Çıkış yap</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#e0f7fa',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '40px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    width: '90%',
    maxWidth: '600px',
  },
  title: {
    marginBottom: '20px',
    color: '#00796b',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  inputSmall: {
    padding: '5px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginLeft: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#00796b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  smallButton: {
    marginLeft: '10px',
    padding: '5px 10px',
    backgroundColor: '#00796b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  list: {
    listStyle: 'none',
    paddingLeft: 0,
  },
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  todoText: {
    marginLeft: '10px',
    flex: 1,
  },
  logoutButton: {
    marginTop: '20px',
    width: '100%',
    backgroundColor: '#d32f2f',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  }
};

export default TodoPage;
