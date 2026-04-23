import { useState, useEffect } from 'react';
import './JobModal.css';

const STATUS_OPTIONS = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];

export default function JobModal({ onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    salary: '',
    status: 'Applied',
    notes: '',
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{initialData ? 'Edit Job' : 'Add New Job'}</h2>
          <button onClick={onClose}>X</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input name="company" placeholder="Company Name" className="modal-input" value={formData.company} onChange={handleChange} required />
          <input name="position" placeholder="Job Position" className="modal-input" value={formData.position} onChange={handleChange} required />
          <input name="location" placeholder="Location" className="modal-input" value={formData.location} onChange={handleChange} />
          <input name="salary" placeholder="Salary Range" className="modal-input" value={formData.salary} onChange={handleChange} />
          
          <select name="status" className="modal-input" value={formData.status} onChange={handleChange}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <div className="modal-actions">
            <button type="button" className="modal-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-btn-submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
