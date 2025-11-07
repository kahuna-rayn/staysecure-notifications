# Notification System Documentation

**Last Updated**: November 6, 2025

## 📖 Quick Start

**Start here**: [START_HERE_NOTIFICATIONS.md](./START_HERE_NOTIFICATIONS.md)

## 📚 Main Documentation

### Core Documents
- **[IMPLEMENTATION_STRATEGY.md](./IMPLEMENTATION_STRATEGY.md)** - Current state, architecture, and roadmap ⭐
- **[NOTIFICATION_IMPLEMENTATION_STATUS.md](./NOTIFICATION_IMPLEMENTATION_STATUS.md)** - Detailed implementation status
- **[START_HERE_NOTIFICATIONS.md](./START_HERE_NOTIFICATIONS.md)** - Entry point and navigation guide

### Architecture & Design
- **[NOTIFICATION_SYSTEM_OVERVIEW.md](./NOTIFICATION_SYSTEM_OVERVIEW.md)** - System architecture
- **[NOTIFICATION_STANDALONE_MODULE.md](./NOTIFICATION_STANDALONE_MODULE.md)** - Module design
- **[NOTIFICATION_USING_EXISTING_TABLES.md](./NOTIFICATION_USING_EXISTING_TABLES.md)** - Why we use existing tables

### Reference
- **[NOTIFICATION_TYPES_REFERENCE.md](./NOTIFICATION_TYPES_REFERENCE.md)** - All notification types
- **[NOTIFICATION_TEMPLATE_EXAMPLES.md](./NOTIFICATION_TEMPLATE_EXAMPLES.md)** - Template examples
- **[NOTIFICATION_ADMIN_GUIDE.md](./NOTIFICATION_ADMIN_GUIDE.md)** - Admin guide
- **[LESSON_REMINDERS_SECURITY.md](./LESSON_REMINDERS_SECURITY.md)** - Security model

### Technical
- **[NOTIFICATION_DATABASE_SCHEMA.md](./NOTIFICATION_DATABASE_SCHEMA.md)** - Database schema
- **[LEARNING_PROGRESS_NOTIFICATIONS.md](./LEARNING_PROGRESS_NOTIFICATIONS.md)** - Learning progress details

## 📦 Archived Documentation

Outdated documentation has been moved to `ARCHIVE/` folder. See [DOCUMENTATION_REVIEW.md](./DOCUMENTATION_REVIEW.md) for details.

Files archived include:
- Historical lesson reminder setup docs (references non-existent tables)
- Old implementation guides from a month ago
- Outdated summaries and manifests

## 🔍 Current Status

### ✅ Working
- Direct notification calls (lesson completed, track milestone, quiz high score)
- Lesson reminder system (automated)
- Email templates system with UI

### ⚠️ Needs Implementation
- Email preference checks in direct calls
- Manager notifications (template ready, needs wiring)
- Certificate expiration reminders

See [IMPLEMENTATION_STRATEGY.md](./IMPLEMENTATION_STRATEGY.md) for full details.

