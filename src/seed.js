import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Ensure clean state (CAREFUL in production!)
    await pool.query(`
      TRUNCATE likes, comments, follows, posts, users RESTART IDENTITY CASCADE;
    `);

    // USERS
    await pool.query(`
      INSERT INTO users (username, email, password_hash, created_at) VALUES
      ('alice', 'alice@example.com', 'hashed_pw1', NOW() - interval '10 days'),
      ('bob', 'bob@example.com', 'hashed_pw2', NOW() - interval '9 days'),
      ('charlie', 'charlie@example.com', 'hashed_pw3', NOW() - interval '8 days'),
      ('diana', 'diana@example.com', 'hashed_pw4', NOW() - interval '7 days'),
      ('eva', 'eva@example.com', 'hashed_pw5', NOW() - interval '6 days'),
      ('frank', 'frank@example.com', 'hashed_pw6', NOW() - interval '5 days'),
      ('george', 'george@example.com', 'hashed_pw7', NOW() - interval '4 days'),
      ('hannah', 'hannah@example.com', 'hashed_pw8', NOW() - interval '3 days'),
      ('ian', 'ian@example.com', 'hashed_pw9', NOW() - interval '2 days'),
      ('julia', 'julia@example.com', 'hashed_pw10', NOW() - interval '1 days');
    `);

    // POSTS
    await pool.query(`
      INSERT INTO posts (user_id, content, created_at) VALUES
      (1, 'Hello world from Alice!', NOW() - interval '5 days'),
      (2, 'Bob here, nice to meet you all!', NOW() - interval '4 days'),
      (3, 'Charlie posting about SQL.', NOW() - interval '3 days'),
      (4, 'Diana loves GraphQL!', NOW() - interval '3 days'),
      (5, 'Eva testing mock data generation.', NOW() - interval '2 days'),
      (6, 'Frank likes backend stuff.', NOW() - interval '2 days'),
      (7, 'George posting something random.', NOW() - interval '1 days'),
      (8, 'Hannah loves React.', NOW() - interval '1 days'),
      (9, 'Ian debugging queries.', NOW()),
      (10, 'Julia saying hi!', NOW());
    `);

    // LIKES
    await pool.query(`
      INSERT INTO likes (user_id, post_id, created_at) VALUES
      (1, 2, NOW() - interval '2 days'),
      (2, 1, NOW() - interval '2 days'),
      (3, 1, NOW() - interval '1 days'),
      (4, 1, NOW()),
      (5, 3, NOW()),
      (6, 4, NOW() - interval '1 days'),
      (7, 5, NOW()),
      (8, 6, NOW()),
      (9, 7, NOW()),
      (10, 8, NOW());
    `);

    // COMMENTS
    await pool.query(`
      INSERT INTO comments (user_id, post_id, content, created_at) VALUES
      (2, 1, 'Nice post, Alice!', NOW() - interval '2 days'),
      (3, 1, 'Agree with Bob!', NOW() - interval '1 days'),
      (4, 2, 'Cool intro!', NOW() - interval '1 days'),
      (5, 3, 'SQL is awesome.', NOW()),
      (6, 3, 'Yes, totally agree!', NOW()),
      (7, 4, 'GraphQL FTW!', NOW()),
      (8, 5, 'Nice testing!', NOW()),
      (9, 6, 'Backend rocks.', NOW()),
      (10, 7, 'Random but fun!', NOW()),
      (1, 8, 'React is the best!', NOW());
    `);

    // FOLLOWS
    await pool.query(`
      INSERT INTO follows (follower_id, followed_id, created_at) VALUES
      (1, 2, NOW() - interval '5 days'),
      (2, 3, NOW() - interval '4 days'),
      (3, 4, NOW() - interval '4 days'),
      (4, 5, NOW() - interval '3 days'),
      (5, 6, NOW() - interval '3 days'),
      (6, 7, NOW() - interval '2 days'),
      (7, 8, NOW() - interval '2 days'),
      (8, 9, NOW() - interval '1 days'),
      (9, 10, NOW() - interval '1 days'),
      (10, 1, NOW());
    `);

    console.log("✅ Seeding completed!");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await pool.end();
  }
}

seed();