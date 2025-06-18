import React, {  useState,useEffect } from 'react';
import { Col, Container, Image, Nav, Navbar, NavbarCollapse, NavbarToggle, NavLink, Row } from 'react-bootstrap';
import telanganaLogo  from '../images/telangana_logo.png';
import Sidebar from './sidemenu/Sidebar'; // Import your Sidebar component
import '../App.css';
import Cookies from 'js-cookie';
import { useMenu } from './sidemenu/MenuContext';
import SidebarRti from './sidemenu/SidebarRti';
import 'bootstrap-icons/font/bootstrap-icons.css';
// import { getChargeCount } from './ReadCookie';
// import refreshToken from './RefreshToken';
 


function Header() {
  const [activeMenu, setActiveMenu] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(true); // State to control sidebar visibility
   const [showSwitchPost,setShowSwitchPost] = useState(false);

  const [refreshedToken, setRefreshedToken] = useState(false);
  const { setSelectedMenu } = useMenu();

  // useEffect(() => {
    
  // //   const checkToken = async () => {
  // //     if(!refreshedToken){
  // //     const response = await refreshToken();      
  // //     if (response?.error) {
  // //         console.log("Redirecting to login...");
  // //         window.location.href = 'http://localhost:3000/icad';
  // //     } else {
  // //         setRefreshedToken(true);
  // //     }      
  // //   }
  // // };

  // // checkToken();
  //   const chargecount = getChargeCount();   
  //    if (chargecount>1) {
  //     setShowSwitchPost(true);
  //   } else {
  //     setShowSwitchPost(false);
  //   }
  // }, []);

  // Handle menu item click
  const handleNavLinkClick = (menu, event) => {
    event.preventDefault();
    setActiveMenu(menu); // Set active menu    
   // console.log('active menu in oandm1', activeMenu);
     const selectedPostId = Cookies.get('selectedPost');   
    // Show the sidebar only when 'ICAD' menu is clicked
   
    if (menu === 'icad') {
      window.location.href = 'http://localhost:3000/icad/dashboard';// Show sidebar for ICAD
    }
    else if (menu === 'home') {
      window.location.href = 'http://localhost:3000/icad/dashboard';
    } else{
     if(selectedPostId>0){
     
      if (menu === 'hrms') { 
        window.location.href = `http://localhost:4000/ui/hrms`;
     }
     else if (menu === 'mk') {
     window.location.href = 'http://localhost:3001/mk/dashboard';
     setSidebarVisible(true); 
     }
     else if (menu === 'pms') window.location.href  = 'http://localhost:3003/pms/dashboard';

      else if (menu === 'oandm') {
       // console.log("menu in om", menu);
             setActiveMenu(menu);
          sessionStorage.setItem('activeMenu', 'oandm');
      //  window.location.href = `http://localhost:3001/oandmdashboard?menu=${menu}`;
       window.location.href = `http://localhost:3002/oandmDashboard?menu=${menu}`;

     }
      else if (menu === 'rti') {
        // console.log("menu in om", menu);
        setSidebarVisible(true); 
       setActiveMenu(menu);
          sessionStorage.setItem('activeMenu', 'rti');
     //   window.location.href = `http://localhost:3001/rtidashboard?menu=${menu}`;
      window.location.href = `http://localhost:3002/rtidashboard?menu=${menu}`;
        
    }
     else {
       setSidebarVisible(false); // Hide sidebar for other menu items
     }
     }else{

      window.location.href='http://localhost:3000/icad/dashboard';
      //window.location.href='http://localhost:3000/icad/dashboard';
     } 
    
  }
  };
  useEffect(() => {
  const storedMenu = sessionStorage.getItem('activeMenu');
  if (storedMenu) {
    setActiveMenu(storedMenu);
    setSidebarVisible(true);
  }
}, []);

 
   // Corrected handleLogout method
   const handleLogout = async ()  => {
    
    Cookies.remove('selectedPost');Cookies.remove('chargeCount');Cookies.remove('token');
    window.location.href="http://localhost:3000/icad"
   };

  
  return (
    <div>
<Navbar variant="white" style={{ backgroundColor: '#191970', padding: '0.5rem', width: '100%' }}>
  <Row style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
    <Nav className="ms-auto" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
      <div style={{ display: 'flex', color: 'white', alignItems: 'center', cursor: 'pointer' }} onClick={handleLogout}>
        <i className="bi bi-envelope-arrow-up" style={{ fontSize: '1rem' }}></i> &nbsp;Contact Us &nbsp; | &nbsp;
      </div>
      {showSwitchPost && (
        <div style={{ display: 'flex', color: 'white', cursor: 'pointer' }} onClick={() => { window.location.href = '/icad/dashboard'; }}>
          <i className="bi bi-people-fill"></i> &nbsp; Switch User&nbsp; | &nbsp;
        </div>
      )}
      <div style={{ display: 'flex', color: 'white', alignItems: 'center', cursor: 'pointer' }} onClick={handleLogout}>
        <i className="bi bi-box-arrow-right" style={{ fontSize: '1rem' }}></i> &nbsp;Logout  
      </div>
    </Nav>
  </Row>
</Navbar>


      <Row style={{ padding: '0', borderBottom: '0.1em solid black' }} className="text-dark bg-light">
        <Col lg={5} md={5} xs={12} sm={12} style={{ display: 'flex', alignItems: 'center' }}>
          <Image src={telanganaLogo} width={100} height={100} alt="Telangana Logo" className="ms-4 mb-2" />
          <div className="pt-2" style={{ fontFamily: 'Montserrat, sans-serif', lineHeight: '0.1', textAlign: 'left', fontStretch: 'expanded' }}>
            <h2 style={{ marginBottom: '0' }}>Irrigation & CAD Department</h2>
            <h5 className="pt-0 gradient-text" style={{ marginBottom: '0' }}>Government of Telangana</h5>
          </div>
        </Col>
        <Col lg={7} md={7} xs={12} sm={12} style={{ display: 'flex', alignItems: 'center' }}>
        <Navbar expand="lg sm" className="bg-body-tertiary w-100  navbar-custom">
            <Container>
              <Navbar.Brand href="/"> </Navbar.Brand>
              <NavbarToggle aria-controls="basic-navbar-nav" />
              <NavbarCollapse id="basic-navbar-nav">
                <Nav className="pt-4 text-dark w-150 d-flex justify-content-center" style={{ fontStretch: 'expanded', fontFamily: 'Montserrat, sans-serif', gap: '20px' }}>
                  <NavLink className="nav-link-custom" to="/" onClick={(e) => handleNavLinkClick('home', e)} style={{color:'#191970',fontWeight:'500'}}>HOME</NavLink>
                  <NavLink className="nav-link-custom" to="/icad" onClick={(e) => handleNavLinkClick('icad', e)} style={{color:'#191970',fontWeight:'500'}}>ICAD</NavLink>
                  <NavLink className="nav-link-custom" to="/hrms" onClick={(e) => handleNavLinkClick('hrms', e)} style={{color:'#191970',fontWeight:'500'}}>HRMS</NavLink>
                  <NavLink className="{`nav-link-custom ${activeMenu === 'mk' ? 'text-success' : 'nav-link-custom'}`}" to="/mk" onClick={(e) => handleNavLinkClick('mk', e)} style={{color:'#191970',fontWeight:'500'}}>MK</NavLink>
                  <NavLink className="nav-link-custom" to="/oandm" onClick={(e) => handleNavLinkClick('oandm', e)} style={{color:'#191970',fontWeight:'500'}}>O&M</NavLink>
                  <NavLink className="nav-link-custom" to="/pms" onClick={(e) => handleNavLinkClick('pms', e)} style={{color:'#191970',fontWeight:'500'}}>PMS</NavLink>
                  <NavLink className="nav-link-custom" to="/legal" onClick={(e) => handleNavLinkClick('legal', e)} style={{color:'#191970',fontWeight:'500'}}>Legal Cases</NavLink>
                  <NavLink className="nav-link-custom" to="/legal" onClick={(e) => handleNavLinkClick('rti', e)} style={{color:'#191970',fontWeight:'500'}}>RTI</NavLink>
                  <NavLink className="nav-link-custom" href="#" onClick={(e) => handleNavLinkClick('tgimis', e)} style={{color:'#191970',fontWeight:'500'}}>TGIMIS</NavLink>
                 </Nav>
                 
              </NavbarCollapse>
            </Container>
          </Navbar>
        </Col>
      </Row>
      {/* Conditionally render Sidebar based on visibility state */}
      {console.log('menu oandm2', activeMenu)}
    {sidebarVisible && activeMenu === 'oandm' && <Sidebar visible={sidebarVisible} setVisible={setSidebarVisible} />}
      {sidebarVisible && activeMenu === 'rti' && <SidebarRti visible={sidebarVisible} setVisible={setSidebarVisible} />}
    </div>
  );
}

export default Header;
