import http from "../http-common";

class ProjectDataService {
    getAll() {
        return http.get("/enseignant");
    }

    getAllArchive() {
        return http.get("/enseignant/archive");
    }

    get(id){
        return http.get(`/enseignant${id}`);
    }

    create(data) {
        return http.post("/enseignant", data);
    }

    addUserInProject(user, project){
        if(!user || !project) return;
        return http.post(`/enseignant/addUser`,
            {
                projectId: project,
                userId: user
            });
    }

    update(id, data) {
        return http.put(`/enseignant${id}`, data);
    }

    delete(id) {
        return http.delete(`/enseignant${id}`);
    }

    archive(id) {
        return http.post(`/enseignant${id}`)
    }
}

export default new ProjectDataService();