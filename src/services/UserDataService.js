import http from "../http-common";
import authHeader from "@/services/auth.header";

/**
 * Les services sont des class JS exporter dans l'application,
 * Elle ont pour but de faire la liaison entre ce serveur et le serveur back end
 * Elle utilise axios pour y parvenir, et possède pour la plus pars une configuration de verification du jeton d'accès pour assurer la sécuriter de l'application
 * Elle ont toutes la même forme c'est pourquoi mise a part ici elle ne seront pas commenter
 */
class UserDataService {

    /**
     * Appel de la fonction addUser dans le serveur back end
     * @param data
     * @returns {Promise<AxiosResponse<any>>}
     */
    addUser(data) {
         return http.post("/admin", data, { headers: authHeader() });
    }

    /**
     * Appel de la fonction getAdmin dans le serveur back end
     * @returns {Promise<AxiosResponse<any>>}
     */
    getAdmin() {
        return http.get("/admin", { headers: authHeader() });
    }

    /**
     * Appel de la fonction getEnseignant dans le serveur back end
     * @returns {Promise<AxiosResponse<any>>}
     */
    getEnseignant(){
        return http.get("/enseignant/getEnseignants", { headers: authHeader() });
    }

    /**
     * Appel de la fonction getEtudiant dans le serveur back end
     * @returns {Promise<AxiosResponse<any>>}
     */
    getEtudiant(){
        return http.get("/enseignant/getEtudiants", { headers: authHeader() });
    }

    /**
     * Appel de la fonction update du User dans le serveur back end
     * @param id
     * @param data
     * @returns {Promise<AxiosResponse<any>>}
     */
    editUser(id, data) {
        return http.put(`/admin${id}`, data, { headers: authHeader() });
    }

    /**
     * Appel de la fonction delete du User dans le serveur back end
     * @param id
     * @returns {Promise<AxiosResponse<any>>}
     */
    delete(id) {
        return http.delete(`/admin${id}`, { headers: authHeader() });
    }
}

export default new UserDataService();