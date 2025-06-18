import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap"; // Using react-bootstrap components
import Chart from 'react-apexcharts';
import ReportsService from '../../../services/ReportsService';

const WorksOverview = () => {
  const [reportData, setReportData] = useState([]); 
  //const [errorData, setErrorData] = useState(null); 

  const detailsoverview = {
    grid: {
      show: true,
      borderColor: "transparent",
      strokeDashArray: 2,
      padding: {
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "68%",
        endingShape: "rounded",
        borderRadius: 5,
      },
    },
    colors: ["#1e4db7", "#a7e3f4", "#1e9ab7"],
    fill: {
      type: "solid",
      opacity: 1,
    },
    chart: {
      offsetX: -15,
      toolbar: {
        show: false,
      },
      foreColor: "#adb0bb",
      fontFamily: "'DM Sans',sans-serif",
      sparkline: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    legend: {
      show: false,
    },
    xaxis: {
      type: "category",
      categories: [
        "2020-21",
        "2021-22",
        "2022-23",
        "2023-24",
        "2024-25",
      ],
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    yaxis: {
      show: true,
      min: 20,
      max: 2000,
      tickAmount: 4,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    tooltip: {
      theme: "dark",
    },
  };

  // Fetch data when the component mounts
  useEffect(() => {
    ReportsService.fetchWorkOverViewReport(
      {
        params: {
          unitId: 9813,
          circleId: 21574,
          divisionId: 30994,
          subDivisionId: 11751,
          finyear: 2024,
        },
      },
      (response) => {
       
        const data = response.data.data;
        
        // Extracting the data for the chart
        const adminSanctionData = data.map(item => item.adminCount);
        const technicalSanctionData = data.map(item => item.techCount);
        const agreementsData = data.map(item => item.agreementCount);


        //console.log("adminSanctionData "+adminSanctionData + " technicalSanctionData "+technicalSanctionData + " agreementsData"+agreementsData);

        setReportData(data);
        setSeries([
          {
            name: "Admin Sanction",
            data: adminSanctionData,
          },
          {
            name: "Technical Sanction",
            data: technicalSanctionData,
          },
          {
            name: "Agreements",
            data: agreementsData,
          },
        ]);
      //  setErrorData(null); // Clear error if the fetch is successful
      },
      (error) => {
       //setErrorData('Error fetching data');
        console.log(error);
      }
    );
  }, []);

  // Data for chart
  const [series, setSeries] = useState([
    {
      name: "Admin Sanction",
      data: [],
    },
    {
      name: "Technical Sanction",
      data: [],
    },
    {
      name: "Agreements",
      data: [],
    },
  ]);

  return (
    <Card className="mb-3">
      <Card.Body>
        <Row className="mb-4">
          <Col>
            <h5>O&M Work Details Overview</h5>
          </Col>
          <Col className="text-end">
            <Row className="d-flex align-items-center">
              <Col>
                <span
                  style={{
                    backgroundColor: "#1e4db7",
                    borderRadius: "50%",
                    height: "8px",
                    width: "8px",
                    display: "inline-block",
                  }}
                />
                <span className="ms-2">Admin Sanction</span>
              </Col>
              <Col>
                <span
                  style={{
                    backgroundColor: "#a7e3f4",
                    borderRadius: "50%",
                    height: "8px",
                    width: "8px",
                    display: "inline-block",
                  }}
                />
                <span className="ms-2">Technical Sanction</span>
              </Col>

              <Col>
                <span
                  style={{
                    backgroundColor: "#1e9ab7",
                    borderRadius: "50%",
                    height: "8px",
                    width: "8px",
                    display: "inline-block",
                  }}
                />
                <span className="ms-2">Agreements</span>
              </Col>
            </Row>
          </Col>
        </Row>

        {reportData.length === 0 ? ("") : (
          <Row>
            <Col>
              <Chart
                options={detailsoverview}
                series={series}
                type="bar"
                height="295px"
              />
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default WorksOverview;
