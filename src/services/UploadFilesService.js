import http from "../http-common";
import authHeader from "@/services/auth.header";

class UploadFilesService {
    mkdirProject(data) {
        return http.post(`/enseignant/projects${data.id}`, data);
    }

    rmDirProject(data) {
        return http.post(`/enseignant/project${data.id}/delete`, data);
    }

    upload(file, project, onUploadProgress) {
        let formData = new FormData();
        let id = project.id

        formData.append("uploadFile", file);

        return http.post(`/enseignant/projects${id}/upload`, formData, {
            headers: authHeader(true),
            onUploadProgress
        });
    }

    getFiles(project) {
        let id = project.id;
        return http.get(`/enseignant/projects${id}/files`);
    }

    download(project, fileName) {
        let id = project.id;
        return http.get(`/enseignant/projects${id}/download${fileName}`, {
            responseType: "blob"
        });
    }
}

export default new UploadFilesService();