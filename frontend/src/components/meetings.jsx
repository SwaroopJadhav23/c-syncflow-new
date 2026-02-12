import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Meetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        appPassword: '',
        host: 'imap.gmail.com'
    });

    // 1. Fetch saved meetings from the database on load
    const fetchMeetings = async () => {
        try {
            const token = localStorage.getItem('token'); // Assumes you store your JWT here
            const res = await axios.get('http://localhost:5000/api/sync/list', {
                headers: { 'x-auth-token': token }
            });
            setMeetings(res.data);
        } catch (err) {
            console.error("Error fetching meetings", err);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    // 2. Handle the "Sync" button click
    const handleSync = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/sync/imap-sync', formData, {
                headers: { 'x-auth-token': token }
            });
            alert(res.data.msg);
            fetchMeetings(); // Refresh list after sync
        } catch (err) {
            alert("Sync failed. Check console for details.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>SyncFlow Meeting Dashboard</h2>

            {/* Sync Form */}
            <form onSubmit={handleSync} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
                <h3>Sync New Meetings</h3>
                <input 
                    type="email" placeholder="Email" required 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                />
                <input 
                    type="password" placeholder="App Password" required 
                    onChange={e => setFormData({...formData, appPassword: e.target.value})} 
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Syncing...' : 'Start IMAP Sync'}
                </button>
            </form>

            {/* Meeting List */}
            <h3>Your Synced Meetings</h3>
            {meetings.length === 0 ? <p>No meetings found. Try syncing!</p> : (
                <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left' }}>
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>From</th>
                            <th>Date Received</th>
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meetings.map(m => (
                            <tr key={m._id}>
                                <td>{m.subject}</td>
                                <td>{m.sender}</td>
                                <td>{new Date(m.receivedDate).toLocaleString()}</td>
                                <td>
                                    {m.meetingLink ? (
                                        <a href={m.meetingLink} target="_blank" rel="noreferrer">Join Meeting</a>
                                    ) : 'No Link Found'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Meetings;