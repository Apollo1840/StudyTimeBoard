import HttpService from "./HttpService";
import {
  SERVER_BASE_URL,
  GO_URL,
  HOLD_URL,
  INTERVAL_URL,
} from "../shared/serverUrls.js";

// todo?: sumbit the form with time. namely, record time by frontend, not backend
export default class SubmitRecordService {
  static submit_go(username) {
    return new Promise((resolve, reject) => {
      HttpService.post(
        SERVER_BASE_URL + GO_URL,
        { username: username },
        () => {
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
          resolve(null);
        },
        (errorMsg) => {
          reject(errorMsg);
        }
      );
    });
  }
  static submit_interval(username, start_time, end_time) {
    return new Promise((resolve, reject) => {
      HttpService.post(
        SERVER_BASE_URL + INTERVAL_URL,
        { username: username, start_time: start_time, end_time: end_time },
        () => {
          resolve(null);
        },
        (errorMsg) => {
          reject(errorMsg);
        }
      );
    });
  }
}
