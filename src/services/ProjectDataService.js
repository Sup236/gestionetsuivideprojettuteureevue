import http from "../http-common";
import authHeader from "@/services/auth.header";

class ProjectDataService {
    getAll() {
        return http.get("/enseignant",{ headers: authHeader() });
    }

    getAllArchive() {
        return http.get("/enseignant/archive",{ headers: authHeader() });
    }

    get(id){
        return http.get(`/enseignant${id}`,{ headers: authHeader() });
    }

    create(data) {
        return http.post("/enseignant", data,{ headers: authHeader() });
    }

    addUserInProject(user, project){
        if(!user || !project) return;
        return http.post(`/enseignant/addUser`,
            {
                projectId: project,
                userId: user
            },{ headers: authHeader() });
    }

    update(id, data) {
        return http.put(`/enseignant${id}`, data,{ headers: authHeader() });
    }

    delete(id) {
        return http.delete(`/enseignant${id}`,{ headers: authHeader() });
    }

    archive(id) {
        return http.put(`/enseignant${id}`,{etat: false},{ headers: authHeader() })
    }
}

export default new ProjectDataService();