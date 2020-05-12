-- Information on structure of database

-- 'users' table:

-- spotify_email must be unique
-- username can be the same, but cannot be null

/*
id | spotify_email | username
___|_______________|__________
   |               |
   |               |
*/

-- 'countries' table:

-- country_name and alpha_2_code must be unique, not null
-- alternate_name can be null

/*
id | country_name | alpha_2_code | alternate_name
___|______________|______________|________________
   |              |              |
   |              |              |
*/


-- 'cities' table:

-- city_name and country_id can don't need to be unique, but cannot be null
/*
id | city_name | country_id
___|___________|______________
   |           |
   |           |
*/

-- 'countries_cities_users' table:

-- table to join user, countries, and cities 
-- all columns don't need to be unique, but cannot be null

/*
id | user_id |  city_id  | country_id
___|_________|___________|________________
   |         |           |
   |         |           |
*/