alter table polls add vote_limit_per_option integer;
alter table polls add vote_limit_per_option_enabled boolean default false;
