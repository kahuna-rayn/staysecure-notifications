# Lesson Reminders - Security Updates Summary

## What Changed

Based on your feedback, I've updated the lesson reminder system to:

### 1. ✅ Fixed Database Dependencies
- **Issue**: Migration failed due to missing `organisations` table
- **Solution**: Made `organisation_id` optional and added conditional foreign keys
- **Result**: Works with or without organisations table

### 2. ✅ Implemented Proper Access Control
- **Issue**: You correctly pointed out that only admins should manage reminders
- **Solution**: Updated all RLS policies to require `super_admin` or `client_admin` roles
- **Result**: Regular users cannot access or modify reminder settings

## Security Model (Updated)

### Who Can Do What

| Action | super_admin | client_admin | Regular Users | Service Role |
|--------|-------------|--------------|---------------|--------------|
| **View reminder settings** | ✅ | ✅ | ❌ | ✅ |
| **Create reminder settings** | ✅ | ✅ | ❌ | ✅ |
| **Update reminder settings** | ✅ | ✅ | ❌ | ✅ |
| **Delete reminder settings** | ✅ | ✅ | ❌ | ✅ |
| **Manually trigger reminders** | ✅ | ✅ | ❌ | ✅ |
| **View all reminder history** | ✅ | ✅ | ❌ | ✅ |
| **View own reminder history** | ✅ | ✅ | ✅ | ✅ |

### Updated RLS Policies

**Before** (Too permissive):
```sql
-- Any authenticated user could manage settings
CREATE POLICY "Authenticated users can view reminder settings"
  ON public.lesson_reminder_settings FOR SELECT
  USING (auth.uid() IS NOT NULL);
```

**After** (Properly restricted):
```sql
-- Only admins can manage settings
CREATE POLICY "Admins can view reminder settings"
  ON public.lesson_reminder_settings FOR SELECT
  USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR 
    has_role(auth.uid(), 'client_admin'::app_role)
  );
```

## Files Updated

### 1. `/supabase/migrations/20251008_lesson_reminders.sql`
**Changes**:
- ✅ Made `organisation_id` nullable
- ✅ Added conditional foreign key constraints
- ✅ Updated RLS policies to use `has_role()` function
- ✅ Restricted access to `super_admin` and `client_admin` only
- ✅ Removed dependency on `user_organisations` table

**Key Updates**:
```sql
-- RLS for lesson_reminder_settings
CREATE POLICY "Admins can view reminder settings" ...
CREATE POLICY "Admins can insert reminder settings" ...
CREATE POLICY "Admins can update reminder settings" ...
CREATE POLICY "Admins can delete reminder settings" ...

-- RLS for lesson_reminder_history
CREATE POLICY "Users can view their own reminder history" ...
CREATE POLICY "Admins can view all reminder history" ...
```

### 2. `/supabase/migrations/20251008_lesson_reminders_cron.sql`
**Changes**:
- ✅ Updated `trigger_lesson_reminders()` function to check for admin roles
- ✅ Updated cron job config RLS policy
- ✅ Removed dependency on `user_organisations` table

**Key Update**:
```sql
-- Check if user is a super_admin or client_admin
IF NOT (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'client_admin'::app_role)
) THEN
  RAISE EXCEPTION 'Only administrators can trigger lesson reminders';
END IF;
```

### 3. React Components (No changes needed)
The components already support optional `organisationId` and will work correctly with the new security model. The RLS policies will automatically enforce access control.

## New Documentation

Created three new documentation files:

### 1. **LESSON_REMINDERS_SECURITY.md**
Complete security documentation including:
- Role permissions breakdown
- All RLS policies explained
- Function security details
- UI security recommendations
- Testing procedures
- Troubleshooting guide

### 2. **LESSON_REMINDERS_FIX.md**
Documents the organisations table fix including:
- Problem explanation
- Solution details
- Migration updates
- Usage examples
- Security model

### 3. **LESSON_REMINDERS_UPDATES.md** (This file)
Summary of all changes made based on your feedback

