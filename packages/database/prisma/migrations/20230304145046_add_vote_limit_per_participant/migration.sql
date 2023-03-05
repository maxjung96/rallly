alter table polls add vote_limit_per_participant integer;
alter table polls add vote_limit_per_participant_enabled boolean default false;
