alter table "public"."families" alter column "active" set not null;

alter table "public"."families" alter column "created_at" set default (now() AT TIME ZONE 'utc'::text);

alter table "public"."families" alter column "created_at" set not null;

alter table "public"."families" alter column "id" set default gen_random_uuid();

alter table "public"."families" alter column "image" set data type text using "image"::text;

alter table "public"."families" alter column "name" set not null;

alter table "public"."families" alter column "name" set data type text using "name"::text;

alter table "public"."families" alter column "updated_at" set default (now() AT TIME ZONE 'utc'::text);

alter table "public"."families" alter column "updated_at" set not null;

alter table "public"."posts" alter column "content" set data type text using "content"::text;

alter table "public"."posts" alter column "created_at" set default (now() AT TIME ZONE 'utc'::text);

alter table "public"."posts" alter column "created_at" set not null;

alter table "public"."posts" alter column "id" set default gen_random_uuid();

alter table "public"."posts" alter column "topic_id" set not null;

alter table "public"."posts" alter column "updated_at" set default (now() AT TIME ZONE 'utc'::text);

alter table "public"."posts" alter column "updated_at" set not null;

alter table "public"."posts" alter column "user_id" set not null;

alter table "public"."topics" alter column "completed" set not null;

alter table "public"."topics" alter column "created_at" set default (now() AT TIME ZONE 'utc'::text);

alter table "public"."topics" alter column "created_at" set not null;

alter table "public"."topics" alter column "family_id" set not null;

alter table "public"."topics" alter column "id" set default gen_random_uuid();

alter table "public"."topics" alter column "summary_sent" set not null;

alter table "public"."topics" alter column "updated_at" set default (now() AT TIME ZONE 'utc'::text);

alter table "public"."topics" alter column "updated_at" set not null;

alter table "public"."users" alter column "first_name" set not null;

alter table "public"."users" alter column "first_name" set data type text using "first_name"::text;

alter table "public"."users" alter column "id" set default gen_random_uuid();

alter table "public"."users" alter column "image" set data type text using "image"::text;

alter table "public"."users" alter column "last_name" set not null;

alter table "public"."users" alter column "last_name" set data type text using "last_name"::text;

alter table "public"."users" alter column "phone" set data type text using "phone"::text;

CREATE UNIQUE INDEX families_id_key ON public.families USING btree (id);

CREATE UNIQUE INDEX posts_id_key ON public.posts USING btree (id);

CREATE UNIQUE INDEX topics_id_key ON public.topics USING btree (id);

alter table "public"."families" add constraint "families_id_key" UNIQUE using index "families_id_key";

alter table "public"."posts" add constraint "posts_id_key" UNIQUE using index "posts_id_key";

alter table "public"."topics" add constraint "topics_id_key" UNIQUE using index "topics_id_key";


