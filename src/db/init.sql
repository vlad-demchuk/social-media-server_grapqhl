-- =========================
-- INIT SCHEMA + SEED DATA
-- =========================

-- 1. USERS
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

-- seed users
INSERT INTO public.users (username, email, email_verified, image) VALUES
('alice', 'alice@example.com', true, 'https://i.pravatar.cc/150?img=1'),
('bob', 'bob@example.com', false, 'https://i.pravatar.cc/150?img=2'),
('charlie', 'charlie@example.com', false, 'https://i.pravatar.cc/150?img=3');

-- 2. ACCOUNTS
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
CREATE UNIQUE INDEX accounts_pkey ON public.accounts USING BTREE (id);

-- seed accounts
INSERT INTO public.accounts (account_id, provider_id, user_id, password)
VALUES
('acc_alice', 'local', 1, 'hashed_pw1'),
('acc_bob', 'local', 2, 'hashed_pw2');

-- 3. SESSIONS
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

-- seed sessions
INSERT INTO public.sessions (expires_at, token, updated_at, ip_address, user_agent, user_id)
VALUES
(now() + interval '7 days', 'token_alice', now(), '127.0.0.1', 'Mozilla/5.0', 1),
(now() + interval '7 days', 'token_bob', now(), '127.0.0.1', 'Mozilla/5.0', 2);

-- 4. POSTS
CREATE TABLE public.posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE
);
CREATE UNIQUE INDEX posts_pkey ON public.posts USING BTREE (id);

-- seed posts
INSERT INTO public.posts (user_id, content) VALUES
(1, 'Hello world, this is Alice''s first post!'),
(2, 'Bob checking in with a quick update.'),
(3, 'Charlie here – loving this new app!');

-- 5. COMMENTS
CREATE TABLE public.comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE,
    CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id)
        REFERENCES public.posts (id)
        ON DELETE CASCADE
);
CREATE UNIQUE INDEX comments_pkey ON public.comments USING BTREE (id);

-- seed comments
INSERT INTO public.comments (user_id, post_id, content) VALUES
(2, 1, 'Nice post Alice!'),
(3, 1, 'Agree, welcome!'),
(1, 2, 'Good update Bob'),
(1, 3, 'Thanks Charlie!');

-- 6. LIKES
CREATE TABLE public.likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE,
    CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id)
        REFERENCES public.posts (id)
        ON DELETE CASCADE,
    CONSTRAINT likes_user_id_post_id_key UNIQUE (user_id, post_id)
);
CREATE UNIQUE INDEX likes_pkey ON public.likes USING BTREE (id);
CREATE UNIQUE INDEX likes_user_id_post_id_key ON public.likes USING BTREE (user_id, post_id);

-- seed likes
INSERT INTO public.likes (user_id, post_id) VALUES
(1, 2),
(2, 1),
(3, 1),
(3, 2);

-- 7. FOLLOWS
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
CREATE UNIQUE INDEX follows_pkey ON public.follows USING BTREE (id);
CREATE UNIQUE INDEX unique_follow ON public.follows USING BTREE (follower_id, followed_id);

-- seed follows
INSERT INTO public.follows (follower_id, followed_id) VALUES
(1, 2),
(2, 1),
(3, 1);

-- 8. VERIFICATIONS
CREATE TABLE public.verifications (
    id SERIAL PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX verifications_pkey ON public.verifications USING BTREE (id);

-- seed verifications
INSERT INTO public.verifications (identifier, value, expires_at)
VALUES
('alice@example.com', '123456', now() + interval '15 minutes'),
('bob@example.com', '654321', now() + interval '15 minutes');
