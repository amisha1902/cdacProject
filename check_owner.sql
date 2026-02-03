-- Check if Owner records exist for all OWNER users
SELECT u.user_id, u.email, u.user_role, o.owner_id, o.is_approved
FROM users u
LEFT JOIN owner o ON u.user_id = o.user_id
WHERE u.user_role = 'OWNER';

-- If any owners are missing Owner records, create them:
-- INSERT INTO owner (user_id, is_approved) 
-- SELECT u.user_id, FALSE 
-- FROM users u 
-- LEFT JOIN owner o ON u.user_id = o.user_id 
-- WHERE u.user_role = 'OWNER' AND o.owner_id IS NULL;

-- Check all salons
SELECT * FROM salon;
