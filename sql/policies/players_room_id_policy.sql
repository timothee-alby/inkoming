CREATE POLICY players_room_id_policy ON api.players USING ((room_id IS NOT NULL));
