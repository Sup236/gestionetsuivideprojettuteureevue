export default function authHeader(addFormData) {
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.accessToken) {
        if (addFormData)
            return { 'x-access-token': user.accessToken, 'Content-Type': "multipart/form-data" };
        return { 'x-access-token': user.accessToken }
    }else{
        return {};
    }
}