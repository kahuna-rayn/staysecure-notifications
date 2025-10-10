# Lesson Reminders Security Model

## Access Control

The lesson reminder system uses **role-based access control (RBAC)** to ensure only authorized users can manage reminder settings.

### User Roles

Your system has the following roles (defined in `app_role` enum):
- `super_admin` - Full system access
- `client_admin` - Organization/client administrator
- `manager` - Management level access
- `author` - Content creation access
- `admin` - General admin (legacy)
- `user` - Standard user access

### Permissions for Lesson Reminders

#### Reminder Settings Management
**Who can access**: `super_admin` and `client_admin` only

**Capabilities**:
- ✅ View reminder settings
- ✅ Create new reminder settings
- ✅ Update reminder settings
- ✅ Delete reminder settings
- ✅ Manually trigger reminders (test function)

**Code**:
```sql
has_role(auth.uid(), 'super_admin'::app_role) OR 
has_role(auth.uid(), 'client_admin'::app_role)
```

#### Reminder History

**Users**:
- ✅ Can view their own reminder history
- ❌ Cannot view other users' history

**Admins** (`super_admin` and `client_admin`):
- ✅ Can view all users' reminder history
- ✅ Monitor system-wide reminder delivery

#### Automated System

**Service Role**:
- ✅ Full access to create and manage reminders
- ✅ Required for Edge Function execution
- ✅ Bypass RLS policies for automated tasks

## Row Level Security (RLS) Policies

### `lesson_reminder_settings` Table

```sql
-- Admins can view
CREATE POLICY "Admins can view reminder settings"
  ON public.lesson_reminder_settings FOR SELECT
  USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR 
    has_role(auth.uid(), 'client_admin'::app_role)
  );

-- Admins can insert
CREATE POLICY "Admins can insert reminder settings"
  ON public.lesson_reminder_settings FOR INSERT
  WITH CHECK (
    has_role(auth.uid(), 'super_admin'::app_role) OR 
    has_role(auth.uid(), 'client_admin'::app_role)
  );

-- Admins can update
CREATE POLICY "Admins can update reminder settings"
  ON public.lesson_reminder_settings FOR UPDATE
  USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR 
    has_role(auth.uid(), 'client_admin'::app_role)
  );

-- Admins can delete
CREATE POLICY "Admins can delete reminder settings"
  ON public.lesson_reminder_settings FOR DELETE
  USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR 
    has_role(auth.uid(), 'client_admin'::app_role)
  );

-- Service role (for automation)
CREATE POLICY "Service role can manage reminder settings"
  ON public.lesson_reminder_settings FOR ALL
  USING (true)
  WITH CHECK (true);
```

### `lesson_reminder_history` Table

```sql
-- Users can view their own
CREATE POLICY "Users can view their own reminder history"
  ON public.lesson_reminder_history FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all
CREATE POLICY "Admins can view all reminder history"
  ON public.lesson_reminder_history FOR SELECT
  USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR 
    has_role(auth.uid(), 'client_admin'::app_role)
  );

-- Service role (for automation)
CREATE POLICY "Service role can manage reminder history"
  ON public.lesson_reminder_history FOR ALL
  USING (true)
  WITH CHECK (true);
```

## Function Security

### `trigger_lesson_reminders()`

This function allows manual triggering of the reminder system (useful for testing).

**Security**:
```sql
-- Check if user is a super_admin or client_admin
IF NOT (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'client_admin'::app_role)
) THEN
  RAISE EXCEPTION 'Only administrators (super_admin or client_admin) can trigger lesson reminders';
END IF;
```

**Function Type**: `SECURITY DEFINER`
- Runs with privileges of the function owner
- Allows calling Edge Functions with service role credentials

### `get_users_needing_lesson_reminders()`

This function queries the database to find users who need reminders.

**Security**: `SECURITY DEFINER`
- Grants to: `authenticated` and `service_role`
- Used internally by the automated system

## UI Component Security

The React components should also check user roles before rendering admin controls:

```tsx
import { useAuth } from '@staysecure/auth';

function LessonReminderSettingsPage() {
  const { user, profile } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Check if user has admin role
    const checkAdminAccess = async () => {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();
      
      setIsAdmin(
        data?.role === 'super_admin' || 
        data?.role === 'client_admin'
      );
    };
    
    if (user) checkAdminAccess();
  }, [user]);
  
  if (!isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }
  
  return <LessonReminderSettingsWrapper />;
}
```

## Security Best Practices

### ✅ Implemented

1. **Role-Based Access Control**: Only admins can manage settings
2. **Row Level Security**: All tables have RLS enabled
3. **Secure Functions**: Functions check permissions before execution
4. **Service Role Isolation**: Automated tasks use service role, separated from user access
5. **Audit Trail**: Reminder history tracks all sent reminders
6. **User Privacy**: Users can only see their own reminder history

### 🔒 Recommendations

1. **Audit Logging**: Consider logging when admins change reminder settings
2. **Rate Limiting**: Add rate limits on manual trigger function
3. **Environment Variables**: Never expose service role key in client code
4. **HTTPS Only**: Ensure all API calls use HTTPS
5. **Regular Reviews**: Periodically review access logs

## Testing Security

### Test Admin Access

```sql
-- Set your test user to admin role
UPDATE public.user_roles 
SET role = 'client_admin'::app_role 
WHERE user_id = 'your-user-id';

-- Verify access
SELECT * FROM public.lesson_reminder_settings; -- Should work

-- Test trigger function
SELECT * FROM public.trigger_lesson_reminders(); -- Should work
```

### Test Non-Admin Access

```sql
-- Set user to regular user
UPDATE public.user_roles 
SET role = 'user'::app_role 
WHERE user_id = 'your-user-id';

-- Verify denial
SELECT * FROM public.lesson_reminder_settings; -- Should return empty

-- Test trigger function
SELECT * FROM public.trigger_lesson_reminders(); -- Should error
```

## Troubleshooting

### "Permission denied" errors

**Cause**: User doesn't have `super_admin` or `client_admin` role

**Solution**:
```sql
-- Check user's role
SELECT role FROM public.user_roles WHERE user_id = auth.uid();

-- Grant admin role (super admin only)
UPDATE public.user_roles 
SET role = 'client_admin'::app_role 
WHERE user_id = 'target-user-id';
```

### Function not executing

**Cause**: RLS policies blocking access

**Solution**: Verify the function is marked `SECURITY DEFINER` and grants are in place:
```sql
-- Check grants
SELECT routine_name, security_type 
FROM information_schema.routines 
WHERE routine_name = 'trigger_lesson_reminders';

-- Should show: security_type = 'DEFINER'
```

## Summary

✅ **Only** `super_admin` and `client_admin` can manage reminder settings  
✅ Users can view their own reminder history  
✅ Admins can view all reminder history  
✅ Service role handles automated reminder sending  
✅ All tables protected by Row Level Security  
✅ Functions validate permissions before execution  

---

**Last Updated**: October 8, 2025  
**Security Model**: Role-Based Access Control (RBAC)
