import HttpService from "./HttpService";

const StudentService = {
    // Fetch students
    fetchStudents: (token, successCallback, errorCallback) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        HttpService.getStudents(config)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

    createStudent: (data, token, successCallback, errorCallback) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        HttpService.createStudent(data, config)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

    updateStudent: (id, data, token, successCallback, errorCallback) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        HttpService.updateStudent(id, data, config)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

    // Delete a student
    deleteStudent: (id, token, successCallback, errorCallback) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        HttpService.deleteStudent(id, config)
            .then(() => successCallback())
            .catch((error) => errorCallback(error));
    },
};

export default StudentService;
