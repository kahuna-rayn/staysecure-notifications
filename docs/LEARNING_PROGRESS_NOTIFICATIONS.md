# Learning Progress Notifications - Phase 1 Implementation

## Overview

Phase 1 focuses on essential learning progress notifications that keep users engaged and informed about their learning journey. These notifications leverage your existing learning infrastructure and respect user preferences.

## Notification Types

### 1. Lesson Reminder ✅ (Already Implemented)

**Status**: Complete  
**Trigger**: Based on lesson availability schedule  
**When**: Lesson becomes available or is coming soon  

**Template Variables**:
```javascript
{
  user_name: "John Doe",
  lesson_title: "Introduction to Cybersecurity",
  lesson_description: "Learn the basics of cybersecurity...",
  learning_track_title: "Security Fundamentals",
  available_date: "Monday, October 14, 2025",
  lesson_url: "https://app.staysecure.com/lessons/abc123"
}
```

**Default Template**:
```html
Subject: 📚 New Lesson Available: {{lesson_title}}

<div style="font-family: Arial, sans-serif;">
  <h1>📚 New Lesson Available!</h1>
  <h2>{{lesson_title}}</h2>
  
  <p>Hi {{user_name}},</p>
  
  <p>Your lesson "<strong>{{lesson_title}}</strong>" from 
     <strong>{{learning_track_title}}</strong> is now available!</p>
  
  {{#if lesson_description}}
  <p>{{lesson_description}}</p>
  {{/if}}
  
  <p><strong>Available:</strong> {{available_date}}</p>
  
  <a href="{{lesson_url}}" 
     style="display: inline-block; padding: 12px 24px; 
            background-color: #667eea; color: white; 
            text-decoration: none; border-radius: 6px;">
    Start Lesson
  </a>
</div>
```

---

### 2. Lesson Completed 🆕

**Trigger**: User completes a lesson  
**When**: Immediately after lesson completion  
**Database Check**: `user_lesson_progress.completed_at IS NOT NULL`

**Template Variables**:
```javascript
{
  user_name: "John Doe",
  lesson_title: "Introduction to Cybersecurity",
  learning_track_title: "Security Fundamentals",
  completion_date: "October 10, 2025",
  completion_time: "2:45 PM",
  lessons_completed_in_track: 3,
  total_lessons_in_track: 10,
  track_progress_percentage: 30,
  next_lesson_title: "Network Security Basics",
  next_lesson_available: true,
  next_lesson_url: "https://app.staysecure.com/lessons/def456",
  total_learning_hours: 2.5
}
```

**Default Template**:
```html
Subject: ✅ Lesson Complete: {{lesson_title}}

<div style="font-family: Arial, sans-serif;">
  <h1>✅ Great Job!</h1>
  
  <p>Congratulations, {{user_name}}!</p>
  
  <p>You've successfully completed "<strong>{{lesson_title}}</strong>" 
     from {{learning_track_title}}.</p>
  
  <div style="background-color: #f0f9ff; padding: 20px; 
              border-radius: 8px; margin: 20px 0;">
    <h3>📊 Your Progress</h3>
    <p><strong>Track Progress:</strong> {{track_progress_percentage}}%</p>
    <p><strong>Lessons Completed:</strong> {{lessons_completed_in_track}}/{{total_lessons_in_track}}</p>
    <p><strong>Learning Time:</strong> ~{{total_learning_hours}} hours</p>
  </div>
  
  {{#if next_lesson_available}}
  <p>Ready for the next lesson?</p>
  <a href="{{next_lesson_url}}" 
     style="display: inline-block; padding: 12px 24px; 
            background-color: #667eea; color: white; 
            text-decoration: none; border-radius: 6px;">
    Continue to: {{next_lesson_title}}
  </a>
  {{/if}}
</div>
```

**Rule Configuration**:
```json
{
  "trigger_event": "lesson_completed",
  "send_immediately": true,
  "respect_quiet_hours": true,
  "conditions": {}
}
```

---

