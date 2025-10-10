# Notification Template Examples

Complete, ready-to-use templates for Phase 1 notification types.

> **Note**: These templates use a simple {{variable}} syntax. Client admins can edit these templates to customize messaging, branding, and styling.

---

## Template Syntax Guide

### Variable Substitution
```
{{variable_name}} - Replaced with actual value
```

### Conditionals
```
{{#if variable_name}}
  Content shown if variable is truthy
{{/if}}
```

### Available Variables
Each template documents its available variables. Client admins should reference this when editing.

---

## 1. Lesson Completed

**Type**: `lesson_completed`  
**Trigger**: User completes any lesson  
**Category**: Learning Progress

**Available Variables**:
```json
{
  "user_name": "John Doe",
  "lesson_title": "Introduction to Cybersecurity",
  "learning_track_title": "Security Fundamentals",
  "completion_date": "October 10, 2025",
  "completion_time": "2:45 PM",
  "lessons_completed_in_track": 3,
  "total_lessons_in_track": 10,
  "track_progress_percentage": 30,
  "next_lesson_title": "Network Security Basics",
  "next_lesson_available": true,
  "next_lesson_url": "https://app.staysecure.com/lessons/def456"
}
```

**Subject Template**:
```
✅ Lesson Complete: {{lesson_title}}
```

