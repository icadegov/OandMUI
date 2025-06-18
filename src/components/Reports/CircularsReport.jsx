import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';  // Assuming you are using react-bootstrap
import { Card } from 'react-bootstrap';
import ReportsService from '../../services/ReportsService';
import ExporttoExcel from '../ExporttoExcel';
import PaginationComponent from '../PaginationComponent';


import PrintableComponents from '../PrintableComponents';


const CircularsReport = () => {
  const [circularsList, setCircularsList] = useState([]);
  const [msg, setMsg] = useState('');
  const [userName, setUserName] = useState('');  // User info state
  const [uploadType, setUploadType] = useState('circular');
  const [errorData, seterrorData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Items per page

  const totalPages = circularsList && Math.ceil(circularsList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = circularsList && circularsList.slice(indexOfFirstItem, indexOfLastItem);
 
  useEffect(() => {
    // Fetch circulars and user info on component mount
    fetchGosCirculars(uploadType);
  }, []);

  

  const fetchGosCirculars = async (type) => {
    setUploadType(type);
    try {
      ReportsService.fetchGosCirculars({
        params: {
          uploadType: type
        }
      }, (response) => {
        setCircularsList(response.data.data);
        seterrorData(null);
      }, (error) => {
        seterrorData("Error fetching data");
        console.log(error);
      })

    } catch (error) {
      console.error('Error fetching circulars:', error);
    }
  };

  // const fetchUserInfo = async () => {
  //   try {
  //     const response = await axios.get('/api/userinfo');  // Replace with actual API
  //     setUserName(response.data.userName);
  //   } catch (error) {
  //     console.error('Error fetching user info:', error);
  //   }
  // };
  const handleDeleteCircular = (goId) => {
    const flag = window.confirm('Are you sure you want to delete this Circular. Click OK to Proceed');
    if (flag) {
      axios
        .post(`/api/deleteCircular/${goId}`, { status: 2, finYear: 0 })
        .then(() => {
          setMsg('Circular deleted successfully!');
          fetchGosCirculars();  // Re-fetch the circular list after deletion
        })
        .catch((error) => {
          console.error('Error deleting circular:', error);
        });
    }
  };
  const formatDate = (dateString, locale = "en-GB") => {
    if (!dateString) return "N/A"; // Handle cases where date is missing or undefined
    return new Date(dateString).toLocaleDateString(locale);
  };

  const reportList=circularsList.map((item,index) => ({ SlNo: index+1, Number: item.goNumber, Date: formatDate(item.goDt), Description: item.goDesc, 
    ...(uploadType === 'go' ? { Amount: item.goAmount=== null ? "" :item.goAmount } : {}) }))


  return (
     <div className='d-flex justify-content-center m-3'>
    
      {msg && (
        <div className="alert alert-success" role="alert">
          {msg}
        </div>
      )}
<br/><br/>

      <Card className="mb-3" style={{ width: '80%' }}>
        <Card.Header  className='Card-header'  as="h5"> Gos/Circulars Report</Card.Header>
        <Card.Body >
{errorData && (
  <div className="alert alert-danger" role="alert">
    {errorData}
  </div>
)}
          <div className="row" >
            <div className="col-md-3">
              <Button
                variant={uploadType === 'circular' ? 'success' : 'outline-success'}
                onClick={() => fetchGosCirculars('circular')}

              >
                View Circulars
              </Button>
            </div>
            <div className="col-md-3">
              <Button
                variant={uploadType === 'go' ? 'info' : 'outline-info'}
                onClick={() => {
                  // setUploadType();
                  fetchGosCirculars('go');
                 }}>
                View GOs
              </Button>
            </div>
            <div className="col-md-3"></div>
            
            <div className="col-md-3 d-flex justify-content-around">

             
              <div><PrintableComponents data={reportList} columns={ reportList.length > 0 ? Object.keys(reportList[0]) : []} type={"json"} header={"GO/Circular Report"}></PrintableComponents></div>
              <div> <ExporttoExcel tableData={reportList}
                fileName="circularReport" ></ExporttoExcel></div>
            </div>

            <div className="mt-3 table-responsive"  id="printTable">
              <table className="table table-striped table-bordered" >
                <thead>
                  <tr style={{ backgroundColor: '#FAF0E6' }}>
                    <th>Sl.No</th>
                    <th> {uploadType === 'go' ? 'GO' : uploadType === 'circular' ? 'Circular' : 'Proceeding'} Number</th>
                    <th> {uploadType === 'go' ? 'GO' : uploadType === 'circular' ? 'Circular' : 'Proceeding'} Date</th>
                    {uploadType === 'go' && (<th> Amount(Rupees)</th>)}
                    <th> {uploadType === 'go' ? 'GO' : uploadType === 'circular' ? 'Circular' : 'Proceeding'} Description</th>
                    {userName === 'ENC_OM' && (
                      <th>Delete  {uploadType === 'go' ? 'GO' : uploadType === 'circular' ? 'Circular' : 'Proceeding'}</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentItems && currentItems.map((item, index) => (
                    <tr key={item.goId}>
                      {/* to get the serial number */}
                      <td style={{ textAlign: 'center' }}>{(currentPage-1)*itemsPerPage + index + 1}</td> 
                      <td style={{ textAlign: 'center' }}>{item.goNumber}</td>
                      <td style={{ textAlign: 'center' }}>{formatDate(item.goDt)}</td>
                      {uploadType === 'go' && (<td> {item.goAmount}</td>)}
                      <td style={{ textAlign: 'center' }}>
                        <a href={`../${item.goUrl}`} target="_blank" rel="noopener noreferrer">
                          {item.goDesc}
                        </a>
                      </td>
                      {userName === 'ENC_OM' && (
                        <td style={{ textAlign: 'center' }}>
                          <Button variant="warning" onClick={() => handleDeleteCircular(item.goId)}>
                            Delete
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        

    
          <div className="d-flex justify-content-center">
              <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage}></PaginationComponent>
            </div>
         
        </Card.Body>
      </Card>
    </div>
  );
};

export default CircularsReport;