### 3. Track Milestone 🆕

**Trigger**: User reaches 25%, 50%, 75%, or 100% of learning track  
**When**: Immediately after crossing milestone threshold  
**Database Check**: Calculate from `user_learning_track_progress.progress_percentage`

**Template Variables**:
```javascript
{
  user_name: "John Doe",
  learning_track_title: "Security Fundamentals",
  milestone_percentage: 50, // 25, 50, 75, or 100
  milestone_label: "Halfway There!", // or "Quarter Done!", "Almost There!", "Completed!"
  lessons_completed: 5,
  total_lessons: 10,
  estimated_completion_date: "October 25, 2025",
  track_url: "https://app.staysecure.com/tracks/xyz789",
  average_quiz_score: 85.5,
  time_invested_hours: 5.5
}
```

**Default Template (50% Milestone)**:
```html
Subject: 🎯 Halfway There! {{learning_track_title}}

<div style="font-family: Arial, sans-serif;">
  <h1>🎯 {{milestone_label}}</h1>
  
  <p>{{user_name}}, you're making fantastic progress!</p>
  
  <p>You've completed <strong>{{lessons_completed}} of {{total_lessons}}</strong> 
     lessons in <strong>{{learning_track_title}}</strong>.</p>
  
  <div style="background-color: #f0fdf4; padding: 20px; 
              border-radius: 8px; margin: 20px 0; 
              border-left: 4px solid #22c55e;">
    <h3 style="margin-top: 0;">📈 Your Stats</h3>
    <p><strong>Progress:</strong> {{milestone_percentage}}%</p>
    <p><strong>Average Quiz Score:</strong> {{average_quiz_score}}%</p>
    <p><strong>Time Invested:</strong> ~{{time_invested_hours}} hours</p>
    {{#if estimated_completion_date}}
    <p><strong>Est. Completion:</strong> {{estimated_completion_date}}</p>
    {{/if}}
  </div>
  
  <p>Keep up the excellent work! You're on track to master cybersecurity.</p>
  
  <a href="{{track_url}}" 
     style="display: inline-block; padding: 12px 24px; 
            background-color: #22c55e; color: white; 
            text-decoration: none; border-radius: 6px;">
    View Progress
  </a>
</div>
```

**Rule Configuration** (Create 4 rules, one for each milestone):
```json
{
  "trigger_event": "track_milestone_reached",
  "send_immediately": true,
  "conditions": {
    "milestone_percentage": {"operator": "=", "value": 50}
  },
  "cooldown_hours": 24
}
```

---

### 4. Quiz Performance 🆕

**Trigger**: User completes a quiz  
**When**: Immediately after quiz submission  
**Database Check**: `quiz_attempts` table

**Four Sub-Types**:
1. **Perfect Score** (100%)
2. **High Score** (90-99%)
3. **Pass** (70-89%)
4. **Fail** (<70%)

**Template Variables**:
```javascript
{
  user_name: "John Doe",
  quiz_title: "Cybersecurity Basics Quiz",
  lesson_title: "Introduction to Cybersecurity",
  score: 95,
  correct_answers: 19,
  total_questions: 20,
  passing_score: 70,
  attempt_number: 1,
  max_attempts: 3,
  remaining_attempts: 2,
  passed: true,
  is_perfect: false,
  is_high_score: true,
  time_taken_minutes: 15,
  next_lesson_url: "https://app.staysecure.com/lessons/next",
  retry_url: "https://app.staysecure.com/quiz/retry/abc123",
  review_url: "https://app.staysecure.com/quiz/review/abc123"
}
```

