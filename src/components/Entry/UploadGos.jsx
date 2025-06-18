import React, { useState } from 'react';
import { Row, Col, Alert, Card, Button } from 'react-bootstrap';
import UploadGOsService from '../../services/UploadGOsService';

const UploadGos = () => {
  const [uploadType, setUploadType] = useState('');
  const [goNumber, setGoNumber] = useState('');
  const [goDate, setGoDate] = useState('');
  const [goAmount, setGoAmount] = useState('');
  const [goDesc, setGoDesc] = useState('');
  const [goFileUrl, setGoFileUrl] = useState(null);
  const [financialYear, setFinancialYear] = useState('');
  const [msg, setMsg] = useState('');
  const [message, setMessage] = useState('');
  const [errormsg, setErrormsg] = useState('');

  const finYearList = [
    { key: '2023-2024', value: '2024' },
    { key: '2024-2025', value: '2025' },
    { key: '2025-2026', value: '2026' },
  ];

  const handleUploadTypeChange = (e) => setUploadType(e.target.value);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      setMsg('Please upload a valid .pdf file');
      setGoFileUrl(null);
    } else {
      setMsg('');
      setGoFileUrl(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goNumber || !goDate || !goDesc || !goFileUrl) {
      setMsg('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('goNumber', goNumber);
    formData.append('goDate', goDate);
    formData.append('goDesc', goDesc);
    formData.append('goFileUrl', goFileUrl);
    formData.append('uploadType', uploadType);
    formData.append('goAmount', goAmount);

    UploadGOsService.saveAllGOsCirculars(formData, handleResponse, handleError);
  };

  const handleResponse = (response) => {
    setMessage(response.data.message);
    setErrormsg('');
    resetForm();
  };

  const handleError = (error) => {
    setErrormsg('Error: ' + error.response?.data?.message || 'Something went wrong');
    setMessage('');
  };

  const resetForm = () => {
    setUploadType('');
    setGoNumber('');
    setGoDate('');
    setGoAmount('');
    setGoDesc('');
    setGoFileUrl(null);
    setFinancialYear('');
  };

  return (
    <div className='d-flex justify-content-center m-3'>
      <Card className="mb-2" style={{ width: '80%' }}>
        {message && <Alert variant="success" className='m-3'>{message}</Alert>}
        {errormsg && <Alert variant="danger">{errormsg}</Alert>}
        <Card.Header style={{ backgroundColor: '#00458b', color: 'white' }}>Upload O&M GOs/Circulars</Card.Header>
        <Card.Body>
          {msg && <div style={{ color: 'red' }}>{msg}</div>}
          <form onSubmit={handleSubmit}>
            <Row className="mb-2">
              <Col xs={12} sm={4}><label><b>Select Upload Type</b></label></Col>
              <Col xs={12} sm={8}>
                <select className="form-control" value={uploadType} onChange={handleUploadTypeChange} required>
                  <option value="">--Select--</option>
                  <option value="go">GOs</option>
                  <option value="circular">Circulars</option>
                  <option value="proceeding">O & M Committee Proceedings</option>
                </select>
              </Col>
            </Row>

        {uploadType && (
          <div>
            {/* Financial Year */}
            {uploadType === 'proceeding' && (
              <Row className="mb-2">
                <Col xs={12} sm={4} className="d-flex align-items-center">
                  <label><b>Financial Year</b></label>
                </Col>
                <Col xs={12} sm={8}>
                  <select
                    className="form-control"
                    value={financialYear}
                    onChange={(e) => setFinancialYear(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    {finYearList.map((f) => (
                      <option key={f.key} value={f.key}>
                        {f.value}
                      </option>
                    ))}
                  </select>
                </Col>
              </Row>
            )}

            {/* GO/Circular/Proceeding Number */}
            <Row className="mb-2">
              <Col xs={12} sm={4} className="d-flex align-items-center">
                <label><b>{uploadType === 'go' ? 'GO' : uploadType === 'circular' ? 'Circular' : 'Proceeding'} Number</b></label>
              </Col>
              <Col xs={12} sm={8}>
                <input
                  type="text"
                  className="form-control"
                  value={goNumber}
                  onChange={(e) => setGoNumber(e.target.value)}
                  required
                />
              </Col>
            </Row>

            {/* GO/Circular/Proceeding Date */}
            <Row className="mb-2">
              <Col xs={12} sm={4} className="d-flex align-items-center">
                <label><b>{uploadType === 'go' ? 'GO' : uploadType === 'circular' ? 'Circular' : 'Proceeding'} Date</b></label>
              </Col>
              <Col xs={12} sm={8}>
                <input
                  type="date"
                  className="form-control"
                  value={goDate}
                  onChange={(e) => setGoDate(e.target.value)}
                  required
                />
              </Col>
            </Row>

            {/* GO Amount (only for GO) */}
            {uploadType === 'go' && (
              <Row className="mb-2">
                <Col xs={12} sm={4} className="d-flex align-items-center">
                  <label><b>GO Amount</b></label>
                </Col>
                <Col xs={12} sm={8}>
                  <input
                    type="number"
                    className="form-control"
                    value={goAmount}
                    onChange={(e) => setGoAmount(e.target.value)}
                    required
                  />
                </Col>
              </Row>
            )}

            {/* Description */}
            <Row className="mb-2">
              <Col xs={12} sm={4} className="d-flex align-items-center">
                <label><b>{uploadType === 'go' ? 'GO' : uploadType === 'circular' ? 'Circular' : 'Proceeding'} Description</b></label>
              </Col>
              <Col xs={12} sm={8}>
                <textarea
                  className="form-control"
                  rows="4"
                  value={goDesc}
                  onChange={(e) => setGoDesc(e.target.value)}
                  required
                />
              </Col>
            </Row>

            {/* File Upload */}
            <Row className="mb-2">
              <Col xs={12} sm={4} className="d-flex align-items-center">
                <label><b>Select File (PDF format)</b></label>
              </Col>
              <Col xs={12} sm={8}>
                <input
                  type="file"
                  name= "goFileUrl"
                  className="form-control"
                  onChange={handleFileChange}
                  accept=".pdf"
                  required
                />
              </Col>
            </Row>

            {/* Submit Button */}
            <Row>
              <Col xs={12} sm={12} className="text-center">
                <Button type="submit" variant="primary">
                  Submit
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </form>
      </Card.Body>
      </Card>
    </div>
  );
};

export default UploadGos;
