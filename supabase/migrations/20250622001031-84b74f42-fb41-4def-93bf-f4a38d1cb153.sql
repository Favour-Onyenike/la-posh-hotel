
-- Add timeline fields to the rooms table for tracking when a room is taken
ALTER TABLE public.rooms 
ADD COLUMN taken_from DATE,
ADD COLUMN taken_until DATE;

-- Add a comment to explain the new fields
COMMENT ON COLUMN public.rooms.taken_from IS 'Start date when room is marked as taken (null if not taken or permanently taken)';
COMMENT ON COLUMN public.rooms.taken_until IS 'End date when room should automatically become available again (null if permanently taken)';
