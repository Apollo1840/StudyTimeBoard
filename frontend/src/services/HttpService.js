import store from "../redux-store";

export default class HttpService{

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
            // level 1: check if status=401, return resp.json
            if(!this.isauthorized(resp)){
                if(window.location.pathname !== '/login')
                    window.location = "/login";
                return;
            } else {
                return resp.json()
            }
        }).then((resp)=>{
            // level 2: check if return status is "success"
            if(resp.status == "success"){
                onSuccess(resp.data)
            } else {
                // TODO: refresh jwt token
                onError(resp.message);
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
            // level 1: check if status=401, return resp.json
            if(!this.isauthorized(resp)){
                if(window.location.pathname !== '/login')
                    window.location = "/login";
                return;
            } else {
                return resp.json();
            }
        }).then((resp)=>{
            // level 2: check if return status is "success"
            if(resp.status == "success"){
                onSuccess(resp.data);
            } else {
                // TODO: refresh jwt token
                onError(resp.message);
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
            // level 1: check if status=401, return resp.json
            if(!this.isauthorized(resp)) {
                if(window.location.pathname !== '/login')
                    window.location = "/login";
                return;
            }
            else {
                return resp.json();
            }
        }).then((resp)=>{
            // level 2: check if return status is "success"
            if(resp.status == "success"){
                onSuccess(resp.data)
            } else {
                // TODO: refresh jwt token
                onError(resp.message);
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
            // level 1: check if status=401, return resp.json
            if(!this.isauthorized(resp)){
                if(window.location.pathname !== '/login')
                    window.location = "/login";
                return;
            }
            else {
                return resp.json();
            }
        }).then((resp)=>{
            // level 2: check if return status is "success"
            if(resp.status == "success"){
                onSuccess(resp.data)
            } else {
                // TODO: refresh jwt token
                onError(resp.message);
            }
        }).catch((e) => {
            onError(e.message);
        });
    }
    
    static isauthorized(res){
        if(res.status === 401){
            return false;
        }
        return true;
    }
}
