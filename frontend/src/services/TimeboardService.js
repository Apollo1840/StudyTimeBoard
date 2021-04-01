import HttpService from "./HttpService";
import {SERVER_BASE_URL, MINUTES_LASTWEEK_URL, MINUTES_TOTAL} from "../shared/serverUrls.js";

export default class TimeboardService {

    // TODO: move this to somewhere robust
    static frontEndURL() {
      return "http://localhost:3000/";
    }

    static getLastweekMinutes() {
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
    static getUserMinutes() {
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
  }