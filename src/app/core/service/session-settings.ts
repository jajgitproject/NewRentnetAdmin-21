/** Keep in sync with EmployeeLoginSessionSettings on API (20 min timeout, 2 min warning). */
export const SESSION_INACTIVITY_TIMEOUT_MINUTES = 20;
export const SESSION_INACTIVITY_WARNING_LEAD_MINUTES = 2;

/** Tab registry prune threshold for open-tab / last-tab detection. */
export const SESSION_TAB_STALE_MS = 2 * 60 * 1000;

/** Session is active if any tab had activity within the inactivity timeout window. */
export const SESSION_ACTIVE_MS = SESSION_INACTIVITY_TIMEOUT_MINUTES * 60 * 1000;

export const SESSION_INACTIVITY_MS = SESSION_ACTIVE_MS;
export const SESSION_WARNING_MS =
  (SESSION_INACTIVITY_TIMEOUT_MINUTES - SESSION_INACTIVITY_WARNING_LEAD_MINUTES) * 60 * 1000;

export const SESSION_HEARTBEAT_DEBOUNCE_MS = 60 * 1000;
