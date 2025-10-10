# Notification System - Client Admin Guide

## Quick Reference for Client Administrators

This guide shows you how to manage notification templates and rules in StaySecure Hub.

---

## What Can You Do?

As a Client Admin, you can:

✅ **Edit notification templates** - Customize messaging, branding, and styling  
✅ **Create custom templates** - Add new notification types  
✅ **Configure notification rules** - Control when notifications are sent  
✅ **Test notifications** - Send test emails to yourself  
✅ **View analytics** - See notification delivery stats  
❌ **Delete system templates** - System templates are protected  

---

## Managing Templates

### Edit a System Template

1. Navigate to **Settings → Notifications → Templates**
2. Find the template you want to edit (e.g., "Lesson Completed")
3. Click **[Edit]**
4. Modify the content:
   - **Subject**: Email subject line
   - **HTML Body**: Email content
5. Use variables from the dropdown (e.g., `{{user_name}}`)
6. Click **[Preview]** to see how it looks
7. Click **[Test Send]** to send to your email
8. Click **[Save]** to apply changes

### Create a Custom Template

1. Click **[+ Create Template]**
2. Enter:
   - **Name**: Descriptive name
   - **Type**: Choose notification type or create custom
   - **Subject**: Email subject with variables
   - **Body**: HTML email content
3. Mark available variables
4. Click **[Save]**

### Best Practices

- ✅ Always test before saving
- ✅ Keep subject lines under 50 characters
- ✅ Use variables for personalization
- ✅ Include clear call-to-action buttons
- ✅ Test on mobile (responsive design)
- ✅ Keep consistent with brand voice

---

## Managing Rules

### Edit a Rule

1. Navigate to **Settings → Notifications → Rules**
2. Find the rule (e.g., "Quiz High Score")
3. Click **[Edit]**
4. Configure:
   - **Template**: Which template to use
   - **Conditions**: When to trigger (e.g., score >= 90)
   - **Schedule**: Send immediately or at specific time
   - **Limits**: Max sends per day, cooldown period
5. Click **[Save]**

### Create a New Rule

1. Click **[+ Create Rule]**
2. **Name**: Descriptive rule name
3. **Trigger Event**: When does this happen?
   - Lesson completed
   - Quiz completed
   - Track milestone reached
   - Assignment due check
   - User inactivity check
4. **Conditions**: Add conditions (optional)
   - Example: `score >= 90 AND attempt_number = 1`
5. **Template**: Select which template to use
6. **Scheduling**: Immediate or delayed?
7. **Throttling**: Prevent spam
   - Max sends per user per day
   - Cooldown hours between notifications
8. Click **[Save & Enable]**

### Disable a Rule Temporarily

1. Find the rule
2. Toggle the **Enabled** switch to OFF
3. Re-enable when ready

---

## Testing Notifications

### Test a Template

1. Open template editor
2. Click **[Test Send]**
3. Enter test email (defaults to your email)
4. Review sample variables
5. Click **[Send Test]**
6. Check your inbox

### Test a Rule

1. Open rule editor
2. Click **[Test Rule]**
3. Select a test user or use yourself
4. Click **[Trigger Test]**
5. Rule executes once for that user
6. Check notification history

---

## Common Scenarios

### Scenario 1: Reduce Notification Frequency

**Problem**: Users complaining about too many emails

**Solution**:
1. Go to **Rules** for the notification type
2. Add throttling:
   - Set "Max sends per user per day" to 3
   - Set "Cooldown hours" to 24
3. Save rule

### Scenario 2: Change Notification Time

**Problem**: Notifications sent at wrong time of day

**Solution**:
1. Edit the rule
2. Change "Send immediately" to OFF
3. Set "Send at time" to desired time (e.g., 9:00 AM)
4. Save rule

### Scenario 3: Customize Messaging

**Problem**: Want to add company-specific messaging

**Solution**:
1. Edit the template
2. Add your custom message
3. Add your company logo:
   ```html
   <img src="https://yourcompany.com/logo.png" style="width: 150px;" />
   ```
4. Update colors to match brand
5. Test and save

### Scenario 4: Stop Sending a Notification Type

**Problem**: Don't want to send quiz failure notifications

**Solution**:
1. Find the "Quiz Failed" rule
2. Toggle **Enabled** to OFF
3. Rule won't trigger anymore

### Scenario 5: Send Weekly Summary

