-- Align the persisted Table-session lifecycle with the paid Open Tab transition.

alter table public.table_sessions
  drop constraint table_sessions_status_check;

alter table public.table_sessions
  add constraint table_sessions_status_check
  check (status in ('pending','active','bill_requested','settled','cleaned','cancelled','expired'));
