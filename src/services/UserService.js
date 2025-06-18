import HttpService from "./HttpService";
import Cookies from 'js-cookie';
import Axios from "axios";


const UserService={
    settoken:()=>{
        const token = Cookies.get('token');
       // const token=window.localStorage.getItem('KC_TOKEN');
        //console.log("token in circle api", token);
        if (token) {
        HttpService.setAuthToken(token);
    } else {
        console.warn("No authentication token found in localStorage.");
    }
    },
         getToken: async() => {
            const token = Cookies.get('token');
        const refreshToken= Cookies.get('refreshToken');

        //console.log('Setting token in cookie:', token);
        //console.log('Setting refresh token in cookie:', refreshToken);
        if (token) {
          return token;
        } 
         if (!refreshToken) {
            console.error("No refresh token found. User needs to log in.");
          return null;
        }
        try {
            const params = new URLSearchParams();
            params.append("refreshToken", refreshToken); 

        const response = await Axios.post(
            "http://192.168.1.122:8072/icadapi/icad/api/refresh",
            params, // Send the string as the request body
            {
                headers: {
                    //"Authorization": `Bearer ${token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                    //Accept: "application/json",
                },
            }
        );
        if (response.data.access_token && response.data.refresh_token) {
            // Cookies.set("token", response.data.access_token, { secure: true, sameSite: "LAX" });


            // Cookies.set("refreshToken", response.data.refresh_token, { secure: true, sameSite: "LAX" });
            Cookies.set('token', response.data.access_token, {
    path: '/', // Available for all paths
    secure: false, // No need for secure on localhost
    sameSite: 'Lax', // Prevent CSRF attacks, but allows access from same origin
  });
  Cookies.set('refreshToken', response.data.refresh_token, {
    path: '/', // Available for all paths
    secure: false, // No need for secure on localhost
    sameSite: 'Lax', // Prevent CSRF attacks, but allows access from same origin
  });

            //console.log("Token refreshed successfully.");
            return response.data;
        } else {
            console.error("Invalid token response. User needs to log in.");
            return null;
            
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
    }
      },

    isUserAuthenticate:()=>{    
        const userData = Cookies.get('user');
        try{
        return userData? true : false;
        }
        catch(error){
            console.error("No user Found : User Service", error);
            return false;
        }
    },
    getUserData: () => {
        const userData =Cookies.get('user');
   
        if (!userData) return null; // Explicitly return null if no user data exists
        try {
            const parsedUserInfo = userData && JSON.parse(userData);
            return parsedUserInfo;
        } catch (error) {
            console.error(" No user Found : User Service", error);
            return null;
        }
    },



    login:(payload,successCallback,errorCallback)=>{
        HttpService.setAuthToken("");
        HttpService.login(payload).then((response)=>{
            successCallback(response);
        }).catch((error)=>{
            errorCallback(error);
        })
    },
getUserDetailsFromHRMS: (empid) => {
    UserService.settoken(); // Set auth token before making API call
   // console.log("Auth token before API call:");
    //console.log("Fetching user details for empId:", empid);
    HttpService.getUserDetails({ params: { empId: empid } })
        .then((response) => {
            if (response?.data?.data?.ppe) {
                const userDetails = response.data.data.ppe;
                const username = localStorage.getItem("username") || "Unknown";
                const updatedUserDetails = { ...userDetails, username };
                localStorage.setItem("userDetails", JSON.stringify(updatedUserDetails));
               // console.log("Updated user details stored:", updatedUserDetails);
            } else {
                console.warn("No PPE details found in response.");
            }
        })
        .catch((error) => {
            console.error("Error fetching user details:", error);
        });
},

getUnits:(successCallback,errorCallback)=>{
    //  HttpService.setAuthToken();
     HttpService.getUnits().then((response)=>{
          successCallback(response);
      }).catch((error)=>{
          errorCallback(error);
      })
  },

    getCirclesByUnitId: (unitId, successCallback, errorCallback) => {
    //  let token=window.localStorage.getItem('KC_TOKEN');
    // UserService.settoken(); 
   // HttpService.setAuthToken();
       
HttpService.getCirclesByUnitId({ params: { unitId: unitId } }).then((response)=>{
        successCallback(response.data.data);
    }).catch((error)=>{
        errorCallback(error);
    })
},

getDivisionsByCircleId:(circleId,successCallback,errorCallback)=>{
   // HttpService.setAuthToken();
 HttpService.getDivisionsByCircleId({ params: { circleId: circleId } }).then((response)=>{
        successCallback(response.data.data);
    }).catch((error)=>{
        errorCallback(error);
    })
},  

getSubdivisionsByDivisionId:(circleId,divisionId,successCallback,errorCallback)=>{
    //HttpService.setAuthToken();
   HttpService.getSubDivisionsByDivisionId({ params: {circleId: circleId, divisionId: divisionId } }).then((response)=>{
        successCallback(response);
    }).catch((error)=>{
        errorCallback(error);
    })
},

getOfficeNames:(successCallback,errorCallback)=>{
  //  HttpService.setAuthToken();
   HttpService.getOfficeNames().then((response)=>{
        successCallback(response);
    }).catch((error)=>{
        errorCallback(error);
    })
},



}

export default UserService;