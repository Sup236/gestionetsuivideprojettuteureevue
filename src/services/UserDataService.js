import http from "../http-common";
import authHeader from "@/services/auth.header";

class UserDataService {

    addUser(data) {
         return http.post("/admin", data, { headers: authHeader() });
    }

    getAdmin() {
        return http.get("/admin", { headers: authHeader() });
    }

    getEnseignant(){
        return http.get("/enseignant/getEnseignants", { headers: authHeader() });
    }

    getEtudiant(){
        return http.get("/enseignant/getEtudiants", { headers: authHeader() });
    }

    editUser(id, data) {
        return http.put(`/admin${id}`, data, { headers: authHeader() });
    }

    delete(id) {
        return http.delete(`/admin${id}`, { headers: authHeader() });
    }
}

export default new UserDataService();