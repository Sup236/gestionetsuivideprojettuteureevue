import http from "../http-common";
//import authHeader from "@/services/auth.header";

class UserDataService {

    addUser(data) {
         return http.post("/admin", data/*, { headers: authHeader() }*/);
    }

    getAdmin() {
        return http.get("/admin"/*, { headers: authHeader() }*/);
    }

    getEnseignant(){
        return http.get("/enseignant");
    }

    getEtudiant(){
        return http.get("/etudiant");
    }

    editUser(id) {
        return http.post(`/admin${id}`);
    }

    findByName(name) {
        return http.get(`/admin/users?name=${name}`);
    }

    delete(id) {
        return http.delete(`/admin${id}`);
    }
}

export default new UserDataService();