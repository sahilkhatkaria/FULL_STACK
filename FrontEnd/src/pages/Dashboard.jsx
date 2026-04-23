import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import JobModal from '../components/JobModal';
import './Dashboard.css';

const STATUS_OPTIONS = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];

export default function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load jobs
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`jobtracker_jobs_${user.id}`);
      if (stored) setJobs(JSON.parse(stored));
    }
  }, [user]);

  // Save jobs
  const saveJobs = (updatedJobs) => {
    setJobs(updatedJobs);
    localStorage.setItem(`jobtracker_jobs_${user.id}`, JSON.stringify(updatedJobs));
  };

  const handleAddJob = (job) => {
    const newJob = { ...job, id: Date.now().toString(), createdAt: new Date().toISOString() };
    saveJobs([newJob, ...jobs]);
    setShowModal(false);
  };

  const handleUpdateJob = (updatedJob) => {
    const updatedJobs = jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j));
    saveJobs(updatedJobs);
    setShowModal(false);
    setEditingJob(null);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Delete this application?')) {
      saveJobs(jobs.filter((j) => j.id !== jobId));
    }
  };

  const handleStatusChange = (jobId, newStatus) => {
    saveJobs(jobs.map((j) => j.id === jobId ? { ...j, status: newStatus } : j));
  };

  // Stats
  const stats = useMemo(() => {
    const s = { total: jobs.length };
    STATUS_OPTIONS.forEach(opt => s[opt] = jobs.filter(j => j.status === opt).length);
    return s;
  }, [jobs]);

  // Filtered jobs
  const filteredJobs = jobs.filter(j => 
    j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Navbar />
      <main className="dashboard-main">
        <header className="dashboard-hero">
          <h1>My Job Applications</h1>
          <button className="add-job-btn" onClick={() => setShowModal(true)}>+ Add New Job</button>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Jobs</div>
          </div>
          {STATUS_OPTIONS.map(opt => (
            <div key={opt} className="stat-card">
              <div className="stat-number">{stats[opt]}</div>
              <div className="stat-label">{opt}</div>
            </div>
          ))}
        </div>

        <div className="filters-bar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search company or position..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="jobs-grid">
          {filteredJobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-position">{job.position}</div>
              <div className="job-company">{job.company}</div>
              <div className="job-detail">Location: {job.location || 'N/A'}</div>
              <div className="job-detail">Salary: {job.salary || 'N/A'}</div>
              
              <div className="job-card-footer">
                <select 
                  className="status-select"
                  value={job.status}
                  onChange={(e) => handleStatusChange(job.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="job-actions">
                  <button className="job-action-btn" onClick={() => {setEditingJob(job); setShowModal(true);}}>Edit</button>
                  <button className="job-action-btn danger" onClick={() => handleDeleteJob(job.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <JobModal 
          onClose={() => {setShowModal(false); setEditingJob(null);}} 
          onSubmit={editingJob ? handleUpdateJob : handleAddJob}
          initialData={editingJob}
        />
      )}
    </div>
  );
}
