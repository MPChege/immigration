import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Documents.css';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    document_name: '',
    document_type: 'other',
    file: null,
    description: '',
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/api/documents/');
      setDocuments(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('document_name', formData.document_name);
    formDataToSend.append('document_type', formData.document_type);
    formDataToSend.append('file_path', formData.file);
    formDataToSend.append('description', formData.description);

    try {
      await axios.post('/api/documents/', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowForm(false);
      setFormData({ document_name: '', document_type: 'other', file: null, description: '' });
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Error uploading document');
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'file') {
      setFormData({ ...formData, file: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>My Documents</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : 'Upload Document'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2>Upload Document</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Document Name</label>
              <input
                type="text"
                name="document_name"
                value={formData.document_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Document Type</label>
              <select
                name="document_type"
                value={formData.document_type}
                onChange={handleChange}
                required
              >
                <option value="contract">Contract</option>
                <option value="invoice">Invoice</option>
                <option value="insurance">Insurance</option>
                <option value="passport">Passport</option>
                <option value="visa">Visa</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>File</label>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">Upload</button>
          </form>
        </div>
      )}

      <div className="card">
        <h2>All Documents</h2>
        {documents.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Type</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.document_name}</td>
                  <td>{doc.document_type}</td>
                  <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                  <td>
                    {doc.file_url && (
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                        View
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No documents found. Upload your first document above.</p>
        )}
      </div>
    </div>
  );
};

export default Documents;
