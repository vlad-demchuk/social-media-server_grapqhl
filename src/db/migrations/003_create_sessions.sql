CREATE TABLE public.sessions (
    id SERIAL PRIMARY KEY,
    expires_at TIMESTAMP NOT NULL,
    token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    user_id INTEGER NOT NULL,

    CONSTRAINT sessions_userId_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE,
    CONSTRAINT sessions_token_key UNIQUE (token)
);

CREATE UNIQUE INDEX sessions_pkey ON public.sessions USING BTREE (id);
CREATE UNIQUE INDEX sessions_token_key ON public.sessions USING BTREE (token);
