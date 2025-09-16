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
