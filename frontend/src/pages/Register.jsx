import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"student" });
  const navigate = useNavigate();

  const submit = async () => {
    await API.post("/auth/register", form);
    navigate("/");
  };

  return (
    <div className="card">
      <h2>Register</h2>
      <input placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})}/>
      <input type="password" placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})}/>
      <select onChange={e=>setForm({...form,role:e.target.value})}>
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={submit}>Register</button>
    </div>
  );
}
