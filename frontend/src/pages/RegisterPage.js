import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3001/auth/signup', { email, password });
      alert('✅ Kayıt başarılı! Şimdi giriş yapabilirsin.');
      navigate('/');
    } catch (err) {
      alert('❌ Bu e-posta zaten kullanılıyor.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Kayıt Ol</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="email"
            placeholder="E-posta adresin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Şifren"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Kayıt Ol</button>
        </form>
        <p style={styles.text}>
          Zaten hesabın var mı? <Link to="/" style={styles.link}>Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#e0f7fa',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    minWidth: '300px'
  },
  title: {
    marginBottom: '20px',
    color: '#00796b',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
  },
  button: {
    padding: '12px',
    marginTop: '10px',
    backgroundColor: '#00796b',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  text: {
    marginTop: '15px',
    fontSize: '14px',
  },
  link: {
    color: '#00796b',
    textDecoration: 'underline',
  }
};

export default RegisterPage;
