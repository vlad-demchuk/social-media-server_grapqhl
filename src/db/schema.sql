-- 001_init.sql
-- Migration: Create accounts table

CREATE TABLE public.accounts (
    id SERIAL PRIMARY KEY,
    account_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    id_token TEXT,
    access_token_expires_at TIMESTAMP,
    refresh_token_expires_at TIMESTAMP,
    scope TEXT,
    password TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT accounts_userId_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE
);

-- Indexes
CREATE UNIQUE INDEX accounts_pkey ON public.accounts USING BTREE (id);

-- Migration: Create comments table

CREATE TABLE public.comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),

    CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id)
        REFERENCES public.posts (id)
        ON DELETE CASCADE,

    CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE
);

-- Indexes (Postgres automatically creates one for PRIMARY KEY,
-- but adding explicitly for clarity if you want)
CREATE UNIQUE INDEX comments_pkey ON public.comments USING BTREE (id);

-- Migration: Create follows table

CREATE TABLE public.follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL,
    followed_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT fk_follower FOREIGN KEY (follower_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_followed FOREIGN KEY (followed_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE,

    CONSTRAINT unique_follow UNIQUE (follower_id, followed_id)
);

-- Indexes (automatically created for PRIMARY KEY, but adding explicitly for clarity)
CREATE UNIQUE INDEX follows_pkey ON public.follows USING BTREE (id);
CREATE UNIQUE INDEX unique_follow ON public.follows USING BTREE (follower_id, followed_id);

-- Migration: Create likes table

CREATE TABLE public.likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT now(),

    CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id)
        REFERENCES public.posts (id)
        ON DELETE CASCADE,

    CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE,

    CONSTRAINT likes_user_id_post_id_key UNIQUE (user_id, post_id)
);

-- Indexes
CREATE UNIQUE INDEX likes_pkey ON public.likes USING BTREE (id);
CREATE UNIQUE INDEX likes_user_id_post_id_key ON public.likes USING BTREE (user_id, post_id);

-- Migration: Create posts table

CREATE TABLE public.posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),

    CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE
);

-- Indexes
CREATE UNIQUE INDEX posts_pkey ON public.posts USING BTREE (id);

-- Migration: Create users table

CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    email_verified BOOLEAN NOT NULL DEFAULT false,
    image TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE UNIQUE INDEX users_pkey ON public.users USING BTREE (id);
CREATE UNIQUE INDEX users_email_key ON public.users USING BTREE (email);
CREATE UNIQUE INDEX users_username_key ON public.users USING BTREE (username);

-- Migration: Create sessions table

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

-- Indexes
CREATE UNIQUE INDEX sessions_pkey ON public.sessions USING BTREE (id);
CREATE UNIQUE INDEX sessions_token_key ON public.sessions USING BTREE (token);

-- Migration: Create verifications table

CREATE TABLE public.verifications (
    id SERIAL PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE UNIQUE INDEX verifications_pkey ON public.verifications USING BTREE (id);
