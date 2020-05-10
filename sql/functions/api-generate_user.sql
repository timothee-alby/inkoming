CREATE OR REPLACE FUNCTION api.generate_user()
RETURNS table (jwt TEXT)
LANGUAGE SQL SECURITY DEFINER AS
$$
  SELECT
    public.sign(
      ROW_TO_JSON(data), (SELECT value from secrets WHERE key = 'app.jwt_secret')
    ) AS jwt
  FROM (
    SELECT
      'web_anon' AS role,
      gen_random_uuid() AS user_id
  ) AS data;
$$;

ALTER FUNCTION api.generate_user() OWNER TO master;
