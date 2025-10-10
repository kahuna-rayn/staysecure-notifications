(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("react/jsx-runtime"), require("react")) : typeof define === "function" && define.amd ? define(["exports", "react/jsx-runtime", "react"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.NotificationSystem = {}, global["react/jsx-runtime"], global.React));
})(this, function(exports2, jsxRuntime, react) {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  const _EmailService = class _EmailService {
    constructor() {
      __publicField(this, "lambdaUrl");
      __publicField(this, "defaultFrom");
      this.lambdaUrl = "";
      this.defaultFrom = "kahuna@raynsecure.com";
    }
    static getInstance() {
      if (!_EmailService.instance) {
        _EmailService.instance = new _EmailService();
      }
      return _EmailService.instance;
    }
    static configure(config) {
      _EmailService.getInstance().lambdaUrl = config.lambdaUrl;
      if (config.fromEmail) {
        _EmailService.getInstance().defaultFrom = config.fromEmail;
      }
    }
    async sendEmail(emailData, supabaseClient) {
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
            return {
              success: false,
              error: error.message || "Failed to send email"
            };
          }
          if (data && data.success) {
            return {
              success: true,
              messageId: data.messageId
            };
          } else {
            return {
              success: false,
              error: (data == null ? void 0 : data.error) || "Failed to send email"
            };
          }
        } else {
          const supabaseUrl = "https://ufvingocbzegpgjknzhm.supabase.co";
          const supabaseKey = void 0;
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
            return {
              success: true,
              messageId: result.messageId
            };
          } else {
            return {
              success: false,
              error: result.error || "Failed to send email"
            };
          }
        }
      } catch (error) {
        console.error("Error sending email:", error);
        return {
          success: false,
          error: error.message || "Failed to send email"
        };
      }
    }
    // Template for lesson reminder emails
    async sendLessonReminder(to, lessonTitle, scheduledTime, supabaseClient) {
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
  };
  __publicField(_EmailService, "instance");
  let EmailService = _EmailService;
  const emailService = EmailService.getInstance();
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
  const Play = createLucideIcon("Play", [
    ["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Save = createLucideIcon("Save", [
    [
      "path",
      {
        d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
        key: "1c8476"
      }
    ],
    ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
    ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
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
  const EmailNotifications = ({
    supabase,
    user,
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
      if (user) {
        loadPreferences();
      }
    }, [user]);
    const loadPreferences = async () => {
      try {
        const { data, error } = await supabase.from("email_preferences").select("*").eq("user_id", user == null ? void 0 : user.id).single();
        if (error && error.code !== "PGRST116") {
          console.error("Error loading preferences:", error);
          return;
        }
        if (data) {
          setPreferences(data);
        } else {
          const defaultPrefs = {
            userId: (user == null ? void 0 : user.id) || "",
            emailEnabled: true,
            lessonReminders: true,
            taskDueDates: true,
            systemAlerts: false,
            achievements: true,
            courseCompletions: true,
            quietHoursEnabled: false,
            quietHoursStart: "22:00",
            quietHoursEnd: "08:00"
          };
          await createPreferences(defaultPrefs);
          setPreferences(defaultPrefs);
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      } finally {
        setLoading(false);
      }
    };
    const createPreferences = async (prefs) => {
      const { error } = await supabase.from("email_preferences").insert({
        user_id: prefs.userId,
        email_enabled: prefs.emailEnabled,
        lesson_reminders: prefs.lessonReminders,
        task_due_dates: prefs.taskDueDates,
        system_alerts: prefs.systemAlerts,
        achievements: prefs.achievements,
        course_completions: prefs.courseCompletions,
        quiet_hours_enabled: prefs.quietHoursEnabled,
        quiet_hours_start: prefs.quietHoursStart,
        quiet_hours_end: prefs.quietHoursEnd
      });
      if (error) {
        console.error("Error creating preferences:", error);
      }
    };
    const updatePreferences = async (updates) => {
      const updatedPrefs = {
        ...preferences,
        ...updates,
        userId: user.id
        // Always use current user ID
      };
      setPreferences(updatedPrefs);
      const { error } = await supabase.from("email_preferences").upsert({
        user_id: user.id,
        // Always use current user ID
        email_enabled: updatedPrefs.emailEnabled,
        lesson_reminders: updatedPrefs.lessonReminders,
        task_due_dates: updatedPrefs.taskDueDates,
        system_alerts: updatedPrefs.systemAlerts,
        achievements: updatedPrefs.achievements,
        course_completions: updatedPrefs.courseCompletions,
        quiet_hours_enabled: updatedPrefs.quietHoursEnabled,
        quiet_hours_start: updatedPrefs.quietHoursStart,
        quiet_hours_end: updatedPrefs.quietHoursEnd
      });
      if (error) {
        console.error("Error updating preferences:", error);
      }
    };
    const sendTestEmail = async () => {
      console.log("Send test email clicked. User:", user);
      console.log("AWS Config:", awsConfig ? {
        lambdaUrl: awsConfig.lambdaUrl ? "Configured" : "Not configured",
        fromEmail: awsConfig.fromEmail
      } : "Not provided");
      if (!user || !user.email) {
        console.log("Missing user or email:", { user, email: user == null ? void 0 : user.email });
        return;
      }
      setSending(true);
      try {
        let emailResult;
        switch (testEmailType) {
          case "lesson_reminder":
            emailResult = await emailService.sendLessonReminder(
              user.email,
              "Introduction to Cybersecurity",
              "2:00 PM today",
              supabase
            );
            break;
          case "task_due":
            emailResult = await emailService.sendTaskDueReminder(
              user.email,
              "Security Assessment Quiz",
              "Tomorrow at 11:59 PM",
              supabase
            );
            break;
          case "achievement":
            emailResult = await emailService.sendAchievementEmail(
              user.email,
              "First Lesson Completed",
              "You completed your first cybersecurity lesson!",
              supabase
            );
            break;
          case "course_completion":
            emailResult = await emailService.sendCourseCompletionEmail(
              user.email,
              "Cybersecurity Fundamentals",
              supabase
            );
            break;
          case "system_alert":
          default:
            emailResult = await emailService.sendSystemAlert(
              user.email,
              "System Maintenance",
              "Scheduled maintenance will occur tonight at 2 AM EST.",
              supabase
            );
            break;
        }
        if (emailResult.success) {
          const { error } = await supabase.from("email_notifications").insert({
            user_id: user.id,
            type: testEmailType,
            title: "Test Email Notification",
            message: `Test ${testEmailType} email sent successfully.`,
            email: user.email,
            status: "sent"
          });
          if (error) {
            console.error("Error saving notification:", error);
          }
          alert("Test email sent successfully!");
        } else {
          alert(`Failed to send email: ${emailResult.error}`);
        }
      } catch (error) {
        console.error("Error sending test email:", error);
        alert("Error sending test email. Please check console for details.");
      } finally {
        setSending(false);
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
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "email-enabled", children: "Enable Email Notifications" }),
            /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-muted-foreground", children: "Receive notifications via email" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(
            Switch,
            {
              id: "email-enabled",
              checked: (preferences == null ? void 0 : preferences.emailEnabled) || false,
              onCheckedChange: (checked) => updatePreferences({ emailEnabled: checked })
            }
          )
        ] }),
        (preferences == null ? void 0 : preferences.emailEnabled) && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h4", { className: "font-medium", children: "Notification Types" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntime.jsx(Label, { className: "text-left", children: "Lesson Reminders" }),
              /* @__PURE__ */ jsxRuntime.jsx(
                Switch,
                {
                  checked: (preferences == null ? void 0 : preferences.lessonReminders) || false,
                  onCheckedChange: (checked) => updatePreferences({ lessonReminders: checked })
                }
              )
            ] }),
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
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h4", { className: "font-medium", children: "Test Email Notifications" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntime.jsx(Label, { children: "Email Type" }),
              /* @__PURE__ */ jsxRuntime.jsxs(Select, { value: testEmailType, onValueChange: setTestEmailType, children: [
                /* @__PURE__ */ jsxRuntime.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntime.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntime.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "system_alert", children: "System Alert" }),
                  /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "lesson_reminder", children: "Lesson Reminder" }),
                  /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "task_due", children: "Task Due Date" }),
                  /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "achievement", children: "Achievement" }),
                  /* @__PURE__ */ jsxRuntime.jsx(SelectItem, { value: "course_completion", children: "Course Completion" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs(
              Button,
              {
                onClick: sendTestEmail,
                disabled: sending || !(preferences == null ? void 0 : preferences.emailEnabled),
                className: "flex items-center gap-2",
                children: [
                  sending ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" }) : /* @__PURE__ */ jsxRuntime.jsx(Send, { className: "h-4 w-4" }),
                  "Send Test Email"
                ]
              }
            )
          ] })
        ] })
      ] })
    ] });
  };
  const LessonReminderSettings = ({
    supabase,
    Card = "div",
    CardHeader = "div",
    CardTitle = "h3",
    CardDescription = "p",
    CardContent = "div",
    Button = "button",
    Switch = "input",
    Input = "input",
    Label = "label",
    Alert = "div",
    AlertDescription = "p"
  }) => {
    const [settings, setSettings] = react.useState({
      enabled: true,
      reminder_days_before: 1,
      reminder_time: "09:00:00",
      include_upcoming_lessons: true,
      upcoming_days_ahead: 3,
      max_reminder_attempts: 3,
      reminder_frequency_days: 7
    });
    const [loading, setLoading] = react.useState(true);
    const [saving, setSaving] = react.useState(false);
    const [error, setError] = react.useState(null);
    const [success, setSuccess] = react.useState(false);
    const [testingReminders, setTestingReminders] = react.useState(false);
    react.useEffect(() => {
      loadSettings();
    }, []);
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await supabase.from("lesson_reminder_config").select("*").eq("id", "00000000-0000-0000-0000-000000000001").single();
        if (fetchError) {
          console.error("Error loading reminder settings:", fetchError);
          throw fetchError;
        }
        if (data) {
          setSettings({
            id: data.id,
            enabled: data.enabled,
            reminder_days_before: data.reminder_days_before,
            reminder_time: data.reminder_time,
            include_upcoming_lessons: data.include_upcoming_lessons,
            upcoming_days_ahead: data.upcoming_days_ahead,
            max_reminder_attempts: data.max_reminder_attempts || 3,
            reminder_frequency_days: data.reminder_frequency_days || 7
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load reminder settings");
      } finally {
        setLoading(false);
      }
    };
    const saveSettings = async () => {
      try {
        setSaving(true);
        setError(null);
        setSuccess(false);
        const { error: updateError } = await supabase.from("lesson_reminder_config").update({
          enabled: settings.enabled,
          reminder_days_before: settings.reminder_days_before,
          reminder_time: settings.reminder_time,
          include_upcoming_lessons: settings.include_upcoming_lessons,
          upcoming_days_ahead: settings.upcoming_days_ahead,
          max_reminder_attempts: settings.max_reminder_attempts,
          reminder_frequency_days: settings.reminder_frequency_days,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", "00000000-0000-0000-0000-000000000001");
        if (updateError) throw updateError;
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3e3);
      } catch (err) {
        console.error("Error saving reminder settings:", err);
        setError(err.message || "Failed to save reminder settings");
      } finally {
        setSaving(false);
      }
    };
    const testReminders = async () => {
      try {
        setTestingReminders(true);
        setError(null);
        const { data: authData, error: authError } = await supabase.rpc("trigger_lesson_reminders");
        if (authError) {
          throw authError;
        }
        console.log("Admin validation result:", authData);
        const { data, error: error2 } = await supabase.functions.invoke("send-lesson-reminders", {
          body: {
            test_mode: true
          }
        });
        if (error2) {
          throw error2;
        }
        console.log("Lesson reminder result:", data);
        alert(`Test completed! Processed: ${(data == null ? void 0 : data.processed) || 0}, Sent: ${(data == null ? void 0 : data.sent) || 0}`);
      } catch (err) {
        console.error("Error testing reminders:", err);
        setError(err.message || "Failed to test reminders");
      } finally {
        setTestingReminders(false);
      }
    };
    if (loading) {
      return /* @__PURE__ */ jsxRuntime.jsx(Card, { children: /* @__PURE__ */ jsxRuntime.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntime.jsx("p", { children: "Loading reminder settings..." }) }) });
    }
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "text-2xl font-bold text-learning-primary", children: "Lesson Reminder Settings" }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4", children: [
        error && /* @__PURE__ */ jsxRuntime.jsx(Alert, { variant: "destructive", children: /* @__PURE__ */ jsxRuntime.jsx(AlertDescription, { children: error }) }),
        success && /* @__PURE__ */ jsxRuntime.jsx(Alert, { children: /* @__PURE__ */ jsxRuntime.jsx(AlertDescription, { children: "Settings saved successfully!" }) }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              Switch,
              {
                id: "enabled",
                checked: settings.enabled,
                onCheckedChange: (checked) => setSettings({ ...settings, enabled: checked })
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "enabled", children: "Enable Lesson Reminders" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              Button,
              {
                onClick: saveSettings,
                disabled: saving,
                size: "sm",
                title: saving ? "Saving..." : "Save Settings",
                children: /* @__PURE__ */ jsxRuntime.jsx(Save, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              Button,
              {
                variant: "outline",
                onClick: testReminders,
                disabled: testingReminders,
                size: "sm",
                title: testingReminders ? "Testing..." : "Test Reminders",
                children: /* @__PURE__ */ jsxRuntime.jsx(Play, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        settings.enabled && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxRuntime.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntime.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(CardTitle, { children: "Reminder Timing" }),
              /* @__PURE__ */ jsxRuntime.jsx(CardDescription, { children: "When to send reminders" })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "reminder_time", children: "Reminder Time" }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  Input,
                  {
                    id: "reminder_time",
                    type: "time",
                    value: settings.reminder_time,
                    onChange: (e) => setSettings({ ...settings, reminder_time: e.target.value })
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-muted-foreground", children: "What time of day should reminders be sent?" })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "reminder_days_before", children: "Days Before" }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  Input,
                  {
                    id: "reminder_days_before",
                    type: "number",
                    min: "0",
                    max: "7",
                    value: settings.reminder_days_before,
                    onChange: (e) => setSettings({
                      ...settings,
                      reminder_days_before: parseInt(e.target.value) || 2
                    })
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-muted-foreground", children: "Send reminders this many days before lesson becomes available" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntime.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(CardTitle, { children: "Reminder Limits" }),
              /* @__PURE__ */ jsxRuntime.jsx(CardDescription, { children: "Control reminder frequency and attempts" })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "max_reminder_attempts", children: "Max Attempts" }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  Input,
                  {
                    id: "max_reminder_attempts",
                    type: "number",
                    min: "1",
                    max: "10",
                    value: settings.max_reminder_attempts,
                    onChange: (e) => setSettings({
                      ...settings,
                      max_reminder_attempts: parseInt(e.target.value) || 3
                    })
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-muted-foreground", children: "Maximum number of reminders per lesson" })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "reminder_frequency_days", children: "Frequency (Days)" }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  Input,
                  {
                    id: "reminder_frequency_days",
                    type: "number",
                    min: "1",
                    max: "30",
                    value: settings.reminder_frequency_days,
                    onChange: (e) => setSettings({
                      ...settings,
                      reminder_frequency_days: parseInt(e.target.value) || 7
                    })
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-muted-foreground", children: "Days between reminder attempts" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntime.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(CardTitle, { children: "Upcoming Lessons" }),
              /* @__PURE__ */ jsxRuntime.jsx(CardDescription, { children: 'Configure "coming soon" notifications' })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  Switch,
                  {
                    id: "include_upcoming",
                    checked: settings.include_upcoming_lessons,
                    onCheckedChange: (checked) => setSettings({ ...settings, include_upcoming_lessons: checked })
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "include_upcoming", children: "Include Upcoming Lessons" })
              ] }),
              settings.include_upcoming_lessons && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "upcoming_days_ahead", children: "Look Ahead Days" }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  Input,
                  {
                    id: "upcoming_days_ahead",
                    type: "number",
                    min: "1",
                    max: "14",
                    value: settings.upcoming_days_ahead,
                    onChange: (e) => setSettings({
                      ...settings,
                      upcoming_days_ahead: parseInt(e.target.value) || 3
                    })
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-muted-foreground", children: 'Send "coming soon" reminders for lessons available within this many days' })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pt-6", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-lg font-semibold text-learning-primary mb-2", children: "How Lesson Reminders Work" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Understanding the reminder system behavior" }),
          /* @__PURE__ */ jsxRuntime.jsxs("ul", { className: "text-sm space-y-1 list-disc list-inside text-left", children: [
            /* @__PURE__ */ jsxRuntime.jsx("li", { children: "Reminders are sent automatically based on learning track schedules" }),
            /* @__PURE__ */ jsxRuntime.jsx("li", { children: "Uses existing email_notifications system" }),
            /* @__PURE__ */ jsxRuntime.jsx("li", { children: "Only active, enrolled users receive reminders" }),
            /* @__PURE__ */ jsxRuntime.jsx("li", { children: "Completed lessons won't trigger reminders" }),
            /* @__PURE__ */ jsxRuntime.jsx("li", { children: "Users control reminders via their email_preferences (lesson_reminders field)" }),
            /* @__PURE__ */ jsxRuntime.jsx("li", { children: "Respects user's quiet hours and email_enabled settings" }),
            /* @__PURE__ */ jsxRuntime.jsx("li", { children: "Maximum 3 reminders per lesson with 7-day intervals" })
          ] })
        ] })
      ] })
    ] });
  };
  const LessonReminderSettingsPage = ({
    supabaseClient,
    uiComponents
  }) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
      LessonReminderSettings,
      {
        supabase: supabaseClient,
        Card: uiComponents.Card,
        CardHeader: uiComponents.CardHeader,
        CardTitle: uiComponents.CardTitle,
        CardDescription: uiComponents.CardDescription,
        CardContent: uiComponents.CardContent,
        Button: uiComponents.Button,
        Switch: uiComponents.Switch,
        Input: uiComponents.Input,
        Label: uiComponents.Label,
        Alert: uiComponents.Alert,
        AlertDescription: uiComponents.AlertDescription,
        Badge: uiComponents.Badge,
        Select: uiComponents.Select,
        SelectContent: uiComponents.SelectContent,
        SelectItem: uiComponents.SelectItem,
        SelectTrigger: uiComponents.SelectTrigger,
        SelectValue: uiComponents.SelectValue,
        Separator: uiComponents.Separator,
        Tabs: uiComponents.Tabs,
        TabsContent: uiComponents.TabsContent,
        TabsList: uiComponents.TabsList,
        TabsTrigger: uiComponents.TabsTrigger
      }
    );
  };
  exports2.EmailNotifications = EmailNotifications;
  exports2.EmailService = EmailService;
  exports2.LessonReminderSettings = LessonReminderSettings;
  exports2.LessonReminderSettingsPage = LessonReminderSettingsPage;
  exports2.emailService = emailService;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
//# sourceMappingURL=index.umd.js.map
