import HttpService from './HttpService';

const UserService = {
    // Login API
    login: (payload, successCallback, errorCallback) => {
        HttpService.setAuthToken(""); // Clear token before login
        HttpService.login(payload)
            .then((response) => {
                successCallback(response);
            })
            .catch((error) => {
                errorCallback(error);
            });
    },
};

export default UserService;
