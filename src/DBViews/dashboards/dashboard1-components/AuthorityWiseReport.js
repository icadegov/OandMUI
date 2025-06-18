import React from "react";
import { Card, CardBody, CardHeader, Form, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"; // Using Reactstrap for Bootstrap components
import ReportTable from "./ReportTable";

const   AuthorityWiseReport = () => {
  const [finYear, setFinyearr] = React.useState("2025");
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleChange = (event) => {
    setFinyearr(event.target.value);
  };

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">SANCTION AUTHORITY WISE - ABSTRACT REPORT (Nos-Amount in Lakhs)</h5>
        <Form >
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>
            {finYear ? `Year: ${parseInt(finYear) - 1}-${finYear}` : ""}
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem onClick={() => setFinyearr("2025")}>2024-2025</DropdownItem>
              <DropdownItem onClick={() => setFinyearr("2024")}>2023-2024</DropdownItem>
              <DropdownItem onClick={() => setFinyearr("2023")}>2022-2023</DropdownItem>
              <DropdownItem onClick={() => setFinyearr("2022")}>2021-2022</DropdownItem>
              <DropdownItem onClick={() => setFinyearr("2021")}>2020-2021</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Form>
      </CardHeader>
      <CardBody>
        <div className="overflow-auto" style={{ marginTop: "5px" }}>
          <ReportTable finYear={finYear}  />
        </div>
      </CardBody>
    </Card>
  );
};

export default AuthorityWiseReport;
