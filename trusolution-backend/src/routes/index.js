const express = require("express");

const router = express.Router();

const authRoutes = require("../modules/auth/auth.routes");
const usersRoutes = require("../modules/users/users.routes");
const issuesRoutes = require("../modules/issues/issues.routes");
const communityRoutes = require("../modules/community/community.routes");
const sessionsRoutes = require("../modules/sessions/sessions.routes");
const chatsRoutes = require("../modules/chat/chat.routes");
const therapistsRoutes = require("../modules/therapists/therapists.routes");
const appointmentsRoutes = require("../modules/appointments/appointments.routes");
const moodsRoutes = require("../modules/moods/moods.routes");
const notificationsRoutes = require("../modules/notifications/notifications.routes");
const supportRoutes = require("../modules/support/support.routes");

router.get("/", (req, res) => {
  res.status(200).json({ ok: true, version: "v1" });
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/issues", issuesRoutes);
router.use("/community", communityRoutes);
router.use("/sessions", sessionsRoutes);
router.use("/chats", chatsRoutes);
router.use("/therapists", therapistsRoutes);
router.use("/appointments", appointmentsRoutes);
router.use("/moods", moodsRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/support", supportRoutes);

module.exports = router;
