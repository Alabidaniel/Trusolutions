const prisma = require("../../config/prisma");

async function listIssues() {
  return prisma.issue.findMany({
    where: { isActive: true, deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

module.exports = {
  listIssues,
};

