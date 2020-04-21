import axios from './axios';

class Auth {
    setSession(userId, name, token, company, photo, callback) {
        let sessionData = {userId: userId, name: name, token: token, company: company, photo: photo};
        sessionStorage.setItem('avesbox_session', JSON.stringify(sessionData));
        const res = sessionStorage.getItem('avesbox_session');
        callback(res);
    }

    getSession() {
        return JSON.parse(sessionStorage.getItem('avesbox_session'));
    }

    isSessionActive(callback) {
        if (!this.getSession())
            return false;

        const reqBody = {
            query: `query{
                          getProfile{
                            _id
                            username
                            password
                            email
                            name
                          }
                        }
                `
        };
        axios.post('graphql', JSON.stringify(reqBody), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.getSession().token
            }
        }).then((res) => {
            if (res.data.errors)
                callback(false);
            else if (res.status !== 200 || res.status !== 201)
                callback(false);
            else
                callback(true)
        });
    }

    async isRegistered(email) {
        try {
            const reqBody = {
                query: `query{
                      checkEmail(email:"${email}"){
                        registered
                      }
                    }
                `
            }
            let apiResponse = await axios.post('graphql', JSON.stringify(reqBody), {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return apiResponse.data.data.checkEmail.registered;
        } catch (e) {
            console.log(e);
        }
    }

    logout() {
        sessionStorage.removeItem('avesbox_session');
    }

    isAuthenticated() {
        return !!sessionStorage.getItem('avesbox_session');
    }
}

export default new Auth();