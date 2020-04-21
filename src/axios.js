import axios from "axios";

export default axios.create({
    baseURL: "https://avesbox.glitch.me/",
    responseType: "json"
});