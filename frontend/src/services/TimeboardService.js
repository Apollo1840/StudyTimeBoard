import HttpService from "./HttpService";
import {
  SERVER_BASE_URL,
  DURATIONS_LASTWEEK_URL,
  DURATIONS_TOTAL_URL,
  PERSONAL_DURATION_AVG_URL,
  PERSONAL_DURATIONS_URL,
  PERSONAL_DURATIONS_AVERAGE_URL,
  PERSONAL_INTERVALS_URL,
  PERSONAL_INTERVALS_PER_WEEK_URL,
} from "../shared/serverUrls.js";

export default class TimeboardService {
  // Get logged minutes of all users of last week
  static getMinutesLastWeek(groupAttr) {
    return new Promise((resolve, reject) => {
      HttpService.post(
        SERVER_BASE_URL + DURATIONS_LASTWEEK_URL,
        { groupAttr: groupAttr },
        (data) => {
          resolve(data);
        },
        (errorMsg) => {
          reject(errorMsg);
        }
      );
    });
  }

  // Get logged minutes of all users of all time
  static getMinutesWholeTime() {
    return new Promise((resolve, reject) => {
      HttpService.get(
        SERVER_BASE_URL + DURATIONS_TOTAL_URL,
        (data) => {
          resolve(data);
        },
        (errorMsg) => {
          reject(errorMsg);
        }
      );
    });
  }

  static getPersonalDurationAvg() {
    return new Promise((resolve, reject) => {
      HttpService.get(
        SERVER_BASE_URL + PERSONAL_DURATION_AVG_URL,
        (data) => {
          resolve(data);
        },
        (errorMsg) => {
          reject(errorMsg);
        }
      );
    });
  }

  // Get logged durations of current user of all time,
  // data from server contains pairs of date and integer,
  // date could be transfered only as string and must be converted to type `Date'.
  static getPersonalDurations() {
    return new Promise((resolve, reject) => {
      HttpService.get(
        SERVER_BASE_URL + PERSONAL_DURATIONS_URL,
        (data) => {
          resolve(data);
        },
        (errorMsg) => {
          reject(errorMsg);
        }
      );
    });
  }

  // Get average durations of current user of all time,
  // data from server contains pairs of date and integer,
  // date could be transfered only as string and must be converted to type `Date'.
  static getPersonalDurationsAverage() {
    return new Promise((resolve, reject) => {
      HttpService.get(
        SERVER_BASE_URL + PERSONAL_DURATIONS_AVERAGE_URL,
        (data) => {
          resolve(data);
        },
        (errorMsg) => {
          reject(errorMsg);
        }
      );
    });
  }

  // Get logged intervals of current user of all time,
  // data from server contains pairs of date and integer
  // date could be transfered only as string and must be converted to type `Date'.
  static getPersonalIntervals() {
    return new Promise((resolve, reject) => {
      HttpService.get(
        SERVER_BASE_URL + PERSONAL_INTERVALS_URL,
        (data) => {
          resolve(data);
        },
        (errorMsg) => {
          reject(errorMsg);
        }
      );
    });
  }

  // Get logged intervals of current user of all time with calender week ID.
  // Data from server contains start time, end time, week id and year.
  // Date could be transfered only as string and must be converted to type `Date'.
  static getPersonalIntervalsPerWeek() {
    return new Promise((resolve, reject) => {
      HttpService.get(
        SERVER_BASE_URL + PERSONAL_INTERVALS_PER_WEEK_URL,
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

export const WEEKDAY = "weekday";
export const CURRENT = "current";
