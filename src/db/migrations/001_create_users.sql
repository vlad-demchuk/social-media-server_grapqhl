CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    email_verified BOOLEAN NOT NULL DEFAULT false,
    image TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX users_pkey ON public.users USING BTREE (id);
CREATE UNIQUE INDEX users_email_key ON public.users USING BTREE (email);
CREATE UNIQUE INDEX users_username_key ON public.users USING BTREE (username);
