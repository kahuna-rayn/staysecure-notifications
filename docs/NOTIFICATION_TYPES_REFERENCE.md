# Notification Types - Quick Reference

## Phase 1: Learning Progress (Ready to Implement)

| # | Type | Icon | Trigger | Purpose | Priority |
|---|------|------|---------|---------|----------|
| 1 | **lesson_reminder** | 📚 | Lesson available date reached | Remind users of available lessons | Normal |
| 2 | **lesson_completed** | ✅ | User completes lesson | Celebrate completion, show progress | Normal |
| 3 | **track_milestone_25** | 🎯 | 25% track completion | Motivate continued learning | Low |
| 4 | **track_milestone_50** | 🎯 | 50% track completion | Celebrate halfway point | Normal |
| 5 | **track_milestone_75** | 🎯 | 75% track completion | Encourage final push | Normal |
| 6 | **track_milestone_100** | 🎓 | 100% track completion | Celebrate full completion | High |
| 7 | **quiz_perfect** | ⭐ | Quiz score = 100% | Celebrate perfect score | High |
| 8 | **quiz_high_score** | 🌟 | Quiz score 90-99% | Celebrate strong performance | Normal |
| 9 | **quiz_passed** | ✓ | Quiz score 70-89% | Confirm passing | Normal |
| 10 | **quiz_failed** | 📖 | Quiz score < 70% | Encourage retry | Normal |
| 11 | **assignment_due_7days** | ⏰ | 7 days before deadline | Early warning | Low |
| 12 | **assignment_due_3days** | ⏰ | 3 days before deadline | Deadline reminder | Normal |
| 13 | **assignment_due_1day** | ⚠️ | 1 day before deadline | Urgent reminder | High |
| 14 | **assignment_overdue** | 🚨 | Past deadline | Overdue notice | Urgent |
| 15 | **user_inactive_7days** | 👋 | 7 days no activity | Re-engagement | Low |
| 16 | **user_inactive_14days** | 💤 | 14 days no activity | Re-engagement | Normal |
| 17 | **user_inactive_30days** | 🔔 | 30 days no activity | Strong re-engagement | High |

---

## Phase 2: Badges & Achievements (Future - Q2 2026)

| # | Type | Icon | Trigger | Purpose | Priority |
|---|------|------|---------|---------|----------|
| 18 | **badge_earned** | 🏆 | Badge criteria met | Celebrate achievement | High |
| 19 | **milestone_reached** | 🎯 | Milestone achieved | Recognize progress | Normal |
| 20 | **points_milestone** | 💎 | Point threshold reached | Motivate earning more | Normal |

---

## Phase 3: Streaks (Future - Q3 2026)

| # | Type | Icon | Trigger | Purpose | Priority |
|---|------|------|---------|---------|----------|
| 21 | **streak_milestone** | 🔥 | Streak milestone reached | Celebrate consistency | High |
| 22 | **streak_at_risk** | ⚡ | No activity today | Prevent streak break | Normal |
| 23 | **streak_broken** | 💔 | Streak ended | Motivate restart | Low |
| 24 | **streak_recovered** | 💪 | Used freeze day | Confirm protection | Normal |

---

## Phase 4: Leaderboards (Future - Q4 2026)

| # | Type | Icon | Trigger | Purpose | Priority |
|---|------|------|---------|---------|----------|
| 25 | **ranking_improved** | 📈 | Rank moved up | Celebrate progress | Normal |
| 26 | **ranking_milestone** | 🏅 | Entered top 10/50/100 | Recognition | High |
| 27 | **department_leader** | 👑 | #1 in department | Recognition | High |
| 28 | **overtaken** | 🎯 | Someone passed you | Motivate competition | Low |

---

## Phase 5: Certificates (Future - Q1 2027)

| # | Type | Icon | Trigger | Purpose | Priority |
|---|------|------|---------|---------|----------|
| 29 | **certificate_issued** | 📜 | Certificate generated | Provide certificate | High |
| 30 | **certificate_expiring** | ⏳ | 30/60/90 days to expiry | Reminder to recertify | Normal |
| 31 | **recertification_due** | 🔄 | Recertification needed | Action required | High |
| 32 | **featured_learner** | ⭐ | Selected as featured | Recognition | High |

---

## Priority Levels

| Level | When to Use | Email Styling | User Impact |
|-------|-------------|---------------|-------------|
| **Urgent** | Immediate action required | Red, bold | Critical |
| **High** | Important achievements/deadlines | Green/Purple, emphasized | Important |
| **Normal** | Regular updates | Standard blue | Informational |
| **Low** | Nice-to-know updates | Subtle gray | Optional |

---

## Notification Frequency Guidelines

### Daily Notifications (Max)
- **High Priority**: Up to 5 per day
- **Normal Priority**: Up to 3 per day
- **Low Priority**: Up to 2 per day

