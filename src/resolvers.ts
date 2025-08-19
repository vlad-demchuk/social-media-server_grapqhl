import * as postService from "./services/post.service.js";
import { Resolvers } from "./types.js";

const mockPosts = [
  {
    id: "1",
    content: "Just finished building my first GraphQL server 🚀",
    createdAt: "2025-08-18T13:20:00.000Z",
    username: "alice",
    likesCount: 12,
    commentsCount: 2,
    comments: [
      {
        id: "101",
        content: "That's awesome! Congrats 🎉",
        createdAt: "2025-08-18T13:25:00.000Z",
        username: "bob",
      },
      {
        id: "102",
        content: "Keep going! 💪",
        createdAt: "2025-08-18T13:30:00.000Z",
        username: "charlie",
      },
    ],
  },
  {
    id: "2",
    content: "Learning PostgreSQL joins today. It's actually not that scary 😅",
    createdAt: "2025-08-17T15:00:00.000Z",
    username: "bob",
    likesCount: 8,
    commentsCount: 1,
    comments: [
      {
        id: "103",
        content: "Haha, yeah, once you get it, it's super powerful!",
        createdAt: "2025-08-17T15:10:00.000Z",
        username: "diana",
      },
    ],
  },
  {
    id: "3",
    content: "Anyone else hyped for Next.js 15 release? 🔥",
    createdAt: "2025-08-16T20:45:00.000Z",
    username: "charlie",
    likesCount: 20,
    commentsCount: 3,
    comments: [
      {
        id: "104",
        content: "Yes! Especially excited for the new router improvements.",
        createdAt: "2025-08-16T21:00:00.000Z",
        username: "alice",
      },
      {
        id: "105",
        content: "Finally, streaming + GraphQL will be smooth!",
        createdAt: "2025-08-16T21:05:00.000Z",
        username: "bob",
      },
      {
        id: "106",
        content: "I just hope build times improve 🤞",
        createdAt: "2025-08-16T21:10:00.000Z",
        username: "diana",
      },
    ],
  },
  {
    id: "4",
    content: "Experimenting with WebSockets in Express. Real-time FTW!",
    createdAt: "2025-08-15T18:15:00.000Z",
    username: "diana",
    likesCount: 5,
    commentsCount: 0,
    comments: [],
  },
  {
    id: "5",
    content: "Weekend hackathon project: a mini habit tracker app 📅",
    createdAt: "2025-08-14T10:05:00.000Z",
    username: "eve",
    likesCount: 15,
    commentsCount: 2,
    comments: [
      {
        id: "107",
        content: "Nice! Will you open-source it?",
        createdAt: "2025-08-14T10:20:00.000Z",
        username: "alice",
      },
      {
        id: "108",
        content: "Habit trackers are the best for side projects!",
        createdAt: "2025-08-14T10:25:00.000Z",
        username: "charlie",
      },
    ],
  },
];

export const resolvers: Resolvers = {
  Query: {
    posts: async () => {
      const posts = await postService.getAll();

      return posts;
    },
  },
  Mutation: {
    createPost: async (_, args) => {
      try {
        const post = await postService.create({
          content: args.input.content,
          userId: 1,
        });

        return {
          code: 200,
          success: true,
          message: "Post successfully created!",
          post,
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Something went wrong: ${error.extensions.response.body}`,
        };
      }
    },
    deletePost: async (_, args) => {
      try {
        await postService.remove(args.postId)

        return {
          code: 200,
          success: true,
          message: "Post successfully deleted!",
          postId: args.postId,
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Something went wrong: ${error.extensions.response.body}`,
        };
      }
    }
  },
};
