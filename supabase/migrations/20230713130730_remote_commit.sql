alter table "public"."topics" add column "prompt" text not null;

alter table "public"."users" alter column "family_id" set not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$begin
  NEW.phone := '+' || NEW.phone;
  INSERT INTO public.users (id, phone)
  VALUES (NEW.id, NEW.phone);
  RETURN NEW;
end;
$function$
;


