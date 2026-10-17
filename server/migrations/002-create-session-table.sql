CREATE TABLE session (
    sid VARCHAR PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMPTZ NOT NULL
);

CREATE INDEX session_expire_idx ON session (expire);
