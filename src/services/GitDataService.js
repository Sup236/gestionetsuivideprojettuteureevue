import http from "../http-common";
import authHeader from "@/services/auth.header";

class GitDataService {
    initRepository(data, project) {
        const id = project.id;
        return http.post(`/enseignant/projects${id}/initGit`, data, {
            headers: authHeader(),
        });
    }

    uploadForPush(file, project) {
        let formData = new FormData();
        const id = project.id;
        formData.append("uploadFile", file);
        return http.post(`/enseignant/projects${id}/pushFile`, formData, {
            headers: authHeader(true),
        })
    }

    lastCommit(id) {
        return http.get(`/enseignant/projects${id}/lastCommit`, {
            headers: authHeader(),
        });
    }
}

export default new GitDataService();