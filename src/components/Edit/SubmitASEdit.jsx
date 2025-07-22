import React, { useState , useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Form, Row, Table, Alert, Card, Col } from 'react-bootstrap';
import { FinancialYearOptions } from '../Entry/FinancialYearOptions';
import AdminSanctionService from '../../services/AdminSanctionService';
import { ViewFile} from '../Reports/ViewFile';

function SubmitASEdit() {
  const location = useLocation();
  const { workData } = location.state || {};

 
  const [selectedYear, setSelectedYear] = useState(workData?.data?.financialYear || '');

useEffect(() => {
  if (selectedYear) {
    handleYearChange(selectedYear);
  }
}, [selectedYear]);

const handleYearChange = (year) => {
  setSelectedYear(year);
  setAsEdit(prev => ({
    ...prev,
    financialYear: year
  }));
};

const viewFile = (filePath) => {
    ViewFile(filePath);
  };

  const [submitStatus, setSubmitStatus] = useState({ success: '', error: '' });

  const [asEdit, setAsEdit] = useState({
    workId: workData?.data?.workId || '',
    workName: workData?.data?.workName || '',
    hoaId: workData?.data?.hoaId || '',
    approvedById: workData?.data?.approvedById || '',
    referenceNo: workData?.data?.referenceNumber || '',
    adminAmt: workData?.data?.adminSanctionAmt || '',
    referenceDate: workData?.data?.referenceDate || '',
    adminSancUrl: workData?.data?.aaFileUrl || '',
    workTypeId: workData?.data?.workTypeId || ''
  });

  const [file, setFile] = useState(null);

 const handleChange = (e) => {
  const { name, value, type } = e.target;
  if (type === 'file') {
    setFile(e.target.files[0]);
  } else {
    setAsEdit((prev) => ({
      ...prev,
      [name]: value
    }));
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("workId", asEdit.workId);
    formData.append("workName", asEdit.workName);
    formData.append("hoaId", asEdit.hoaId);
    formData.append("approvedById", asEdit.approvedById);
    formData.append("referenceNumber", asEdit.referenceNo);
    formData.append("adminSanctionAmt", asEdit.adminAmt);
    formData.append("referenceDate", asEdit.referenceDate);
    formData.append("financialYear", selectedYear);
    formData.append("workTypeId", asEdit.workTypeId);
    formData.append("aaFileUrl", asEdit.adminSancUrl);

    if (file) {
      formData.append("adminFileUrl", file);
    }
for (let [key, value] of formData.entries()) {
  console.log(`${key}:`, value);
}
    AdminSanctionService.updateAdminSanction(
      formData,
      (response) => {
        setSubmitStatus({ success: response.data.message, error: '' });
      },
      (error) => {
        console.error(error);
        setSubmitStatus({ success: '', error: 'Submission failed. Please try again.' });
      }
    );
  };

  if (!workData) {
    return <Alert variant="danger">No data available to edit.</Alert>;
  }

  return (
    <div className="d-flex justify-content-center m-3">
      <Card className="mb-3" style={{ width: '80%' }}>
        <Card.Header className="Card-header">Edit Administrative Sanctions</Card.Header>
        <Card.Body>
          {submitStatus.success && <Alert variant="success">{submitStatus.success}</Alert>}
          {submitStatus.error && <Alert variant="danger">{submitStatus.error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Table bordered striped>
                <thead>
                  <tr>
                    <th>Financial Year</th>
                    <th>Work Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>   <FinancialYearOptions key={selectedYear || 'default'} selectedYearFromChild={handleYearChange} selectedYear={selectedYear}/>
                    </td>
                    <td>
                      <Form.Control  as="select"  name="workTypeId" value={asEdit.workTypeId}  onChange={handleChange}  disabled >
                        <option value="1">Project</option>
                        <option value="2">Tanks/Minor Irrigation</option>
                        <option value="3">Lift Irrigation</option>
                        <option value="4">Small LIS</option>
                        <option value="5">Flood Banks</option>
                        <option value="6">Camps & Buildings</option>
                      </Form.Control>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Row>

            <Row className="mb-3">
              <Table bordered striped>
                <thead>
                  <tr>
                    <th>Name of the Work</th>
                    <th>Head of Account</th>
                    <th>Approved by</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Form.Control
                        type="text"
                        name="workName"
                        value={asEdit.workName}
                        onChange={handleChange}
                        required
                      />
                    </td>
                    <td>
                      <Form.Control
                        as="select"
                        name="hoaId"
                        value={asEdit.hoaId}
                        onChange={handleChange}
                      >
                        <option value="1">2700-01-800-00-26-270-272</option>
                        <option value="2">2700-01-800-00-27-270-272</option>
                        <option value="3">2700-01-800-00-05-270-272</option>
                      </Form.Control>
                    </td>
                    <td>
                       
                      <Form.Control
                        as="select"
                        name="approvedById"
                        value={asEdit.approvedById}
                        onChange={handleChange}
                      >
                        <option value="1">GOVERNMENT SANCTIONS</option>
                        <option value="2">O & M COMMITTEE</option>
                        <option value="3">CHIEF ENGINEER</option>
                        <option value="4">SUPERINTENDING ENGINEER</option>
                        <option value="5">EXECUTIVE ENGINEER</option>
                        <option value="6">DEPUTY EXECUTIVE ENGINEER</option>
                      </Form.Control>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Row>

            <Row className="mb-3">
              <Table bordered striped>
                <thead>
                  <tr>
                    <th>Admin Sanction Amount (In Rupees)</th>
                    <th>Reference Number</th>
                    <th>Date</th>
                    <th>Modify Admin Sanction Copy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Form.Control
                        type="text"
                        name="adminAmt"
                        value={asEdit.adminAmt}
                        onChange={handleChange}
                        required
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        name="referenceNo"
                        value={asEdit.referenceNo}
                        onChange={handleChange}
                        required
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="date"
                        name="referenceDate"
                        value={asEdit.referenceDate}
                        onChange={handleChange}
                        required
                      />
                    </td>
                    <td><Button variant="link" className='w-50 m-0' onClick={() => viewFile(asEdit.adminSancUrl)} >  View Existing File   </Button>
                      {/* <a href={asEdit.adminSancUrl} target="_blank" rel="noopener noreferrer">  View Existing File</a> */}
                      <Form.Control type="file" name="adminSancUrl"  onChange={handleChange} />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Row>

            <Row>
              <Col xs={12} sm={12} className="text-center">
                <Button type="submit" variant="primary">Submit</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default SubmitASEdit;
