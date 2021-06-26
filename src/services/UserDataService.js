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
        return http.get("/enseignant/getEnseignants");
    }

    getEtudiant(){
        return http.get("/enseignant/getEtudiants");
    }

    editUser(id, data) {
        return http.put(`/admin${id}`, data);
    }

    findByName(name) {
        return http.get(`/admin${name}`);
    }

    delete(id) {
        return http.delete(`/admin${id}`);
    }
}

export default new UserDataService();