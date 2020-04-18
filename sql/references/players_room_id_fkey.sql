ALTER TABLE ONLY api.players
    ADD CONSTRAINT players_room_id_fkey FOREIGN KEY (room_id) REFERENCES api.rooms(id) ON DELETE CASCADE;
