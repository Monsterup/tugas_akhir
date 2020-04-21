import {store} from 'react-notifications-component';

export function showNotification(message,type="info"){
    let title = 'Info!';
    if (type === "warning" || type === "danger")
        title = 'Ups!';
    else if (type === "success")
        title = 'Sukses';
    store.addNotification({
        title: title,
        message: message,
        type: type,
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
            duration: 5000,
            onScreen: true
        }
    });
}