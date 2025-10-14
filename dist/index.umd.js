(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("react/jsx-runtime"), require("react"), require("@tanstack/react-query"), require("@supabase/supabase-js")) : typeof define === "function" && define.amd ? define(["exports", "react/jsx-runtime", "react", "@tanstack/react-query", "@supabase/supabase-js"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.NotificationSystem = {}, global["react/jsx-runtime"], global.React, global.ReactQuery));
})(this, function(exports2, jsxRuntime, react, reactQuery) {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

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
  const Icon = react.forwardRef(
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
      return react.createElement(
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
          ...iconNode.map(([tag, attrs]) => react.createElement(tag, attrs)),
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
    const Component = react.forwardRef(
      ({ className, ...props }, ref) => react.createElement(Icon, {
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
  const Award = createLucideIcon("Award", [
    [
      "path",
      {
        d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
        key: "1yiouv"
      }
    ],
    ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Bell = createLucideIcon("Bell", [
    ["path", { d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9", key: "1qo2s2" }],
    ["path", { d: "M10.3 21a1.94 1.94 0 0 0 3.4 0", key: "qgo35s" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const BookOpen = createLucideIcon("BookOpen", [
    ["path", { d: "M12 7v14", key: "1akyts" }],
    [
      "path",
      {
        d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
        key: "ruj8y"
      }
    ]
  ]);
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
  const Check = createLucideIcon("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
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
  const Filter = createLucideIcon("Filter", [
    ["polygon", { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3", key: "1yg77f" }]
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
  const Settings = createLucideIcon("Settings", [
    [
      "path",
      {
        d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
        key: "1qme2f"
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
  const Smartphone = createLucideIcon("Smartphone", [
    ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2", key: "1yt0o3" }],
    ["path", { d: "M12 18h.01", key: "mhygvu" }]
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
  const Target = createLucideIcon("Target", [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
    ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
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
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const X = createLucideIcon("X", [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
  ]);
  const _EmailService = class _EmailService {
    constructor() {
      __publicField(this, "lambdaUrl");
      __publicField(this, "defaultFrom");
      __publicField(this, "baseUrl");
      this.lambdaUrl = "";
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
      instance.lambdaUrl = config.lambdaUrl;
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
    // Template variable substitution
    substituteVariables(template, variables) {
      let result = template;
      for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, "g");
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
    async sendEmailFromTemplate(type, to, variables, supabaseClient) {
      try {
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
        if (supabaseClient) {
          const { data, error } = await supabaseClient.functions.invoke("send-email", {
            body: {
              to: emailData.to,
              subject: emailData.subject,
              html: emailData.htmlBody
              // Note: Edge Function expects 'html', not 'htmlBody'
            }
          });
          if (error) {
            if (notificationId && supabaseClient) {
              await this.updateNotificationStatus(supabaseClient, notificationId, "failed", void 0, error.message || "Failed to send email");
            }
            return {
              success: false,
              error: error.message || "Failed to send email"
            };
          }
          if (data && data.success) {
            if (notificationId && supabaseClient) {
              await new Promise((resolve) => setTimeout(resolve, 2e3));
              await this.updateNotificationStatus(supabaseClient, notificationId, "sent", data.messageId);
            }
            return {
              success: true,
              messageId: data.messageId
            };
          } else {
            if (notificationId && supabaseClient) {
              await this.updateNotificationStatus(supabaseClient, notificationId, "failed", void 0, (data == null ? void 0 : data.error) || "Failed to send email");
            }
            return {
              success: false,
              error: (data == null ? void 0 : data.error) || "Failed to send email"
            };
          }
        } else {
          const supabaseUrl = typeof window !== "undefined" && window.VITE_SUPABASE_URL || "https://ufvingocbzegpgjknzhm.supabase.co";
          const supabaseKey = typeof window !== "undefined" && window.VITE_SUPABASE_ANON_KEY;
          if (!supabaseKey) {
            return {
              success: false,
              error: "Supabase client not provided and VITE_SUPABASE_ANON_KEY not configured"
            };
          }
          const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({
              to: emailData.to,
              subject: emailData.subject,
              html: emailData.htmlBody
            })
          });
          const result = await response.json();
          if (response.ok && result.success) {
            if (notificationId && supabaseClient) {
              await this.updateNotificationStatus(supabaseClient, notificationId, "sent", result.messageId);
            }
            return {
              success: true,
              messageId: result.messageId
            };
          } else {
            if (notificationId && supabaseClient) {
              await this.updateNotificationStatus(supabaseClient, notificationId, "failed", void 0, result.error || "Failed to send email");
            }
            return {
              success: false,
              error: result.error || "Failed to send email"
            };
          }
        }
      } catch (error) {
        console.error("Error sending email:", error);
        if (notificationId && supabaseClient) {
          await this.updateNotificationStatus(supabaseClient, notificationId, "failed", void 0, error.message || "Failed to send email");
        }
        return {
          success: false,
          error: error.message || "Failed to send email"
        };
      }
    }
    // Template for lesson reminder emails
    async sendLessonReminder(to, lessonTitle, scheduledTime, supabaseClient, additionalVariables) {
      if (supabaseClient) {
        const variables = {
          lesson_title: lessonTitle,
          scheduled_time: scheduledTime,
          ...additionalVariables
        };
        const result = await this.sendEmailFromTemplate(
          "lesson_reminder",
          to,
          variables,
          supabaseClient
        );
        if (result.success || result.error !== `No active template found for type: lesson_reminder`) {
          return result;
        }
      }
      const subject = `Reminder: ${lessonTitle} starts soon`;
      const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Lesson Reminder</h2>
        <p>Hello!</p>
        <p>This is a friendly reminder that your lesson <strong>${lessonTitle}</strong> is scheduled to start at <strong>${scheduledTime}</strong>.</p>
        <p>Please make sure you're ready to begin your cybersecurity training session.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Lesson Details:</h3>
          <p><strong>Title:</strong> ${lessonTitle}</p>
          <p><strong>Time:</strong> ${scheduledTime}</p>
        </div>
        <p>Best regards,<br>Your Cybersecurity Training Team</p>
      </div>
    `;
      return this.sendEmail({
        to,
        subject,
        htmlBody
      }, supabaseClient);
    }
    // Template for task due date reminders
    async sendTaskDueReminder(to, taskName, dueDate, supabaseClient) {
      const subject = `Reminder: ${taskName} is due soon`;
      const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Task Due Reminder</h2>
        <p>Hello!</p>
        <p>This is a reminder that your task <strong>${taskName}</strong> is due on <strong>${dueDate}</strong>.</p>
        <p>Please complete this task to stay on track with your cybersecurity training.</p>
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="margin-top: 0; color: #dc2626;">Task Details:</h3>
          <p><strong>Task:</strong> ${taskName}</p>
          <p><strong>Due Date:</strong> ${dueDate}</p>
        </div>
        <p>Best regards,<br>Your Cybersecurity Training Team</p>
      </div>
    `;
      return this.sendEmail({
        to,
        subject,
        htmlBody
      }, supabaseClient);
    }
    // Template for achievement emails
    async sendAchievementEmail(to, achievementTitle, achievementDescription, supabaseClient) {
      const subject = `Congratulations! You've earned: ${achievementTitle}`;
      const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">🎉 Achievement Unlocked!</h2>
        <p>Congratulations!</p>
        <p>You've successfully earned the achievement: <strong>${achievementTitle}</strong></p>
        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
          <h3 style="margin-top: 0; color: #059669;">Achievement Details:</h3>
          <p><strong>Title:</strong> ${achievementTitle}</p>
          <p><strong>Description:</strong> ${achievementDescription}</p>
        </div>
        <p>Keep up the great work in your cybersecurity journey!</p>
        <p>Best regards,<br>Your Cybersecurity Training Team</p>
      </div>
    `;
      return this.sendEmail({
        to,
        subject,
        htmlBody
      }, supabaseClient);
    }
    // Template for course completion emails
    async sendCourseCompletionEmail(to, courseName, supabaseClient) {
      const subject = `Congratulations! You've completed ${courseName}`;
      const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">🎓 Course Completed!</h2>
        <p>Congratulations on completing your course!</p>
        <p>You've successfully finished: <strong>${courseName}</strong></p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
          <h3 style="margin-top: 0; color: #7c3aed;">Course Details:</h3>
          <p><strong>Course:</strong> ${courseName}</p>
          <p><strong>Status:</strong> ✅ Completed</p>
        </div>
        <p>You're now one step closer to becoming a cybersecurity expert!</p>
        <p>Best regards,<br>Your Cybersecurity Training Team</p>
      </div>
    `;
      return this.sendEmail({
        to,
        subject,
        htmlBody
      }, supabaseClient);
    }
    // Template for system alert emails
    async sendSystemAlert(to, alertTitle, alertMessage, supabaseClient) {
      const subject = `System Alert: ${alertTitle}`;
      const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ea580c;">⚠️ System Alert</h2>
        <p>Hello!</p>
        <p>This is an important system alert regarding: <strong>${alertTitle}</strong></p>
        <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ea580c;">
          <h3 style="margin-top: 0; color: #ea580c;">Alert Details:</h3>
          <p><strong>Title:</strong> ${alertTitle}</p>
          <p><strong>Message:</strong> ${alertMessage}</p>
        </div>
        <p>Please take note of this information.</p>
        <p>Best regards,<br>Your Cybersecurity Training Team</p>
      </div>
    `;
      return this.sendEmail({
        to,
        subject,
        htmlBody
      }, supabaseClient);
    }
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
  };
  __publicField(_EmailService, "instance");
  let EmailService = _EmailService;
  const emailService = EmailService.getInstance();
  const emailService$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    EmailService,
    emailService
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
    const [preferences, setPreferences] = react.useState(null);
    const [loading, setLoading] = react.useState(true);
    const [sending, setSending] = react.useState(false);
    const [testEmailType, setTestEmailType] = react.useState("system_alert");
    react.useEffect(() => {
      if (awsConfig) {
        EmailService.configure(awsConfig);
      }
    }, [awsConfig]);
    react.useEffect(() => {
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
            courseCompletions: data.course_completions,
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
        course_completions: updatedPrefs.courseCompletions,
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
      return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-learning-primary" }) });
    }
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx(Mail, { className: "h-6 w-6 text-learning-primary" }),
        /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "text-2xl font-bold text-learning-primary", children: "Email Preferences" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-left", children: /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "email-enabled", children: "Enable Email Notifications" }) }),
          /* @__PURE__ */ jsxRuntime.jsx(
            Switch,
            {
              id: "email-enabled",
              checked: (preferences == null ? void 0 : preferences.emailEnabled) || false,
              onCheckedChange: (checked) => updatePreferences({ emailEnabled: checked })
            }
          )
        ] }),
        (preferences == null ? void 0 : preferences.emailEnabled) && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-2 gap-4 pl-4 border-l-2 border-blue-200", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "max-attempts", className: "text-sm", children: "Max Reminder Attempts" }),
            /* @__PURE__ */ jsxRuntime.jsx(
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
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "reminder-frequency", className: "text-sm", children: "Reminder Frequency (Days)" }),
            /* @__PURE__ */ jsxRuntime.jsx(
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
        (preferences == null ? void 0 : preferences.emailEnabled) && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h4", { className: "font-medium", children: "Notification Types" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntime.jsx(Label, { className: "text-left", children: "Task Due Dates" }),
              /* @__PURE__ */ jsxRuntime.jsx(
                Switch,
                {
                  checked: (preferences == null ? void 0 : preferences.taskDueDates) || false,
                  onCheckedChange: (checked) => updatePreferences({ taskDueDates: checked })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntime.jsx(Label, { className: "text-left", children: "System Alerts" }),
              /* @__PURE__ */ jsxRuntime.jsx(
                Switch,
                {
                  checked: (preferences == null ? void 0 : preferences.systemAlerts) || false,
                  onCheckedChange: (checked) => updatePreferences({ systemAlerts: checked })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntime.jsx(Label, { className: "text-left", children: "Achievements" }),
              /* @__PURE__ */ jsxRuntime.jsx(
                Switch,
                {
                  checked: (preferences == null ? void 0 : preferences.achievements) || false,
                  onCheckedChange: (checked) => updatePreferences({ achievements: checked })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntime.jsx(Label, { className: "text-left", children: "Course Completions" }),
              /* @__PURE__ */ jsxRuntime.jsx(
                Switch,
                {
                  checked: (preferences == null ? void 0 : preferences.courseCompletions) || false,
                  onCheckedChange: (checked) => updatePreferences({ courseCompletions: checked })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntime.jsx(Label, { className: "text-left font-medium", children: "Lesson Reminders" }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  Switch,
                  {
                    checked: (preferences == null ? void 0 : preferences.reminderDaysBefore) !== void 0 && (preferences == null ? void 0 : preferences.reminderDaysBefore) >= 0,
                    onCheckedChange: (checked) => {
                      updatePreferences({
                        reminderDaysBefore: checked ? 1 : -1
                        // -1 means disabled
                      });
                    }
                  }
                )
              ] }),
              (preferences == null ? void 0 : preferences.reminderDaysBefore) !== void 0 && (preferences == null ? void 0 : preferences.reminderDaysBefore) >= 0 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "space-y-4 pl-4 border-l-2 border-blue-200", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "reminder-days", className: "text-sm", children: "Days before lesson" }),
                  /* @__PURE__ */ jsxRuntime.jsx(
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
                /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "reminder-time", className: "text-sm", children: "Send at time" }),
                  /* @__PURE__ */ jsxRuntime.jsx(
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
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntime.jsx(Label, { className: "text-left font-medium", children: "Upcoming Lessons" }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  Switch,
                  {
                    checked: (preferences == null ? void 0 : preferences.includeUpcomingLessons) || false,
                    onCheckedChange: (checked) => updatePreferences({ includeUpcomingLessons: checked })
                  }
                )
              ] }),
              (preferences == null ? void 0 : preferences.includeUpcomingLessons) && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pl-4 border-l-2 border-green-200", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "upcoming-days", className: "text-sm", children: "Look ahead days" }),
                /* @__PURE__ */ jsxRuntime.jsx(
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
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsxRuntime.jsx(Label, { children: "Quiet Hours" }),
              /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-muted-foreground", children: "Don't send emails during these hours" })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx(
              Switch,
              {
                checked: (preferences == null ? void 0 : preferences.quietHoursEnabled) || false,
                onCheckedChange: (checked) => updatePreferences({ quietHoursEnabled: checked })
              }
            )
          ] }),
          (preferences == null ? void 0 : preferences.quietHoursEnabled) && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntime.jsx(Label, { children: "Start Time" }),
              /* @__PURE__ */ jsxRuntime.jsx(
                Input,
                {
                  type: "time",
                  value: (preferences == null ? void 0 : preferences.quietHoursStart) || "22:00",
                  onChange: (e) => updatePreferences({ quietHoursStart: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntime.jsx(Label, { children: "End Time" }),
              /* @__PURE__ */ jsxRuntime.jsx(
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
    isSuperAdmin = false
  }) {
    const [templates, setTemplates] = react.useState([]);
    const [loading, setLoading] = react.useState(true);
    const [error, setError] = react.useState(null);
    const [searchTerm, setSearchTerm] = react.useState("");
    const [statusFilter, setStatusFilter] = react.useState("all");
    const [typeFilter, setTypeFilter] = react.useState("all");
    const [selectedTemplate, setSelectedTemplate] = react.useState(null);
    const [isEditing, setIsEditing] = react.useState(false);
    const [isViewing, setIsViewing] = react.useState(false);
    const [isCreating, setIsCreating] = react.useState(false);
    react.useEffect(() => {
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
    const handleView = (template) => {
      setSelectedTemplate(template);
      setIsViewing(true);
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
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!(user == null ? void 0 : user.email)) {
          alert("No user email found for testing");
          return;
        }
        const sampleVariables = generateSampleVariables(template.type);
        const { data: notificationData, error: notificationError } = await supabaseClient.from("notification_history").insert({
          user_id: user.id,
          email_template_id: template.id,
          // Include the template ID!
          trigger_event: template.type,
          template_variables: sampleVariables,
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
          sampleVariables,
          supabaseClient,
          notificationData == null ? void 0 : notificationData.id
          // Pass notification ID for status tracking
        );
        if (result.success) {
          alert(`Test email sent successfully to ${user.email}`);
        } else {
          alert(`Failed to send test email: ${result.error}`);
        }
      } catch (err) {
        alert(`Error sending test email: ${err.message}`);
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
          alert("Template created successfully");
        } else {
          const { error: error2 } = await supabaseClient.from("email_templates").update(templateData).eq("id", selectedTemplate.id);
          if (error2) throw error2;
          alert("Template updated successfully");
        }
        setIsEditing(false);
        setIsCreating(false);
        setSelectedTemplate(null);
        loadTemplates();
      } catch (err) {
        alert(`Error saving template: ${err.message}`);
      }
    };
    const generateSampleVariables = (templateType) => {
      const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";
      const baseVariables = {
        user_name: "John Doe",
        lesson_title: "Introduction to Cybersecurity",
        learning_track_title: "Cybersecurity Fundamentals",
        lesson_description: "Learn the basics of cybersecurity and how to protect digital assets.",
        completion_date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US"),
        completion_time: (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        available_date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }),
        reminder_type: "Available Now",
        lesson_url: `${origin}/#/lesson/sample-lesson-id`
      };
      switch (templateType) {
        case "lesson_completed":
          return {
            ...baseVariables,
            lessons_completed_in_track: 5,
            total_lessons_in_track: 10,
            track_progress_percentage: 50,
            next_lesson_title: "Advanced Security Concepts",
            next_lesson_available: true,
            next_lesson_url: "http://localhost:8080/#/lesson/next-lesson-id"
          };
        case "track_milestone_50":
          return {
            ...baseVariables,
            milestone_percentage: 50,
            lessons_completed: 5,
            total_lessons: 10,
            time_spent_hours: 12,
            continue_learning_url: "http://localhost:8080/#/dashboard"
          };
        case "quiz_high_score":
          return {
            ...baseVariables,
            quiz_title: "Cybersecurity Basics Quiz",
            score: 95,
            correct_answers: 19,
            total_questions: 20,
            view_results_url: "http://localhost:8080/#/quiz/results",
            continue_learning_url: "http://localhost:8080/#/dashboard"
          };
        case "lesson_reminder":
          return {
            ...baseVariables,
            lesson_description: "Learn the basics of cybersecurity and how to protect digital assets.",
            reminder_type: "Available Now"
          };
        default:
          return baseVariables;
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
      return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-muted-foreground", children: "Loading templates..." }) });
    }
    if (error) {
      return /* @__PURE__ */ jsxRuntime.jsx(Alert, { className: "mb-4", children: /* @__PURE__ */ jsxRuntime.jsxs(AlertDescription, { children: [
        "Error loading templates: ",
        error
      ] }) });
    }
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "text-2xl font-bold text-learning-primary", children: "Email Template Management" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-muted-foreground", children: "Create and manage email templates" })
        ] }),
        isSuperAdmin ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsxRuntime.jsxs(
          Button,
          {
            onClick: handleCreate,
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(Plus, { className: "h-4 w-4 mr-2" }),
              "Create Template"
            ]
          }
        ) }) : /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-muted-foreground", children: "Template creation requires Super Admin access" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            Input,
            {
              placeholder: "Search templates...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "pl-10"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntime.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
            /* @__PURE__ */ jsxRuntime.jsx(SelectTrigger, { className: "w-32", children: /* @__PURE__ */ jsxRuntime.jsx(SelectValue, { placeholder: "Status" }) }),
            /* @__PURE__ */ jsxRuntime.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "all", children: "All Status" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "system", children: "System" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "custom", children: "Custom" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs(Select, { value: typeFilter, onValueChange: setTypeFilter, children: [
            /* @__PURE__ */ jsxRuntime.jsx(SelectTrigger, { className: "w-40", children: /* @__PURE__ */ jsxRuntime.jsx(SelectValue, { placeholder: "Type" }) }),
            /* @__PURE__ */ jsxRuntime.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "all", children: "All Types" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "lesson_completed", children: "Lesson Completed" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "lesson_reminder", children: "Lesson Reminder" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "quiz_high_score", children: "Quiz High Score" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "track_milestone", children: "Track Milestone" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "system_alert", children: "System Alert" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "task_due", children: "Task Due" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "achievement", children: "Achievement" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "course_completion", children: "Course Completion" })
            ] })
          ] })
        ] })
      ] }),
      filteredTemplates.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx(Card, { children: /* @__PURE__ */ jsxRuntime.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12", children: [
        /* @__PURE__ */ jsxRuntime.jsx(Mail, { className: "h-12 w-12 text-muted-foreground mb-4" }),
        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-lg font-semibold mb-2", children: "No templates found" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-muted-foreground text-center", children: searchTerm ? "No templates match your search." : "Create your first email template to get started." })
      ] }) }) : /* @__PURE__ */ jsxRuntime.jsx(Card, { children: /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntime.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntime.jsx("thead", { children: /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "border-b", children: [
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: "text-left p-4 font-medium", children: "Template" }),
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: "text-left p-4 font-medium", children: "Type" }),
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: "text-left p-4 font-medium", children: "Status" }),
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: "text-left p-4 font-medium", children: "Created" }),
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: "text-left p-4 font-medium", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: filteredTemplates.map((template) => /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "border-b hover:bg-gray-50", children: [
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-medium", children: template.name }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-muted-foreground", children: template.subject_template })
          ] }) }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntime.jsx(Badge, { className: getTypeColor(template.type), children: template.type.replace("_", " ") }) }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(Badge, { variant: "secondary", children: "Published" }),
            template.is_system && /* @__PURE__ */ jsxRuntime.jsx(Badge, { variant: "outline", children: "System" })
          ] }) }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "p-4 text-sm text-muted-foreground", children: formatDate(template.created_at) }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => handleEdit(template),
                title: "Edit Template",
                children: /* @__PURE__ */ jsxRuntime.jsx(SquarePen, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => handleView(template),
                title: "View Template",
                children: /* @__PURE__ */ jsxRuntime.jsx(Eye, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => handleDuplicate(template),
                title: "Duplicate Template",
                children: /* @__PURE__ */ jsxRuntime.jsx(Copy, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => handleSendTest(template),
                title: "Send Test Email",
                children: /* @__PURE__ */ jsxRuntime.jsx(Send, { className: "h-4 w-4" })
              }
            ),
            !template.is_system && /* @__PURE__ */ jsxRuntime.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => handleDelete(template),
                className: "text-red-600 hover:text-red-700",
                title: "Delete Template",
                style: { backgroundColor: "orange", color: "white" },
                children: /* @__PURE__ */ jsxRuntime.jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] }) })
        ] }, template.id)) })
      ] }) }) }) }),
      (isEditing || isViewing) && selectedTemplate && /* @__PURE__ */ jsxRuntime.jsx(Dialog, { open: isEditing || isViewing, onOpenChange: () => {
        setIsEditing(false);
        setIsViewing(false);
        setIsCreating(false);
        setSelectedTemplate(null);
      }, children: /* @__PURE__ */ jsxRuntime.jsxs(DialogContent, { className: "max-w-4xl max-h-[80vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntime.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntime.jsxs(DialogTitle, { children: [
          isCreating ? "Create Template" : isEditing ? "Edit Template" : "Email Preview",
          ": ",
          selectedTemplate.name || "New Template"
        ] }) }),
        isViewing ? (
          /* Email Preview Mode */
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "border rounded-lg p-4 bg-white", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "border-b pb-2 mb-4", children: [
                /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "font-semibold text-gray-700", children: "Email Preview" }),
                /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-gray-500", children: "How this email will appear to recipients" })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Subject:" }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-1 p-2 bg-gray-50 rounded border", children: selectedTemplate.subject_template.replace(/\{\{(\w+)\}\}/g, (match2, key) => {
                    const sampleData = generateSampleVariables(selectedTemplate.type);
                    return sampleData[key] || match2;
                  }) })
                ] }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Email Body:" }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-1 border rounded bg-white max-h-96 overflow-y-auto", children: /* @__PURE__ */ jsxRuntime.jsx(
                    "div",
                    {
                      className: "p-4 prose max-w-none",
                      dangerouslySetInnerHTML: {
                        __html: selectedTemplate.html_body_template.replace(/\{\{(\w+)\}\}/g, (match2, key) => {
                          const sampleData = generateSampleVariables(selectedTemplate.type);
                          return sampleData[key] || match2;
                        })
                      }
                    }
                  ) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntime.jsx(Button, { variant: "outline", onClick: () => {
              setIsViewing(false);
              setSelectedTemplate(null);
            }, children: "Close Preview" }) })
          ] })
        ) : (
          /* Edit/Create Mode */
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "name", children: "Template Name" }),
                /* @__PURE__ */ jsxRuntime.jsx(
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
              /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "type", children: "Template Type" }),
                /* @__PURE__ */ jsxRuntime.jsx(
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
            /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "subject", children: "Subject" }),
              /* @__PURE__ */ jsxRuntime.jsx(
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
            /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "content", children: "HTML Content" }),
              /* @__PURE__ */ jsxRuntime.jsx(
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
            /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "text-content", children: "Text Content (Optional)" }),
              /* @__PURE__ */ jsxRuntime.jsx(
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
            isEditing && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-end space-x-2", children: [
              /* @__PURE__ */ jsxRuntime.jsx(Button, { variant: "outline", onClick: () => {
                setIsEditing(false);
                setIsCreating(false);
                setSelectedTemplate(null);
              }, children: "Cancel" }),
              /* @__PURE__ */ jsxRuntime.jsx(Button, { onClick: handleSave, children: isCreating ? "Create" : "Save" })
            ] })
          ] })
        )
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
    const [notifications, setNotifications] = react.useState([]);
    const [loading, setLoading] = react.useState(true);
    const [error, setError] = react.useState(null);
    const [searchTerm, setSearchTerm] = react.useState("");
    const [statusFilter, setStatusFilter] = react.useState("all");
    const [typeFilter, setTypeFilter] = react.useState("all");
    react.useEffect(() => {
      loadNotifications();
    }, []);
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const { data, error: error2 } = await supabaseClient.from("notification_history").select(`
          *,
          user:user_id(email)
        `).order("created_at", { ascending: false }).limit(100);
        if (error2) throw error2;
        const mappedData = (data || []).map((notification) => {
          var _a;
          return {
            id: notification.id,
            title: notification.trigger_event.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            message: `Notification of type ${notification.trigger_event}`,
            type: notification.trigger_event,
            status: notification.status,
            email: ((_a = notification.user) == null ? void 0 : _a.email) || "Unknown User",
            sent_at: notification.sent_at || notification.created_at,
            error_message: notification.error_message
          };
        });
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
          return /* @__PURE__ */ jsxRuntime.jsx(CircleCheckBig, { className: "h-4 w-4" });
        case "failed":
          return /* @__PURE__ */ jsxRuntime.jsx(CircleX, { className: "h-4 w-4" });
        case "pending":
          return /* @__PURE__ */ jsxRuntime.jsx(Clock, { className: "h-4 w-4" });
        default:
          return /* @__PURE__ */ jsxRuntime.jsx(CircleAlert, { className: "h-4 w-4" });
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
      return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-muted-foreground", children: "Loading recent notifications..." }) });
    }
    if (error) {
      return /* @__PURE__ */ jsxRuntime.jsx(Alert, { className: "mb-4", children: /* @__PURE__ */ jsxRuntime.jsxs(AlertDescription, { children: [
        "Error loading notifications: ",
        error
      ] }) });
    }
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "text-2xl font-bold text-learning-primary", children: "Recent Email Notifications" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-muted-foreground", children: "View sent email notifications and their status" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsxRuntime.jsxs(Button, { variant: "outline", size: "sm", onClick: loadNotifications, children: [
          /* @__PURE__ */ jsxRuntime.jsx(RefreshCw, { className: "h-4 w-4 mr-2" }),
          "Refresh"
        ] }) })
      ] }),
      notifications.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-row gap-4", children: [
        /* @__PURE__ */ jsxRuntime.jsx(Card, { className: "flex-1", children: /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx(CircleCheckBig, { className: "h-5 w-5 text-green-600" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-2xl font-bold text-green-600", children: notifications.filter((n) => n.status === "sent").length }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-muted-foreground", children: "Sent" })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx(Card, { className: "flex-1", children: /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx(CircleX, { className: "h-5 w-5 text-red-600" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-2xl font-bold text-red-600", children: notifications.filter((n) => n.status === "failed").length }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-muted-foreground", children: "Failed" }),
            notifications.filter((n) => n.status === "failed").length > 0 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-xs text-red-700 mt-1 font-medium", children: "Check error messages above" })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx(Card, { className: "flex-1", children: /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Clock, { className: "h-5 w-5 text-yellow-600" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-2xl font-bold text-yellow-600", children: notifications.filter((n) => n.status === "pending").length }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-muted-foreground", children: "Pending" }),
            notifications.filter((n) => n.status === "pending").length > 0 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-xs text-yellow-700 mt-1 font-medium", children: "Being processed" })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx(Card, { className: "flex-1", children: /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Mail, { className: "h-5 w-5 text-blue-600" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-2xl font-bold text-blue-600", children: notifications.length }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-muted-foreground", children: "Total" })
          ] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            Input,
            {
              placeholder: "Search notifications...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "pl-10"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntime.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
            /* @__PURE__ */ jsxRuntime.jsx(SelectTrigger, { className: "w-32", children: /* @__PURE__ */ jsxRuntime.jsx(SelectValue, { placeholder: "Status" }) }),
            /* @__PURE__ */ jsxRuntime.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "all", children: "All Status" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "sent", children: "Sent" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "failed", children: "Failed" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "pending", children: "Pending" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs(Select, { value: typeFilter, onValueChange: setTypeFilter, children: [
            /* @__PURE__ */ jsxRuntime.jsx(SelectTrigger, { className: "w-40", children: /* @__PURE__ */ jsxRuntime.jsx(SelectValue, { placeholder: "Type" }) }),
            /* @__PURE__ */ jsxRuntime.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "all", children: "All Types" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "lesson_completed", children: "Lesson Completed" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "lesson_reminder", children: "Lesson Reminder" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "quiz_high_score", children: "Quiz High Score" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "track_milestone", children: "Track Milestone" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "system_alert", children: "System Alert" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "task_due", children: "Task Due" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "achievement", children: "Achievement" }),
              /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "course_completion", children: "Course Completion" })
            ] })
          ] })
        ] })
      ] }),
      filteredNotifications.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx(Card, { children: /* @__PURE__ */ jsxRuntime.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12", children: [
        /* @__PURE__ */ jsxRuntime.jsx(Mail, { className: "h-12 w-12 text-muted-foreground mb-4" }),
        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-lg font-semibold mb-2", children: "No notifications found" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-muted-foreground text-center", children: searchTerm || statusFilter !== "all" || typeFilter !== "all" ? "No notifications match your filters." : "No email notifications have been sent yet." })
      ] }) }) : /* @__PURE__ */ jsxRuntime.jsx(Card, { children: /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntime.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntime.jsx("thead", { children: /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "border-b bg-gray-50", children: [
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: "text-left p-4 font-medium", children: "Notification" }),
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: "text-left p-4 font-medium", children: "Type" }),
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: "text-left p-4 font-medium", children: "Status" }),
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: "text-left p-4 font-medium", children: "Recipient" }),
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: "text-left p-4 font-medium", children: "Sent" })
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: filteredNotifications.map((notification) => /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "border-b hover:bg-gray-50", children: [
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-medium", children: notification.title }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-muted-foreground line-clamp-2", children: notification.message })
          ] }) }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "p-4 text-left", children: /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
              style: getTypeStyle(notification.type),
              children: notification.type.replace("_", " ")
            }
          ) }),
          /* @__PURE__ */ jsxRuntime.jsxs("td", { className: "p-4 text-left", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
              getStatusIcon(notification.status),
              /* @__PURE__ */ jsxRuntime.jsx(
                "span",
                {
                  className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                  style: getStatusStyle(notification.status),
                  children: notification.status
                }
              )
            ] }),
            notification.status === "failed" && notification.error_message && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-xs text-red-600 mt-1", children: notification.error_message })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "p-4 text-left", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(User, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm", children: notification.email })
          ] }) }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "p-4 text-left", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm", children: notification.sent_at ? /* @__PURE__ */ jsxRuntime.jsx("div", { children: formatDate(notification.sent_at) }) : /* @__PURE__ */ jsxRuntime.jsx("div", { children: formatDate(notification.created_at) }) })
          ] }) })
        ] }, notification.id)) })
      ] }) }) }) })
    ] });
  }
  const supabase = null;
  const useNotifications = (filters = {}) => {
    const queryClient = reactQuery.useQueryClient();
    const [unreadCount, setUnreadCount] = react.useState(0);
    const {
      data: notifications = [],
      isLoading,
      error,
      refetch
    } = reactQuery.useQuery({
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
    const { data: unreadData } = reactQuery.useQuery({
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
    react.useEffect(() => {
      if (unreadData !== void 0) {
        setUnreadCount(unreadData);
      }
    }, [unreadData]);
    const markAsReadMutation = reactQuery.useMutation({
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
    const markAllAsReadMutation = reactQuery.useMutation({
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
    const deleteNotificationMutation = reactQuery.useMutation({
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
    const markAsRead = react.useCallback(async (id) => {
      await markAsReadMutation.mutateAsync(id);
    }, [markAsReadMutation]);
    const markAllAsRead = react.useCallback(async () => {
      await markAllAsReadMutation.mutateAsync();
    }, [markAllAsReadMutation]);
    const deleteNotification = react.useCallback(async (id) => {
      await deleteNotificationMutation.mutateAsync(id);
    }, [deleteNotificationMutation]);
    const refresh = react.useCallback(() => {
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
  function toDate(argument) {
    const argStr = Object.prototype.toString.call(argument);
    if (argument instanceof Date || typeof argument === "object" && argStr === "[object Date]") {
      return new argument.constructor(+argument);
    } else if (typeof argument === "number" || argStr === "[object Number]" || typeof argument === "string" || argStr === "[object String]") {
      return new Date(argument);
    } else {
      return /* @__PURE__ */ new Date(NaN);
    }
  }
  function constructFrom(date, value) {
    if (date instanceof Date) {
      return new date.constructor(value);
    } else {
      return new Date(value);
    }
  }
  const millisecondsInWeek = 6048e5;
  const millisecondsInDay = 864e5;
  const minutesInMonth = 43200;
  const minutesInDay = 1440;
  let defaultOptions = {};
  function getDefaultOptions() {
    return defaultOptions;
  }
  function startOfWeek(date, options) {
    var _a, _b, _c, _d;
    const defaultOptions2 = getDefaultOptions();
    const weekStartsOn = (options == null ? void 0 : options.weekStartsOn) ?? ((_b = (_a = options == null ? void 0 : options.locale) == null ? void 0 : _a.options) == null ? void 0 : _b.weekStartsOn) ?? defaultOptions2.weekStartsOn ?? ((_d = (_c = defaultOptions2.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.weekStartsOn) ?? 0;
    const _date = toDate(date);
    const day = _date.getDay();
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    _date.setDate(_date.getDate() - diff);
    _date.setHours(0, 0, 0, 0);
    return _date;
  }
  function startOfISOWeek(date) {
    return startOfWeek(date, { weekStartsOn: 1 });
  }
  function getISOWeekYear(date) {
    const _date = toDate(date);
    const year = _date.getFullYear();
    const fourthOfJanuaryOfNextYear = constructFrom(date, 0);
    fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
    fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
    const startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);
    const fourthOfJanuaryOfThisYear = constructFrom(date, 0);
    fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
    fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
    const startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);
    if (_date.getTime() >= startOfNextYear.getTime()) {
      return year + 1;
    } else if (_date.getTime() >= startOfThisYear.getTime()) {
      return year;
    } else {
      return year - 1;
    }
  }
  function startOfDay(date) {
    const _date = toDate(date);
    _date.setHours(0, 0, 0, 0);
    return _date;
  }
  function getTimezoneOffsetInMilliseconds(date) {
    const _date = toDate(date);
    const utcDate = new Date(
      Date.UTC(
        _date.getFullYear(),
        _date.getMonth(),
        _date.getDate(),
        _date.getHours(),
        _date.getMinutes(),
        _date.getSeconds(),
        _date.getMilliseconds()
      )
    );
    utcDate.setUTCFullYear(_date.getFullYear());
    return +date - +utcDate;
  }
  function differenceInCalendarDays(dateLeft, dateRight) {
    const startOfDayLeft = startOfDay(dateLeft);
    const startOfDayRight = startOfDay(dateRight);
    const timestampLeft = +startOfDayLeft - getTimezoneOffsetInMilliseconds(startOfDayLeft);
    const timestampRight = +startOfDayRight - getTimezoneOffsetInMilliseconds(startOfDayRight);
    return Math.round((timestampLeft - timestampRight) / millisecondsInDay);
  }
  function startOfISOWeekYear(date) {
    const year = getISOWeekYear(date);
    const fourthOfJanuary = constructFrom(date, 0);
    fourthOfJanuary.setFullYear(year, 0, 4);
    fourthOfJanuary.setHours(0, 0, 0, 0);
    return startOfISOWeek(fourthOfJanuary);
  }
  function compareAsc(dateLeft, dateRight) {
    const _dateLeft = toDate(dateLeft);
    const _dateRight = toDate(dateRight);
    const diff = _dateLeft.getTime() - _dateRight.getTime();
    if (diff < 0) {
      return -1;
    } else if (diff > 0) {
      return 1;
    } else {
      return diff;
    }
  }
  function constructNow(date) {
    return constructFrom(date, Date.now());
  }
  function isDate(value) {
    return value instanceof Date || typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]";
  }
  function isValid(date) {
    if (!isDate(date) && typeof date !== "number") {
      return false;
    }
    const _date = toDate(date);
    return !isNaN(Number(_date));
  }
  function differenceInCalendarMonths(dateLeft, dateRight) {
    const _dateLeft = toDate(dateLeft);
    const _dateRight = toDate(dateRight);
    const yearDiff = _dateLeft.getFullYear() - _dateRight.getFullYear();
    const monthDiff = _dateLeft.getMonth() - _dateRight.getMonth();
    return yearDiff * 12 + monthDiff;
  }
  function getRoundingMethod(method) {
    return (number) => {
      const round = method ? Math[method] : Math.trunc;
      const result = round(number);
      return result === 0 ? 0 : result;
    };
  }
  function differenceInMilliseconds(dateLeft, dateRight) {
    return +toDate(dateLeft) - +toDate(dateRight);
  }
  function endOfDay(date) {
    const _date = toDate(date);
    _date.setHours(23, 59, 59, 999);
    return _date;
  }
  function endOfMonth(date) {
    const _date = toDate(date);
    const month = _date.getMonth();
    _date.setFullYear(_date.getFullYear(), month + 1, 0);
    _date.setHours(23, 59, 59, 999);
    return _date;
  }
  function isLastDayOfMonth(date) {
    const _date = toDate(date);
    return +endOfDay(_date) === +endOfMonth(_date);
  }
  function differenceInMonths(dateLeft, dateRight) {
    const _dateLeft = toDate(dateLeft);
    const _dateRight = toDate(dateRight);
    const sign = compareAsc(_dateLeft, _dateRight);
    const difference = Math.abs(
      differenceInCalendarMonths(_dateLeft, _dateRight)
    );
    let result;
    if (difference < 1) {
      result = 0;
    } else {
      if (_dateLeft.getMonth() === 1 && _dateLeft.getDate() > 27) {
        _dateLeft.setDate(30);
      }
      _dateLeft.setMonth(_dateLeft.getMonth() - sign * difference);
      let isLastMonthNotFull = compareAsc(_dateLeft, _dateRight) === -sign;
      if (isLastDayOfMonth(toDate(dateLeft)) && difference === 1 && compareAsc(dateLeft, _dateRight) === 1) {
        isLastMonthNotFull = false;
      }
      result = sign * (difference - Number(isLastMonthNotFull));
    }
    return result === 0 ? 0 : result;
  }
  function differenceInSeconds(dateLeft, dateRight, options) {
    const diff = differenceInMilliseconds(dateLeft, dateRight) / 1e3;
    return getRoundingMethod(options == null ? void 0 : options.roundingMethod)(diff);
  }
  function startOfYear(date) {
    const cleanDate = toDate(date);
    const _date = constructFrom(date, 0);
    _date.setFullYear(cleanDate.getFullYear(), 0, 1);
    _date.setHours(0, 0, 0, 0);
    return _date;
  }
  const formatDistanceLocale = {
    lessThanXSeconds: {
      one: "less than a second",
      other: "less than {{count}} seconds"
    },
    xSeconds: {
      one: "1 second",
      other: "{{count}} seconds"
    },
    halfAMinute: "half a minute",
    lessThanXMinutes: {
      one: "less than a minute",
      other: "less than {{count}} minutes"
    },
    xMinutes: {
      one: "1 minute",
      other: "{{count}} minutes"
    },
    aboutXHours: {
      one: "about 1 hour",
      other: "about {{count}} hours"
    },
    xHours: {
      one: "1 hour",
      other: "{{count}} hours"
    },
    xDays: {
      one: "1 day",
      other: "{{count}} days"
    },
    aboutXWeeks: {
      one: "about 1 week",
      other: "about {{count}} weeks"
    },
    xWeeks: {
      one: "1 week",
      other: "{{count}} weeks"
    },
    aboutXMonths: {
      one: "about 1 month",
      other: "about {{count}} months"
    },
    xMonths: {
      one: "1 month",
      other: "{{count}} months"
    },
    aboutXYears: {
      one: "about 1 year",
      other: "about {{count}} years"
    },
    xYears: {
      one: "1 year",
      other: "{{count}} years"
    },
    overXYears: {
      one: "over 1 year",
      other: "over {{count}} years"
    },
    almostXYears: {
      one: "almost 1 year",
      other: "almost {{count}} years"
    }
  };
  const formatDistance$1 = (token, count, options) => {
    let result;
    const tokenValue = formatDistanceLocale[token];
    if (typeof tokenValue === "string") {
      result = tokenValue;
    } else if (count === 1) {
      result = tokenValue.one;
    } else {
      result = tokenValue.other.replace("{{count}}", count.toString());
    }
    if (options == null ? void 0 : options.addSuffix) {
      if (options.comparison && options.comparison > 0) {
        return "in " + result;
      } else {
        return result + " ago";
      }
    }
    return result;
  };
  function buildFormatLongFn(args) {
    return (options = {}) => {
      const width = options.width ? String(options.width) : args.defaultWidth;
      const format2 = args.formats[width] || args.formats[args.defaultWidth];
      return format2;
    };
  }
  const dateFormats = {
    full: "EEEE, MMMM do, y",
    long: "MMMM do, y",
    medium: "MMM d, y",
    short: "MM/dd/yyyy"
  };
  const timeFormats = {
    full: "h:mm:ss a zzzz",
    long: "h:mm:ss a z",
    medium: "h:mm:ss a",
    short: "h:mm a"
  };
  const dateTimeFormats = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: "{{date}}, {{time}}",
    short: "{{date}}, {{time}}"
  };
  const formatLong = {
    date: buildFormatLongFn({
      formats: dateFormats,
      defaultWidth: "full"
    }),
    time: buildFormatLongFn({
      formats: timeFormats,
      defaultWidth: "full"
    }),
    dateTime: buildFormatLongFn({
      formats: dateTimeFormats,
      defaultWidth: "full"
    })
  };
  const formatRelativeLocale = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "P"
  };
  const formatRelative = (token, _date, _baseDate, _options) => formatRelativeLocale[token];
  function buildLocalizeFn(args) {
    return (value, options) => {
      const context = (options == null ? void 0 : options.context) ? String(options.context) : "standalone";
      let valuesArray;
      if (context === "formatting" && args.formattingValues) {
        const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
        const width = (options == null ? void 0 : options.width) ? String(options.width) : defaultWidth;
        valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
      } else {
        const defaultWidth = args.defaultWidth;
        const width = (options == null ? void 0 : options.width) ? String(options.width) : args.defaultWidth;
        valuesArray = args.values[width] || args.values[defaultWidth];
      }
      const index = args.argumentCallback ? args.argumentCallback(value) : value;
      return valuesArray[index];
    };
  }
  const eraValues = {
    narrow: ["B", "A"],
    abbreviated: ["BC", "AD"],
    wide: ["Before Christ", "Anno Domini"]
  };
  const quarterValues = {
    narrow: ["1", "2", "3", "4"],
    abbreviated: ["Q1", "Q2", "Q3", "Q4"],
    wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
  };
  const monthValues = {
    narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    abbreviated: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    wide: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]
  };
  const dayValues = {
    narrow: ["S", "M", "T", "W", "T", "F", "S"],
    short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    wide: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ]
  };
  const dayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    }
  };
  const formattingDayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    }
  };
  const ordinalNumber = (dirtyNumber, _options) => {
    const number = Number(dirtyNumber);
    const rem100 = number % 100;
    if (rem100 > 20 || rem100 < 10) {
      switch (rem100 % 10) {
        case 1:
          return number + "st";
        case 2:
          return number + "nd";
        case 3:
          return number + "rd";
      }
    }
    return number + "th";
  };
  const localize = {
    ordinalNumber,
    era: buildLocalizeFn({
      values: eraValues,
      defaultWidth: "wide"
    }),
    quarter: buildLocalizeFn({
      values: quarterValues,
      defaultWidth: "wide",
      argumentCallback: (quarter) => quarter - 1
    }),
    month: buildLocalizeFn({
      values: monthValues,
      defaultWidth: "wide"
    }),
    day: buildLocalizeFn({
      values: dayValues,
      defaultWidth: "wide"
    }),
    dayPeriod: buildLocalizeFn({
      values: dayPeriodValues,
      defaultWidth: "wide",
      formattingValues: formattingDayPeriodValues,
      defaultFormattingWidth: "wide"
    })
  };
  function buildMatchFn(args) {
    return (string, options = {}) => {
      const width = options.width;
      const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
      const matchResult = string.match(matchPattern);
      if (!matchResult) {
        return null;
      }
      const matchedString = matchResult[0];
      const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
      const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString)) : (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
        findKey(parsePatterns, (pattern) => pattern.test(matchedString))
      );
      let value;
      value = args.valueCallback ? args.valueCallback(key) : key;
      value = options.valueCallback ? (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
        options.valueCallback(value)
      ) : value;
      const rest = string.slice(matchedString.length);
      return { value, rest };
    };
  }
  function findKey(object, predicate) {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
        return key;
      }
    }
    return void 0;
  }
  function findIndex(array, predicate) {
    for (let key = 0; key < array.length; key++) {
      if (predicate(array[key])) {
        return key;
      }
    }
    return void 0;
  }
  function buildMatchPatternFn(args) {
    return (string, options = {}) => {
      const matchResult = string.match(args.matchPattern);
      if (!matchResult) return null;
      const matchedString = matchResult[0];
      const parseResult = string.match(args.parsePattern);
      if (!parseResult) return null;
      let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
      value = options.valueCallback ? options.valueCallback(value) : value;
      const rest = string.slice(matchedString.length);
      return { value, rest };
    };
  }
  const matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
  const parseOrdinalNumberPattern = /\d+/i;
  const matchEraPatterns = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i
  };
  const parseEraPatterns = {
    any: [/^b/i, /^(a|c)/i]
  };
  const matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i
  };
  const parseQuarterPatterns = {
    any: [/1/i, /2/i, /3/i, /4/i]
  };
  const matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
  };
  const parseMonthPatterns = {
    narrow: [
      /^j/i,
      /^f/i,
      /^m/i,
      /^a/i,
      /^m/i,
      /^j/i,
      /^j/i,
      /^a/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i
    ],
    any: [
      /^ja/i,
      /^f/i,
      /^mar/i,
      /^ap/i,
      /^may/i,
      /^jun/i,
      /^jul/i,
      /^au/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i
    ]
  };
  const matchDayPatterns = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
  };
  const parseDayPatterns = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
  };
  const matchDayPeriodPatterns = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
  };
  const parseDayPeriodPatterns = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i
    }
  };
  const match = {
    ordinalNumber: buildMatchPatternFn({
      matchPattern: matchOrdinalNumberPattern,
      parsePattern: parseOrdinalNumberPattern,
      valueCallback: (value) => parseInt(value, 10)
    }),
    era: buildMatchFn({
      matchPatterns: matchEraPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseEraPatterns,
      defaultParseWidth: "any"
    }),
    quarter: buildMatchFn({
      matchPatterns: matchQuarterPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseQuarterPatterns,
      defaultParseWidth: "any",
      valueCallback: (index) => index + 1
    }),
    month: buildMatchFn({
      matchPatterns: matchMonthPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseMonthPatterns,
      defaultParseWidth: "any"
    }),
    day: buildMatchFn({
      matchPatterns: matchDayPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseDayPatterns,
      defaultParseWidth: "any"
    }),
    dayPeriod: buildMatchFn({
      matchPatterns: matchDayPeriodPatterns,
      defaultMatchWidth: "any",
      parsePatterns: parseDayPeriodPatterns,
      defaultParseWidth: "any"
    })
  };
  const enUS = {
    code: "en-US",
    formatDistance: formatDistance$1,
    formatLong,
    formatRelative,
    localize,
    match,
    options: {
      weekStartsOn: 0,
      firstWeekContainsDate: 1
    }
  };
  function getDayOfYear(date) {
    const _date = toDate(date);
    const diff = differenceInCalendarDays(_date, startOfYear(_date));
    const dayOfYear = diff + 1;
    return dayOfYear;
  }
  function getISOWeek(date) {
    const _date = toDate(date);
    const diff = +startOfISOWeek(_date) - +startOfISOWeekYear(_date);
    return Math.round(diff / millisecondsInWeek) + 1;
  }
  function getWeekYear(date, options) {
    var _a, _b, _c, _d;
    const _date = toDate(date);
    const year = _date.getFullYear();
    const defaultOptions2 = getDefaultOptions();
    const firstWeekContainsDate = (options == null ? void 0 : options.firstWeekContainsDate) ?? ((_b = (_a = options == null ? void 0 : options.locale) == null ? void 0 : _a.options) == null ? void 0 : _b.firstWeekContainsDate) ?? defaultOptions2.firstWeekContainsDate ?? ((_d = (_c = defaultOptions2.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.firstWeekContainsDate) ?? 1;
    const firstWeekOfNextYear = constructFrom(date, 0);
    firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
    firstWeekOfNextYear.setHours(0, 0, 0, 0);
    const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);
    const firstWeekOfThisYear = constructFrom(date, 0);
    firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
    firstWeekOfThisYear.setHours(0, 0, 0, 0);
    const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);
    if (_date.getTime() >= startOfNextYear.getTime()) {
      return year + 1;
    } else if (_date.getTime() >= startOfThisYear.getTime()) {
      return year;
    } else {
      return year - 1;
    }
  }
  function startOfWeekYear(date, options) {
    var _a, _b, _c, _d;
    const defaultOptions2 = getDefaultOptions();
    const firstWeekContainsDate = (options == null ? void 0 : options.firstWeekContainsDate) ?? ((_b = (_a = options == null ? void 0 : options.locale) == null ? void 0 : _a.options) == null ? void 0 : _b.firstWeekContainsDate) ?? defaultOptions2.firstWeekContainsDate ?? ((_d = (_c = defaultOptions2.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.firstWeekContainsDate) ?? 1;
    const year = getWeekYear(date, options);
    const firstWeek = constructFrom(date, 0);
    firstWeek.setFullYear(year, 0, firstWeekContainsDate);
    firstWeek.setHours(0, 0, 0, 0);
    const _date = startOfWeek(firstWeek, options);
    return _date;
  }
  function getWeek(date, options) {
    const _date = toDate(date);
    const diff = +startOfWeek(_date, options) - +startOfWeekYear(_date, options);
    return Math.round(diff / millisecondsInWeek) + 1;
  }
  function addLeadingZeros(number, targetLength) {
    const sign = number < 0 ? "-" : "";
    const output = Math.abs(number).toString().padStart(targetLength, "0");
    return sign + output;
  }
  const lightFormatters = {
    // Year
    y(date, token) {
      const signedYear = date.getFullYear();
      const year = signedYear > 0 ? signedYear : 1 - signedYear;
      return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
    },
    // Month
    M(date, token) {
      const month = date.getMonth();
      return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
    },
    // Day of the month
    d(date, token) {
      return addLeadingZeros(date.getDate(), token.length);
    },
    // AM or PM
    a(date, token) {
      const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";
      switch (token) {
        case "a":
        case "aa":
          return dayPeriodEnumValue.toUpperCase();
        case "aaa":
          return dayPeriodEnumValue;
        case "aaaaa":
          return dayPeriodEnumValue[0];
        case "aaaa":
        default:
          return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
      }
    },
    // Hour [1-12]
    h(date, token) {
      return addLeadingZeros(date.getHours() % 12 || 12, token.length);
    },
    // Hour [0-23]
    H(date, token) {
      return addLeadingZeros(date.getHours(), token.length);
    },
    // Minute
    m(date, token) {
      return addLeadingZeros(date.getMinutes(), token.length);
    },
    // Second
    s(date, token) {
      return addLeadingZeros(date.getSeconds(), token.length);
    },
    // Fraction of second
    S(date, token) {
      const numberOfDigits = token.length;
      const milliseconds = date.getMilliseconds();
      const fractionalSeconds = Math.trunc(
        milliseconds * Math.pow(10, numberOfDigits - 3)
      );
      return addLeadingZeros(fractionalSeconds, token.length);
    }
  };
  const dayPeriodEnum = {
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  };
  const formatters = {
    // Era
    G: function(date, token, localize2) {
      const era = date.getFullYear() > 0 ? 1 : 0;
      switch (token) {
        case "G":
        case "GG":
        case "GGG":
          return localize2.era(era, { width: "abbreviated" });
        case "GGGGG":
          return localize2.era(era, { width: "narrow" });
        case "GGGG":
        default:
          return localize2.era(era, { width: "wide" });
      }
    },
    // Year
    y: function(date, token, localize2) {
      if (token === "yo") {
        const signedYear = date.getFullYear();
        const year = signedYear > 0 ? signedYear : 1 - signedYear;
        return localize2.ordinalNumber(year, { unit: "year" });
      }
      return lightFormatters.y(date, token);
    },
    // Local week-numbering year
    Y: function(date, token, localize2, options) {
      const signedWeekYear = getWeekYear(date, options);
      const weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
      if (token === "YY") {
        const twoDigitYear = weekYear % 100;
        return addLeadingZeros(twoDigitYear, 2);
      }
      if (token === "Yo") {
        return localize2.ordinalNumber(weekYear, { unit: "year" });
      }
      return addLeadingZeros(weekYear, token.length);
    },
    // ISO week-numbering year
    R: function(date, token) {
      const isoWeekYear = getISOWeekYear(date);
      return addLeadingZeros(isoWeekYear, token.length);
    },
    // Extended year. This is a single number designating the year of this calendar system.
    // The main difference between `y` and `u` localizers are B.C. years:
    // | Year | `y` | `u` |
    // |------|-----|-----|
    // | AC 1 |   1 |   1 |
    // | BC 1 |   1 |   0 |
    // | BC 2 |   2 |  -1 |
    // Also `yy` always returns the last two digits of a year,
    // while `uu` pads single digit years to 2 characters and returns other years unchanged.
    u: function(date, token) {
      const year = date.getFullYear();
      return addLeadingZeros(year, token.length);
    },
    // Quarter
    Q: function(date, token, localize2) {
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      switch (token) {
        case "Q":
          return String(quarter);
        case "QQ":
          return addLeadingZeros(quarter, 2);
        case "Qo":
          return localize2.ordinalNumber(quarter, { unit: "quarter" });
        case "QQQ":
          return localize2.quarter(quarter, {
            width: "abbreviated",
            context: "formatting"
          });
        case "QQQQQ":
          return localize2.quarter(quarter, {
            width: "narrow",
            context: "formatting"
          });
        case "QQQQ":
        default:
          return localize2.quarter(quarter, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    // Stand-alone quarter
    q: function(date, token, localize2) {
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      switch (token) {
        case "q":
          return String(quarter);
        case "qq":
          return addLeadingZeros(quarter, 2);
        case "qo":
          return localize2.ordinalNumber(quarter, { unit: "quarter" });
        case "qqq":
          return localize2.quarter(quarter, {
            width: "abbreviated",
            context: "standalone"
          });
        case "qqqqq":
          return localize2.quarter(quarter, {
            width: "narrow",
            context: "standalone"
          });
        case "qqqq":
        default:
          return localize2.quarter(quarter, {
            width: "wide",
            context: "standalone"
          });
      }
    },
    // Month
    M: function(date, token, localize2) {
      const month = date.getMonth();
      switch (token) {
        case "M":
        case "MM":
          return lightFormatters.M(date, token);
        case "Mo":
          return localize2.ordinalNumber(month + 1, { unit: "month" });
        case "MMM":
          return localize2.month(month, {
            width: "abbreviated",
            context: "formatting"
          });
        case "MMMMM":
          return localize2.month(month, {
            width: "narrow",
            context: "formatting"
          });
        case "MMMM":
        default:
          return localize2.month(month, { width: "wide", context: "formatting" });
      }
    },
    // Stand-alone month
    L: function(date, token, localize2) {
      const month = date.getMonth();
      switch (token) {
        case "L":
          return String(month + 1);
        case "LL":
          return addLeadingZeros(month + 1, 2);
        case "Lo":
          return localize2.ordinalNumber(month + 1, { unit: "month" });
        case "LLL":
          return localize2.month(month, {
            width: "abbreviated",
            context: "standalone"
          });
        case "LLLLL":
          return localize2.month(month, {
            width: "narrow",
            context: "standalone"
          });
        case "LLLL":
        default:
          return localize2.month(month, { width: "wide", context: "standalone" });
      }
    },
    // Local week of year
    w: function(date, token, localize2, options) {
      const week = getWeek(date, options);
      if (token === "wo") {
        return localize2.ordinalNumber(week, { unit: "week" });
      }
      return addLeadingZeros(week, token.length);
    },
    // ISO week of year
    I: function(date, token, localize2) {
      const isoWeek = getISOWeek(date);
      if (token === "Io") {
        return localize2.ordinalNumber(isoWeek, { unit: "week" });
      }
      return addLeadingZeros(isoWeek, token.length);
    },
    // Day of the month
    d: function(date, token, localize2) {
      if (token === "do") {
        return localize2.ordinalNumber(date.getDate(), { unit: "date" });
      }
      return lightFormatters.d(date, token);
    },
    // Day of year
    D: function(date, token, localize2) {
      const dayOfYear = getDayOfYear(date);
      if (token === "Do") {
        return localize2.ordinalNumber(dayOfYear, { unit: "dayOfYear" });
      }
      return addLeadingZeros(dayOfYear, token.length);
    },
    // Day of week
    E: function(date, token, localize2) {
      const dayOfWeek = date.getDay();
      switch (token) {
        case "E":
        case "EE":
        case "EEE":
          return localize2.day(dayOfWeek, {
            width: "abbreviated",
            context: "formatting"
          });
        case "EEEEE":
          return localize2.day(dayOfWeek, {
            width: "narrow",
            context: "formatting"
          });
        case "EEEEEE":
          return localize2.day(dayOfWeek, {
            width: "short",
            context: "formatting"
          });
        case "EEEE":
        default:
          return localize2.day(dayOfWeek, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    // Local day of week
    e: function(date, token, localize2, options) {
      const dayOfWeek = date.getDay();
      const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
      switch (token) {
        case "e":
          return String(localDayOfWeek);
        case "ee":
          return addLeadingZeros(localDayOfWeek, 2);
        case "eo":
          return localize2.ordinalNumber(localDayOfWeek, { unit: "day" });
        case "eee":
          return localize2.day(dayOfWeek, {
            width: "abbreviated",
            context: "formatting"
          });
        case "eeeee":
          return localize2.day(dayOfWeek, {
            width: "narrow",
            context: "formatting"
          });
        case "eeeeee":
          return localize2.day(dayOfWeek, {
            width: "short",
            context: "formatting"
          });
        case "eeee":
        default:
          return localize2.day(dayOfWeek, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    // Stand-alone local day of week
    c: function(date, token, localize2, options) {
      const dayOfWeek = date.getDay();
      const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
      switch (token) {
        case "c":
          return String(localDayOfWeek);
        case "cc":
          return addLeadingZeros(localDayOfWeek, token.length);
        case "co":
          return localize2.ordinalNumber(localDayOfWeek, { unit: "day" });
        case "ccc":
          return localize2.day(dayOfWeek, {
            width: "abbreviated",
            context: "standalone"
          });
        case "ccccc":
          return localize2.day(dayOfWeek, {
            width: "narrow",
            context: "standalone"
          });
        case "cccccc":
          return localize2.day(dayOfWeek, {
            width: "short",
            context: "standalone"
          });
        case "cccc":
        default:
          return localize2.day(dayOfWeek, {
            width: "wide",
            context: "standalone"
          });
      }
    },
    // ISO day of week
    i: function(date, token, localize2) {
      const dayOfWeek = date.getDay();
      const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
      switch (token) {
        case "i":
          return String(isoDayOfWeek);
        case "ii":
          return addLeadingZeros(isoDayOfWeek, token.length);
        case "io":
          return localize2.ordinalNumber(isoDayOfWeek, { unit: "day" });
        case "iii":
          return localize2.day(dayOfWeek, {
            width: "abbreviated",
            context: "formatting"
          });
        case "iiiii":
          return localize2.day(dayOfWeek, {
            width: "narrow",
            context: "formatting"
          });
        case "iiiiii":
          return localize2.day(dayOfWeek, {
            width: "short",
            context: "formatting"
          });
        case "iiii":
        default:
          return localize2.day(dayOfWeek, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    // AM or PM
    a: function(date, token, localize2) {
      const hours = date.getHours();
      const dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
      switch (token) {
        case "a":
        case "aa":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          });
        case "aaa":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          }).toLowerCase();
        case "aaaaa":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "narrow",
            context: "formatting"
          });
        case "aaaa":
        default:
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    // AM, PM, midnight, noon
    b: function(date, token, localize2) {
      const hours = date.getHours();
      let dayPeriodEnumValue;
      if (hours === 12) {
        dayPeriodEnumValue = dayPeriodEnum.noon;
      } else if (hours === 0) {
        dayPeriodEnumValue = dayPeriodEnum.midnight;
      } else {
        dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
      }
      switch (token) {
        case "b":
        case "bb":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          });
        case "bbb":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          }).toLowerCase();
        case "bbbbb":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "narrow",
            context: "formatting"
          });
        case "bbbb":
        default:
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    // in the morning, in the afternoon, in the evening, at night
    B: function(date, token, localize2) {
      const hours = date.getHours();
      let dayPeriodEnumValue;
      if (hours >= 17) {
        dayPeriodEnumValue = dayPeriodEnum.evening;
      } else if (hours >= 12) {
        dayPeriodEnumValue = dayPeriodEnum.afternoon;
      } else if (hours >= 4) {
        dayPeriodEnumValue = dayPeriodEnum.morning;
      } else {
        dayPeriodEnumValue = dayPeriodEnum.night;
      }
      switch (token) {
        case "B":
        case "BB":
        case "BBB":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          });
        case "BBBBB":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "narrow",
            context: "formatting"
          });
        case "BBBB":
        default:
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    // Hour [1-12]
    h: function(date, token, localize2) {
      if (token === "ho") {
        let hours = date.getHours() % 12;
        if (hours === 0) hours = 12;
        return localize2.ordinalNumber(hours, { unit: "hour" });
      }
      return lightFormatters.h(date, token);
    },
    // Hour [0-23]
    H: function(date, token, localize2) {
      if (token === "Ho") {
        return localize2.ordinalNumber(date.getHours(), { unit: "hour" });
      }
      return lightFormatters.H(date, token);
    },
    // Hour [0-11]
    K: function(date, token, localize2) {
      const hours = date.getHours() % 12;
      if (token === "Ko") {
        return localize2.ordinalNumber(hours, { unit: "hour" });
      }
      return addLeadingZeros(hours, token.length);
    },
    // Hour [1-24]
    k: function(date, token, localize2) {
      let hours = date.getHours();
      if (hours === 0) hours = 24;
      if (token === "ko") {
        return localize2.ordinalNumber(hours, { unit: "hour" });
      }
      return addLeadingZeros(hours, token.length);
    },
    // Minute
    m: function(date, token, localize2) {
      if (token === "mo") {
        return localize2.ordinalNumber(date.getMinutes(), { unit: "minute" });
      }
      return lightFormatters.m(date, token);
    },
    // Second
    s: function(date, token, localize2) {
      if (token === "so") {
        return localize2.ordinalNumber(date.getSeconds(), { unit: "second" });
      }
      return lightFormatters.s(date, token);
    },
    // Fraction of second
    S: function(date, token) {
      return lightFormatters.S(date, token);
    },
    // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
    X: function(date, token, _localize) {
      const timezoneOffset = date.getTimezoneOffset();
      if (timezoneOffset === 0) {
        return "Z";
      }
      switch (token) {
        case "X":
          return formatTimezoneWithOptionalMinutes(timezoneOffset);
        case "XXXX":
        case "XX":
          return formatTimezone(timezoneOffset);
        case "XXXXX":
        case "XXX":
        default:
          return formatTimezone(timezoneOffset, ":");
      }
    },
    // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
    x: function(date, token, _localize) {
      const timezoneOffset = date.getTimezoneOffset();
      switch (token) {
        case "x":
          return formatTimezoneWithOptionalMinutes(timezoneOffset);
        case "xxxx":
        case "xx":
          return formatTimezone(timezoneOffset);
        case "xxxxx":
        case "xxx":
        default:
          return formatTimezone(timezoneOffset, ":");
      }
    },
    // Timezone (GMT)
    O: function(date, token, _localize) {
      const timezoneOffset = date.getTimezoneOffset();
      switch (token) {
        case "O":
        case "OO":
        case "OOO":
          return "GMT" + formatTimezoneShort(timezoneOffset, ":");
        case "OOOO":
        default:
          return "GMT" + formatTimezone(timezoneOffset, ":");
      }
    },
    // Timezone (specific non-location)
    z: function(date, token, _localize) {
      const timezoneOffset = date.getTimezoneOffset();
      switch (token) {
        case "z":
        case "zz":
        case "zzz":
          return "GMT" + formatTimezoneShort(timezoneOffset, ":");
        case "zzzz":
        default:
          return "GMT" + formatTimezone(timezoneOffset, ":");
      }
    },
    // Seconds timestamp
    t: function(date, token, _localize) {
      const timestamp = Math.trunc(date.getTime() / 1e3);
      return addLeadingZeros(timestamp, token.length);
    },
    // Milliseconds timestamp
    T: function(date, token, _localize) {
      const timestamp = date.getTime();
      return addLeadingZeros(timestamp, token.length);
    }
  };
  function formatTimezoneShort(offset, delimiter = "") {
    const sign = offset > 0 ? "-" : "+";
    const absOffset = Math.abs(offset);
    const hours = Math.trunc(absOffset / 60);
    const minutes = absOffset % 60;
    if (minutes === 0) {
      return sign + String(hours);
    }
    return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
  }
  function formatTimezoneWithOptionalMinutes(offset, delimiter) {
    if (offset % 60 === 0) {
      const sign = offset > 0 ? "-" : "+";
      return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
    }
    return formatTimezone(offset, delimiter);
  }
  function formatTimezone(offset, delimiter = "") {
    const sign = offset > 0 ? "-" : "+";
    const absOffset = Math.abs(offset);
    const hours = addLeadingZeros(Math.trunc(absOffset / 60), 2);
    const minutes = addLeadingZeros(absOffset % 60, 2);
    return sign + hours + delimiter + minutes;
  }
  const dateLongFormatter = (pattern, formatLong2) => {
    switch (pattern) {
      case "P":
        return formatLong2.date({ width: "short" });
      case "PP":
        return formatLong2.date({ width: "medium" });
      case "PPP":
        return formatLong2.date({ width: "long" });
      case "PPPP":
      default:
        return formatLong2.date({ width: "full" });
    }
  };
  const timeLongFormatter = (pattern, formatLong2) => {
    switch (pattern) {
      case "p":
        return formatLong2.time({ width: "short" });
      case "pp":
        return formatLong2.time({ width: "medium" });
      case "ppp":
        return formatLong2.time({ width: "long" });
      case "pppp":
      default:
        return formatLong2.time({ width: "full" });
    }
  };
  const dateTimeLongFormatter = (pattern, formatLong2) => {
    const matchResult = pattern.match(/(P+)(p+)?/) || [];
    const datePattern = matchResult[1];
    const timePattern = matchResult[2];
    if (!timePattern) {
      return dateLongFormatter(pattern, formatLong2);
    }
    let dateTimeFormat;
    switch (datePattern) {
      case "P":
        dateTimeFormat = formatLong2.dateTime({ width: "short" });
        break;
      case "PP":
        dateTimeFormat = formatLong2.dateTime({ width: "medium" });
        break;
      case "PPP":
        dateTimeFormat = formatLong2.dateTime({ width: "long" });
        break;
      case "PPPP":
      default:
        dateTimeFormat = formatLong2.dateTime({ width: "full" });
        break;
    }
    return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong2)).replace("{{time}}", timeLongFormatter(timePattern, formatLong2));
  };
  const longFormatters = {
    p: timeLongFormatter,
    P: dateTimeLongFormatter
  };
  const dayOfYearTokenRE = /^D+$/;
  const weekYearTokenRE = /^Y+$/;
  const throwTokens = ["D", "DD", "YY", "YYYY"];
  function isProtectedDayOfYearToken(token) {
    return dayOfYearTokenRE.test(token);
  }
  function isProtectedWeekYearToken(token) {
    return weekYearTokenRE.test(token);
  }
  function warnOrThrowProtectedError(token, format2, input) {
    const _message = message(token, format2, input);
    console.warn(_message);
    if (throwTokens.includes(token)) throw new RangeError(_message);
  }
  function message(token, format2, input) {
    const subject = token[0] === "Y" ? "years" : "days of the month";
    return `Use \`${token.toLowerCase()}\` instead of \`${token}\` (in \`${format2}\`) for formatting ${subject} to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
  }
  const formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
  const longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
  const escapedStringRegExp = /^'([^]*?)'?$/;
  const doubleQuoteRegExp = /''/g;
  const unescapedLatinCharacterRegExp = /[a-zA-Z]/;
  function format(date, formatStr, options) {
    var _a, _b, _c, _d;
    const defaultOptions2 = getDefaultOptions();
    const locale = defaultOptions2.locale ?? enUS;
    const firstWeekContainsDate = defaultOptions2.firstWeekContainsDate ?? ((_b = (_a = defaultOptions2.locale) == null ? void 0 : _a.options) == null ? void 0 : _b.firstWeekContainsDate) ?? 1;
    const weekStartsOn = defaultOptions2.weekStartsOn ?? ((_d = (_c = defaultOptions2.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.weekStartsOn) ?? 0;
    const originalDate = toDate(date);
    if (!isValid(originalDate)) {
      throw new RangeError("Invalid time value");
    }
    let parts = formatStr.match(longFormattingTokensRegExp).map((substring) => {
      const firstCharacter = substring[0];
      if (firstCharacter === "p" || firstCharacter === "P") {
        const longFormatter = longFormatters[firstCharacter];
        return longFormatter(substring, locale.formatLong);
      }
      return substring;
    }).join("").match(formattingTokensRegExp).map((substring) => {
      if (substring === "''") {
        return { isToken: false, value: "'" };
      }
      const firstCharacter = substring[0];
      if (firstCharacter === "'") {
        return { isToken: false, value: cleanEscapedString(substring) };
      }
      if (formatters[firstCharacter]) {
        return { isToken: true, value: substring };
      }
      if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
        throw new RangeError(
          "Format string contains an unescaped latin alphabet character `" + firstCharacter + "`"
        );
      }
      return { isToken: false, value: substring };
    });
    if (locale.localize.preprocessor) {
      parts = locale.localize.preprocessor(originalDate, parts);
    }
    const formatterOptions = {
      firstWeekContainsDate,
      weekStartsOn,
      locale
    };
    return parts.map((part) => {
      if (!part.isToken) return part.value;
      const token = part.value;
      if (isProtectedWeekYearToken(token) || isProtectedDayOfYearToken(token)) {
        warnOrThrowProtectedError(token, formatStr, String(date));
      }
      const formatter = formatters[token[0]];
      return formatter(originalDate, token, locale.localize, formatterOptions);
    }).join("");
  }
  function cleanEscapedString(input) {
    const matched = input.match(escapedStringRegExp);
    if (!matched) {
      return input;
    }
    return matched[1].replace(doubleQuoteRegExp, "'");
  }
  function formatDistance(date, baseDate, options) {
    const defaultOptions2 = getDefaultOptions();
    const locale = (options == null ? void 0 : options.locale) ?? defaultOptions2.locale ?? enUS;
    const minutesInAlmostTwoDays = 2520;
    const comparison = compareAsc(date, baseDate);
    if (isNaN(comparison)) {
      throw new RangeError("Invalid time value");
    }
    const localizeOptions = Object.assign({}, options, {
      addSuffix: options == null ? void 0 : options.addSuffix,
      comparison
    });
    let dateLeft;
    let dateRight;
    if (comparison > 0) {
      dateLeft = toDate(baseDate);
      dateRight = toDate(date);
    } else {
      dateLeft = toDate(date);
      dateRight = toDate(baseDate);
    }
    const seconds = differenceInSeconds(dateRight, dateLeft);
    const offsetInSeconds = (getTimezoneOffsetInMilliseconds(dateRight) - getTimezoneOffsetInMilliseconds(dateLeft)) / 1e3;
    const minutes = Math.round((seconds - offsetInSeconds) / 60);
    let months;
    if (minutes < 2) {
      if (options == null ? void 0 : options.includeSeconds) {
        if (seconds < 5) {
          return locale.formatDistance("lessThanXSeconds", 5, localizeOptions);
        } else if (seconds < 10) {
          return locale.formatDistance("lessThanXSeconds", 10, localizeOptions);
        } else if (seconds < 20) {
          return locale.formatDistance("lessThanXSeconds", 20, localizeOptions);
        } else if (seconds < 40) {
          return locale.formatDistance("halfAMinute", 0, localizeOptions);
        } else if (seconds < 60) {
          return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
        } else {
          return locale.formatDistance("xMinutes", 1, localizeOptions);
        }
      } else {
        if (minutes === 0) {
          return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
        } else {
          return locale.formatDistance("xMinutes", minutes, localizeOptions);
        }
      }
    } else if (minutes < 45) {
      return locale.formatDistance("xMinutes", minutes, localizeOptions);
    } else if (minutes < 90) {
      return locale.formatDistance("aboutXHours", 1, localizeOptions);
    } else if (minutes < minutesInDay) {
      const hours = Math.round(minutes / 60);
      return locale.formatDistance("aboutXHours", hours, localizeOptions);
    } else if (minutes < minutesInAlmostTwoDays) {
      return locale.formatDistance("xDays", 1, localizeOptions);
    } else if (minutes < minutesInMonth) {
      const days = Math.round(minutes / minutesInDay);
      return locale.formatDistance("xDays", days, localizeOptions);
    } else if (minutes < minutesInMonth * 2) {
      months = Math.round(minutes / minutesInMonth);
      return locale.formatDistance("aboutXMonths", months, localizeOptions);
    }
    months = differenceInMonths(dateRight, dateLeft);
    if (months < 12) {
      const nearestMonth = Math.round(minutes / minutesInMonth);
      return locale.formatDistance("xMonths", nearestMonth, localizeOptions);
    } else {
      const monthsSinceStartOfYear = months % 12;
      const years = Math.trunc(months / 12);
      if (monthsSinceStartOfYear < 3) {
        return locale.formatDistance("aboutXYears", years, localizeOptions);
      } else if (monthsSinceStartOfYear < 9) {
        return locale.formatDistance("overXYears", years, localizeOptions);
      } else {
        return locale.formatDistance("almostXYears", years + 1, localizeOptions);
      }
    }
  }
  function formatDistanceToNow(date, options) {
    return formatDistance(date, constructNow(date), options);
  }
  const NotificationItem = ({
    notification,
    onMarkAsRead,
    onDelete
  }) => {
    const isRead = !!notification.readAt;
    const isUrgent = notification.priority === "urgent";
    const isHigh = notification.priority === "high";
    const getIcon = () => {
      switch (notification.type) {
        case "lesson_reminder":
          return /* @__PURE__ */ jsxRuntime.jsx(BookOpen, { className: "h-4 w-4 text-blue-500" });
        case "task_due":
          return /* @__PURE__ */ jsxRuntime.jsx(Target, { className: "h-4 w-4 text-orange-500" });
        case "system_alert":
          return /* @__PURE__ */ jsxRuntime.jsx(CircleAlert, { className: "h-4 w-4 text-red-500" });
        case "achievement":
          return /* @__PURE__ */ jsxRuntime.jsx(Award, { className: "h-4 w-4 text-yellow-500" });
        case "course_completion":
          return /* @__PURE__ */ jsxRuntime.jsx(Award, { className: "h-4 w-4 text-green-500" });
        case "assignment_due":
          return /* @__PURE__ */ jsxRuntime.jsx(Target, { className: "h-4 w-4 text-purple-500" });
        case "meeting_reminder":
          return /* @__PURE__ */ jsxRuntime.jsx(Calendar, { className: "h-4 w-4 text-indigo-500" });
        default:
          return /* @__PURE__ */ jsxRuntime.jsx(Bell, { className: "h-4 w-4 text-gray-500" });
      }
    };
    const getPriorityColor = () => {
      switch (notification.priority) {
        case "urgent":
          return "border-l-red-500 bg-red-50";
        case "high":
          return "border-l-orange-500 bg-orange-50";
        case "normal":
          return "border-l-blue-500 bg-blue-50";
        case "low":
          return "border-l-gray-500 bg-gray-50";
        default:
          return "border-l-gray-300 bg-white";
      }
    };
    const handleMarkAsRead = async () => {
      if (!isRead) {
        await onMarkAsRead(notification.id);
      }
    };
    const handleDelete = async () => {
      await onDelete(notification.id);
    };
    const handleClick = () => {
      if (!isRead) {
        handleMarkAsRead();
      }
      if (notification.actionUrl) {
        window.open(notification.actionUrl, "_blank");
      }
    };
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: `p-4 border-l-4 ${getPriorityColor()} hover:bg-gray-50 transition-colors cursor-pointer ${isRead ? "opacity-75" : ""}`,
        onClick: handleClick,
        children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-shrink-0 mt-0.5", children: getIcon() }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntime.jsx("h4", { className: `text-sm font-medium ${isRead ? "text-gray-600" : "text-gray-900"}`, children: notification.title }),
                /* @__PURE__ */ jsxRuntime.jsx("p", { className: `text-sm mt-1 ${isRead ? "text-gray-500" : "text-gray-700"}`, children: notification.message })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1 flex-shrink-0", children: [
                !isRead && /* @__PURE__ */ jsxRuntime.jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      handleMarkAsRead();
                    },
                    className: "p-1 rounded hover:bg-gray-200 transition-colors",
                    "aria-label": "Mark as read",
                    children: /* @__PURE__ */ jsxRuntime.jsx(Check, { className: "h-3 w-3 text-gray-500" })
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      handleDelete();
                    },
                    className: "p-1 rounded hover:bg-gray-200 transition-colors",
                    "aria-label": "Delete notification",
                    children: /* @__PURE__ */ jsxRuntime.jsx(Trash2, { className: "h-3 w-3 text-gray-500" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-4 mt-2 text-xs text-gray-500", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntime.jsx(Clock, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { children: formatDistanceToNow(notification.createdAt, { addSuffix: true }) })
              ] }),
              notification.scheduledFor && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntime.jsx(Calendar, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
                  "Scheduled for ",
                  format(notification.scheduledFor, "MMM d, yyyy HH:mm")
                ] })
              ] }),
              isUrgent && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium", children: "Urgent" }),
              isHigh && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium", children: "High Priority" })
            ] }),
            notification.metadata && Object.keys(notification.metadata).length > 0 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-2 text-xs text-gray-500", children: Object.entries(notification.metadata).map(([key, value]) => /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "mr-3", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "font-medium", children: [
                key,
                ":"
              ] }),
              " ",
              String(value)
            ] }, key)) })
          ] })
        ] })
      }
    );
  };
  const useNotificationSettings = (userId) => {
    const queryClient = reactQuery.useQueryClient();
    const {
      data: preferences,
      isLoading,
      error
    } = reactQuery.useQuery({
      queryKey: ["notification-preferences", userId],
      queryFn: async () => {
        const { data, error: error2 } = await supabase.from("notification_preferences").select("*").eq("user_id", userId).single();
        if (error2) {
          if (error2.code === "PGRST116") {
            return createDefaultPreferences(userId);
          }
          throw new Error(`Failed to fetch notification preferences: ${error2.message}`);
        }
        return {
          ...data,
          types: data.types || getDefaultTypePreferences()
        };
      },
      enabled: !!userId
    });
    const updatePreferencesMutation = reactQuery.useMutation({
      mutationFn: async (newPreferences) => {
        const { error: error2 } = await supabase.from("notification_preferences").upsert({
          user_id: userId,
          ...newPreferences,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        if (error2) {
          throw new Error(`Failed to update notification preferences: ${error2.message}`);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notification-preferences", userId] });
      }
    });
    const updateTypePreferenceMutation = reactQuery.useMutation({
      mutationFn: async ({
        type,
        method,
        enabled
      }) => {
        if (!preferences) return;
        const updatedTypes = {
          ...preferences.types,
          [type]: {
            ...preferences.types[type],
            [method]: enabled
          }
        };
        const { error: error2 } = await supabase.from("notification_preferences").upsert({
          user_id: userId,
          types: updatedTypes,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        if (error2) {
          throw new Error(`Failed to update type preference: ${error2.message}`);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notification-preferences", userId] });
      }
    });
    const updatePreferences = async (newPreferences) => {
      await updatePreferencesMutation.mutateAsync(newPreferences);
    };
    const updateTypePreference = async (type, method, enabled) => {
      await updateTypePreferenceMutation.mutateAsync({ type, method, enabled });
    };
    return {
      preferences,
      isLoading,
      error,
      updatePreferences,
      updateTypePreference
    };
  };
  const createDefaultPreferences = async (userId) => {
    const defaultPreferences = {
      userId,
      emailEnabled: true,
      pushEnabled: true,
      inAppEnabled: true,
      types: getDefaultTypePreferences(),
      quietHours: {
        enabled: false,
        startTime: "22:00",
        endTime: "08:00",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      frequency: "immediate"
    };
    const { error } = await supabase.from("notification_preferences").insert({
      user_id: userId,
      email_enabled: defaultPreferences.emailEnabled,
      push_enabled: defaultPreferences.pushEnabled,
      in_app_enabled: defaultPreferences.inAppEnabled,
      types: defaultPreferences.types,
      quiet_hours: defaultPreferences.quietHours,
      frequency: defaultPreferences.frequency,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (error) {
      throw new Error(`Failed to create default preferences: ${error.message}`);
    }
    return defaultPreferences;
  };
  const getDefaultTypePreferences = () => ({
    lesson_reminder: { email: true, push: true, inApp: true },
    task_due: { email: true, push: true, inApp: true },
    system_alert: { email: false, push: true, inApp: true },
    achievement: { email: false, push: true, inApp: true },
    course_completion: { email: true, push: true, inApp: true },
    assignment_due: { email: true, push: true, inApp: true },
    meeting_reminder: { email: true, push: true, inApp: true },
    custom: { email: true, push: true, inApp: true }
  });
  const NotificationSettings = ({
    userId,
    className = ""
  }) => {
    const {
      preferences,
      isLoading,
      error,
      updatePreferences,
      updateTypePreference
    } = useNotificationSettings(userId);
    const [isExpanded, setIsExpanded] = react.useState(false);
    if (isLoading) {
      return /* @__PURE__ */ jsxRuntime.jsx("div", { className: `p-4 ${className}`, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-center text-gray-500", children: "Loading settings..." }) });
    }
    if (error) {
      return /* @__PURE__ */ jsxRuntime.jsx("div", { className: `p-4 ${className}`, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-center text-red-500", children: [
        "Error loading settings: ",
        error.message
      ] }) });
    }
    if (!preferences) {
      return /* @__PURE__ */ jsxRuntime.jsx("div", { className: `p-4 ${className}`, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-center text-gray-500", children: "No settings found" }) });
    }
    const handleGlobalToggle = async (method) => {
      const newValue = !preferences[`${method}Enabled`];
      await updatePreferences({ [`${method}Enabled`]: newValue });
    };
    const handleTypeToggle = async (type, method) => {
      await updateTypePreference(type, method, !preferences.types[type][method]);
    };
    const handleQuietHoursToggle = async () => {
      await updatePreferences({
        quietHours: {
          ...preferences.quietHours,
          enabled: !preferences.quietHours.enabled
        }
      });
    };
    const handleQuietHoursChange = async (field, value) => {
      await updatePreferences({
        quietHours: {
          ...preferences.quietHours,
          [field]: value
        }
      });
    };
    const handleFrequencyChange = async (frequency) => {
      await updatePreferences({ frequency });
    };
    const getTypeLabel = (type) => {
      switch (type) {
        case "lesson_reminder":
          return "Lesson Reminders";
        case "task_due":
          return "Task Due Dates";
        case "system_alert":
          return "System Alerts";
        case "achievement":
          return "Achievements";
        case "course_completion":
          return "Course Completions";
        case "assignment_due":
          return "Assignment Due Dates";
        case "meeting_reminder":
          return "Meeting Reminders";
        case "custom":
          return "Custom Notifications";
        default:
          return type;
      }
    };
    const getTypeDescription = (type) => {
      switch (type) {
        case "lesson_reminder":
          return "Reminders for upcoming lessons and learning sessions";
        case "task_due":
          return "Notifications for tasks and assignments due soon";
        case "system_alert":
          return "Important system updates and maintenance alerts";
        case "achievement":
          return "Celebrations for completed milestones and achievements";
        case "course_completion":
          return "Notifications when you complete courses or modules";
        case "assignment_due":
          return "Reminders for upcoming assignment deadlines";
        case "meeting_reminder":
          return "Reminders for scheduled meetings and appointments";
        case "custom":
          return "Custom notifications from administrators";
        default:
          return "";
      }
    };
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `p-4 ${className}`, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("h4", { className: "text-lg font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Settings, { className: "h-5 w-5" }),
          "Notification Settings"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: () => setIsExpanded(!isExpanded),
            className: "p-1 rounded hover:bg-gray-100",
            children: isExpanded ? /* @__PURE__ */ jsxRuntime.jsx(X, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntime.jsx(Settings, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("h5", { className: "text-sm font-medium text-gray-700 mb-3", children: "Global Settings" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntime.jsx(Mail, { className: "h-4 w-4 text-gray-500" }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm", children: "Email Notifications" })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: preferences.emailEnabled,
                    onChange: () => handleGlobalToggle("email"),
                    className: "sr-only peer"
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntime.jsx(Smartphone, { className: "h-4 w-4 text-gray-500" }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm", children: "Push Notifications" })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: preferences.pushEnabled,
                    onChange: () => handleGlobalToggle("push"),
                    className: "sr-only peer"
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntime.jsx(Bell, { className: "h-4 w-4 text-gray-500" }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm", children: "In-App Notifications" })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: preferences.inAppEnabled,
                    onChange: () => handleGlobalToggle("inApp"),
                    className: "sr-only peer"
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("h5", { className: "text-sm font-medium text-gray-700 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntime.jsx(Clock, { className: "h-4 w-4" }),
              "Quiet Hours"
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: preferences.quietHours.enabled,
                  onChange: handleQuietHoursToggle,
                  className: "sr-only peer"
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })
            ] })
          ] }),
          preferences.quietHours.enabled && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: "From" }),
            /* @__PURE__ */ jsxRuntime.jsx(
              "input",
              {
                type: "time",
                value: preferences.quietHours.startTime,
                onChange: (e) => handleQuietHoursChange("startTime", e.target.value),
                className: "border border-gray-300 rounded px-2 py-1"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: "to" }),
            /* @__PURE__ */ jsxRuntime.jsx(
              "input",
              {
                type: "time",
                value: preferences.quietHours.endTime,
                onChange: (e) => handleQuietHoursChange("endTime", e.target.value),
                className: "border border-gray-300 rounded px-2 py-1"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("h5", { className: "text-sm font-medium text-gray-700 mb-3", children: "Notification Frequency" }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-wrap gap-2", children: ["immediate", "hourly", "daily", "weekly"].map((frequency) => /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              onClick: () => handleFrequencyChange(frequency),
              className: `px-3 py-1 text-xs rounded-full ${preferences.frequency === frequency ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
              children: frequency.charAt(0).toUpperCase() + frequency.slice(1)
            },
            frequency
          )) })
        ] }),
        isExpanded && /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("h5", { className: "text-sm font-medium text-gray-700 mb-3", children: "Notification Types" }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "space-y-4", children: Object.keys(preferences.types).map((type) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "border border-gray-200 rounded-lg p-3", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mb-2", children: [
              /* @__PURE__ */ jsxRuntime.jsx("h6", { className: "text-sm font-medium", children: getTypeLabel(type) }),
              /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs text-gray-500", children: getTypeDescription(type) })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "space-y-2", children: ["email", "push", "inApp"].map((method) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs text-gray-600 capitalize", children: method }),
              /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: preferences.types[type][method],
                    onChange: () => handleTypeToggle(type, method),
                    disabled: !preferences[`${method}Enabled`],
                    className: "sr-only peer"
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: `w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 ${!preferences[`${method}Enabled`] ? "opacity-50" : ""}` })
              ] })
            ] }, method)) })
          ] }, type)) })
        ] })
      ] })
    ] });
  };
  const NotificationCenter = ({
    userId,
    className = "",
    maxNotifications = 50
  }) => {
    const [isOpen, setIsOpen] = react.useState(false);
    const [showSettings, setShowSettings] = react.useState(false);
    const [filters, setFilters] = react.useState({
      userId,
      unreadOnly: false,
      limit: maxNotifications
    });
    const {
      notifications,
      unreadCount,
      isLoading,
      error,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      refresh
    } = useNotifications(filters);
    const handleMarkAsRead = async (id) => {
      await markAsRead(id);
    };
    const handleMarkAllAsRead = async () => {
      await markAllAsRead();
    };
    const handleDelete = async (id) => {
      await deleteNotification(id);
    };
    const handleFilterChange = (newFilters) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    };
    const handleTypeFilter = (type) => {
      if (type === "all") {
        setFilters((prev) => ({ ...prev, type: void 0 }));
      } else {
        setFilters((prev) => ({ ...prev, type }));
      }
    };
    const getTypeCount = (type) => {
      return notifications.filter((n) => n.type === type).length;
    };
    const unreadNotifications = notifications.filter((n) => !n.readAt);
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `relative ${className}`, children: [
      /* @__PURE__ */ jsxRuntime.jsxs(
        "button",
        {
          onClick: () => setIsOpen(!isOpen),
          className: "relative p-2 rounded-lg hover:bg-gray-100 transition-colors",
          "aria-label": "Notifications",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(Bell, { className: "h-5 w-5" }),
            unreadCount > 0 && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center", children: unreadCount > 99 ? "99+" : unreadCount })
          ]
        }
      ),
      isOpen && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-200", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-lg font-semibold", children: "Notifications" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: () => setShowSettings(!showSettings),
                className: "p-1 rounded hover:bg-gray-100",
                "aria-label": "Settings",
                children: /* @__PURE__ */ jsxRuntime.jsx(Settings, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: () => setIsOpen(false),
                className: "p-1 rounded hover:bg-gray-100",
                "aria-label": "Close",
                children: /* @__PURE__ */ jsxRuntime.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        showSettings && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "border-b border-gray-200", children: /* @__PURE__ */ jsxRuntime.jsx(NotificationSettings, { userId }) }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-4 border-b border-gray-200", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntime.jsx(Filter, { className: "h-4 w-4 text-gray-500" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm font-medium text-gray-700", children: "Filters" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-wrap gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntime.jsxs(
              "button",
              {
                onClick: () => handleTypeFilter("all"),
                className: `px-2 py-1 text-xs rounded-full ${!filters.type ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`,
                children: [
                  "All (",
                  notifications.length,
                  ")"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsxs(
              "button",
              {
                onClick: () => handleTypeFilter("lesson_reminder"),
                className: `px-2 py-1 text-xs rounded-full ${filters.type === "lesson_reminder" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`,
                children: [
                  "Lessons (",
                  getTypeCount("lesson_reminder"),
                  ")"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsxs(
              "button",
              {
                onClick: () => handleTypeFilter("task_due"),
                className: `px-2 py-1 text-xs rounded-full ${filters.type === "task_due" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`,
                children: [
                  "Tasks (",
                  getTypeCount("task_due"),
                  ")"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsxs(
              "button",
              {
                onClick: () => handleTypeFilter("system_alert"),
                className: `px-2 py-1 text-xs rounded-full ${filters.type === "system_alert" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`,
                children: [
                  "Alerts (",
                  getTypeCount("system_alert"),
                  ")"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "input",
              {
                type: "checkbox",
                checked: filters.unreadOnly || false,
                onChange: (e) => handleFilterChange({ unreadOnly: e.target.checked }),
                className: "rounded"
              }
            ),
            "Unread only"
          ] }) })
        ] }),
        unreadNotifications.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-200", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-sm text-gray-600", children: [
            unreadNotifications.length,
            " unread notification",
            unreadNotifications.length !== 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs(
            "button",
            {
              onClick: handleMarkAllAsRead,
              className: "text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1",
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(Check, { className: "h-3 w-3" }),
                "Mark all as read"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "max-h-96 overflow-y-auto", children: isLoading ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "p-4 text-center text-gray-500", children: "Loading notifications..." }) : error ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-4 text-center text-red-500", children: [
          "Error loading notifications: ",
          error.message
        ] }) : notifications.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "p-4 text-center text-gray-500", children: "No notifications found" }) : /* @__PURE__ */ jsxRuntime.jsx("div", { className: "divide-y divide-gray-200", children: notifications.map((notification) => /* @__PURE__ */ jsxRuntime.jsx(
          NotificationItem,
          {
            notification,
            onMarkAsRead: handleMarkAsRead,
            onDelete: handleDelete
          },
          notification.id
        )) }) }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "p-4 border-t border-gray-200", children: /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: refresh,
            className: "text-sm text-gray-600 hover:text-gray-800",
            children: "Refresh"
          }
        ) })
      ] })
    ] });
  };
  exports2.EmailNotifications = EmailNotifications;
  exports2.EmailService = EmailService;
  exports2.EmailTemplateManager = EmailTemplateManager;
  exports2.NotificationCenter = NotificationCenter;
  exports2.NotificationItem = NotificationItem;
  exports2.NotificationSettings = NotificationSettings;
  exports2.RecentEmailNotifications = RecentEmailNotifications;
  exports2.emailService = emailService;
  exports2.useNotificationSettings = useNotificationSettings;
  exports2.useNotifications = useNotifications;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
//# sourceMappingURL=index.umd.js.map