**Default Template (Pass - High Score)**:
```html
Subject: 🌟 Excellent Work! {{score}}% on {{quiz_title}}

<div style="font-family: Arial, sans-serif;">
  <h1>🌟 Outstanding Performance!</h1>
  
  <p>Congratulations, {{user_name}}!</p>
  
  <p>You scored <strong style="color: #22c55e; font-size: 24px;">{{score}}%</strong> 
     on "{{quiz_title}}"</p>
  
  <div style="background-color: #f0fdf4; padding: 20px; 
              border-radius: 8px; margin: 20px 0;">
    <p><strong>Correct Answers:</strong> {{correct_answers}}/{{total_questions}}</p>
    <p><strong>Time Taken:</strong> {{time_taken_minutes}} minutes</p>
    <p><strong>Attempt:</strong> {{attempt_number}}/{{max_attempts}}</p>
  </div>
  
  <p>Excellent understanding of the material! Keep up the great work.</p>
  
  <a href="{{next_lesson_url}}" 
     style="display: inline-block; padding: 12px 24px; 
            background-color: #667eea; color: white; 
            text-decoration: none; border-radius: 6px; margin-right: 10px;">
    Continue Learning
  </a>
  
  <a href="{{review_url}}" 
     style="display: inline-block; padding: 12px 24px; 
            background-color: #6b7280; color: white; 
            text-decoration: none; border-radius: 6px;">
    Review Answers
  </a>
</div>
```

**Default Template (Fail)**:
```html
Subject: 📖 Quiz Result: {{quiz_title}}

<div style="font-family: Arial, sans-serif;">
  <h1>📖 Keep Learning!</h1>
  
  <p>Hi {{user_name}},</p>
  
  <p>You scored <strong>{{score}}%</strong> on "{{quiz_title}}"</p>
  <p>Passing score: <strong>{{passing_score}}%</strong></p>
  
  <div style="background-color: #fef2f2; padding: 20px; 
              border-radius: 8px; margin: 20px 0; 
              border-left: 4px solid #ef4444;">
    <h3 style="margin-top: 0;">Don't Give Up!</h3>
    <p><strong>Correct Answers:</strong> {{correct_answers}}/{{total_questions}}</p>
    <p><strong>Attempts Remaining:</strong> {{remaining_attempts}}/{{max_attempts}}</p>
  </div>
  
  <p>Review the lesson material and try again when you're ready. 
     You've got this! 💪</p>
  
  <a href="{{review_url}}" 
     style="display: inline-block; padding: 12px 24px; 
            background-color: #ef4444; color: white; 
            text-decoration: none; border-radius: 6px; margin-right: 10px;">
    Review Material
  </a>
  
  {{#if remaining_attempts}}
  <a href="{{retry_url}}" 
     style="display: inline-block; padding: 12px 24px; 
            background-color: #667eea; color: white; 
            text-decoration: none; border-radius: 6px;">
    Retry Quiz
  </a>
  {{/if}}
</div>
```

**Rule Configuration**:
```json
{
  "trigger_event": "quiz_completed",
  "send_immediately": true,
  "conditions": {
    "score": {"operator": ">=", "value": 90}
  }
}
```

---

### 5. Track Completion 🆕

**Trigger**: User completes all lessons in a learning track  
**When**: Immediately after final lesson completion  
**Database Check**: `user_learning_track_progress.completed_at IS NOT NULL`

**Template Variables**:
```javascript
{
  user_name: "John Doe",
  learning_track_title: "Security Fundamentals",
  completion_date: "October 15, 2025",
  total_lessons: 10,
  total_quizzes: 5,
  total_hours: 12.5,
  average_quiz_score: 88.5,
  completion_time_days: 14,
  certificate_available: true,
  certificate_url: "https://app.staysecure.com/certificates/cert123",
  certificate_id: "CERT-2025-12345",
  next_recommended_track: "Advanced Security Concepts",
  next_track_url: "https://app.staysecure.com/tracks/advanced"
}
```

