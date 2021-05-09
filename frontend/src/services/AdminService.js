import HttpService from "./HttpService";
import {
  SERVER_BASE_URL,
  RELOAD_DATA_FROM_GS_URL,
} from "../shared/serverUrls.js";

export default class AdminService {
  static reloadDataFromGooglesheet() {
    return new Promise((resolve, reject) => {
      HttpService.get(
        SERVER_BASE_URL + RELOAD_DATA_FROM_GS_URL,
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
