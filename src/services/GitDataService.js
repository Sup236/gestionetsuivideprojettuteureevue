import http from "../http-common";

class GitDataService {
    initRepository(url, project){
        const id = project.id;
        return http.get(`/enseignant/projects${id}/initGit`, url);
    }
}

export default new GitDataService();