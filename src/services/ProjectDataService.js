import http from "../http-common";

class ProjectDataService {
    getAll() {
        return http.get("/enseignant");
    }

    get(id){
        return http.get(`/enseignant${id}`);
    }

    create(data) {
        return http.post("/enseignant", data);
    }

    addUserInProject(project, user){
        return http.post(`/enseignant`,user, project);
    }

    update(id, data) {
        return http.put(`/enseignant${id}`, data);
    }

    delete(id) {
        return http.delete(`/enseignant${id}`);
    }

    findBySujet(sujet) {
        return http.get(`/projects?sujet=${sujet}`);
    }

    archive(id) {
        return http.post(`/enseignant${id}`)
    }
}

export default new ProjectDataService();