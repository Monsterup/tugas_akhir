import axios from "../../axios";
import auth from "../../auth";

const AsyncFetch = (query, callback) => {
    const q = {
        query: query
    };
    axios.post('graphql', JSON.stringify(q), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth.getSession().token
        }
    }).then(res => {
        console.log(res);
        if (typeof(res.data.errors) == 'undefined'){
            callback(res);
        }else{
            throw new Error();
            // auth.logout();
            // window.location.href = '/';
        }
    }).catch(err => {
        console.log(err);
        if (err.response.data.errors[0].message === "Unauthenticated") {
            auth.logout();
            window.location.href = '/';
        } else {
            console.log(err);
        }
    });
};

export default AsyncFetch