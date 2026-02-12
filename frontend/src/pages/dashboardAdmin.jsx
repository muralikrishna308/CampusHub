import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard(){
  const { user, token, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if (!token) return;
    setLoading(true);
    fetch(`${process.env.REACT_APP_API || 'http://localhost:5000'}/api/dashboard/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(()=>setStats(null))
      .finally(()=>setLoading(false));
  }, [token]);

  return (
    <div style={{padding:24}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h1>Admin Dashboard</h1>
          <div style={{color:'#666'}}>{user?.name || user?.email} — {user?.role}</div>
        </div>
        <div>
          <button onClick={logout}>Sign out</button>
        </div>
      </div>

      {loading && <p>Loading stats…</p>}

      {stats && (
        <div style={{marginTop:20}}>
          <div style={{display:'flex', gap:12, marginBottom:16}}>
            <Card title="Total Events" value={stats.totalEvents} />
            <Card title="Active Events" value={stats.activeEvents} />
            <Card title="Total Registrations" value={stats.totalRegistrations} />
            <Card title="Avg Participants" value={stats.avgParticipants} />
          </div>

          <div style={{display:'flex', gap:16}}>
            <div style={{flex:2, background:'#fff', padding:16, borderRadius:8}}>
              <h3>Recent Events</h3>
              {stats.recentEvents.length===0 && <p>No recent events</p>}
              <ul>
                {stats.recentEvents.map(ev=> (
                  <li key={ev._id} style={{padding:'8px 0', borderBottom:'1px solid #eee'}}>
                    <strong>{ev.title}</strong> — {ev.participants} participants — {ev.active? 'Active': 'Inactive'}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{flex:1, background:'#fff', padding:16, borderRadius:8}}>
              <h3>Quick Actions</h3>
              <button style={{width:'100%', padding:10, marginBottom:8}}>Create New Event</button>
              <button style={{width:'100%', padding:10}}>Export Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Card({title, value}){
  return (
    <div style={{background:'#fff', padding:16, borderRadius:8, minWidth:160}}>
      <div style={{color:'#888', fontSize:13}}>{title}</div>
      <div style={{fontSize:22, fontWeight:600}}>{value}</div>
    </div>
  )
}

