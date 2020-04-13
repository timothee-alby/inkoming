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
-- Name: players players_room_id_fkey; Type: FK CONSTRAINT; Schema: api; Owner: master
--

ALTER TABLE ONLY api.players
    ADD CONSTRAINT players_room_id_fkey FOREIGN KEY (room_id) REFERENCES api.rooms(id) ON DELETE CASCADE;


--
-- Name: players player_policy; Type: POLICY; Schema: api; Owner: master
--

CREATE POLICY player_policy ON api.players USING (((user_id)::text = current_setting('request.jwt.claim.user_id'::text, true))) WITH CHECK (((user_id)::text = current_setting('request.jwt.claim.user_id'::text, true)));


--
-- Name: players; Type: ROW SECURITY; Schema: api; Owner: master
--

ALTER TABLE api.players ENABLE ROW LEVEL SECURITY;

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
-- PostgreSQL database dump complete
--

