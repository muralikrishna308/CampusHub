import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/auth/admin");
        setMessage(res.data.message);
      } catch {
        logout();
      }
    };
    fetchData();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>👨‍💼 Admin Dashboard</h2>
        <p>{message}</p>
        <p><strong>Role:</strong> Admin</p>
        <button onClick={logout} style={styles.button}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8f9fa"
  },
  card: {
    width: "400px",
    padding: "30px",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    textAlign: "center"
  },
  button: {
    marginTop: "20px",
    padding: "10px",
    width: "100%",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};
