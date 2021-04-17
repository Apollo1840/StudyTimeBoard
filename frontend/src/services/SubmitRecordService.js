import HttpService from "./HttpService";
import { SERVER_BASE_URL, GO_URL, HOLD_URL } from "../shared/serverUrls.js";

export default class SubmitRecordService {
  static submit_go(username) {
    return new Promise((resolve, reject) => {
      HttpService.post(
        SERVER_BASE_URL + GO_URL,
        { username: username },
        () => {
          console.log("on success");
          resolve(null);
        },
        (errorMsg) => {
          reject(errorMsg);
        }
      );
    });
  }
  static submit_hold(username) {
    return new Promise((resolve, reject) => {
      HttpService.post(
        SERVER_BASE_URL + HOLD_URL,
        { username: username },
        () => {
          console.log("on success");
          resolve(null);
        },
        (errorMsg) => {
          reject(errorMsg);
        }
      );
    });
  }
}
