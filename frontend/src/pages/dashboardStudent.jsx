import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function StudentDashboard(){
  const { user, token, logout } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if (!token) return;
    setLoading(true);
    fetch(`${process.env.REACT_APP_API || 'http://localhost:5000'}/api/dashboard/user`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(d => setData(d))
      .catch(()=>setData(null))
      .finally(()=>setLoading(false));
  }, [token]);

  return (
    <div style={{padding:24}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h1>Student Dashboard</h1>
          <div style={{color:'#666'}}>{user?.name || user?.email}</div>
        </div>
        <div>
          <button onClick={logout}>Sign out</button>
        </div>
      </div>

      {loading && <p>Loading…</p>}

      {data && (
        <div style={{marginTop:20}}>
          <div style={{display:'flex', gap:12, marginBottom:16}}>
            <SmallCard title="My Registrations" value={data.myRegistrations.length} />
            <SmallCard title="Upcoming Events" value={data.upcomingEvents.length} />
          </div>

          <div style={{display:'flex', gap:16}}>
            <div style={{flex:2, background:'#fff', padding:16, borderRadius:8}}>
              <h3>My Registrations</h3>
              {data.myRegistrations.length===0 && <p>No registrations yet</p>}
              <ul>
                {data.myRegistrations.map(r=> (
                  <li key={r._id} style={{padding:'8px 0', borderBottom:'1px solid #eee'}}>
                    <strong>{r.event?.title}</strong> — {new Date(r.event?.date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{flex:1, background:'#fff', padding:16, borderRadius:8}}>
              <h3>Upcoming Events</h3>
              <ul>
                {data.upcomingEvents.map(ev=> (
                  <li key={ev._id} style={{padding:'8px 0', borderBottom:'1px solid #eee'}}>
                    <strong>{ev.title}</strong>
                    <div style={{fontSize:12, color:'#666'}}>{new Date(ev.date).toLocaleDateString()}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SmallCard({title, value}){
  return (
    <div style={{background:'#fff', padding:12, borderRadius:8, minWidth:140}}>
      <div style={{color:'#888', fontSize:12}}>{title}</div>
      <div style={{fontSize:18, fontWeight:600}}>{value}</div>
    </div>
  )
}

