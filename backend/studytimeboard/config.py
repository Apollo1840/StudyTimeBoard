import os
from .constant import SHEET_EVENTS, SHEET_EVENTS_DEBUG, SHEET_USERBANK, SHEET_USERBANK_DEBUG

user_amount_limit = 100


if os.environ.get("PHASE", "DEV") == "PROD":
    debug_mode = False
else:
    debug_mdoel = True

if debug_mode:
    has_gs_auth = True
    if has_gs_auth:
        main_googlesheet_name = SHEET_EVENTS_DEBUG
        user_googlesheet_name = SHEET_USERBANK_DEBUG
        add_examples = False
        add_users = False
    else:
        main_googlesheet_name = None
        user_googlesheet_name = None
        add_examples = True
        add_users = True
else:
    main_googlesheet_name = SHEET_EVENTS
    user_googlesheet_name = SHEET_USERBANK
    add_examples = False
    add_users = False



