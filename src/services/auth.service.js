import http from "../http-common";

class AuthService {
    signIn(data) {
        return http.post("/signIn", data).then(response => {
            if (response.data.accessToken) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
    }

    signOut(){
        localStorage.removeItem('user');
    }

    signUp(data) {
        return http.post("/signUp", data);
    }
}

export default new AuthService();