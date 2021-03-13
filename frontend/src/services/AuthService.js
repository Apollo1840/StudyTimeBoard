import HttpService from "./HttpService";
import store from "../redux-store";
import {logout} from "../redux/authActions";
import {SERVER_URL, REGISTRATION_URL, LOGIN_URL} from "../shared/serverUrls.js";

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
      return new Promise((resolve, reject) => {
        HttpService.post(
          UserService.baserURL() + "/login",
          {
            username: user,
            password: pass,
          },
          (data) => {
            resolve(data);
            window.location.assign(UserService.frontEndURL());
          },
          (textStatus) => {
            reject(textStatus);
          }
        );
      });
    }

    static logout() {
      store.dispatch(logout());
      return new Promise((resolve, reject) => {
        HttpService.get(
          SERVER_URL + "/logout",
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