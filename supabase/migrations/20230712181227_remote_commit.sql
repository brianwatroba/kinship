alter table "public"."users" drop constraint "users_auth_id_fkey";

alter table "public"."users" drop column "auth_id";

alter table "public"."users" alter column "active" set not null;

alter table "public"."users" alter column "created_at" set not null;

alter table "public"."users" alter column "first_name" drop not null;

alter table "public"."users" alter column "last_name" drop not null;

alter table "public"."users" alter column "updated_at" set not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$begin
  insert into public.users (id, phone)
  values (new.id, new.phone);
  return new;
end;
$function$
;