**Default Template**:
```html
Subject: 🎓 Congratulations! {{learning_track_title}} Complete!

<div style="font-family: Arial, sans-serif;">
  <h1>🎓 Outstanding Achievement!</h1>
  
  <p>Congratulations, {{user_name}}!</p>
  
  <p>You've successfully completed 
     <strong>{{learning_track_title}}</strong>!</p>
  
  <div style="background-color: #fef3c7; padding: 20px; 
              border-radius: 8px; margin: 20px 0; 
              border-left: 4px solid #f59e0b;">
    <h3 style="margin-top: 0;">📊 Track Summary</h3>
    <p><strong>Lessons Completed:</strong> {{total_lessons}}</p>
    <p><strong>Quizzes Passed:</strong> {{total_quizzes}}</p>
    <p><strong>Time Invested:</strong> ~{{total_hours}} hours</p>
    <p><strong>Average Quiz Score:</strong> {{average_quiz_score}}%</p>
    <p><strong>Completion Time:</strong> {{completion_time_days}} days</p>
    <p><strong>Completed:</strong> {{completion_date}}</p>
  </div>
  
  {{#if certificate_available}}
  <div style="background-color: #f0fdf4; padding: 20px; 
              border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0;">📜 Your Certificate is Ready!</h3>
    <p><strong>Certificate ID:</strong> {{certificate_id}}</p>
    <p>Download your certificate and share your achievement!</p>
  </div>
  
  <a href="{{certificate_url}}" 
     style="display: inline-block; padding: 12px 24px; 
            background-color: #22c55e; color: white; 
            text-decoration: none; border-radius: 6px; margin-right: 10px;">
    📜 Download Certificate
  </a>
  {{/if}}
  
  {{#if next_recommended_track}}
  <hr style="margin: 30px 0;" />
  <h3>Continue Your Learning Journey</h3>
  <p>Ready for the next challenge? We recommend: 
     <strong>{{next_recommended_track}}</strong></p>
  
  <a href="{{next_track_url}}" 
     style="display: inline-block; padding: 12px 24px; 
            background-color: #667eea; color: white; 
            text-decoration: none; border-radius: 6px;">
    Start Next Track
  </a>
  {{/if}}
</div>
```

---

### 6. Assignment Deadline 🆕

**Trigger**: Assignment due date approaching  
**When**: Configurable (7 days, 3 days, 1 day, 4 hours before)  
**Database Check**: `learning_track_assignments.due_date`

**Template Variables**:
```javascript
{
  user_name: "John Doe",
  assignment_name: "Security Fundamentals Track",
  learning_track_title: "Security Fundamentals",
  due_date: "October 20, 2025",
  due_date_formatted: "Friday, October 20, 2025",
  due_time: "11:59 PM",
  days_remaining: 3,
  hours_remaining: 72,
  completion_required: true,
  current_progress: 60,
  lessons_remaining: 4,
  assignment_url: "https://app.staysecure.com/assignments/xyz789",
  is_overdue: false,
  urgency_level: "moderate" // "low", "moderate", "high", "critical"
}
```

**Default Template (3 days before)**:
```html
Subject: ⏰ Assignment Due Soon: {{assignment_name}}

<div style="font-family: Arial, sans-serif;">
  <h1>⏰ Deadline Reminder</h1>
  
  <p>Hi {{user_name}},</p>
  
  <p><strong>{{assignment_name}}</strong> is due in 
     <strong style="color: #f59e0b;">{{days_remaining}} days</strong>.</p>
  
  <div style="background-color: #fef3c7; padding: 20px; 
              border-radius: 8px; margin: 20px 0; 
              border-left: 4px solid #f59e0b;">
    <h3 style="margin-top: 0;">📅 Deadline Information</h3>
    <p><strong>Due Date:</strong> {{due_date_formatted}}</p>
    <p><strong>Due Time:</strong> {{due_time}}</p>
    <p><strong>Current Progress:</strong> {{current_progress}}%</p>
    <p><strong>Lessons Remaining:</strong> {{lessons_remaining}}</p>
    
    {{#if completion_required}}
    <p style="color: #dc2626; font-weight: bold;">
      ⚠️ This assignment is required for compliance.
    </p>
    {{/if}}
  </div>
  
  <p>Stay on track! Complete the remaining lessons to meet your deadline.</p>
  
  <a href="{{assignment_url}}" 
     style="display: inline-block; padding: 12px 24px; 
            background-color: #f59e0b; color: white; 
            text-decoration: none; border-radius: 6px;">
    Continue Assignment
  </a>
</div>
```

