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
