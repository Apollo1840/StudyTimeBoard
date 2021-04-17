import HttpService from "./HttpService";
import {SERVER_BASE_URL, MINUTES_LASTWEEK_URL, MINUTES_TOTAL, PERSONAL_TIMESTAMPS} from "../shared/serverUrls.js";
import store from "../redux-store";

export default class TimeboardService {

  // TODO: move this to somewhere robust
  static frontEndURL() {
    return "http://localhost:3000/";
  }

  // Get logged minutes of all users of last week
  static getMinutesLastWeek() {
    return new Promise((resolve,reject) => {
        HttpService.get(SERVER_BASE_URL + MINUTES_LASTWEEK_URL,
        (data) => {
          resolve(JSON.parse(data));
        },
        (errorMsg) => {
          reject(errorMsg);
        }
      );
    });
  }

  // Get logged minutes of all users of all time
  static getMinutesWholeTime() {
    return new Promise((resolve,reject) => {
        HttpService.get(SERVER_BASE_URL + MINUTES_TOTAL,
        (data) => {
          resolve(JSON.parse(data));
        },
        (errorMsg) => {
          reject(errorMsg);
        }
      );
    });
  }

  // Get logged time stamps of current user of all time
  static getPersonalTimestamps() {
    return new Promise((resolve,reject) => {
        HttpService.get(SERVER_BASE_URL + PERSONAL_TIMESTAMPS,
        (data) => {
          resolve(JSON.parse(data));
        },
        (errorMsg) => {
          reject(errorMsg);
        }
      );
    });
  }
}