import store from "../redux-store";

export default class HttpService{
    static baseURL() {return "http://0.0.0.0:5555/";}

    static get(url, onSuccess, onError){
        let token = store.getState().auth.token;
        let header = new Headers();
        if(token){
            header.append('Authorization', 'JWT ' + token);
        }

        fetch(url,{
            method: 'GET',
            headers: header
        }).then((resp) => {
            if(!this.checkIfauthorized(resp)){
                if(window.location.pathname !== '/login')
                    window.location = "/login";
                else
                    window.location.reload();
            }
            else{
                return resp.json()
            }
        }).then((resp)=>{
            if(resp.error){
                onError(resp.error);
            }
            else{
                // TODO: refresh jwt token
                onSuccess(resp);
            }
        }).catch((e) => {
            onError(e.message);
        });
    }

    static put(url, data, onSuccess, onError){
        let token = window.localStorage['jwtToken'];
        let header = new Headers();
        if(token){
            header.append('Authorization', 'JWT ' + token);
        }
        header.append('Content-Type', 'application/json');

        fetch(url, {
            method: 'PUT',
            headers: header,
            body: JSON.stringify(data)
        }).then((resp) => {
            if(this.checkIfUnauthorized(resp)){
                if(window.location.pathname !== '/login')
                    window.location = "/login";
                return;
            }
            else{
                return resp.json();
            }
        }).then((resp) => {
            if(resp.error){
                onError(resp.error);
            }
            else{
                // TODO: refresh jwt token
                onSuccess(resp);
            }
        }).catch((e) => {
            onError(e.message);
        });
    }

    static post(url, data, onSuccess, onError){
        let token = window.localStorage['jwtToken'];
        let header = new Headers();
        if(token){
            header.append('Authorization', 'JWT ' + token);
        }
        header.append('Content-Type', 'application/json');

        fetch(url, {
            method: 'POST',
            headers: header,
            body: JSON.stringify(data)
        }).then((resp) => {
            if(this.checkIfUnauthorized(resp)) {
                if(window.location.pathname !== '/login')
                    window.location = "/login";
                return;
            }
            else {
                return resp.json();
            }
        }).then((resp) => {
            if(resp.error){
                onError(resp.error);
            }
            else{
                // TODO: refresh jwt token
                onSuccess(resp);
            }
        }).catch((e) => {
            onError(e.message);
        });
    }

    static delete(url, onSuccess, onError) {
        let token = window.localStorage['jwtToken'];
        let header = new Headers();
        if(token) {
            header.append('Authorization', 'JWT ' + token);
        }
        
        fetch(url,{
            method: 'DELETE',
            headers: header
        }).then((resp) => {
            if(this.checkIfUnauthorized(resp)){
                if(window.location.pathname !== '/login')
                    window.location = "/login";
                return;
            }
            else {
                return resp.json();
            }
        }).then((resp) => {
            if(resp.error) {
                onError(resp.error);
            }
            else {
                onSuccess(resp)
            }
        }).catch((e) => {
            onError(e.message);
        });
    }
    
    static checkIfauthorized(res){
        if(res.status === 401){
            return false;
        }
        return true;
    }
}
