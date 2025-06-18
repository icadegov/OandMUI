import React, { useState } from 'react';
import { Offcanvas, ListGroup } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';
import './SidebarMenu.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Submenus expanded by default
  const [expandedMenu, setExpandedMenu] = useState({
    entryForms: true,
    editForms: true,
    reportForms: true,
    tankFillingForms: true,
  });

  const toggleMenu = (menu) => {
    setExpandedMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {isSidebarOpen ? (
        <Offcanvas show={true} onHide={toggleSidebar} style={{ width: '230px', top: '16%', bottom: '7%' }}>
          <Offcanvas.Header>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              style={{
                paddingTop: '1px',
                fontSize: '0.5rem',
                color: 'black',
                paddingBottom: '0.2',
                paddingRight: '0',
                border: '1px solid black',
              }}
              onClick={toggleSidebar}
            />
          </Offcanvas.Header>

          <Offcanvas.Body style={{ padding: '3%' }}>
            <ListGroup variant="flush">
              {/* Dashboard */}
              <ListGroup.Item onClick={() => navigate("/oandmDashboard")} className="sidebar-item first-level">
                O&M DashBoard
              </ListGroup.Item>

              {/* Entry Forms */}
              <ListGroup.Item
                onClick={() => toggleMenu("entryForms")}
                className={`sidebar-item first-level ${expandedMenu["entryForms"] ? "highlighted" : ""}`}
              >
                O&M Entry
                <i
                  className={`ms-2 bi ${expandedMenu["entryForms"] ? "bi-chevron-down" : "bi-chevron-right"}`}
                ></i>
              </ListGroup.Item>
              {expandedMenu["entryForms"] && (
                <ListGroup className="submenu">
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/adminSanctionForm"); }}>
                    Admin sanction
                  </ListGroup.Item>
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/AssignWork"); }}>
                    Assign Admin Sanction
                  </ListGroup.Item>
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/techSanctionForm"); }}>
                    Technical Sanction
                  </ListGroup.Item>
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/agreementForm"); }}>
                    Agreements
                  </ListGroup.Item>
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/billsForm"); }}>
                    Bill Details
                  </ListGroup.Item>
                </ListGroup>
              )}

              {/* Edit Forms */}
              <ListGroup.Item
                onClick={() => toggleMenu("editForms")}
                className={`sidebar-item first-level ${expandedMenu["editForms"] ? "highlighted" : ""}`}
              >
                O&M Edit
                <i
                  className={`ms-2 bi ${expandedMenu["editForms"] ? "bi-chevron-down" : "bi-chevron-right"}`}
                ></i>
              </ListGroup.Item>
              {expandedMenu["editForms"] && (
                <ListGroup className="submenu">
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/adminSancEdit"); }}>
                   Edit Admin Sanction
                  </ListGroup.Item>
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/icad/uploadforms/proceeding"); }}>
                    Edit AS - SC/ST SDF
                  </ListGroup.Item>
                </ListGroup>
              )}

              {/* Report Forms */}
              <ListGroup.Item
                onClick={() => toggleMenu("reportForms")}
                className={`sidebar-item first-level ${expandedMenu["reportForms"] ? "highlighted" : ""}`}
              >
                O&M Reports
                <i
                  className={`ms-2 bi ${expandedMenu["reportForms"] ? "bi-chevron-down" : "bi-chevron-right"}`}
                ></i>
              </ListGroup.Item>
              {expandedMenu["reportForms"] && (
                <ListGroup className="submenu">
                   <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/CEAbsReportUnitWise"); }}>
                    Unit Wise
                  </ListGroup.Item>
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/CEAbsReportProjectUnitWise"); }}>
                    Unit - Project Wise
                  </ListGroup.Item>
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/CEAbsReportUnitHoaWise"); }}>
                    Unit - HOA Wise
                  </ListGroup.Item>
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/CEAbsReportSCSTUnitWise"); }}>
                    Unit Wise SC/ST SDF
                  </ListGroup.Item>
                  
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/CEAbstractReport"); }}>
                    Sanction Authority Wise
                  </ListGroup.Item>
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/CEAbsReportWorkTypeWise"); }}>
                    Work Category Wise
                  </ListGroup.Item>
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/CEAbstractReportHoaWise"); }}>
                    HOA Wise
                  </ListGroup.Item>
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/CEAbsReportHoaWorkTypeWise"); }}>
                    HOA - Work Category Wise
                  </ListGroup.Item>
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/CEAbsReportSancWorkTypeWise"); }}>
                    Sanction - Work Category Wise
                  </ListGroup.Item>
                 
                </ListGroup>
              )}

              {/* Tank Filling */}
              <ListGroup.Item
                onClick={() => toggleMenu("tankFillingForms")}
                className={`sidebar-item first-level ${expandedMenu["tankFillingForms"] ? "highlighted" : ""}`}
              >
                Tank Filling Status
                <i
                  className={`ms-2 bi ${expandedMenu["tankFillingForms"] ? "bi-chevron-down" : "bi-chevron-right"}`}
                ></i>
              </ListGroup.Item>
              {expandedMenu["tankFillingForms"] && (
                <ListGroup className="submenu">
                   <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/tankFillingEntry"); }}>
                    Tank Filling Status-Entry
                  </ListGroup.Item>
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/totalTanksListForTankFilling"); }}>
                    Tank List
                  </ListGroup.Item>
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/tankFillingStatusReport"); }}>
                    Status Report
                  </ListGroup.Item>
                  <ListGroup.Item className="submenu-item second-level" onClick={() => { toggleSidebar(); navigate("/tankFillingStatisticsReport"); }}>
                    Statistics Report
                  </ListGroup.Item>
                </ListGroup>
              )}

              {/* View Circulars */}
              <ListGroup.Item
                onClick={() => navigate("/circularsReport")}
                className="sidebar-item first-level  "
              >
                View GOs/Circulars
              </ListGroup.Item>
            </ListGroup>
          </Offcanvas.Body>
        </Offcanvas>
      ) : (
        <div className="open-sidebar-btn">
          <button onClick={toggleSidebar} title="ICAD Menu">
            <FaBars size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