### Cooldown Periods (Recommended)
- **Same notification type**: 24 hours
- **Quiz notifications**: 4 hours
- **Inactivity reminders**: 7 days
- **Assignment reminders**: 24 hours

---

## User Preferences Mapping

Maps notification types to `email_preferences` table fields:

| Notification Type | email_preferences Field |
|-------------------|------------------------|
| lesson_reminder, lesson_completed, track_milestone_* | `lesson_reminders` |
| quiz_* | `lesson_reminders` |
| assignment_due_*, assignment_overdue | `task_due_dates` |
| user_inactive_* | `system_alerts` |
| track_milestone_100 | `course_completions` |
| badge_earned, milestone_reached (future) | `achievements` |

---

## Template Variable Categories

### Common Variables (All Templates)
```javascript
user_name          // User's full name
user_email         // User's email
user_id            // User's UUID
dashboard_url      // Link to dashboard
```

### Learning Variables
```javascript
lesson_title                 // Lesson name
lesson_description           // Lesson description
lesson_url                   // Direct link to lesson
learning_track_title         // Parent track name
track_progress_percentage    // % complete in track
lessons_completed_in_track   // Count of completed lessons
total_lessons_in_track       // Total lessons in track
```

### Quiz Variables
```javascript
quiz_title           // Quiz/lesson name
score                // Percentage score
correct_answers      // Number correct
total_questions      // Total questions
passing_score        // Minimum to pass (usually 70)
attempt_number       // Which attempt (1, 2, 3...)
max_attempts         // Maximum allowed
remaining_attempts   // How many left
```

### Assignment Variables
```javascript
assignment_name          // Assignment name
due_date                 // Deadline date
due_date_formatted       // Nicely formatted date
days_remaining           // Days until due
hours_remaining          // Hours until due
completion_required      // Is it mandatory?
current_progress         // % complete
lessons_remaining        // Lessons left to do
```

### Date/Time Variables
```javascript
completion_date          // When completed
completion_time          // Time of completion
available_date           // When lesson available
last_activity_date       // Last user activity
```

---

## Trigger Events

### Immediate Triggers
Execute as soon as event happens:
- `lesson_completed`
- `quiz_completed`
- `track_milestone_reached`
- `track_completed`

### Scheduled Checks (Daily Cron)
Run once per day to check conditions:
- `assignment_due_check` - Checks all assignments
- `user_inactivity_check` - Checks user activity

### Future: Event Hooks
Real-time database triggers for instant notifications.

---

## Testing Matrix

| Notification Type | How to Test | Expected Result |
|-------------------|-------------|-----------------|
| lesson_reminder | Wait for lesson to become available | Email sent on availability date |
| lesson_completed | Complete any lesson | Immediate email with progress |
| track_milestone_50 | Complete 50% of lessons in a track | Immediate email celebrating milestone |
| quiz_high_score | Score 90%+ on a quiz | Immediate email with score |
| quiz_failed | Score < 70% on a quiz | Immediate email with retry encouragement |
| assignment_due_3days | Set assignment due in 3 days | Email sent 3 days before (via daily cron) |
| user_inactive_7days | Don't log in for 7 days | Email sent on 8th day |

---

## Default Rule Settings

### Lesson Completed
```
Trigger: lesson_completed
Send: Immediately
Conditions: None (all completions)
Max per day: 10
Cooldown: None
```

### Track Milestone 50%
```
Trigger: track_milestone_reached
Send: Immediately
Conditions: milestone_percentage = 50
Max per day: 3
Cooldown: 24 hours
```

### Quiz High Score
```
Trigger: quiz_completed
Send: Immediately
Conditions: score >= 90 AND score < 100
Max per day: 5
Cooldown: 4 hours
```

### Assignment Due 3 Days
```
Trigger: assignment_due_check (daily cron)
Send: At 9:00 AM
Conditions: days_until_due = 3
Max per day: 1
Cooldown: 24 hours
```

### Inactivity 7 Days
```
Trigger: user_inactivity_check (daily cron)
Send: At 9:00 AM
Conditions: days_inactive >= 7
Max per day: 1
Cooldown: 168 hours (1 week)
```

---

## Quick Stats

### Phase 1 (Learning Progress)
- **17 notification types** (7 categories)
- **3 new database tables**
- **6 Edge Functions** (triggers + utilities)
- **30+ template variables**
- **Implementation time**: 4-6 weeks

### Future Phases (Gamification)
- **15+ additional notification types**
- **4 additional database tables**
- **Points system** with 10+ point actions
- **50+ badges** across 4 tiers
- **Timeline**: 2026-2027

---

**Last Updated**: October 8, 2025  
**Version**: 1.0.0  
**Format**: Quick Reference Card
