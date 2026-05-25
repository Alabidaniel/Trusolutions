const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function seedIssues() {
  const issueNames = [
    "Stress",
    "Anxiety",
    "Grief",
    "Depression",
    "Relationship",
    "Confession",
    "Self-esteem",
    "Family",
    "Work",
    "Trauma",
    "Break-up",
    "Loneliness",
  ];

  const data = issueNames.map((name, index) => ({
    name,
    slug: slugify(name),
    sortOrder: index,
    isActive: true,
  }));

  await prisma.issue.createMany({ data, skipDuplicates: true });
}

async function seedTherapists() {
  const therapists = [
    {
      displayName: "Dr. Sarah Johnson",
      specialty: "Anxiety & Stress",
      ratingAvg: 4.9,
      sessionsCount: 150,
      bio: "CBT and mindfulness for anxiety management. Calm, practical support.",
    },
    {
      displayName: "Dr. Michael Chen",
      specialty: "Depression & Mood",
      ratingAvg: 4.8,
      sessionsCount: 200,
      bio: "Warm, structured sessions with evidence-based approaches for mood support.",
    },
    {
      displayName: "Dr. Emily Rodriguez",
      specialty: "Relationship Issues",
      ratingAvg: 5.0,
      sessionsCount: 120,
      bio: "Empathetic communication coach focused on relationship and attachment patterns.",
    },
    {
      displayName: "Dr. David Kim",
      specialty: "Trauma & PTSD",
      ratingAvg: 4.7,
      sessionsCount: 180,
      bio: "Trauma-informed care with grounding tools and long-term recovery planning.",
    },
    {
      displayName: "Dr. Lisa Patel",
      specialty: "ADHD & Focus",
      ratingAvg: 4.9,
      sessionsCount: 95,
      bio: "Action-oriented support for focus, routines, and executive function skills.",
    },
  ];

  for (const t of therapists) {
    const therapist = await prisma.therapist.upsert({
      where: { id: `seed-${slugify(t.displayName)}` },
      create: {
        id: `seed-${slugify(t.displayName)}`,
        displayName: t.displayName,
        specialty: t.specialty,
        ratingAvg: t.ratingAvg,
        sessionsCount: t.sessionsCount,
        bio: t.bio,
        isActive: true,
      },
      update: {
        displayName: t.displayName,
        specialty: t.specialty,
        ratingAvg: t.ratingAvg,
        sessionsCount: t.sessionsCount,
        bio: t.bio,
        isActive: true,
        deletedAt: null,
      },
    });

    const now = new Date();
    const day0 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0, 0);
    const slots = [9, 10, 11, 13, 15, 17].map((hour, idx) => {
      const startAt = new Date(day0.getTime());
      startAt.setHours(hour, 0, 0, 0);
      startAt.setDate(startAt.getDate() + Math.floor(idx / 3));
      const endAt = new Date(startAt.getTime() + 30 * 60 * 1000);
      return { therapistId: therapist.id, startAt, endAt, status: "AVAILABLE" };
    });

    await prisma.therapistSlot.createMany({ data: slots, skipDuplicates: true });
  }
}

async function main() {
  await seedIssues();
  await seedTherapists();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

