import axios from "axios";

/**
 * Permet de créer la liaison avec le serveur back end (serveur NodeJs)
 */
export default axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-type": "application/json"
    }
});