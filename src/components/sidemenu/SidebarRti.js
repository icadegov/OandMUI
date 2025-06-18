import React, { useState, useEffect, useContext } from "react";
import { Navbar, Nav, Offcanvas, ListGroup } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMenu } from "./MenuContext";
import { useUserDetails } from "../UserDetailsContext";

const SidebarRti = () => {
  const { user } = useUserDetails();
  const { username, designationId } = user;
  const { activeMenu } = useMenu();
  const [expandedMenu, setExpandedMenu] = useState({
    RTIEntry: true,
    RTIEdit: true,
    RTIreports: true,
    OMEntry: true,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsSidebarOpen(true);
  }, [activeMenu]);

  const toggleMenu = (menu) => {
    setExpandedMenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const allowedUsers = ["madha051174", "jayak050484", "prame200369", "kavit070381", "shash200880", "bhoom220877", "ganga050471"];
  return (
    <div>
      {isSidebarOpen && activeMenu === "rti" ? (
        <Offcanvas show={true} onHide={toggleSidebar} style={{ width: "250px", top: "16%", bottom: "8%" }}>
          <Offcanvas.Header>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              style={{
                paddingTop: "1px",
                fontSize: "0.5rem",
                color: "black",
                paddingBottom: "0.2",
                paddingRight: "0",
                border: "1px solid black",
              }}
              onClick={toggleSidebar}
            />
          </Offcanvas.Header>
          <Offcanvas.Body>
            {(designationId === 5 || allowedUsers.includes(username)) && (
              <>
                <ListGroup variant="flush">
                  <ListGroup.Item onClick={() => toggleMenu("RTIEntry")} className={`sidebar-item first-level ${expandedMenu["RTIEntry"] ? "highlighted" : ""}`}>
                    RTI Entry
                    <i className={`ms-2 bi ${expandedMenu["RTIEntry"] ? "bi-chevron-down" : "bi-chevron-right"}`}></i>
                  </ListGroup.Item>
                  {expandedMenu["RTIEntry"] && (
                    <ListGroup className="submenu">
                      <ListGroup.Item
                        className="submenu-item second-level"
                        onClick={() => {
                          toggleSidebar();
                          navigate("/rtiapp");
                        }}
                      >
                        Application Entry
                      </ListGroup.Item>
                      <ListGroup.Item
                        className="submenu-item second-level"
                        onClick={() => {
                          toggleSidebar();
                          navigate("/rtiproformaGentry");
                        }}
                      >
                        Appeal Entry
                      </ListGroup.Item>
                    </ListGroup>
                  )}
                </ListGroup>
                <ListGroup variant="flush">
                  <ListGroup.Item onClick={() => toggleMenu("RTIEdit")} className={`sidebar-item first-level ${expandedMenu["RTIEdit"] ? "highlighted" : ""}`}>
                    RTI Edit/Delete
                    <i className={`ms-2 bi ${expandedMenu["RTIEdit"] ? "bi-chevron-down" : "bi-chevron-right"}`}></i>
                  </ListGroup.Item>
                  {expandedMenu["RTIEdit"] && (
                    <ListGroup className="submenu">
                      <ListGroup.Item
                        className="submenu-item second-level"
                        onClick={() => {
                          toggleSidebar();
                          navigate("/rtiappEdit");
                        }}
                      >
                        Application Edit/Delete
                      </ListGroup.Item>
                      <ListGroup.Item
                        className="submenu-item second-level"
                        onClick={() => {
                          toggleSidebar();
                          navigate("/rtiproformaGEdit");
                        }}
                      >
                        Appeal Edit/Delete
                      </ListGroup.Item>
                    </ListGroup>
                  )}
                </ListGroup>
              </>
            )}
            <ListGroup variant="flush">
              <ListGroup.Item onClick={() => toggleMenu("RTIreports")} className={`sidebar-item first-level ${expandedMenu["RTIreports"] ? "highlighted" : ""}`}>
                RTI Reports
                <i className={`ms-2 bi ${expandedMenu["RTIreports"] ? "bi-chevron-down" : "bi-chevron-right"}`}></i>
              </ListGroup.Item>
              {expandedMenu["RTIreports"] && (
                <ListGroup className="submenu">
                  {(designationId === 5 || allowedUsers.includes(username)) && (
                    <>
                      <ListGroup.Item
                        className="submenu-item second-level"
                        onClick={() => {
                          toggleSidebar();
                          navigate("/rtiappEEreport");
                        }}
                      >
                        Application EE Data Report
                      </ListGroup.Item>
                      <ListGroup.Item
                        className="submenu-item second-level"
                        onClick={() => {
                          toggleSidebar();
                          navigate("/rtiproformaGDataReport");
                        }}
                      >
                        Appeal EE Data Report
                      </ListGroup.Item>
                    </>
                  )}
                  {(designationId === 7 || designationId === 9 || designationId === 10 || designationId === 5) && (
                    <>
                      <ListGroup.Item
                        className="submenu-item second-level"
                        onClick={() => {
                          toggleSidebar();
                          navigate("/rtiAppConsolidatedReport");
                        }}
                      >
                        Application Consolidate Report
                      </ListGroup.Item>
                      <ListGroup.Item
                        className="submenu-item second-level"
                        onClick={() => {
                          toggleSidebar();
                          navigate("/rtiprfmGConsolidatedReport");
                        }}
                      >
                        Appeal Consolidate Report
                      </ListGroup.Item>
                    </>
                  )}
                </ListGroup>
              )}
            </ListGroup>
          </Offcanvas.Body>
        </Offcanvas>
      ) : activeMenu === "O&M" ? (
        <Offcanvas show={true} onHide={toggleSidebar} style={{ width: "250px", top: "5%", bottom: "8%" }}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <Navbar.Brand className="gradient-text" style={{ textAlign: "center", borderBottom: "0.5px dotted" }}>
                {activeMenu} Menu
              </Navbar.Brand>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <ListGroup variant="flush">
              <ListGroup.Item onClick={() => toggleMenu("OMEntry")} className={`sidebar-item first-level ${expandedMenu["OMEntry"] ? "highlighted" : ""}`}>
                O&M Entry
                <i className={`ms-2 bi ${expandedMenu["OMEntry"] ? "bi-chevron-down" : "bi-chevron-right"}`}></i>
              </ListGroup.Item>
              {expandedMenu["OMEntry"] && (
                <ListGroup className="submenu">
                  <ListGroup.Item
                    className="submenu-item second-level"
                    onClick={() => {
                      toggleSidebar();
                      navigate("/omapp");
                    }}
                  >
                    O&M Application Entry
                  </ListGroup.Item>
                  <ListGroup.Item
                    className="submenu-item second-level"
                    onClick={() => {
                      toggleSidebar();
                      navigate("/omproformaGentry");
                    }}
                  >
                    O&M Appeal Entry
                  </ListGroup.Item>
                </ListGroup>
              )}
            </ListGroup>
          </Offcanvas.Body>
        </Offcanvas>
      ) : (
        <div className="open-sidebar-btn">
          <button onClick={toggleSidebar} title="RTI Menu">
            <FaBars size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarRti;
