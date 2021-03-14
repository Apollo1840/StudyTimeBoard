import HttpService from "./HttpService";
import store from "../redux-store";
import {logout} from "../redux/authActions";
import {SERVER_BASE_URL, REGISTRATION_URL, LOGIN_URL} from "../shared/serverUrls.js";

export default class UserService {

    static frontEndURL() {
      return "http://localhost:3000/";
    }

    static register(user,pass, userData) {
        return new Promise((resolve,reject) => {
            HttpService.post(UserService.baserURL() + '/register', {
                username: user,
                password: pass,
                userData: userData
            }, (data) => {
                resolve(data);
                window.location.assign(UserService.frontEndURL());
            }, (textStatus) => {
                reject(textStatus);
            });
        });
    }

    static login(user, pass) {
      console.log("AuthService.login!!")
      return new Promise((resolve, reject) => {
        console.log("inside promise!")
        HttpService.post(
          SERVER_BASE_URL + LOGIN_URL,
          {
            username: user,
            password: pass,
          },
          (data) => {
            console.log("resolve data")
            console.log(data)
            resolve(data);
            window.history.pushState({ foo: 'bar' }, '', UserService.frontEndURL());
          },
          (textStatus) => {
            console.log("reject textStatus")
            console.log(textStatus)
            reject(textStatus);
          }
        );
      });
    }

    static logout() {
      store.dispatch(logout());
      return new Promise((resolve, reject) => {
        HttpService.get(
          SERVER_BASE_URL + "/logout",
          (data) => {
            window.location.assign(UserService.frontEndURL());
            resolve(data);
          },
          (statusText) => {
            reject(statusText);
          }
        );
      });
    }

    static getCurrentUser() {
      let token = store.getState().auth.token;
      if (!token || token === "null" || token === null) return {};

      let base64Url = token.split(".")[1];
      let base64 = base64Url.replace("-", "+").replace("_", "/");
      return {
        id: JSON.parse(window.atob(base64)).id,
        username: JSON.parse(window.atob(base64)).username,
      };
    }

    static isAuthenticated() {
      return (
        store.getState().auth.token !== null &&
        store.getState().auth.token !== "null"
      );
    }
  }