import React, { useState, useEffect } from 'react';
import { Card } from "react-bootstrap";
import ReportsService from '../../../services/ReportsService';

const colorMapping = {
  "2021": "success",
  "2022": "secondary",
  "2023": "primary",
  "2024": "warning",
  "2025": "danger",
  // You can add more mappings if needed
};


const YearWiseReport = () => {

  const [reportData, setReportData] = useState([]);
  const [errorData, setErrorData] = useState(null);


    useEffect(() => {
      // Replace with your actual API call
      ReportsService.fetchYearWiseReport(
        // {
        //   params: {
        //     unitId: 9813,
        //     circleId: 21574,
        //     divisionId: 30994,
        //     subDivisionId: 11751,
        //     finyear: 2024,
        //   },
        // },
        (response) => {
       //   console.log("response in YearWise " +response.data.data);
          setReportData(response.data.data);
          setErrorData(null);
             //   console.log(response);
        },
        (error) => {
          setErrorData('Error fetching data');
          console.log(error);
        }
      );
    }, []); 


//   return (
//     <Card className="mb-3">
//       <Card.Body>
//         <div className="d-flex justify-content-between align-items-start mb-5">
//           <div>
//             <h3 className="fw-medium mb-0">Year Wise (Total Works- Amount)</h3>
            
//           </div>
        
//         </div>
        
//         <ul className="list-group">
//           {activities.map((activity, index) => (
//             <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
//               <div className="d-flex align-items-center">
//                 <div
//                   className={`rounded-circle me-2 bg-${activity.color} p-2`}
//                   style={{ width: 10, height: 10 }}
//                 />
//                 <div>
//                   <span className="fw-bold">{activity.time}</span> - {activity.text}
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </Card.Body>
//     </Card>
//   );
// };

return (
  <Card className="mb-3">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-start mb-5">
        <div>
          <h5 className="fw-medium mb-0">Year Wise (Total Works- Amount)</h5>
        </div>
      </div>

      {/* {errorData && <div className="alert alert-danger">{errorData}</div>} */}

      {/* If there's no data, show a loading message */}
      {reportData.length === 0 ? (
        <p>Loading data...</p>
      ) : (
        <ul className="list-group">
          {reportData.map((item, index) => {
            // Determine the color based on the financialYear (or fallback to 'primary')
            const color = colorMapping[item.financialYear] || 'primary';

            return (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div
                    className={`rounded-circle me-2 bg-${color} p-2`} 
                    style={{ width: 10, height: 10 }}
                  />
                  <div>
                    <span className="fw-bold">{item.finYear} - </span>{item.longWorkId} - {item.adminSanctionAmt.toFixed(2)} 
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card.Body>
  </Card>
);

};

export default YearWiseReport;
