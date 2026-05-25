const Joi = require("joi");

const profileModeSchema = Joi.string().valid("GHOST", "MASKED", "OPEN");
const sharingModeSchema = Joi.string().valid("PUBLIC", "FRIENDS", "PRIVATE");
const focusModeSchema = Joi.string().valid("GUIDED", "FREEFORM", "MINDFUL");

module.exports = {
  updateMe: {
    body: Joi.object({
      fullName: Joi.string().trim().min(1).max(120).optional(),
      username: Joi.string().trim().min(2).max(32).optional(),
      bio: Joi.string().trim().max(2000).optional(),
      avatarUrl: Joi.string().uri().max(500).optional(),

      profileMode: profileModeSchema.optional(),
      maskedNickname: Joi.string().trim().min(1).max(64).optional(),
      maskedAvatarKey: Joi.string().trim().min(1).max(64).optional(),

      sharingMode: sharingModeSchema.optional(),
      focusMode: focusModeSchema.optional(),
    }).min(1),
  },
  getPreferences: {},
  updatePreferences: {
    body: Joi.object({
      defaultAnonymousPosting: Joi.boolean().optional(),
      profileVisibleInCommunity: Joi.boolean().optional(),
      wellnessInsightsSharing: Joi.boolean().optional(),

      pushEnabled: Joi.boolean().optional(),
      messageAlerts: Joi.boolean().optional(),
      communityAlerts: Joi.boolean().optional(),
      moodReminders: Joi.boolean().optional(),
    }).min(1),
  },
  replaceIssues: {
    body: Joi.object({
      issueIds: Joi.array().items(Joi.string().trim().min(1)).min(1).max(50).required(),
    }),
  },
};

