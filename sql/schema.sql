--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2 (Debian 12.2-2.pgdg100+1)
-- Dumped by pg_dump version 12.2 (Debian 12.2-2.pgdg100+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: api; Type: SCHEMA; Schema: -; Owner: master
--

CREATE SCHEMA api;


ALTER SCHEMA api OWNER TO master;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: card; Type: TYPE; Schema: public; Owner: master
--

CREATE TYPE public.card AS ENUM (
    'black',
    'red'
);


ALTER TYPE public.card OWNER TO master;

--
-- Name: api_turns_room_id_set(); Type: FUNCTION; Schema: public; Owner: master
--

CREATE FUNCTION public.api_turns_room_id_set() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
SELECT INTO NEW.room_id players.room_id
FROM api.players
WHERE players.id = NEW.player_id;
RETURN NEW;
END
$$;


ALTER FUNCTION public.api_turns_room_id_set() OWNER TO master;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: players; Type: TABLE; Schema: api; Owner: master
--

CREATE TABLE api.players (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    room_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE api.players OWNER TO master;

--
-- Name: players_test; Type: TABLE; Schema: api; Owner: master
--

CREATE TABLE api.players_test (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    room_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE api.players_test OWNER TO master;

--
-- Name: rooms; Type: TABLE; Schema: api; Owner: master
--

CREATE TABLE api.rooms (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    name character varying
);


ALTER TABLE api.rooms OWNER TO master;

--
-- Name: turns; Type: TABLE; Schema: api; Owner: master
--

CREATE TABLE api.turns (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    room_id uuid NOT NULL,
    player_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    card public.card,
    bet integer,
    CONSTRAINT turns_card_or_bet_not_null CHECK (((card IS NOT NULL) OR (bet IS NOT NULL)))
);


ALTER TABLE api.turns OWNER TO master;

--
-- Name: room_states; Type: VIEW; Schema: api; Owner: master
--

CREATE VIEW api.room_states AS
 SELECT rooms.id AS room_id,
    count(turns.id) AS total_turns,
    count(DISTINCT players.id) AS total_players,
    count(turns.card) AS total_cards,
    count(turns.bet) AS total_bets,
    max(turns.bet) AS last_bet
   FROM ((api.rooms
     LEFT JOIN api.players ON ((players.room_id = rooms.id)))
     LEFT JOIN api.turns ON ((turns.player_id = players.id)))
  GROUP BY rooms.id;


ALTER TABLE api.room_states OWNER TO master;

--
-- Name: room_options; Type: VIEW; Schema: api; Owner: master
--

CREATE VIEW api.room_options AS
 SELECT room_states.room_id,
    (room_states.total_cards >= room_states.total_players) AS can_bet,
    (room_states.total_bets = 0) AS can_card,
    (COALESCE(room_states.last_bet, 0) + 1) AS min_bet,
    room_states.total_cards AS max_bet
   FROM api.room_states;


ALTER TABLE api.room_options OWNER TO master;

--
-- Name: players players_pkey; Type: CONSTRAINT; Schema: api; Owner: master
--

ALTER TABLE ONLY api.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);


--
-- Name: players players_room_id_user_id_key; Type: CONSTRAINT; Schema: api; Owner: master
--

ALTER TABLE ONLY api.players
    ADD CONSTRAINT players_room_id_user_id_key UNIQUE (room_id, user_id);


--
-- Name: players_test players_test_room_id_user_id_key; Type: CONSTRAINT; Schema: api; Owner: master
--

ALTER TABLE ONLY api.players_test
    ADD CONSTRAINT players_test_room_id_user_id_key UNIQUE (room_id, user_id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: api; Owner: master
--

ALTER TABLE ONLY api.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: turns turns_pkey; Type: CONSTRAINT; Schema: api; Owner: master
--

ALTER TABLE ONLY api.turns
    ADD CONSTRAINT turns_pkey PRIMARY KEY (id);


--
-- Name: turns b_default; Type: TRIGGER; Schema: api; Owner: master
--

CREATE TRIGGER b_default BEFORE INSERT ON api.turns FOR EACH ROW EXECUTE FUNCTION public.api_turns_room_id_set();


--
-- Name: players players_room_id_fkey; Type: FK CONSTRAINT; Schema: api; Owner: master
--

ALTER TABLE ONLY api.players
    ADD CONSTRAINT players_room_id_fkey FOREIGN KEY (room_id) REFERENCES api.rooms(id) ON DELETE CASCADE;


--
-- Name: turns turns_player_id_fkey; Type: FK CONSTRAINT; Schema: api; Owner: master
--

ALTER TABLE ONLY api.turns
    ADD CONSTRAINT turns_player_id_fkey FOREIGN KEY (player_id) REFERENCES api.players(id) ON DELETE CASCADE;


--
-- Name: players; Type: ROW SECURITY; Schema: api; Owner: master
--

ALTER TABLE api.players ENABLE ROW LEVEL SECURITY;

--
-- Name: players players_user_id_policy; Type: POLICY; Schema: api; Owner: master
--

CREATE POLICY players_user_id_policy ON api.players USING (((user_id)::text = current_setting('request.jwt.claim.user_id'::text, true)));


--
-- Name: turns; Type: ROW SECURITY; Schema: api; Owner: master
--

ALTER TABLE api.turns ENABLE ROW LEVEL SECURITY;

--
-- Name: turns turns_can_bet_policy; Type: POLICY; Schema: api; Owner: master
--

CREATE POLICY turns_can_bet_policy ON api.turns USING (((bet IS NULL) OR ( SELECT room_options.can_bet
   FROM api.room_options
  WHERE (room_options.room_id = room_options.room_id))));


--
-- Name: turns turns_can_card_policy; Type: POLICY; Schema: api; Owner: master
--

CREATE POLICY turns_can_card_policy ON api.turns AS RESTRICTIVE USING (((card IS NULL) OR ( SELECT room_options.can_card
   FROM api.room_options
  WHERE (room_options.room_id = room_options.room_id))));


--
-- Name: turns turns_max_bet_policy; Type: POLICY; Schema: api; Owner: master
--

CREATE POLICY turns_max_bet_policy ON api.turns AS RESTRICTIVE USING (((bet IS NULL) OR (bet <= ( SELECT room_options.max_bet
   FROM api.room_options
  WHERE (room_options.room_id = room_options.room_id)))));


--
-- Name: turns turns_min_bet_policy; Type: POLICY; Schema: api; Owner: master
--

CREATE POLICY turns_min_bet_policy ON api.turns AS RESTRICTIVE USING (((bet IS NULL) OR (bet >= ( SELECT room_options.min_bet
   FROM api.room_options
  WHERE (room_options.room_id = room_options.room_id)))));


--
-- Name: turns turns_player_id_policy; Type: POLICY; Schema: api; Owner: master
--

CREATE POLICY turns_player_id_policy ON api.turns AS RESTRICTIVE USING ((player_id IN ( SELECT players.id
   FROM api.players
  WHERE ((players.user_id)::text = current_setting('request.jwt.claim.user_id'::text, true)))));


--
-- Name: SCHEMA api; Type: ACL; Schema: -; Owner: master
--

GRANT USAGE ON SCHEMA api TO web_anon;


--
-- Name: TABLE players; Type: ACL; Schema: api; Owner: master
--

GRANT SELECT,INSERT ON TABLE api.players TO web_anon;


--
-- Name: TABLE rooms; Type: ACL; Schema: api; Owner: master
--

GRANT SELECT,INSERT ON TABLE api.rooms TO web_anon;


--
-- Name: TABLE turns; Type: ACL; Schema: api; Owner: master
--

GRANT SELECT,INSERT ON TABLE api.turns TO web_anon;


--
-- Name: TABLE room_states; Type: ACL; Schema: api; Owner: master
--

GRANT SELECT ON TABLE api.room_states TO web_anon;


--
-- Name: TABLE room_options; Type: ACL; Schema: api; Owner: master
--

GRANT SELECT ON TABLE api.room_options TO web_anon;


--
-- PostgreSQL database dump complete
--

