# Lesson Reminders Migration Fix

## Issue

The original migration referenced a `public.organisations` table that doesn't exist in all database setups, causing the migration to fail with:

```
ERROR: 42P01: relation "public.organisations" does not exist
```

## Solution

The migration has been updated to work **with or without** an organisations table. The system now:

1. ✅ Makes `organisation_id` nullable (optional)
2. ✅ Conditionally adds foreign key constraints only if organisations table exists
3. ✅ Uses simplified RLS policies that don't depend on organisations
4. ✅ Works in both multi-tenant and single-tenant setups

## Changes Made

### Database Migration Updates

**File**: `supabase/migrations/20251008_lesson_reminders.sql`

1. **Made organisation_id optional**:
   ```sql
   organisation_id UUID, -- Optional: for multi-tenant setups
   ```

2. **Conditional foreign key constraint**:
   ```sql
   DO $$
   BEGIN
     IF EXISTS (
       SELECT FROM pg_tables 
       WHERE schemaname = 'public' 
       AND tablename = 'organisations'
     ) THEN
       ALTER TABLE public.lesson_reminder_settings 
       ADD CONSTRAINT fk_lesson_reminder_settings_organisation 
       FOREIGN KEY (organisation_id) 
       REFERENCES public.organisations(id) 
       ON DELETE CASCADE;
     END IF;
   END $$;
   ```

3. **Simplified RLS policies**:
   - Removed dependency on `user_organisations` table
   - Now allows all authenticated users to manage settings
   - Service role has full access for automated tasks

4. **Updated reminder query**:
   - Removed JOIN to `user_organisations`
   - Returns `NULL` for `organisation_id` if table doesn't exist
   - Still functions correctly for identifying users who need reminders

5. **Conditional default data insertion**:
   - Creates per-organisation settings if organisations table exists
   - Creates a single global setting otherwise

### Component Updates

**Files**: 
- `src/modules/notifications/src/components/LessonReminderSettings.tsx`
- `src/modules/notifications/src/components/LessonReminderSettingsWrapper.tsx`

1. **Made organisationId optional**:
   ```tsx
   organisationId?: string | null; // Optional: for systems without organisations
   ```

2. **Updated queries to handle null organisationId**:
   ```tsx
   if (organisationId) {
     query = query.eq('organisation_id', organisationId);
   } else {
     query = query.is('organisation_id', null);
   }
   ```

## How to Apply the Fix

### Option 1: Re-run the Migration

If you haven't successfully run the migration yet:

1. The updated migration file is now ready to run
2. Simply execute it:
   ```bash
   supabase db push
   ```
   Or run it manually in the Supabase SQL Editor

### Option 2: If Migration Already Failed Partially

If you have partial tables created:

1. Drop the existing tables:
   ```sql
   DROP TABLE IF EXISTS public.lesson_reminder_history CASCADE;
   DROP TABLE IF EXISTS public.lesson_reminder_settings CASCADE;
   DROP FUNCTION IF EXISTS public.get_users_needing_lesson_reminders() CASCADE;
   ```

2. Re-run the updated migration

## Usage After Fix

### Without Organisations

If you don't have an organisations table, simply use:

```tsx
import { LessonReminderSettingsWrapper } from '@staysecure/notifications';

// No organisationId needed!
<LessonReminderSettingsWrapper />
```

This will create and manage a single global reminder setting.

### With Organisations

If you have organisations:

```tsx
<LessonReminderSettingsWrapper organisationId={yourOrgId} />
```

This will create per-organisation settings.

## Testing

After applying the fix, verify it works:

```sql
-- Check tables created successfully
SELECT * FROM public.lesson_reminder_settings;
SELECT * FROM public.lesson_reminder_history;

-- Check function exists
SELECT * FROM public.get_users_needing_lesson_reminders();

-- If you have learning tracks and enrolled users, this should return data
```

## Additional Notes

### For Multi-Tenant Systems

If you later add an organisations table:

1. The foreign key constraint can be added manually:
   ```sql
   ALTER TABLE public.lesson_reminder_settings 
   ADD CONSTRAINT fk_lesson_reminder_settings_organisation 
   FOREIGN KEY (organisation_id) 
   REFERENCES public.organisations(id) 
   ON DELETE CASCADE;
   ```

2. Update existing settings to link to organisations:
   ```sql
   UPDATE public.lesson_reminder_settings 
   SET organisation_id = 'your-org-id' 
   WHERE organisation_id IS NULL;
   ```

### Security

**IMPORTANT**: The RLS policies now restrict access to only `super_admin` and `client_admin` roles.

✅ **Who can manage reminder settings**: Only users with `super_admin` or `client_admin` role  
✅ **Who can view reminder history**: Users can see their own; admins see all  
✅ **Who can trigger reminders manually**: Only `super_admin` and `client_admin`

See [LESSON_REMINDERS_SECURITY.md](./LESSON_REMINDERS_SECURITY.md) for complete security documentation.

To grant admin access to a user:
```sql
UPDATE public.user_roles 
SET role = 'client_admin'::app_role 
WHERE user_id = 'target-user-id';
```

## Status

✅ **Fixed and Ready**: The migration now works for all database setups, with or without organisations table.

---

**Fix Applied**: October 8, 2025  
**Migration File**: `supabase/migrations/20251008_lesson_reminders.sql`