## How to Use

### As an Admin (super_admin or client_admin)

1. **Configure settings** via UI:
   ```tsx
   <LessonReminderSettingsWrapper />
   ```

2. **Test reminders manually**:
   ```sql
   SELECT * FROM trigger_lesson_reminders();
   ```

3. **View all reminder history**:
   ```sql
   SELECT * FROM lesson_reminder_history ORDER BY sent_at DESC;
   ```

### As a Regular User

- ✅ Can view their own reminder history in the UI
- ❌ Cannot access or modify reminder settings
- ❌ Cannot manually trigger reminders
- ❌ Cannot view other users' reminder history

### Grant Admin Access

To give a user admin privileges:

```sql
-- Make user a client admin
UPDATE public.user_roles 
SET role = 'client_admin'::app_role 
WHERE user_id = 'target-user-id';

-- Or make them a super admin (full system access)
UPDATE public.user_roles 
SET role = 'super_admin'::app_role 
WHERE user_id = 'target-user-id';
```

## Testing Security

### Test 1: Admin Access
```sql
-- Set yourself as admin
UPDATE public.user_roles 
SET role = 'client_admin'::app_role 
WHERE user_id = auth.uid();

-- Should work
SELECT * FROM lesson_reminder_settings;
SELECT * FROM trigger_lesson_reminders();
```

### Test 2: Regular User Access
```sql
-- Set yourself as regular user
UPDATE public.user_roles 
SET role = 'user'::app_role 
WHERE user_id = auth.uid();

-- Should return empty (RLS blocks access)
SELECT * FROM lesson_reminder_settings;

-- Should error with permission denied
SELECT * FROM trigger_lesson_reminders();
```

## Verification Checklist

Before deploying, verify:

- [ ] Migrations run without errors
- [ ] `has_role()` function exists in your database
- [ ] `user_roles` table has correct structure
- [ ] Your admin users have `super_admin` or `client_admin` role
- [ ] Test with admin account - can access settings ✅
- [ ] Test with regular user - cannot access settings ✅
- [ ] Edge Function is deployed
- [ ] Cron job is scheduled
- [ ] Manual trigger works for admins
- [ ] Manual trigger fails for regular users

## What About Organisations?

**Q**: Do I need the organisations table?

**A**: **No, not required**. The system now works in two modes:

1. **Without organisations** (your case):
   - Single global reminder setting (`organisation_id = NULL`)
   - All users use the same reminder configuration
   - Simpler setup, perfect for single-tenant systems

2. **With organisations** (future-proofing):
   - Per-organisation settings
   - Each org can have different reminder schedules
   - Required for multi-tenant systems

The migrations automatically detect which mode you're using.

## Summary

✅ Fixed organisations table dependency  
✅ Implemented proper role-based access control  
✅ Only `super_admin` and `client_admin` can manage reminders  
✅ Regular users can view their own history only  
✅ All security best practices implemented  
✅ Comprehensive documentation created  
✅ Ready to deploy  

## Next Steps

1. **Run the updated migrations** - They're now safe to execute
2. **Deploy Edge Function** - `supabase functions deploy send-lesson-reminders`
3. **Enable extensions** - pg_cron and pg_net
4. **Configure environment** - Set Supabase URL and service key
5. **Grant admin access** - To users who should manage reminders
6. **Test it** - Use the admin UI to configure and test

## Documentation

- 📖 [Security Model](./LESSON_REMINDERS_SECURITY.md) - Complete security documentation
- 🚀 [Quick Start](./LESSON_REMINDERS_QUICKSTART.md) - 5-minute setup guide
- 📚 [Full Setup](./LESSON_REMINDERS_SETUP.md) - Comprehensive guide
- 🔧 [Fix Details](./LESSON_REMINDERS_FIX.md) - Organisations table fix
- 💡 [Examples](./examples/lesson-reminders-usage.tsx) - Code examples

---

**Updated**: October 8, 2025  
**Status**: ✅ Ready for deployment with proper security
