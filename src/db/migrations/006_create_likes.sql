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
