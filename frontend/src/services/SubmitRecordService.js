import HttpService from "./HttpService";
import {
  SERVER_BASE_URL,
  GO_URL,
  HOLD_URL,
  DURATION_URL,
} from "../shared/serverUrls.js";

// todo?: sumbit the form with time. namely, record time by frontend, not backend
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
  static submit_duration(username, start_time, end_time) {
    return new Promise((resolve, reject) => {
      HttpService.post(
        SERVER_BASE_URL + DURATION_URL,
        { username: username, start_time: start_time, end_time: end_time },
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
