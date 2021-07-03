import http from "../http-common";

class FileDataService {
    mkdirProject(data) {
        return http.post(`/enseignant/projects${data.id}`, data);
    }

    upload(data, project) {
        let formData = new FormData();

        formData.append("File", data);

        console.log("data--------------data")
        console.log(formData)
        return http.post(`/enseignant/projects${project.id}/upload`, {
            file: formData,
            project: project,
        }, {
            headers:{
                "Content-Type": "multipart/form-data"
            },
        });
    }
}

export default new FileDataService();