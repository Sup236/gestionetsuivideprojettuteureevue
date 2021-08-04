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
        console.log(file)
        formData.append("uploadFile", file);
        return http.post(`/enseignant/projects${id}/pushFile`, formData, {
            headers: authHeader(true),
        })
    }
}

export default new GitDataService();