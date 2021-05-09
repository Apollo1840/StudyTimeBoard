// All urls of server web api

const SERVER_BASE_URL_DEV = "http://0.0.0.0:5555";
const SERVER_BASE_URL_PROD = "https://studytimeboard-backend.herokuapp.com";

// homeview API
export const GO_URL = "/api/go";
export const HOLD_URL = "/api/hold";
export const INTERVAL_URL = "/api/interval";

export const STUDYKING_URL = "/api/studying_king";
export const ACTIVE_USERS_URL = "/api/studying_users";

// user auth API
export const REGISTRATION_URL = "/api/registration";
export const LOGIN_URL = "/api/login";
export const LOGOUT_URL = "/api/logout";

// leaderboardview API
export const DURATIONS_LASTWEEK_URL = "/api/minutes_lastweek";
export const DURATIONS_TOTAL_URL = "/api/minutes_total";

// personalanalysisview API
export const PERSONAL_INTERVALS_URL = "/api/personal_intervals";
export const PERSONAL_DURATIONS_URL = "/api/personal_durations";
export const PERSONAL_INTERVALS_PER_WEEK_URL =
  "/api/personal_intervals_per_week";
export const SERVER_BASE_URL =
  process.env.NODE_ENV === "development"
    ? SERVER_BASE_URL_DEV
    : SERVER_BASE_URL_PROD;

// admin API
export const RELOAD_DATA_FROM_GS_URL = "/admin_reload_data";
