import HttpService from "./HttpService";
import store from "../redux-store";
import {logout} from "../redux/authActions";
import {SERVER_BASE_URL, REGISTRATION_URL, LOGIN_URL, LOGOUT_URL} from "../shared/serverUrls.js";

export default class AuthService {

    static frontEndURL() {
      return "http://localhost:3000/";
    }

    static register(user,pass, userData) {
        return new Promise((resolve,reject) => {
            HttpService.post(SERVER_BASE_URL + REGISTRATION_URL, {
                username: user,
                password: pass,
                userData: userData
            }, (data) => {
                resolve(data);
                window.location.assign(AuthService.frontEndURL());
            }, (errorMsg) => {
                reject(errorMsg);
            });
        });
    }

    static login(user, pass) {
      return new Promise((resolve, reject) => {
        HttpService.post(
          SERVER_BASE_URL + LOGIN_URL,
          {
            username: user,
            password: pass,
          },
          (data) => {
            resolve(data);
            window.location.assign(AuthService.frontEndURL());
          },
          (errorMsg) => {
            reject(errorMsg);
          }
        );
      });
    }

    static logout() {
      store.dispatch(logout());
      return new Promise((resolve, reject) => {
        HttpService.post(
          SERVER_BASE_URL + LOGOUT_URL,
          (data) => {
            window.location.assign(AuthService.frontEndURL());
            resolve(data);
          },
          (errorMsg) => {
            reject(errorMsg);
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