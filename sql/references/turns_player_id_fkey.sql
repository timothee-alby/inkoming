ALTER TABLE ONLY api.turns
    ADD CONSTRAINT turns_player_id_fkey FOREIGN KEY (player_id) REFERENCES api.players(id) ON DELETE CASCADE;
