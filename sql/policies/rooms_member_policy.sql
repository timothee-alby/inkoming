CREATE POLICY rooms_member_policy
ON api.rooms
USING ((
    -- user is creator
    user_id::text = current_setting('request.jwt.claim.user_id'::text, true)
  ) OR (
    -- user is player
    SELECT TRUE
    FROM api.players
    WHERE players.user_id::text = current_setting('request.jwt.claim.user_id'::text, true)
    AND players.room_id = rooms.id
));