**Email HTML Template**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px;">✅ Great Job!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">
                Congratulations, <strong>{{user_name}}</strong>!
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #666;">
                You've successfully completed "<strong>{{lesson_title}}</strong>" 
                from {{learning_track_title}}.
              </p>
              
              <!-- Progress Box -->
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
                <h3 style="margin: 0 0 15px 0; color: #0c4a6e; font-size: 18px;">📊 Your Progress</h3>
                <table width="100%" cellpadding="5" cellspacing="0">
                  <tr>
                    <td style="color: #666; font-size: 14px;">Track Progress:</td>
                    <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">
                      {{track_progress_percentage}}%
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-size: 14px;">Lessons Completed:</td>
                    <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">
                      {{lessons_completed_in_track}}/{{total_lessons_in_track}}
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-size: 14px;">Completed:</td>
                    <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">
                      {{completion_date}} at {{completion_time}}
                    </td>
                  </tr>
                </table>
              </div>
              
              {{#if next_lesson_available}}
              <p style="margin: 20px 0; font-size: 16px; color: #333;">
                Ready for the next lesson?
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{next_lesson_url}}" 
                   style="display: inline-block; padding: 15px 40px; 
                          background-color: #667eea; color: #ffffff; 
                          text-decoration: none; border-radius: 6px; 
                          font-size: 16px; font-weight: bold;">
                  Continue to: {{next_lesson_title}}
                </a>
              </div>
              {{/if}}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                Keep up the great work! Every lesson brings you closer to mastering cybersecurity.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 2. Track Milestone - 50% Complete

**Type**: `track_milestone_50`  
**Trigger**: User reaches 50% completion in a learning track  
**Category**: Learning Progress

**Available Variables**:
```json
{
  "user_name": "John Doe",
  "learning_track_title": "Security Fundamentals",
  "milestone_percentage": 50,
  "milestone_label": "Halfway There!",
  "lessons_completed": 5,
  "total_lessons": 10,
  "estimated_completion_date": "October 25, 2025",
  "track_url": "https://app.staysecure.com/tracks/xyz789",
  "average_quiz_score": 85.5,
  "time_invested_hours": 5.5
}
```

**Subject Template**:
```
🎯 {{milestone_label}} {{learning_track_title}}
```

**Email HTML Template**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px;">🎯 {{milestone_label}}</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 18px; color: #333;">
                <strong>{{user_name}}</strong>, you're making fantastic progress!
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; color: #666;">
                You've completed <strong>{{lessons_completed}} of {{total_lessons}}</strong> lessons 
                in <strong>{{learning_track_title}}</strong>.
              </p>
              
              <!-- Stats Box -->
              <div style="background-color: #f0fdf4; padding: 25px; border-radius: 8px; border-left: 4px solid #22c55e;">
                <h3 style="margin: 0 0 20px 0; color: #166534; font-size: 20px;">📈 Your Stats</h3>
                
                <!-- Progress Bar -->
                <div style="margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-size: 14px; color: #666;">Progress</span>
                    <span style="font-size: 14px; color: #333; font-weight: bold;">{{milestone_percentage}}%</span>
                  </div>
                  <div style="background-color: #e5e7eb; height: 10px; border-radius: 5px; overflow: hidden;">
                    <div style="background-color: #22c55e; height: 100%; width: {{milestone_percentage}}%;"></div>
                  </div>
                </div>
                
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #666; font-size: 14px;">Average Quiz Score:</td>
                    <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">
                      {{average_quiz_score}}%
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-size: 14px;">Time Invested:</td>
                    <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">
                      ~{{time_invested_hours}} hours
                    </td>
                  </tr>
                  {{#if estimated_completion_date}}
                  <tr>
                    <td style="color: #666; font-size: 14px;">Est. Completion:</td>
                    <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">
                      {{estimated_completion_date}}
                    </td>
                  </tr>
                  {{/if}}
                </table>
              </div>
              
              <p style="margin: 30px 0; font-size: 16px; color: #333; line-height: 1.6;">
                Keep up the excellent work! You're on track to master cybersecurity. 
                Every lesson completed is a step toward protecting your organization.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{track_url}}" 
                   style="display: inline-block; padding: 15px 40px; 
                          background-color: #667eea; color: #ffffff; 
                          text-decoration: none; border-radius: 6px; 
                          font-size: 16px; font-weight: bold;">
                  View Full Progress
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                You're doing great! Stay committed to your learning journey.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 3. Quiz - High Score (90%+)

**Type**: `quiz_high_score`  
**Trigger**: User scores 90-99% on a quiz  
**Category**: Learning Progress

**Available Variables**:
```json
{
  "user_name": "John Doe",
  "quiz_title": "Cybersecurity Basics Quiz",
  "lesson_title": "Introduction to Cybersecurity",
  "score": 95,
  "correct_answers": 19,
  "total_questions": 20,
  "passing_score": 70,
  "attempt_number": 1,
  "time_taken_minutes": 15,
  "next_lesson_url": "https://app.staysecure.com/lessons/next",
  "review_url": "https://app.staysecure.com/quiz/review/abc123"
}
```

**Subject Template**:
```
🌟 Excellent Work! {{score}}% on {{quiz_title}}
```

**Email HTML Template**:
```html
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px;">🌟 Outstanding Performance!</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <p style="margin: 0 0 20px 0; font-size: 18px; color: #333;">
                Congratulations, <strong>{{user_name}}</strong>!
              </p>
              
              <div style="margin: 30px 0;">
                <div style="font-size: 48px; font-weight: bold; color: #22c55e;">
                  {{score}}%
                </div>
                <p style="margin: 10px 0; font-size: 16px; color: #666;">
                  on "{{quiz_title}}"
                </p>
              </div>
              
              <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; text-align: left; margin: 30px 0;">
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #666; font-size: 14px;">Correct Answers:</td>
                    <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">
                      {{correct_answers}}/{{total_questions}}
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-size: 14px;">Time Taken:</td>
                    <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">
                      {{time_taken_minutes}} minutes
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-size: 14px;">Attempt:</td>
                    <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">
                      #{{attempt_number}}
                    </td>
                  </tr>
                </table>
              </div>
              
              <p style="margin: 20px 0; font-size: 16px; color: #333; line-height: 1.6;">
                Excellent understanding of the material! Your strong performance demonstrates 
                solid comprehension of cybersecurity concepts.
              </p>
              
              <div style="margin: 30px 0;">
                <a href="{{next_lesson_url}}" 
                   style="display: inline-block; padding: 15px 40px; 
                          background-color: #667eea; color: #ffffff; 
                          text-decoration: none; border-radius: 6px; 
                          font-size: 16px; font-weight: bold; margin-right: 10px;">
                  Continue Learning
                </a>
                
                <a href="{{review_url}}" 
                   style="display: inline-block; padding: 15px 40px; 
                          background-color: #6b7280; color: #ffffff; 
                          text-decoration: none; border-radius: 6px; 
                          font-size: 16px; font-weight: bold;">
                  Review Answers
                </a>
              </div>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                Keep up the great work! 🚀
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 4. Quiz - Failed

**Type**: `quiz_failed`  
**Trigger**: User scores below 70% on a quiz  
**Category**: Learning Progress

**Available Variables**:
```json
{
  "user_name": "John Doe",
  "quiz_title": "Cybersecurity Basics Quiz",
  "score": 65,
  "correct_answers": 13,
  "total_questions": 20,
  "passing_score": 70,
  "attempt_number": 1,
  "max_attempts": 3,
  "remaining_attempts": 2,
  "retry_url": "https://app.staysecure.com/quiz/retry/abc123",
  "lesson_review_url": "https://app.staysecure.com/lessons/abc123"
}
```

**Subject Template**:
```
📖 Quiz Result: {{quiz_title}}
```

**Email HTML Template**:
```html
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px;">📖 Keep Learning!</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">
                Hi <strong>{{user_name}}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; color: #666;">
                You scored <strong>{{score}}%</strong> on "{{quiz_title}}"<br>
                <small style="color: #999;">Passing score: {{passing_score}}%</small>
              </p>
              
              <div style="background-color: #fef3c7; padding: 25px; border-radius: 8px; border-left: 4px solid: #f59e0b; margin: 30px 0;">
                <h3 style="margin: 0 0 15px 0; color: #92400e;">💪 Don't Give Up!</h3>
                <p style="margin: 0 0 15px 0; color: #78350f; font-size: 15px;">
                  Learning is a journey, and every attempt helps you improve!
                </p>
                <table width="100%" cellpadding="5" cellspacing="0">
                  <tr>
                    <td style="color: #78350f; font-size: 14px;">Your Score:</td>
                    <td style="color: #92400e; font-size: 14px; font-weight: bold; text-align: right;">
                      {{correct_answers}}/{{total_questions}} correct
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #78350f; font-size: 14px;">Attempts Remaining:</td>
                    <td style="color: #92400e; font-size: 14px; font-weight: bold; text-align: right;">
                      {{remaining_attempts}} more tries
                    </td>
                  </tr>
                </table>
              </div>
              
              <p style="margin: 20px 0; font-size: 16px; color: #333; line-height: 1.6;">
                Here's what you can do:
              </p>
              <ul style="color: #666; font-size: 15px; line-height: 1.8;">
                <li>Review the lesson material carefully</li>
                <li>Take notes on key concepts</li>
                <li>Try the quiz again when you feel confident</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{lesson_review_url}}" 
                   style="display: inline-block; padding: 15px 40px; 
                          background-color: #6b7280; color: #ffffff; 
                          text-decoration: none; border-radius: 6px; 
                          font-size: 16px; font-weight: bold; margin-right: 10px;">
                  📚 Review Material
                </a>
                
                {{#if remaining_attempts}}
                <a href="{{retry_url}}" 
                   style="display: inline-block; padding: 15px 40px; 
                          background-color: #667eea; color: #ffffff; 
                          text-decoration: none; border-radius: 6px; 
                          font-size: 16px; font-weight: bold;">
                  🔄 Retry Quiz
                </a>
                {{/if}}
              </div>
              
              <p style="margin: 20px 0; font-size: 14px; color: #999; text-align: center; font-style: italic;">
                Remember: Cybersecurity is complex, and mastery takes practice. You've got this! 💪
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                Keep learning, keep improving!
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 5. Assignment Due (3 Days)

**Type**: `assignment_due_3days`  
**Trigger**: Assignment deadline in 3 days  
**Category**: Learning Progress

**Available Variables**:
```json
{
  "user_name": "John Doe",
  "assignment_name": "Security Fundamentals Track",
  "learning_track_title": "Security Fundamentals",
  "due_date": "October 20, 2025",
  "due_date_formatted": "Friday, October 20, 2025 at 11:59 PM",
  "days_remaining": 3,
  "hours_remaining": 72,
  "completion_required": true,
  "current_progress": 60,
  "lessons_remaining": 4,
  "assignment_url": "https://app.staysecure.com/assignments/xyz789"
}
```

**Subject Template**:
```
⏰ Assignment Due in {{days_remaining}} Days: {{assignment_name}}
```

**Email HTML Template**:
```html
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px;">⏰ Deadline Reminder</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 10px 0; font-size: 16px; color: #333;">
                Hi <strong>{{user_name}}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 18px; color: #333;">
                <strong>{{assignment_name}}</strong> is due in 
                <span style="color: #ef4444; font-size: 24px; font-weight: bold;">
                  {{days_remaining}} days
                </span>.
              </p>
              
              <div style="background-color: #fef2f2; padding: 25px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 30px 0;">
                <h3 style="margin: 0 0 15px 0; color: #991b1b;">📅 Deadline Information</h3>
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #666; font-size: 14px;">Due Date:</td>
                    <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">
                      {{due_date_formatted}}
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-size: 14px;">Current Progress:</td>
                    <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">
                      {{current_progress}}%
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-size: 14px;">Lessons Remaining:</td>
                    <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">
                      {{lessons_remaining}}
                    </td>
                  </tr>
                </table>
                
                {{#if completion_required}}
                <div style="margin-top: 15px; padding: 15px; background-color: #fee2e2; border-radius: 4px;">
                  <p style="margin: 0; color: #991b1b; font-weight: bold; font-size: 14px;">
                    ⚠️ This assignment is required for compliance.
                  </p>
                </div>
                {{/if}}
              </div>
              
              <p style="margin: 20px 0; font-size: 15px; color: #333; line-height: 1.6;">
                Stay on track! Complete the remaining {{lessons_remaining}} lesson(s) 
                to meet your deadline.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{assignment_url}}" 
                   style="display: inline-block; padding: 15px 40px; 
                          background-color: #ef4444; color: #ffffff; 
                          text-decoration: none; border-radius: 6px; 
                          font-size: 16px; font-weight: bold;">
                  Continue Assignment
                </a>
              </div>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                Need help? Contact your administrator or training coordinator.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 6. Inactivity Reminder (7 Days)

**Type**: `user_inactive_7days`  
**Trigger**: User hasn't logged in or completed lessons for 7 days  
**Category**: Learning Progress

**Available Variables**:
```json
{
  "user_name": "John Doe",
  "days_inactive": 7,
  "last_activity_date": "October 1, 2025",
  "last_lesson_title": "Network Security Basics",
  "pending_lessons_count": 5,
  "active_tracks_count": 2,
  "dashboard_url": "https://app.staysecure.com/dashboard",
  "has_pending_assignments": true,
  "pending_assignments_count": 1
}
```

**Subject Template**:
```
👋 We miss you, {{user_name}}! Continue your learning journey
```

**Email HTML Template**:
```html
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px;">👋 Come Back and Learn!</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">
                Hi <strong>{{user_name}}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; color: #666;">
                It's been <strong>{{days_inactive}} days</strong> since your last lesson. 
                We'd love to see you continue your cybersecurity learning journey!
              </p>
              
              <div style="background-color: #eff6ff; padding: 25px; border-radius: 8px; margin: 30px 0;">
                <h3 style="margin: 0 0 20px 0; color: #1e40af;">📚 Where You Left Off</h3>
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #666; font-size: 14px;">Last Activity:</td>
                    <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">
                      {{last_activity_date}}
                    </td>
                  </tr>
                  {{#if last_lesson_title}}
                  <tr>
                    <td style="color: #666; font-size: 14px;">Last Lesson:</td>
                    <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">
                      {{last_lesson_title}}
                    </td>
                  </tr>
                  {{/if}}
                  <tr>
                    <td style="color: #666; font-size: 14px;">Pending Lessons:</td>
                    <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">
                      {{pending_lessons_count}}
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-size: 14px;">Active Tracks:</td>
                    <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">
                      {{active_tracks_count}}
                    </td>
                  </tr>
                </table>
              </div>
              
              {{#if has_pending_assignments}}
              <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0;">
                <p style="margin: 0; color: #991b1b; font-weight: bold; font-size: 14px;">
                  ⚠️ Reminder: You have {{pending_assignments_count}} pending assignment(s) with upcoming deadlines.
                </p>
              </div>
              {{/if}}
              
              <p style="margin: 30px 0; font-size: 15px; color: #333; line-height: 1.6;">
                Every lesson brings you one step closer to mastering cybersecurity. 
                Your organization depends on informed, security-aware team members like you.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{dashboard_url}}" 
                   style="display: inline-block; padding: 15px 40px; 
                          background-color: #667eea; color: #ffffff; 
                          text-decoration: none; border-radius: 6px; 
                          font-size: 16px; font-weight: bold;">
                  Return to Learning
                </a>
              </div>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                We're here to support your learning journey. Welcome back! 🎓
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Complete Template List (Phase 1)

All 17 system templates:

1. ✅ `lesson_reminder` - Existing
2. `lesson_completed` - Example above
3. `track_milestone_25` - 25% complete variant
4. `track_milestone_50` - Example above
5. `track_milestone_75` - 75% complete variant
6. `track_milestone_100` - Track completion
7. `quiz_perfect` - 100% score
8. `quiz_high_score` - Example above (90-99%)
9. `quiz_passed` - 70-89% score
10. `quiz_failed` - Example above (<70%)
11. `assignment_due_7days` - 7 days before deadline
12. `assignment_due_3days` - Example above
13. `assignment_due_1day` - 1 day before deadline
14. `assignment_overdue` - Past deadline
15. `user_inactive_7days` - Example above
16. `user_inactive_14days` - 14 days inactive
17. `user_inactive_30days` - 30 days inactive

---

## Customization Tips for Client Admins

### Adding Your Brand Colors
Replace color hex codes in templates:
- Primary: `#667eea` (purple)
- Success: `#22c55e` (green)
- Warning: `#f59e0b` (orange)
- Error: `#ef4444` (red)

### Adding Your Logo
```html
<img src="https://yourcompany.com/logo.png" 
     alt="Company Logo" 
     style="width: 150px; margin-bottom: 20px;" />
```

### Changing Tone
Adjust the language to match your culture:
- Formal vs. casual
- Enthusiastic vs. professional
- Short vs. detailed

### Adding CTAs
Include additional calls-to-action:
```html
<a href="{{support_url}}">Get Help</a>
<a href="{{feedback_url}}">Share Feedback</a>
```

---

**Last Updated**: October 8, 2025  
**Version**: 1.0.0  
**Status**: Template Examples - Phase 1
