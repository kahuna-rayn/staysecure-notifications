var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx, jsxs } from "react/jsx-runtime";
import React, { forwardRef, createElement, useState, useEffect, useCallback } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import "@supabase/supabase-js";
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = forwardRef(
    ({ className, ...props }, ref) => createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
      ...props
    })
  );
  Component.displayName = `${iconName}`;
  return Component;
};
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Calendar = createLucideIcon("Calendar", [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleAlert = createLucideIcon("CircleAlert", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleCheckBig = createLucideIcon("CircleCheckBig", [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleX = createLucideIcon("CircleX", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clock = createLucideIcon("Clock", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Copy = createLucideIcon("Copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Eye = createLucideIcon("Eye", [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LoaderCircle = createLucideIcon("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mail = createLucideIcon("Mail", [
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" }],
  ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7", key: "1ocrg3" }]
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Plus = createLucideIcon("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RefreshCw = createLucideIcon("RefreshCw", [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Search = createLucideIcon("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Send = createLucideIcon("Send", [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquarePen = createLucideIcon("SquarePen", [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "1m0v6g" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Trash2 = createLucideIcon("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const User = createLucideIcon("User", [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
]);
const _EmailService = class _EmailService {
  constructor() {
    __publicField(this, "defaultFrom");
    __publicField(this, "baseUrl");
    this.defaultFrom = "kahuna@raynsecure.com";
    this.baseUrl = "";
  }
  static getInstance() {
    if (!_EmailService.instance) {
      _EmailService.instance = new _EmailService();
    }
    return _EmailService.instance;
  }
  static configure(config) {
    const instance = _EmailService.getInstance();
    if (config.fromEmail) {
      instance.defaultFrom = config.fromEmail;
    }
    if (config.baseUrl) {
      instance.baseUrl = config.baseUrl;
    }
  }
  // Helper method to generate lesson URLs
  generateLessonUrl(lessonId, clientPath) {
    if (!this.baseUrl) {
      console.warn("Base URL not configured. Please configure EmailService with baseUrl.");
      return `#/lesson/${lessonId}`;
    }
    const base = this.baseUrl.endsWith("/") ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const path = clientPath ? `/${clientPath}` : "";
    return `${base}${path}/#/lesson/${lessonId}`;
  }
  // Template variable substitution with Handlebars-like conditionals and loops support
  // Made public so it can be used in preview
  substituteVariables(template, variables) {
    let result = template;
    const eachPattern = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
    const eachMatches = Array.from(template.matchAll(eachPattern));
    if (eachMatches.length > 0) {
      console.log("substituteVariables - Found {{#each}} loops:", eachMatches.length, eachMatches.map((m) => ({ key: m[1], content: m[2].substring(0, 50) })));
      result = result.replace(eachPattern, (_match, arrayKey, loopContent) => {
        console.log(`substituteVariables - Processing {{#each ${arrayKey}}}:`, {
          arrayKey,
          arrayValue: variables[arrayKey],
          isArray: Array.isArray(variables[arrayKey]),
          length: Array.isArray(variables[arrayKey]) ? variables[arrayKey].length : "N/A",
          loopContent: loopContent.substring(0, 100)
        });
        const arrayValue = variables[arrayKey];
        if (!Array.isArray(arrayValue) || arrayValue.length === 0) {
          console.log(`substituteVariables - Skipping {{#each ${arrayKey}}} - not an array or empty`);
          return "";
        }
        const itemsHtml = arrayValue.map((item) => {
          let itemHtml = loopContent;
          itemHtml = itemHtml.replace(/\{\{(\w+)\}\}/g, (varMatch, propKey) => {
            const value = item[propKey] !== void 0 ? String(item[propKey] || "") : varMatch;
            return value;
          });
          return itemHtml;
        }).join("");
        console.log(`substituteVariables - {{#each ${arrayKey}}} result:`, itemsHtml.substring(0, 200));
        return itemsHtml;
      });
    }
    result = result.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_match, variableName, content) => {
      const value = variables[variableName];
      if (value && value !== "" && value !== "false" && value !== "0") {
        return content;
      }
      return "";
    });
    for (const [key, value] of Object.entries(variables)) {
      if (Array.isArray(value)) {
        continue;
      }
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
      result = result.replace(regex, String(value || ""));
    }
    return result;
  }
  // Fetch template from database
  async fetchTemplate(type, supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from("email_templates").select("*").eq("type", type).eq("is_active", true).order("system", { ascending: false }).limit(1).single();
      if (error) {
        console.error(`Error fetching template for type ${type}:`, error);
        return null;
      }
      return data;
    } catch (error) {
      console.error(`Error fetching template for type ${type}:`, error);
      return null;
    }
  }
  // Send email using template from database
  async sendEmailFromTemplate(type, to, variables, supabaseClient, options = {}) {
    try {
      const { userId, respectPreferences = true } = options;
      if (respectPreferences && userId && supabaseClient) {
        const preferenceCheck = await this.checkEmailPreferences(
          supabaseClient,
          userId,
          type
        );
        if (!preferenceCheck.allow) {
          return {
            success: false,
            skipped: true,
            skipReason: preferenceCheck.reason || "preference_blocked"
          };
        }
      }
      const template = await this.fetchTemplate(type, supabaseClient);
      if (!template) {
        return {
          success: false,
          error: `No active template found for type: ${type}`
        };
      }
      const subject = this.substituteVariables(template.subject_template, variables);
      const htmlBody = this.substituteVariables(template.html_body_template, variables);
      const textBody = template.text_body_template ? this.substituteVariables(template.text_body_template, variables) : void 0;
      return await this.sendEmail(
        {
          to,
          subject,
          htmlBody,
          textBody
        },
        supabaseClient
      );
    } catch (error) {
      console.error("Error sending email from template:", error);
      return {
        success: false,
        error: error.message || "Failed to send email from template"
      };
    }
  }
  async sendEmail(emailData, supabaseClient, notificationId) {
    try {
      if (!supabaseClient) {
        throw new Error("Supabase client is required to send email");
      }
      const { data, error } = await supabaseClient.functions.invoke("send-email", {
        body: {
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.htmlBody,
          text: emailData.textBody
        }
      });
      if (error) {
        const errorMessage = error.message || "Failed to send email via Edge Function";
        if (notificationId && supabaseClient) {
          await this.updateNotificationStatus(
            supabaseClient,
            notificationId,
            "failed",
            void 0,
            errorMessage
          );
        }
        return {
          success: false,
          error: errorMessage
        };
      }
      const messageId = typeof (data == null ? void 0 : data.messageId) === "string" && data.messageId.length > 0 ? data.messageId : void 0;
      if (notificationId && supabaseClient) {
        await this.updateNotificationStatus(
          supabaseClient,
          notificationId,
          "sent",
          messageId
        );
      }
      return {
        success: true,
        messageId
      };
    } catch (error) {
      console.error("Error sending email via Edge Function:", error);
      if (notificationId && supabaseClient) {
        await this.updateNotificationStatus(
          supabaseClient,
          notificationId,
          "failed",
          void 0,
          error.message || "Failed to send email"
        );
      }
      return {
        success: false,
        error: error.message || "Failed to send email"
      };
    }
  }
  // Deprecated legacy helpers removed: sendLessonReminder, sendTaskDueReminder, sendAchievementEmail,
  // sendCourseCompletionEmail, sendSystemAlert. Use templates + sendEmailFromTemplate instead.
  // Send email using provided template data directly (for testing)
  async sendEmailWithTemplate(subjectTemplate, htmlBodyTemplate, textBodyTemplate, to, variables, supabaseClient, notificationId) {
    try {
      const subject = this.substituteVariables(subjectTemplate, variables);
      const htmlBody = this.substituteVariables(htmlBodyTemplate, variables);
      const textBody = this.substituteVariables(textBodyTemplate, variables);
      return this.sendEmail({
        to,
        subject,
        htmlBody,
        textBody
      }, supabaseClient, notificationId);
    } catch (error) {
      console.error("Error sending email with template:", error);
      return {
        success: false,
        error: error.message || "Failed to send email with template"
      };
    }
  }
  // Update notification status in database
  async updateNotificationStatus(supabaseClient, notificationId, status, messageId, errorMessage) {
    try {
      const updateData = {
        status
      };
      if (status === "sent") {
        updateData.sent_at = (/* @__PURE__ */ new Date()).toISOString();
      }
      if (messageId) {
        updateData.message_id = messageId;
      }
      if (errorMessage) {
        updateData.error_message = errorMessage;
      }
      const { error } = await supabaseClient.from("notification_history").update(updateData).eq("id", notificationId);
      if (error) {
        console.error("Failed to update notification status:", error);
      } else {
        console.log(`Notification ${notificationId} status updated to ${status}`);
        if (status === "sent") {
          console.log("⏱️ Status update completed - check Recent tab now!");
        }
      }
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  }
  async checkEmailPreferences(supabaseClient, userId, notificationType) {
    try {
      const { data: userPrefs, error: userErr } = await supabaseClient.from("email_preferences").select("*").eq("user_id", userId).maybeSingle();
      if (userErr) {
        console.error("Failed to load email preferences (user-level):", userErr);
        return { allow: true };
      }
      let data = userPrefs;
      if (!data) {
        const { data: orgPrefs, error: orgErr } = await supabaseClient.from("email_preferences").select("*").is("user_id", null).maybeSingle();
        if (orgErr) {
          console.error("Failed to load email preferences (org-level):", orgErr);
          return { allow: true };
        }
        data = orgPrefs;
      }
      if (!data) return { allow: true };
      const emailEnabled = data.email_enabled ?? true;
      if (!emailEnabled) return { allow: false, reason: "email_disabled" };
      const normalizedType = (notificationType ?? "").toLowerCase();
      if (data.types) {
        const typePreferences = data.types || {};
        const typeConfig = typePreferences[normalizedType] || typePreferences[normalizedType.toLowerCase()];
        if (typeConfig && typeConfig.email === false) {
          return { allow: false, reason: "type_email_disabled" };
        }
      } else {
        const isFalse = (v) => v === false;
        if (normalizedType.startsWith("track_") || normalizedType.includes("course")) {
          const flag = data.track_completions ?? data.course_completions;
          if (isFalse(flag)) return { allow: false, reason: "track_completions_disabled" };
        }
        if (normalizedType.startsWith("quiz_") || normalizedType.includes("achievement")) {
          if (isFalse(data.achievements)) return { allow: false, reason: "achievements_disabled" };
        }
        if (normalizedType.includes("lesson") && normalizedType.includes("reminder")) {
          if (isFalse(data.lesson_reminders)) return { allow: false, reason: "lesson_reminders_disabled" };
        }
        if (normalizedType.includes("task")) {
          if (isFalse(data.task_due_dates)) return { allow: false, reason: "task_due_dates_disabled" };
        }
        if (normalizedType.includes("system")) {
          if (isFalse(data.system_alerts)) return { allow: false, reason: "system_alerts_disabled" };
        }
      }
      const quietHours = data.quiet_hours;
      if (quietHours == null ? void 0 : quietHours.enabled) {
      } else if (data.quiet_hours_enabled) {
        const startStr = String(data.quiet_hours_start_time || "22:00:00").slice(0, 5);
        const endStr = String(data.quiet_hours_end_time || "08:00:00").slice(0, 5);
        const now = /* @__PURE__ */ new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const parseHHMM = (v) => {
          const [h, m] = v.split(":").map((n) => parseInt(n, 10));
          if (Number.isNaN(h) || Number.isNaN(m)) return null;
          return h * 60 + m;
        };
        const start = parseHHMM(startStr);
        const end = parseHHMM(endStr);
        if (start !== null && end !== null) {
          const inQuietHours = start <= end ? currentMinutes >= start && currentMinutes < end : currentMinutes >= start || currentMinutes < end;
          if (inQuietHours) return { allow: false, reason: "quiet_hours" };
        }
      }
      return { allow: true };
    } catch (error) {
      console.error("Error checking email preferences:", error);
      return { allow: true };
    }
  }
};
__publicField(_EmailService, "instance");
let EmailService = _EmailService;
const emailService = EmailService.getInstance();
async function gatherLessonCompletedVariables(supabaseClient, event) {
  var _a;
  try {
    const { data: user } = await supabaseClient.from("profiles").select("full_name, username").eq("id", event.user_id).single();
    const { data: lesson } = await supabaseClient.from("lessons").select("title, description").eq("id", event.lesson_id).single();
    let track = null;
    let progress = null;
    let lessonsCompleted = 0;
    let totalLessons = 0;
    let nextLesson = null;
    if (event.learning_track_id) {
      track = await supabaseClient.from("learning_tracks").select("title").eq("id", event.learning_track_id).single();
      progress = await supabaseClient.from("user_learning_track_progress").select("current_lesson_order").eq("user_id", event.user_id).eq("learning_track_id", event.learning_track_id).maybeSingle();
      const { data: completedLessons } = await supabaseClient.from("user_lesson_progress").select("lesson_id").eq("user_id", event.user_id).not("completed_at", "is", null);
      const { data: trackLessons } = await supabaseClient.from("learning_track_lessons").select("lesson_id").eq("learning_track_id", event.learning_track_id);
      totalLessons = (trackLessons == null ? void 0 : trackLessons.length) || 0;
      const completedInTrack = (completedLessons == null ? void 0 : completedLessons.filter(
        (cl) => trackLessons == null ? void 0 : trackLessons.some((tl) => tl.lesson_id === cl.lesson_id)
      ).length) || 0;
      lessonsCompleted = completedInTrack;
      const currentOrder = (progress == null ? void 0 : progress.current_lesson_order) || 0;
      const { data: nextLessonData } = await supabaseClient.from("learning_track_lessons").select("lesson_id, order_index, lessons(title)").eq("learning_track_id", event.learning_track_id).gt("order_index", currentOrder).order("order_index").limit(1).maybeSingle();
      if (nextLessonData) {
        nextLesson = {
          title: ((_a = nextLessonData.lessons) == null ? void 0 : _a.title) || "Next Lesson",
          id: nextLessonData.lesson_id
        };
      }
    }
    const origin = typeof window !== "undefined" ? window.location.origin : "https://staysecure-learn.raynsecure.com";
    const clientId = event.clientId || "default";
    const clientPath = clientId !== "default" ? `/${clientId}` : "";
    const clientLoginUrl = `${origin}${clientPath}/login`;
    const trackProgressPercentage = totalLessons > 0 ? Math.round(lessonsCompleted / totalLessons * 100) : 0;
    return {
      user_name: (user == null ? void 0 : user.full_name) || "User",
      user_email: (user == null ? void 0 : user.username) || "",
      lesson_title: (lesson == null ? void 0 : lesson.title) || "Lesson",
      lesson_description: (lesson == null ? void 0 : lesson.description) || "",
      learning_track_title: (track == null ? void 0 : track.title) || "",
      completion_date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US"),
      completion_time: (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      lessons_completed_in_track: lessonsCompleted,
      total_lessons_in_track: totalLessons,
      track_progress_percentage: trackProgressPercentage,
      next_lesson_title: (nextLesson == null ? void 0 : nextLesson.title) || null,
      next_lesson_available: !!nextLesson,
      next_lesson_url: clientLoginUrl,
      // Always use login URL as per requirement
      client_login_url: clientLoginUrl
    };
  } catch (error) {
    console.error("Error gathering lesson completed variables:", error);
    return {
      user_name: "User",
      lesson_title: "Lesson",
      client_login_url: "https://staysecure-learn.raynsecure.com/login"
    };
  }
}
const emailService$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  EmailService,
  emailService,
  gatherLessonCompletedVariables
}, Symbol.toStringTag, { value: "Module" }));
const EmailNotifications = ({
  supabase: supabase2,
  user,
  // Keep for now for auth context, but not used for preferences
  awsConfig,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea
}) => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (awsConfig) {
      EmailService.configure(awsConfig);
    }
  }, [awsConfig]);
  useEffect(() => {
    loadPreferences();
  }, []);
  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase2.from("email_preferences").select("*").is("user_id", null).single();
      if (error) {
        console.error("Error loading preferences:", error);
        return;
      }
      if (data) {
        const mappedData = {
          id: data.id,
          userId: data.user_id,
          // Will be null for org-level
          emailEnabled: data.email_enabled,
          taskDueDates: data.task_due_dates,
          systemAlerts: data.system_alerts,
          achievements: data.achievements,
          trackCompletions: data.track_completions,
          lessonReminders: data.lesson_reminders ?? true,
          // Default to true if null
          quietHoursEnabled: data.quiet_hours_enabled,
          quietHoursStart: data.quiet_hours_start_time,
          quietHoursEnd: data.quiet_hours_end_time,
          // Reminder settings (now part of the same table)
          reminderDaysBefore: data.reminder_days_before,
          reminderTime: data.reminder_time,
          includeUpcomingLessons: data.include_upcoming_lessons,
          upcomingDaysAhead: data.upcoming_days_ahead,
          maxReminderAttempts: data.max_reminder_attempts,
          reminderFrequencyDays: data.reminder_frequency_days
        };
        setPreferences(mappedData);
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setLoading(false);
    }
  };
  const updatePreferences = async (updates) => {
    const updatedPrefs = {
      ...preferences,
      ...updates,
      userId: null
      // Always org-level settings
    };
    setPreferences(updatedPrefs);
    const { data: { user: currentUser } } = await supabase2.auth.getUser();
    const dbPayload = {
      user_id: null,
      // Always org-level settings
      email_enabled: updatedPrefs.emailEnabled,
      task_due_dates: updatedPrefs.taskDueDates,
      system_alerts: updatedPrefs.systemAlerts,
      achievements: updatedPrefs.achievements,
      track_completions: updatedPrefs.trackCompletions,
      lesson_reminders: updatedPrefs.lessonReminders,
      quiet_hours_enabled: updatedPrefs.quietHoursEnabled,
      quiet_hours_start_time: updatedPrefs.quietHoursStart,
      quiet_hours_end_time: updatedPrefs.quietHoursEnd,
      // Reminder settings (consolidated)
      reminder_days_before: updatedPrefs.reminderDaysBefore,
      reminder_time: updatedPrefs.reminderTime,
      include_upcoming_lessons: updatedPrefs.includeUpcomingLessons,
      upcoming_days_ahead: updatedPrefs.upcomingDaysAhead,
      max_reminder_attempts: updatedPrefs.maxReminderAttempts,
      reminder_frequency_days: updatedPrefs.reminderFrequencyDays,
      // Audit fields
      updated_by: (currentUser == null ? void 0 : currentUser.id) || null
    };
    const { error } = await supabase2.from("email_preferences").update(dbPayload).is("user_id", null);
    if (error) {
      console.error("Error updating preferences:", error);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-learning-primary" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Mail, { className: "h-6 w-6 text-learning-primary" }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-learning-primary", children: "Email Preferences" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("div", { className: "text-left", children: /* @__PURE__ */ jsx(Label, { htmlFor: "email-enabled", children: "Enable Email Notifications" }) }),
        /* @__PURE__ */ jsx(
          Switch,
          {
            id: "email-enabled",
            checked: (preferences == null ? void 0 : preferences.emailEnabled) || false,
            onCheckedChange: (checked) => updatePreferences({ emailEnabled: checked })
          }
        )
      ] }),
      (preferences == null ? void 0 : preferences.emailEnabled) && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 pl-4 border-l-2 border-blue-200", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "max-attempts", className: "text-sm", children: "Max Reminder Attempts" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "max-attempts",
              type: "number",
              min: "1",
              max: "10",
              value: (preferences == null ? void 0 : preferences.maxReminderAttempts) || 3,
              onChange: (e) => updatePreferences({ maxReminderAttempts: parseInt(e.target.value) || 3 }),
              className: "mt-1"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "reminder-frequency", className: "text-sm", children: "Reminder Frequency (Days)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "reminder-frequency",
              type: "number",
              min: "1",
              max: "30",
              value: (preferences == null ? void 0 : preferences.reminderFrequencyDays) || 7,
              onChange: (e) => updatePreferences({ reminderFrequencyDays: parseInt(e.target.value) || 7 }),
              className: "mt-1"
            }
          )
        ] })
      ] }),
      (preferences == null ? void 0 : preferences.emailEnabled) && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-medium", children: "Notification Types" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-left", children: "Achievements" }),
          /* @__PURE__ */ jsx(
            Switch,
            {
              checked: (preferences == null ? void 0 : preferences.achievements) || false,
              onCheckedChange: (checked) => updatePreferences({ achievements: checked })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-left", children: "Lesson Track Completions" }),
          /* @__PURE__ */ jsx(
            Switch,
            {
              checked: (preferences == null ? void 0 : preferences.trackCompletions) || false,
              onCheckedChange: (checked) => updatePreferences({ trackCompletions: checked })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-left font-medium", children: "Lesson Reminders" }),
            /* @__PURE__ */ jsx(
              Switch,
              {
                checked: (preferences == null ? void 0 : preferences.lessonReminders) ?? true,
                onCheckedChange: (checked) => {
                  updatePreferences({
                    lessonReminders: checked,
                    // Also update reminderDaysBefore to maintain consistency
                    reminderDaysBefore: checked ? (preferences == null ? void 0 : preferences.reminderDaysBefore) ?? 1 : -1
                  });
                }
              }
            )
          ] }),
          (preferences == null ? void 0 : preferences.lessonReminders) && /* @__PURE__ */ jsx("div", { className: "space-y-4 pl-4 border-l-2 border-blue-200", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "reminder-days", className: "text-sm", children: "Days before lesson" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "reminder-days",
                  type: "number",
                  min: "0",
                  max: "7",
                  value: (preferences == null ? void 0 : preferences.reminderDaysBefore) || 0,
                  onChange: (e) => updatePreferences({ reminderDaysBefore: parseInt(e.target.value) || 0 }),
                  className: "mt-1"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "reminder-time", className: "text-sm", children: "Send at time" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "reminder-time",
                  type: "time",
                  value: (preferences == null ? void 0 : preferences.reminderTime) || "09:00",
                  onChange: (e) => updatePreferences({ reminderTime: e.target.value }),
                  className: "mt-1"
                }
              )
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-left font-medium", children: "Upcoming Lessons" }),
            /* @__PURE__ */ jsx(
              Switch,
              {
                checked: (preferences == null ? void 0 : preferences.includeUpcomingLessons) || false,
                onCheckedChange: (checked) => updatePreferences({ includeUpcomingLessons: checked })
              }
            )
          ] }),
          (preferences == null ? void 0 : preferences.includeUpcomingLessons) && /* @__PURE__ */ jsx("div", { className: "pl-4 border-l-2 border-green-200", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "upcoming-days", className: "text-sm", children: "Look ahead days" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "upcoming-days",
                type: "number",
                min: "1",
                max: "14",
                value: (preferences == null ? void 0 : preferences.upcomingDaysAhead) || 3,
                onChange: (e) => updatePreferences({ upcomingDaysAhead: parseInt(e.target.value) || 3 }),
                className: "mt-1"
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-left", children: "Task Due Dates" }),
            /* @__PURE__ */ jsx(
              Switch,
              {
                checked: (preferences == null ? void 0 : preferences.taskDueDates) || false,
                onCheckedChange: (checked) => updatePreferences({ taskDueDates: checked })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-left", children: "System Alerts" }),
            /* @__PURE__ */ jsx(
              Switch,
              {
                checked: (preferences == null ? void 0 : preferences.systemAlerts) || false,
                onCheckedChange: (checked) => updatePreferences({ systemAlerts: checked })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx(Label, { children: "Quiet Hours" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Don't send emails during these hours" })
          ] }),
          /* @__PURE__ */ jsx(
            Switch,
            {
              checked: (preferences == null ? void 0 : preferences.quietHoursEnabled) || false,
              onCheckedChange: (checked) => updatePreferences({ quietHoursEnabled: checked })
            }
          )
        ] }),
        (preferences == null ? void 0 : preferences.quietHoursEnabled) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Start Time" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "time",
                value: (preferences == null ? void 0 : preferences.quietHoursStart) || "22:00",
                onChange: (e) => updatePreferences({ quietHoursStart: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "End Time" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "time",
                value: (preferences == null ? void 0 : preferences.quietHoursEnd) || "08:00",
                onChange: (e) => updatePreferences({ quietHoursEnd: e.target.value })
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] });
};
function EmailTemplateManager({
  supabaseClient,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Alert,
  AlertDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Textarea,
  Popover,
  PopoverContent,
  PopoverTrigger,
  isSuperAdmin = false,
  gatherTemplateVariables,
  toast
}) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(null);
  const [emailDialog, setEmailDialog] = useState({ open: false, type: "success", message: "" });
  const [previewVariables, setPreviewVariables] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  useEffect(() => {
    loadTemplates();
  }, []);
  const loadTemplates = async () => {
    try {
      setLoading(true);
      const { data, error: error2 } = await supabaseClient.from("email_templates").select("*").order("created_at", { ascending: false });
      if (error2) throw error2;
      setTemplates(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setIsEditing(true);
  };
  const handleView = async (template) => {
    setSelectedTemplate(template);
    setIsViewing(true);
    setLoadingPreview(true);
    if (!gatherTemplateVariables) {
      console.error("gatherTemplateVariables is required for preview");
      setLoadingPreview(false);
      return;
    }
    try {
      const { data: sampleUser } = await supabaseClient.from("profiles").select("id").limit(1).single();
      if (!sampleUser) {
        console.error("No user found for preview");
        setLoadingPreview(false);
        return;
      }
      const context = { user_id: sampleUser.id };
      if (template.type === "lesson_completed" || template.type === "quiz_high_score" || template.type === "lesson_reminder") {
        const { data: sampleLesson } = await supabaseClient.from("lessons").select("id").limit(1).single();
        if (sampleLesson) context.lesson_id = sampleLesson.id;
      }
      if (template.type.includes("track_milestone") || template.type === "lesson_completed") {
        const { data: sampleTrack } = await supabaseClient.from("learning_tracks").select("id").limit(1).single();
        if (sampleTrack) context.learning_track_id = sampleTrack.id;
      }
      if (template.type === "manager_employee_incomplete") {
        context.manager_id = sampleUser.id;
      }
      if (template.type === "quiz_high_score") {
        context.score = 95;
      }
      const templateBody = template.html_body_template || "";
      const variables = await gatherTemplateVariables(supabaseClient, template.type, context, templateBody);
      setPreviewVariables(variables);
    } catch (error2) {
      console.error("Error gathering preview variables:", error2);
      setPreviewVariables(null);
    } finally {
      setLoadingPreview(false);
    }
  };
  const handleDelete = async (template) => {
    if (template.is_system) {
      alert("System templates cannot be deleted");
      return;
    }
    if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
      try {
        const { error: error2 } = await supabaseClient.from("email_templates").delete().eq("id", template.id);
        if (error2) throw error2;
        loadTemplates();
      } catch (err) {
        alert(`Error deleting template: ${err.message}`);
      }
    }
  };
  const handleDuplicate = async (template) => {
    try {
      const { error: error2 } = await supabaseClient.from("email_templates").insert({
        name: `${template.name} (Copy)`,
        type: template.type,
        subject_template: template.subject_template,
        html_body_template: template.html_body_template,
        text_body_template: template.text_body_template,
        is_system: false
      });
      if (error2) throw error2;
      loadTemplates();
    } catch (err) {
      alert(`Error duplicating template: ${err.message}`);
    }
  };
  const handleSendTest = async (template) => {
    try {
      setSendingEmail(template.id);
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!(user == null ? void 0 : user.email)) {
        setEmailDialog({
          open: true,
          type: "error",
          message: "No user email found for testing"
        });
        return;
      }
      if (!gatherTemplateVariables) {
        setEmailDialog({
          open: true,
          type: "error",
          message: "gatherTemplateVariables is required for test emails"
        });
        setSendingEmail(null);
        return;
      }
      const context = { user_id: user.id };
      if (template.type === "lesson_completed" || template.type === "quiz_high_score" || template.type === "lesson_reminder") {
        const { data: sampleLesson } = await supabaseClient.from("lessons").select("id").limit(1).single();
        if (sampleLesson) context.lesson_id = sampleLesson.id;
      }
      if (template.type.includes("track_milestone") || template.type === "lesson_completed") {
        const { data: sampleTrack } = await supabaseClient.from("learning_tracks").select("id").limit(1).single();
        if (sampleTrack) context.learning_track_id = sampleTrack.id;
      }
      if (template.type === "manager_employee_incomplete") {
        context.manager_id = user.id;
      }
      if (template.type === "quiz_high_score") {
        context.score = 95;
      }
      const templateBody = template.html_body_template || "";
      const templateVariables = await gatherTemplateVariables(supabaseClient, template.type, context, templateBody);
      const { data: notificationData, error: notificationError } = await supabaseClient.from("notification_history").insert({
        user_id: user.id,
        email_template_id: template.id,
        // Include the template ID!
        trigger_event: template.type,
        template_variables: templateVariables,
        status: "pending",
        channel: "email",
        priority: "normal"
      }).select("id").single();
      if (notificationError) {
        console.error("Failed to create notification record:", notificationError);
      }
      const { emailService: emailService2 } = await Promise.resolve().then(() => emailService$1);
      const service = emailService2;
      const result = await service.sendEmailWithTemplate(
        template.subject_template,
        template.html_body_template,
        template.text_body_template || "",
        user.email,
        templateVariables,
        supabaseClient,
        notificationData == null ? void 0 : notificationData.id
        // Pass notification ID for status tracking
      );
      if (result.success) {
        setEmailDialog({
          open: true,
          type: "success",
          message: `Test email for "${template.name}" sent successfully to ${user.email}`
        });
      } else {
        setEmailDialog({
          open: true,
          type: "error",
          message: `Failed to send test email for "${template.name}": ${result.error}`
        });
      }
    } catch (err) {
      setEmailDialog({
        open: true,
        type: "error",
        message: `Error sending test email for "${template.name}": ${err.message}`
      });
    } finally {
      setSendingEmail(null);
    }
  };
  const handleCreate = () => {
    setSelectedTemplate({
      id: "",
      name: "",
      type: "",
      subject_template: "",
      html_body_template: "",
      text_body_template: "",
      is_system: false,
      is_active: true,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    setIsCreating(true);
    setIsEditing(true);
  };
  const handleSave = async () => {
    if (!selectedTemplate) return;
    try {
      const templateData = {
        name: selectedTemplate.name,
        type: selectedTemplate.type,
        subject_template: selectedTemplate.subject_template,
        html_body_template: selectedTemplate.html_body_template,
        text_body_template: selectedTemplate.text_body_template,
        is_system: selectedTemplate.is_system,
        is_active: selectedTemplate.is_active
      };
      if (isCreating) {
        const { error: error2 } = await supabaseClient.from("email_templates").insert(templateData);
        if (error2) throw error2;
        if (toast) {
          toast({ title: "Template created successfully" });
        } else {
          alert("Template created successfully");
        }
      } else {
        const { error: error2 } = await supabaseClient.from("email_templates").update(templateData).eq("id", selectedTemplate.id);
        if (error2) throw error2;
        if (toast) {
          toast({ title: "Template updated successfully" });
        } else {
          alert("Template updated successfully");
        }
      }
      setIsEditing(false);
      setIsCreating(false);
      setSelectedTemplate(null);
      loadTemplates();
    } catch (err) {
      if (toast) {
        toast({
          title: "Error saving template",
          description: err.message,
          variant: "destructive"
        });
      } else {
        alert(`Error saving template: ${err.message}`);
      }
    }
  };
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || template.type.toLowerCase().includes(searchTerm.toLowerCase()) || template.subject_template.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || statusFilter === "system" && template.is_system || statusFilter === "custom" && !template.is_system;
    const matchesType = typeFilter === "all" || template.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });
  const getTypeColor = (type) => {
    switch (type) {
      case "lesson_completed":
        return "bg-green-100 text-green-800";
      case "track_milestone":
        return "bg-blue-100 text-blue-800";
      case "quiz_high_score":
        return "bg-purple-100 text-purple-800";
      case "lesson_reminder":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Loading templates..." }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx(Alert, { className: "mb-4", children: /* @__PURE__ */ jsxs(AlertDescription, { children: [
      "Error loading templates: ",
      error
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-learning-primary", children: "Email Template Management" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Create and manage email templates" })
      ] }),
      isSuperAdmin ? /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: handleCreate,
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
            "Create Template"
          ]
        }
      ) }) : /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Template creation requires Super Admin access" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Search templates...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "pl-10"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-32", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Status" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Status" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "system", children: "System" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "custom", children: "Custom" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: typeFilter, onValueChange: setTypeFilter, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-40", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Type" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Types" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "lesson_completed", children: "Lesson Completed" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "lesson_reminder", children: "Lesson Reminder" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "quiz_high_score", children: "Quiz High Score" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "track_milestone", children: "Track Milestone" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "system_alert", children: "System Alert" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "task_due", children: "Task Due" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "achievement", children: "Achievement" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "course_completion", children: "Course Completion" })
          ] })
        ] })
      ] })
    ] }),
    filteredTemplates.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12", children: [
      /* @__PURE__ */ jsx(Mail, { className: "h-12 w-12 text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "No templates found" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center", children: searchTerm ? "No templates match your search." : "Create your first email template to get started." })
    ] }) }) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b", children: [
        /* @__PURE__ */ jsx("th", { className: "text-left p-4 font-medium", children: "Template" }),
        /* @__PURE__ */ jsx("th", { className: "text-left p-4 font-medium", children: "Type" }),
        /* @__PURE__ */ jsx("th", { className: "text-left p-4 font-medium", children: "Created" }),
        /* @__PURE__ */ jsx("th", { className: "text-left p-4 font-medium", children: "Updated" }),
        /* @__PURE__ */ jsx("th", { className: "text-left p-4 font-medium", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: filteredTemplates.map((template) => /* @__PURE__ */ jsxs("tr", { className: "border-b hover:bg-gray-50", children: [
        /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
          /* @__PURE__ */ jsx("div", { className: "font-medium", children: template.name }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: template.subject_template })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx(Badge, { className: getTypeColor(template.type), children: template.type.replace("_", " ") }) }),
        /* @__PURE__ */ jsx("td", { className: "p-4 text-sm text-muted-foreground", children: formatDate(template.created_at) }),
        /* @__PURE__ */ jsx("td", { className: "p-4 text-sm text-muted-foreground", children: template.updated_at ? formatDate(template.updated_at) : "-" }),
        /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => handleEdit(template),
              title: "Edit Template",
              children: /* @__PURE__ */ jsx(SquarePen, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => handleView(template),
              title: "View Template",
              children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => handleDuplicate(template),
              title: "Duplicate Template",
              children: /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => handleSendTest(template),
              title: "Send Test Email",
              disabled: sendingEmail === template.id,
              children: sendingEmail === template.id ? /* @__PURE__ */ jsx(
                LoaderCircle,
                {
                  className: "h-4 w-4",
                  style: {
                    animation: "spin 1s linear infinite",
                    transformOrigin: "center"
                  }
                }
              ) : /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" })
            }
          ),
          !template.is_system && /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => handleDelete(template),
              className: "text-red-600 hover:text-red-700",
              title: "Delete Template",
              style: { backgroundColor: "orange", color: "white" },
              children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] }) })
      ] }, template.id)) })
    ] }) }) }) }),
    (isEditing || isViewing) && selectedTemplate && /* @__PURE__ */ jsx(Dialog, { open: isEditing || isViewing, onOpenChange: () => {
      setIsEditing(false);
      setIsViewing(false);
      setIsCreating(false);
      setSelectedTemplate(null);
    }, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-4xl max-h-[80vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [
        isCreating ? "Create Template" : isEditing ? "Edit Template" : "Email Preview",
        ": ",
        selectedTemplate.name || "New Template"
      ] }) }),
      isViewing ? (
        /* Email Preview Mode */
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-4 bg-white", children: [
            /* @__PURE__ */ jsxs("div", { className: "border-b pb-2 mb-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-700", children: "Email Preview" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "How this email will appear to recipients" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Subject:" }),
                /* @__PURE__ */ jsx("div", { className: "mt-1 p-2 bg-gray-50 rounded border", children: loadingPreview ? "Loading preview..." : previewVariables ? (
                  // Use real variables from database via gatherTemplateVariables
                  emailService.substituteVariables(selectedTemplate.subject_template, previewVariables)
                ) : "Error loading preview variables" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Email Body:" }),
                /* @__PURE__ */ jsx("div", { className: "mt-1 border rounded bg-white max-h-96 overflow-y-auto", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "p-4 prose max-w-none",
                    dangerouslySetInnerHTML: {
                      __html: loadingPreview ? "<div>Loading preview...</div>" : previewVariables ? (() => {
                        console.log("Preview - calling substituteVariables with:", {
                          template: selectedTemplate.html_body_template.substring(0, 200) + "...",
                          variables: {
                            ...previewVariables,
                            incomplete_lessons: Array.isArray(previewVariables.incomplete_lessons) ? `Array(${previewVariables.incomplete_lessons.length})` : previewVariables.incomplete_lessons
                          }
                        });
                        const result = emailService.substituteVariables(selectedTemplate.html_body_template, previewVariables);
                        console.log("Preview - substituteVariables result:", result.substring(0, 500) + "...");
                        return result;
                      })() : "<div>Error loading preview variables</div>"
                    }
                  }
                ) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => {
            setIsViewing(false);
            setSelectedTemplate(null);
            setPreviewVariables(null);
          }, children: "Close Preview" }) })
        ] })
      ) : (
        /* Edit/Create Mode */
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Template Name" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "name",
                  value: selectedTemplate.name,
                  disabled: !isEditing || selectedTemplate.is_system,
                  onChange: (e) => setSelectedTemplate({
                    ...selectedTemplate,
                    name: e.target.value
                  })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "type", children: "Template Type" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "type",
                  value: selectedTemplate.type,
                  disabled: !isEditing || selectedTemplate.is_system,
                  onChange: (e) => setSelectedTemplate({
                    ...selectedTemplate,
                    type: e.target.value
                  })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "subject", children: "Subject" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "subject",
                value: selectedTemplate.subject_template,
                disabled: !isEditing,
                onChange: (e) => setSelectedTemplate({
                  ...selectedTemplate,
                  subject_template: e.target.value
                })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "content", children: "HTML Content" }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                id: "content",
                value: selectedTemplate.html_body_template,
                disabled: !isEditing,
                rows: 10,
                className: "font-mono text-sm",
                onChange: (e) => setSelectedTemplate({
                  ...selectedTemplate,
                  html_body_template: e.target.value
                })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "text-content", children: "Text Content (Optional)" }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                id: "text-content",
                value: selectedTemplate.text_body_template || "",
                disabled: !isEditing,
                rows: 5,
                className: "font-mono text-sm",
                onChange: (e) => setSelectedTemplate({
                  ...selectedTemplate,
                  text_body_template: e.target.value
                })
              }
            )
          ] }),
          isEditing && /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-2", children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => {
              setIsEditing(false);
              setIsCreating(false);
              setSelectedTemplate(null);
            }, children: "Cancel" }),
            /* @__PURE__ */ jsx(Button, { onClick: handleSave, children: isCreating ? "Create" : "Save" })
          ] })
        ] })
      )
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: emailDialog.open, onOpenChange: (open) => setEmailDialog({ ...emailDialog, open }), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        emailDialog.type === "success" ? /* @__PURE__ */ jsx(CircleCheckBig, { className: "h-5 w-5 text-green-600" }) : /* @__PURE__ */ jsx(CircleX, { className: "h-5 w-5 text-red-600" }),
        emailDialog.type === "success" ? "Email Sent Successfully" : "Email Send Failed"
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "py-4", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: emailDialog.message }) }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(Button, { onClick: () => setEmailDialog({ ...emailDialog, open: false }), children: "OK" }) })
    ] }) })
  ] });
}
function RecentEmailNotifications({
  supabaseClient,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Alert,
  AlertDescription
}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  useEffect(() => {
    loadNotifications();
  }, []);
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { data: notifications2, error: error2 } = await supabaseClient.from("notification_history").select("*").order("sent_at", { ascending: false, nullsFirst: false }).limit(100);
      if (error2) throw error2;
      if (!notifications2 || notifications2.length === 0) {
        setNotifications([]);
        setLoading(false);
        return;
      }
      const userIds = [...new Set(notifications2.map((n) => n.user_id))];
      const { data: profiles, error: profilesError } = await supabaseClient.from("profiles").select("id, username").in("id", userIds);
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
      }
      const emailMap = /* @__PURE__ */ new Map();
      profiles == null ? void 0 : profiles.forEach((profile) => {
        if (profile.username) {
          emailMap.set(profile.id, profile.username);
        }
      });
      const mappedData = notifications2.map((notification) => ({
        id: notification.id,
        title: notification.trigger_event.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        message: `Notification of type ${notification.trigger_event}`,
        type: notification.trigger_event,
        status: notification.status,
        email: emailMap.get(notification.user_id) || "Unknown User",
        sent_at: notification.sent_at,
        error_message: notification.error_message
      }));
      setNotifications(mappedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case "sent":
        return { backgroundColor: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" };
      case "failed":
        return { backgroundColor: "#fecaca", color: "#991b1b", borderColor: "#fca5a5" };
      case "pending":
        return { backgroundColor: "#fef3c7", color: "#92400e", borderColor: "#fde68a" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151", borderColor: "#d1d5db" };
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return /* @__PURE__ */ jsx(CircleCheckBig, { className: "h-4 w-4" });
      case "failed":
        return /* @__PURE__ */ jsx(CircleX, { className: "h-4 w-4" });
      case "pending":
        return /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" });
      default:
        return /* @__PURE__ */ jsx(CircleAlert, { className: "h-4 w-4" });
    }
  };
  const getTypeStyle = (type) => {
    switch (type) {
      case "lesson_completed":
        return { backgroundColor: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" };
      case "lesson_reminder":
        return { backgroundColor: "#fed7aa", color: "#9a3412", borderColor: "#fdba74" };
      case "quiz_high_score":
        return { backgroundColor: "#e9d5ff", color: "#6b21a8", borderColor: "#d8b4fe" };
      case "track_milestone":
        return { backgroundColor: "#dbeafe", color: "#1e40af", borderColor: "#bfdbfe" };
      case "system_alert":
        return { backgroundColor: "#fecaca", color: "#991b1b", borderColor: "#fca5a5" };
      case "task_due":
        return { backgroundColor: "#fef3c7", color: "#92400e", borderColor: "#fde68a" };
      case "achievement":
        return { backgroundColor: "#fce7f3", color: "#be185d", borderColor: "#f9a8d4" };
      case "course_completion":
        return { backgroundColor: "#e0e7ff", color: "#3730a3", borderColor: "#c7d2fe" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151", borderColor: "#d1d5db" };
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error2) {
      return "Invalid Date";
    }
  };
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || notification.email.toLowerCase().includes(searchTerm.toLowerCase()) || notification.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter;
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Loading recent notifications..." }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx(Alert, { className: "mb-4", children: /* @__PURE__ */ jsxs(AlertDescription, { children: [
      "Error loading notifications: ",
      error
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-learning-primary", children: "Recent Email Notifications" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "View sent email notifications and their status" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: loadNotifications, children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4 mr-2" }),
        "Refresh"
      ] }) })
    ] }),
    notifications.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-4", children: [
      /* @__PURE__ */ jsx(Card, { className: "flex-1", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(CircleCheckBig, { className: "h-5 w-5 text-green-600" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-600", children: notifications.filter((n) => n.status === "sent").length }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Sent" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx(Card, { className: "flex-1", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(CircleX, { className: "h-5 w-5 text-red-600" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-red-600", children: notifications.filter((n) => n.status === "failed").length }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Failed" }),
          notifications.filter((n) => n.status === "failed").length > 0 && /* @__PURE__ */ jsx("div", { className: "text-xs text-red-700 mt-1 font-medium", children: "Check error messages above" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx(Card, { className: "flex-1", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(Clock, { className: "h-5 w-5 text-yellow-600" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-yellow-600", children: notifications.filter((n) => n.status === "pending").length }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Pending" }),
          notifications.filter((n) => n.status === "pending").length > 0 && /* @__PURE__ */ jsx("div", { className: "text-xs text-yellow-700 mt-1 font-medium", children: "Being processed" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx(Card, { className: "flex-1", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5 text-blue-600" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-600", children: notifications.length }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Total" })
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Search notifications...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "pl-10"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-32", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Status" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Status" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "sent", children: "Sent" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "failed", children: "Failed" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "pending", children: "Pending" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: typeFilter, onValueChange: setTypeFilter, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-40", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Type" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Types" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "lesson_completed", children: "Lesson Completed" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "lesson_reminder", children: "Lesson Reminder" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "quiz_high_score", children: "Quiz High Score" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "track_milestone", children: "Track Milestone" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "system_alert", children: "System Alert" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "task_due", children: "Task Due" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "achievement", children: "Achievement" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "course_completion", children: "Course Completion" })
          ] })
        ] })
      ] })
    ] }),
    filteredNotifications.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12", children: [
      /* @__PURE__ */ jsx(Mail, { className: "h-12 w-12 text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "No notifications found" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center", children: searchTerm || statusFilter !== "all" || typeFilter !== "all" ? "No notifications match your filters." : "No email notifications have been sent yet." })
    ] }) }) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b bg-gray-50", children: [
        /* @__PURE__ */ jsx("th", { className: "text-left p-4 font-medium", children: "Notification" }),
        /* @__PURE__ */ jsx("th", { className: "text-left p-4 font-medium", children: "Type" }),
        /* @__PURE__ */ jsx("th", { className: "text-left p-4 font-medium", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "text-left p-4 font-medium", children: "Recipient" }),
        /* @__PURE__ */ jsx("th", { className: "text-left p-4 font-medium", children: "Sent" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: filteredNotifications.map((notification) => /* @__PURE__ */ jsxs("tr", { className: "border-b hover:bg-gray-50", children: [
        /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
          /* @__PURE__ */ jsx("div", { className: "font-medium", children: notification.title }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground line-clamp-2", children: notification.message })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "p-4 text-left", children: /* @__PURE__ */ jsx(
          "span",
          {
            className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
            style: getTypeStyle(notification.type),
            children: notification.type.replace("_", " ")
          }
        ) }),
        /* @__PURE__ */ jsxs("td", { className: "p-4 text-left", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            getStatusIcon(notification.status),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                style: getStatusStyle(notification.status),
                children: notification.status
              }
            )
          ] }),
          notification.status === "failed" && notification.error_message && /* @__PURE__ */ jsx("div", { className: "text-xs text-red-600 mt-1", children: notification.error_message })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "p-4 text-left", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(User, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: notification.email })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "p-4 text-left", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm", children: notification.sent_at ? formatDate(notification.sent_at) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Not sent" }) })
        ] }) })
      ] }, notification.id)) })
    ] }) }) }) })
  ] });
}
const supabase = null;
const useNotifications = (filters = {}) => {
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["notifications", filters],
    queryFn: async () => {
      let query = supabase.from("notifications").select("*").order("created_at", { ascending: false });
      if (filters.userId) {
        query = query.eq("user_id", filters.userId);
      }
      if (filters.type) {
        query = query.eq("type", filters.type);
      }
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.priority) {
        query = query.eq("priority", filters.priority);
      }
      if (filters.fromDate) {
        query = query.gte("created_at", filters.fromDate.toISOString());
      }
      if (filters.toDate) {
        query = query.lte("created_at", filters.toDate.toISOString());
      }
      if (filters.unreadOnly) {
        query = query.is("read_at", null);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }
      const { data, error: error2 } = await query;
      if (error2) {
        throw new Error(`Failed to fetch notifications: ${error2.message}`);
      }
      return (data == null ? void 0 : data.map((notification) => ({
        ...notification,
        createdAt: new Date(notification.created_at),
        scheduledFor: notification.scheduled_for ? new Date(notification.scheduled_for) : void 0,
        readAt: notification.read_at ? new Date(notification.read_at) : void 0,
        expiresAt: notification.expires_at ? new Date(notification.expires_at) : void 0
      }))) || [];
    },
    refetchInterval: 3e4
    // Refetch every 30 seconds
  });
  const { data: unreadData } = useQuery({
    queryKey: ["notifications", "unread-count", filters.userId],
    queryFn: async () => {
      if (!filters.userId) return 0;
      const { count, error: error2 } = await supabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", filters.userId).is("read_at", null);
      if (error2) {
        throw new Error(`Failed to fetch unread count: ${error2.message}`);
      }
      return count || 0;
    },
    refetchInterval: 1e4
    // Refetch every 10 seconds
  });
  useEffect(() => {
    if (unreadData !== void 0) {
      setUnreadCount(unreadData);
    }
  }, [unreadData]);
  const markAsReadMutation = useMutation({
    mutationFn: async (id) => {
      const { error: error2 } = await supabase.from("notifications").update({
        read_at: (/* @__PURE__ */ new Date()).toISOString(),
        status: "read"
      }).eq("id", id);
      if (error2) {
        throw new Error(`Failed to mark notification as read: ${error2.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    }
  });
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!filters.userId) return;
      const { error: error2 } = await supabase.from("notifications").update({
        read_at: (/* @__PURE__ */ new Date()).toISOString(),
        status: "read"
      }).eq("user_id", filters.userId).is("read_at", null);
      if (error2) {
        throw new Error(`Failed to mark all notifications as read: ${error2.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    }
  });
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id) => {
      const { error: error2 } = await supabase.from("notifications").delete().eq("id", id);
      if (error2) {
        throw new Error(`Failed to delete notification: ${error2.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    }
  });
  const markAsRead = useCallback(async (id) => {
    await markAsReadMutation.mutateAsync(id);
  }, [markAsReadMutation]);
  const markAllAsRead = useCallback(async () => {
    await markAllAsReadMutation.mutateAsync();
  }, [markAllAsReadMutation]);
  const deleteNotification = useCallback(async (id) => {
    await deleteNotificationMutation.mutateAsync(id);
  }, [deleteNotificationMutation]);
  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);
  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh
  };
};
export {
  EmailNotifications,
  EmailService,
  EmailTemplateManager,
  RecentEmailNotifications,
  emailService,
  gatherLessonCompletedVariables,
  useNotifications
};
//# sourceMappingURL=index.esm.js.map