**Problem**: Want to send weekly progress summaries

**Solution**:
1. Create custom template: "Weekly Progress Summary"
2. Create custom rule:
   - Trigger: "weekly_summary" (custom event)
   - Schedule: Every Monday at 9 AM
3. Create a weekly cron job to trigger it

---

## Understanding Variables

### What are Variables?

Variables are placeholders in templates that get replaced with actual user data.

**Example**:
```
Template: "Hi {{user_name}}, you completed {{lesson_title}}!"
Result:   "Hi John Doe, you completed Introduction to Security!"
```

### Common Variables

**User Variables**:
- `{{user_name}}` - Full name
- `{{user_email}}` - Email address
- `{{user_id}}` - Unique ID

**Lesson Variables**:
- `{{lesson_title}}` - Lesson name
- `{{lesson_description}}` - Description
- `{{lesson_url}}` - Direct link

**Track Variables**:
- `{{learning_track_title}}` - Track name
- `{{track_progress_percentage}}` - % complete
- `{{track_url}}` - Direct link

**Quiz Variables**:
- `{{score}}` - Percentage score
- `{{correct_answers}}` - Number correct
- `{{total_questions}}` - Total questions
- `{{attempt_number}}` - Which attempt

### Using Conditionals

Show content only if variable exists:

```html
{{#if next_lesson_available}}
  <a href="{{next_lesson_url}}">Next Lesson</a>
{{/if}}
```

This only shows the link if `next_lesson_available` is true.

---

## Viewing Analytics

### Template Performance

1. Navigate to **Templates → Analytics**
2. View for each template:
   - Total sends
   - Success rate
   - Failed sends
   - Last used date

### Rule Performance

1. Navigate to **Rules → Analytics**
2. View for each rule:
   - Trigger count
   - Skipped count (and reasons)
   - Average sends per day
   - Last triggered time

### Notification History

1. Navigate to **History**
2. Filter by:
   - Date range
   - Template type
   - Status (sent, failed, skipped)
   - User
3. Export to CSV for analysis

---

## Troubleshooting

### Template Not Sending

**Check**:
1. Is template **Active**?
2. Is there a **Rule** using this template?
3. Is the rule **Enabled**?
4. Check **Analytics** for skip reasons

### Users Not Receiving Emails

**Check**:
1. User's **email_preferences** settings
   - `email_enabled` = true?
   - `lesson_reminders` = true?
2. **Quiet hours** configuration
3. **Spam folders**
4. **Email address** valid

### Too Many Notifications

**Solution**:
1. Add **throttling** to rules
2. Increase **cooldown periods**
3. Reduce **max sends per day**
4. Disable non-essential rules

### Template Variables Not Working

**Check**:
1. Variable name spelled correctly
2. Variable wrapped in `{{` and `}}`
3. Variable is in **available_variables** list
4. Data source provides that variable

---

## Getting Help

### Documentation

- [Notification System Overview](./NOTIFICATION_SYSTEM_OVERVIEW.md)
- [Learning Progress Notifications](./LEARNING_PROGRESS_NOTIFICATIONS.md)
- [Database Schema](./NOTIFICATION_DATABASE_SCHEMA.md)
- [Implementation Guide](./NOTIFICATION_IMPLEMENTATION_GUIDE.md)
- [Template Examples](./NOTIFICATION_TEMPLATE_EXAMPLES.md)

### Support Contacts

- **Technical Issues**: Contact your system administrator
- **Template Help**: See [Template Examples](./NOTIFICATION_TEMPLATE_EXAMPLES.md)
- **Feature Requests**: Submit via admin portal

---

## Tips & Tricks

### 1. Test Everything
Always test templates before enabling them for all users.

### 2. Start Conservative
Begin with fewer notifications and add more based on user feedback.

### 3. Monitor Analytics
Check weekly to ensure notifications are delivering properly.

### 4. Respect User Preferences
Users can opt-out - don't try to work around their preferences.

### 5. Keep Templates Simple
Simpler templates are easier to maintain and render better on all devices.

### 6. Use Consistent Branding
Maintain consistent colors, fonts, and tone across all templates.

### 7. Mobile-First Design
Most users read emails on mobile - keep content concise.

### 8. Clear Call-to-Action
Every notification should have a clear next step for the user.

---

**Last Updated**: October 8, 2025  
**Version**: 1.0.0  
**Audience**: Client Administrators
