const prisma = require("../../config/prisma");
const { parsePagination } = require("../../utils/pagination");

function buildAuthorDisplayName(post) {
  if (post.isAnonymous) {
    return "Anonymous";
  }

  return (
    post.authorUser.fullName ||
    post.authorUser.username ||
    "User"
  );
}

async function listPosts({ userId, query }) {
  const { page, limit, skip, take } = parsePagination(query);

  const where = { deletedAt: null };

  const [items, total] = await prisma.$transaction([
    prisma.communityPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        authorUser: { select: { fullName: true, username: true } },
      },
    }),
    prisma.communityPost.count({ where }),
  ]);

  const postIds = items.map((p) => p.id);

  const [likeCounts, commentCounts, myReactions] = await prisma.$transaction([
    prisma.postReaction.groupBy({
      by: ["postId"],
      where: { postId: { in: postIds }, kind: "LIKE" },
      _count: { _all: true },
    }),
    prisma.comment.groupBy({
      by: ["postId"],
      where: { postId: { in: postIds }, deletedAt: null },
      _count: { _all: true },
    }),
    prisma.postReaction.findMany({
      where: { postId: { in: postIds }, userId },
      select: { postId: true, kind: true, reaction: true },
    }),
  ]);

  const likeCountByPost = new Map(likeCounts.map((x) => [x.postId, x._count._all]));
  const commentCountByPost = new Map(commentCounts.map((x) => [x.postId, x._count._all]));

  const myLikePostIds = new Set(
    myReactions.filter((r) => r.kind === "LIKE").map((r) => r.postId),
  );
  const myReactionByPost = new Map(
    myReactions
      .filter((r) => r.kind === "REACTION" && r.reaction)
      .map((r) => [r.postId, r.reaction]),
  );

  return {
    items: items.map((p) => ({
      id: p.id,
      title: p.title,
      body: p.body,
      topics: p.topics,
      isAnonymous: p.isAnonymous,
      authorDisplayName: buildAuthorDisplayName(p),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      likesCount: likeCountByPost.get(p.id) || 0,
      commentsCount: commentCountByPost.get(p.id) || 0,
      liked: myLikePostIds.has(p.id),
      reaction: myReactionByPost.get(p.id) || null,
    })),
    pageInfo: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function createPost({ userId, data }) {
  return prisma.communityPost.create({
    data: {
      authorUserId: userId,
      title: data.title,
      body: data.body,
      topics: data.topics,
      isAnonymous: data.isAnonymous ?? true,
    },
  });
}

async function likePost({ userId, postId, liked }) {
  const post = await prisma.communityPost.findFirst({
    where: { id: postId, deletedAt: null },
    select: { id: true },
  });

  if (!post) {
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }

  if (liked) {
    await prisma.postReaction.upsert({
      where: { postId_userId_kind: { postId, userId, kind: "LIKE" } },
      create: { postId, userId, kind: "LIKE" },
      update: {},
    });
  } else {
    await prisma.postReaction.deleteMany({
      where: { postId, userId, kind: "LIKE" },
    });
  }

  const likesCount = await prisma.postReaction.count({
    where: { postId, kind: "LIKE" },
  });

  return { postId, liked: Boolean(liked), likesCount };
}

async function reactPost({ userId, postId, reaction }) {
  const post = await prisma.communityPost.findFirst({
    where: { id: postId, deletedAt: null },
    select: { id: true },
  });

  if (!post) {
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }

  if (!reaction) {
    await prisma.postReaction.deleteMany({
      where: { postId, userId, kind: "REACTION" },
    });
    return { postId, reaction: null };
  }

  await prisma.postReaction.upsert({
    where: { postId_userId_kind: { postId, userId, kind: "REACTION" } },
    create: { postId, userId, kind: "REACTION", reaction },
    update: { reaction },
  });

  return { postId, reaction };
}

async function addComment({ userId, postId, body }) {
  const post = await prisma.communityPost.findFirst({
    where: { id: postId, deletedAt: null },
    select: { id: true },
  });

  if (!post) {
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }

  return prisma.comment.create({
    data: {
      postId,
      userId,
      body,
    },
  });
}

module.exports = {
  listPosts,
  createPost,
  likePost,
  reactPost,
  addComment,
};

