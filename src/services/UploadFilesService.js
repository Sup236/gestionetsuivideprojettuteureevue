import http from "../http-common";
import authHeader from "@/services/auth.header";

class UploadFilesService {
    upload(file, project,onUploadProgress) {
        let formData = new FormData();
        let id = project.id

        formData.append("uploadFile", file);

            return http.post(`/enseignant/projects${id}/upload`, formData, {
                headers: authHeader(),
                onUploadProgress
            });
    }

    getFiles(project) {
        let id = project.id;
        return http.get(`/enseignant/projects${id}/upload`);
    }
}

export default new UploadFilesService();