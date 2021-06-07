import http from "../http-common";

class UserDataService {

    create(data) {
        return http.post("/signUp", data);
    }

    getAll() {
        return http.get("/admin");
    }

    signIn(data) {
        return http.post("/signIn", data);
    }

    findByName(name) {
        return http.get(`/admin/users?name=${name}`);
    }

    delete(id) {
        return http.delete(`/admin/${id}`);
    }
}

export default new UserDataService();