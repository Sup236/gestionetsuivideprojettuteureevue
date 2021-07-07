import http from "../http-common";

class FileDataService {
    mkdirProject(data) {
        return http.post(`/enseignant/projects${data.id}`, data);
    }

    upload(data, project) {
        return http.post(`/enseignant/projects${project.id}/upload`, {
            files: data,
            projects: project,
        }, {
            headers:{
                "Content-Type": "multipart/form-data"
            },
        });
    }
}

export default new FileDataService();