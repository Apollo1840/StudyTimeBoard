import HttpService from "./HttpService";
import { SERVER_BASE_URL, ACTIVE_USERS_URL } from "../shared/serverUrls.js";

export default class ActiveUsersService {
  static getActiveUsers() {
    return new Promise((resolve, reject) => {
      HttpService.get(
        SERVER_BASE_URL + ACTIVE_USERS_URL,
        (data) => {
          resolve(data);
        },
        (errorMsg) => {
          reject(errorMsg);
        }
      );
    });
  }
}