**Rule Configuration** (Create multiple rules for different timeframes):
```json
{
  "trigger_event": "assignment_due_soon",
  "send_immediately": false,
  "schedule_delay_minutes": 0,
  "conditions": {
    "days_until_due": {"operator": "=", "value": 3}
  },
  "max_sends_per_user_per_day": 1
}
```

---

### 7. Inactivity Reminder 🆕

**Trigger**: User hasn't logged in or completed lessons  
**When**: Configurable (7 days, 14 days, 30 days of inactivity)  
**Database Check**: Last `user_lesson_progress.updated_at` or auth session

**Template Variables**:
```javascript
{
  user_name: "John Doe",
  days_inactive: 7,
  last_activity_date: "October 1, 2025",
  last_lesson_title: "Network Security Basics",
  last_lesson_progress: 45,
  pending_lessons_count: 5,
  active_tracks_count: 2,
  dashboard_url: "https://app.staysecure.com/dashboard",
  pending_assignments_count: 1,
  has_pending_assignments: true
}
```

**Default Template (7 days)**:
```html
Subject: 👋 We miss you, {{user_name}}!

<div style="font-family: Arial, sans-serif;">
  <h1>👋 Come Back and Continue Learning!</h1>
  
  <p>Hi {{user_name}},</p>
  
  <p>It's been <strong>{{days_inactive}} days</strong> since your last lesson.</p>
  
  <div style="background-color: #f0f9ff; padding: 20px; 
              border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0;">📚 Where You Left Off</h3>
    <p><strong>Last Lesson:</strong> {{last_lesson_title}}</p>
    {{#if last_lesson_progress}}
    <p><strong>Progress:</strong> {{last_lesson_progress}}%</p>
    {{/if}}
    <p><strong>Pending Lessons:</strong> {{pending_lessons_count}}</p>
    <p><strong>Active Tracks:</strong> {{active_tracks_count}}</p>
  </div>
  
  {{#if has_pending_assignments}}
  <div style="background-color: #fef2f2; padding: 20px; 
              border-radius: 8px; margin: 20px 0; 
              border-left: 4px solid #ef4444;">
    <p><strong>⚠️ Reminder:</strong> You have {{pending_assignments_count}} 
       pending assignment(s) with upcoming deadlines.</p>
  </div>
  {{/if}}
  
  <p>Every lesson brings you one step closer to mastering cybersecurity. 
     Let's keep your momentum going!</p>
  
  <a href="{{dashboard_url}}" 
     style="display: inline-block; padding: 12px 24px; 
            background-color: #667eea; color: white; 
            text-decoration: none; border-radius: 6px;">
    Return to Learning
  </a>
</div>
```

**Rule Configuration**:
```json
{
  "trigger_event": "user_inactive",
  "send_immediately": false,
  "send_at_time": "09:00:00",
  "respect_quiet_hours": true,
  "conditions": {
    "days_inactive": {"operator": ">=", "value": 7}
  },
  "cooldown_hours": 168, // Don't send more than once per week
  "max_sends_per_user_per_day": 1
}
```

---

## Database Schema

See separate file: `NOTIFICATION_DATABASE_SCHEMA.md`

## Implementation Checklist

- [ ] Create database tables
- [ ] Seed system templates
- [ ] Create default rules
- [ ] Build template editor UI
- [ ] Build rule builder UI
- [ ] Create Edge Functions for each trigger
- [ ] Implement variable processor
- [ ] Build testing interface
- [ ] Create analytics dashboard
- [ ] User acceptance testing

## Next Steps

See `NOTIFICATION_IMPLEMENTATION_GUIDE.md` for detailed implementation steps.

---

**Last Updated**: October 8, 2025  
**Version**: 1.0.0  
**Status**: Phase 1 - Ready for Implementation
