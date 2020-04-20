CREATE TYPE public.outcome AS ENUM (
  'won',
  'lost'
);

ALTER TYPE public.card OWNER TO master;
