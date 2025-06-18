import React from "react";
import PMSService from "../../services/PMSService";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import AdminSanctionService from "../../services/AdminSanctionService";
import { useUserDetails } from "../UserDetailsContext";

const ProjectDetails = ({ workType, selProjectDetFromChild }) => {
  const [projects, setProjects] = useState([]);
  const [selProject, setselProject] = useState();
  const { user } = useUserDetails();

  const [reservoirs, setreservoirs] = useState([]);
  const [selRes, setSelRes] = useState();

  const [lifts, setLifts] = useState([]);
  const [selLift, setSelLift] = useState();

  const [smallLifts, setSmallLifts] = useState([]);
  const [selSmallLift, setSelSmallLift] = useState();

  const [loading, setLoading] = useState({
    projects: false,
    reservoirs: false,
    lifts: false,
    smallLifts: false,
  });

  const [errors, setErrors] = useState({
    projects: null,
    reservoirs: null,
    lifts: null,
    smallLifts: null,
  });

  const userDTO = {
    empId: user && user.empId,
    empName: user && user.employeeName,
    designation: user && user.designationName,
    designationId: user && user.designationId,
    postId: user && user.postId,
    userName: user && user.userName,
    unitId: user && user.unitId,
    circleId: user && user.circleId,
    divisionId: user && user.divisionId,
    subdivisionId: user && user.subDivisionId,
    sectionId: user && user.sectionId,
  };

  useEffect(() => {
    if (Number(workType) === 4) {
      setProjects([]);
      AdminSanctionService.getSmallLifts(
        user && user.unitId,
        (response) => {
          //console.log("response in project details"+JSON.stringify(response.data.data));
          setSmallLifts(response.data.data);
        },
        (error) => {
          console.log(error);
        },
      );
    } else {
      // console.log("user in project details"+JSON.stringify(userDTO));
      setLoading((prev) => ({ ...prev, projects: true }));
      PMSService.getUserProjects(
        { userDTO },
        (response) => {
          setLoading((prev) => ({ ...prev, projects: false }));
          setProjects(response.data.data);
        },
        (error) => {
          setLoading((prev) => ({ ...prev, districts: false }));
          setProjects((prev) => ({ ...prev, districts: false }));

          console.log(error);
        },
      );
    }
  }, []);

  const handleProjectsChange = (event) => {
    const selectedProject = event.target.value;
    setLoading((prev) => ({ ...prev, reservoirs: true }));
    setselProject(selectedProject);
    setreservoirs([]);
    PMSService.getReservoirByProject(
      selectedProject,
      (response) => {
        setLoading((prev) => ({ ...prev, reservoirs: false }));
        setreservoirs(response.data.data);

        if (!response || response.data.data.length === 0) {
          setErrors((prev) => ({ ...prev, reservoirs: "No Reservoirs found." }));
        } else {
          setErrors((prev) => ({ ...prev, reservoirs: null })); // clear old errors
        }
      },
      (error) => {
        setLoading((prev) => ({ ...prev, reservoirs: false }));
        setErrors((prev) => ({ ...prev, reservoirs: "Error in fetching reservoirs" }));
        console.log(error);
      },
    );
  };

  const handleProjectsChangeForLifts = (event) => {
    const selectedProject = event.target.value;
    setLifts([]);
    setLoading((prev) => ({ ...prev, lifts: true }));
    setselProject(selectedProject);
    AdminSanctionService.getLifts(
      selectedProject,
      (response) => {
        setLoading((prev) => ({ ...prev, lifts: false }));
        if (!response || response.data.data.length === 0) {
          setErrors((prev) => ({ ...prev, lifts: "No Lifts found." }));
        } else {
          setErrors((prev) => ({ ...prev, lifts: null })); // clear old errors
        }

        setLifts(response.data.data);
      },
      (error) => {
        setLoading((prev) => ({ ...prev, lifts: false }));
        setErrors((prev) => ({ ...prev, lifts: "Error in fetching Lifts" }));
        console.log(error);
      },
    );
  };

  const handleLiftChange = (event) => {
    const selectedLift = event.target.value;
    setSelLift(selectedLift);
    const data = { projectId: selProject, liftId: selectedLift };
    selProjectDetFromChild(data);
  };

  const handleSmallLiftChanges = (event) => {
    const selectedLift = event.target.value;
    setSelSmallLift(selectedLift);
    const data = { smallLiftId: selectedLift };
    selProjectDetFromChild(data);
  };

  // const getSmallLifts = (event) => {
  //   setLoading(prev => ({ ...prev, smallLifts: true }));
  //   AdminSanctionService.getSmallLifts(event, (response) => {
  //     setLoading(prev => ({ ...prev, smallLifts: false }));

  //     // if (!response || response.data.data.length === 0) {
  //     //   setErrors(prev => ({ ...prev, smallLifts: "No Lifts found." }));
  //     // } else {
  //     //   setErrors(prev => ({ ...prev, smallLifts: null })); // clear old errors
  //     // }

  //     setSmallLifts(response.data.data);
  //   }, (error) => {
  //    // setErrors(prev => ({ ...prev, reservoirs: "Error in fetching reservoirs" }));
  //     console.log(error);
  //   })
  // }

  const handleReservoirChange = (event) => {
    const selectedReservoir = event.target.value;
    setSelRes(selectedReservoir);
    const data = { projectId: selProject, reservoidId: selectedReservoir };
    selProjectDetFromChild(data);
  };

  return (
    <Row className="mb-3" style={{ flexGrow: 1 }}>
      {workType && Number(workType) !== 4 && projects && (
        <Form.Group as={Col} controlId="formGridFinYear">
          {" "}
          <Form.Label>Select Project</Form.Label>
          <Form.Select value={selProject} disabled={loading.projects} onChange={workType && Number(workType) === 1 ? handleProjectsChange : handleProjectsChangeForLifts}>
            {loading.projects ? (
              <option>Loading...</option>
            ) : (
              <>
                <option value="">Select </option>
                {projects.map((proj) => (
                  <option key={proj.projectid} value={proj.projectid}>
                    {proj.projectname}
                  </option>
                ))}
              </>
            )}
          </Form.Select>
          {errors.projects && <Form.Text className="text-danger">{errors.projects}</Form.Text>}
        </Form.Group>
      )}

      {workType && Number(workType) === 1 && (
        <Form.Group as={Col} controlId="formGridFinYear">
          <Form.Label>Select reservoirs</Form.Label>

          {
            <Form.Select disabled={loading.reservoirs} value={selRes} onChange={handleReservoirChange}>
              {loading.reservoirs ? (
                <option>Loading...</option>
              ) : (
                <>
                  <option value="selRes">Select </option>
                  {reservoirs &&
                    reservoirs.map((reservoir) => (
                      <option key={reservoir.resId} value={reservoir.resId}>
                        {reservoir.resName}
                      </option>
                    ))}
                </>
              )}
            </Form.Select>
          }
          {errors.reservoirs && <Form.Text className="text-danger">{errors.reservoirs}</Form.Text>}
        </Form.Group>
      )}

      {workType && Number(workType) === 3 && (
        <Form.Group as={Col} controlId="formGridFinYear">
          <Form.Label>Select Lifts</Form.Label>

          {
            <Form.Select value={selLift} disabled={loading.lifts} onChange={handleLiftChange}>
              {loading.lifts ? (
                <option>Loading...</option>
              ) : (
                <>
                  {" "}
                  <option value="selLift">Select </option>
                  {lifts &&
                    lifts.map((lifts) => (
                      <option key={lifts.lisId} value={lifts.lisId}>
                        {lifts.nameOfLis}
                      </option>
                    ))}
                </>
              )}
            </Form.Select>
          }
          {errors.lifts && <Form.Text className="text-danger">{errors.lifts}</Form.Text>}
        </Form.Group>
      )}
      {workType && Number(workType) === 4 && (
        <Form.Group style={{ width: "50%" }} controlId="formGridFinYear">
          <Form.Label>Select Small Lifts</Form.Label>
          {
            <Form.Select value={selSmallLift} disabled={loading.smallLifts} onChange={handleSmallLiftChanges}>
              {loading.smallLifts ? (
                <option>Loading...</option>
              ) : (
                <>
                  <option value="selSmallLift">Select </option>
                  {smallLifts &&
                    smallLifts.map((smallLifts) => (
                      <option key={smallLifts.lisId} value={smallLifts.lisId}>
                        {smallLifts.nameOfLis}
                      </option>
                    ))}
                </>
              )}
            </Form.Select>
          }
        </Form.Group>
      )}
    </Row>
  );
};

export default ProjectDetails;
