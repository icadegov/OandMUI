import { useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import Cookies from 'js-cookie';
import UserService from '../services/UserService';


const useTokenRefresher = (interval = 60000) => {
    useEffect(() => {
        const intervalId = setInterval(async () => {
            const token = Cookies.get('token');
           // const refreshToken =Cookies.get('refreshToken');
            if (!token ) return;
            try {
                const decoded = jwtDecode(token);
                const exp = decoded.exp * 1000; // convert to ms
                const timeLeft = exp - Date.now();

                // Only refresh if less than 2 minutes left
                if (timeLeft < 2 * 60 * 1000) {
                    console.log("Token expiring soon. Refreshing...");
                    //const result = await refreshToken();
                    const result = await UserService.getToken();
                    if (result?.error) {
                        console.warn("Token refresh failed.");
                        // Optional: force logout or redirect to login
                    }
                } else {
                    console.log(`Token still valid for ${(timeLeft / 1000).toFixed(0)} seconds.`);
                }
            } catch (e) {
                console.error("Error decoding token:", e);
            }
        }, interval);

        return () => clearInterval(intervalId);
    }, [interval]);
};

export default useTokenRefresher;
