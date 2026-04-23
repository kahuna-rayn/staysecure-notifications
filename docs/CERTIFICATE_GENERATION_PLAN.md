## Certificate Generation Plan

Goal: when a quiz completion flag `certificate_config.generate_certificate` is true, issue an actual certificate PDF (not just a DB row) and surface it through the existing certificates modal with download and print options.

---

### 1. DB Migrations (per tenant instance — apply manually)

```sql
-- Add PDF storage path to certificates table (we store the path, not a signed URL)
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS certificate_url text;

-- Add org logo URL to org_profile table (renamed to org_logo_url for clarity)
ALTER TABLE org_profile ADD COLUMN IF NOT EXISTS org_logo_url text;
```

> **Note:** `certificate_url` stores the Supabase Storage **path** (e.g. `{user_id}/{certificate_id}.pdf`), not a signed URL. Signed URLs expire; short-lived signed URLs are generated on-demand via the `get-certificate-url` Edge Function whenever the user clicks Download. This follows the same pattern as `get-document-url` for Knowledge documents.

---

### 2. Certificate Template

- Build a branded HTML template with inline CSS (A4 landscape).
- **Dual-logo layout:** RAYN logo on the left (served as a static asset from the certificate-renderer project), organisation logo on the right (from `org_profile.org_logo_url`).
- Dynamic fields: learner name, quiz/track title, issue date, expiry date, certificate ID, issuer.
- Templates versioned in `certificate-renderer/templates/`.

---

### 3. Org Logo Upload UI

- Add a logo upload field to `OrganisationProfile` in the `organisation` module.
- Use the same `MediaUpload` pattern as `LessonBuilder`.
- Stores the URL in `org_profile.org_logo_url`.

---

### 4. Rendering Service (Vercel)

We cannot run Chromium inside Supabase Deno Edge Functions, so we add a small Node service.

1. Create folder: `certificate-renderer` (sibling of `learn`, `govern`, etc.).
2. `npm install puppeteer-core @sparticuz/chromium`.
3. Add `vercel.json`:
   ```json
   {
     "functions": {
       "api/render-certificate.ts": {
         "runtime": "nodejs18.x",
         "memory": 1024,
         "maxDuration": 30
       }
     }
   }
   ```
4. Implement `api/render-certificate.ts`:
   - Accept POST JSON: `{ name, course, issuedBy, issuedOn, expiresOn?, certificateId, orgLogoUrl? }`.
   - Verify `CERT_RENDER_SECRET` header to prevent public abuse.
   - Use `@sparticuz/chromium` + `puppeteer-core` to render a PDF (`page.pdf({ format: 'A4', landscape: true, printBackground: true })`).
   - Return the PDF bytes with `Content-Type: application/pdf`.
5. Deploy: `vercel --prod`. Endpoint: `https://<project>.vercel.app/api/render-certificate`.

---

### 5. `generate-certificate` Supabase Edge Function

The renderer is called **server-side** (not from the browser) so `CERT_RENDER_SECRET` is never exposed to the client.

Flow:
1. Receive `{ certificate_id }` from the frontend (user_id extracted from JWT).
2. Fetch the certificate row + learner profile from the DB.
3. Query `org_profile.org_logo_url` for the organisation logo.
4. POST to the Vercel renderer with the full payload (including `orgLogoUrl` + `CERT_RENDER_SECRET` header).
5. Receive the PDF buffer.
6. Upload to Supabase Storage bucket `certificates`:
   ```ts
   const storagePath = `${user_id}/${certificate_id}.pdf`;
   await adminClient.storage
     .from('certificates')
     .upload(storagePath, pdfBuffer, {
       contentType: 'application/pdf',
       upsert: true,
     });
   ```
7. Update `certificates.certificate_url` with the **storage path** (not a signed URL).
8. Return `{ success: true }` — the frontend then calls `get-certificate-url` on demand.
9. Add `verify_jwt = false` in `config.toml` (consistent with other functions); validate JWT internally.

---

### 6. `get-certificate-url` Supabase Edge Function

Mirrors the `get-document-url` pattern for certificates.

Flow:
1. Receive `{ certificate_id }` from the frontend.
2. Verify the caller is the certificate owner (or an admin).
3. Fetch the storage path from `certificates.certificate_url`.
4. Generate a short-lived signed URL (1 hour): `adminClient.storage.from('certificates').createSignedUrl(path, 3600)`.
5. Return `{ url }` — the frontend opens this URL for download.
6. Add `verify_jwt = false` in `config.toml`.

---

### 7. Update Quiz Completion Flow (`useQuizLogic.ts`)

In `generateCertificate`:
- Generate a `credential_id` via `crypto.randomUUID()`.
- Insert the certificate row with `credential_id` (no `certificate_url` yet, populated async by Edge Function).
- Call the `generate-certificate` Edge Function to render and store the PDF.
- Fix the existing shadcn-style `toast({title, description})` — use `toast.success()` / `toast.error()` (sonner API).

---

### 8. Frontend / UX (`Certificates.tsx`)

When `certificate_url` is present on a certificate, show two actions:

- **Download button** — calls `get-certificate-url` Edge Function for a fresh signed URL, then opens in new tab.
- **Print button** — uses `useReactToPrint` on the certificate card (same pattern as `ReportViewer.tsx`):
  ```ts
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: printRef });
  ```

Also update:
- `PersonProfile` type in the `organisation` module: add `certificate_url?: string` to the certificate shape.
- `useUserAssets.ts`: add `certificate_url` to `UserCertificate` interface and the DB query.
- `PersonaProfile.tsx`: map `certificate_url` when building `personaData`.

---

### 9. Supabase Storage

- Create a private `certificates` bucket **manually via the Supabase Dashboard** (same approach as the `documents` bucket).
- RLS: only `super_admin` / `client_admin` can upload; users access via signed URLs generated by `get-certificate-url`.
- SQL for RLS policies stored in `learn/supabase/_archive/certificate_storage.sql`.

---

### Implementation Checklist

- [x] Update plan (storage path strategy, `org_logo_url` rename, `get-certificate-url` function).
- [x] Run DB migrations on all tenant instances (`certificate_url`, `org_logo_url`).
- [x] Add org logo upload to `OrganisationProfile` (organisation module).
- [x] Design certificate HTML template (dual-logo, all dynamic fields).
- [x] Stand up `certificate-renderer` Vercel project; set `maxDuration: 30`; add `CERT_RENDER_SECRET` env var.
- [x] Create `generate-certificate` Supabase Edge Function.
- [x] Create `get-certificate-url` Supabase Edge Function.
- [x] Add `verify_jwt = false` to `config.toml` for both new functions.
- [x] Create private `certificates` Storage bucket (Supabase Dashboard) + RLS policy SQL.
- [x] Update `generateCertificate` in `useQuizLogic.ts` (call Edge Function, add `credential_id`, fix toast).
- [x] Update `Certificates.tsx` — Download + Print buttons when `certificate_url` present.
- [x] Update `PersonProfile` type, `useUserAssets.ts`, `PersonaProfile.tsx` for `certificate_url`.
- [x] Update `onboard-client.sh` + `post-migration-fixes.sql` for new Edge Functions + bucket.
- [ ] QA: complete a quiz on dev, confirm `certificate_url` is populated, download and print both work.

---

### Phase 2 — User-Uploaded External Certificates (post-QA)

Allow users to upload certificates they've received from other organisations (e.g. CompTIA, CISSP, vendor certs).

#### What's needed

1. **DB migration** — add a `source` column to `certificates`:
   ```sql
   ALTER TABLE certificates ADD COLUMN IF NOT EXISTS source text DEFAULT 'generated'
     CHECK (source IN ('generated', 'uploaded'));
   ```
   - `generated` — PDFs we produce via `generate-certificate`.
   - `uploaded` — files the user uploads themselves.

2. **Storage** — user uploads go to the same `certificates` bucket under a different path prefix: `user-uploads/{user_id}/{filename}`. Add a new RLS policy:
   ```sql
   CREATE POLICY "Users can manage their own uploaded certificates"
   ON storage.objects FOR ALL TO authenticated
   USING (
     bucket_id = 'certificates'
     AND (storage.foldername(name))[1] = 'user-uploads'
     AND (storage.foldername(name))[2] = auth.uid()::text
   )
   WITH CHECK (
     bucket_id = 'certificates'
     AND (storage.foldername(name))[1] = 'user-uploads'
     AND (storage.foldername(name))[2] = auth.uid()::text
   );
   ```

3. **`get-certificate-url` Edge Function** — already handles both paths since it reads `certificate_url` from the DB; no changes needed as long as the storage path is stored correctly.

4. **UI — `EditableCertificates.tsx`** (organisation module):
   - Add an "Upload Certificate" button that opens a file picker (PDF/image, max 5 MB).
   - Form fields: issuer name, certificate name, credential ID (optional), issue date, expiry date.
   - On submit: upload file to `user-uploads/{user_id}/{uuid}.{ext}`, insert row into `certificates` with `source = 'uploaded'` and `certificate_url = storagePath`.

5. **UI — `Certificates.tsx`** — the Download button already works for both `source` types since it calls `get-certificate-url`. No changes needed there.

#### Implementation checklist
- [ ] Apply `source` column migration on all tenant instances.
- [ ] Add `user-uploads` RLS policy to `certificate_storage.sql` and `post-migration-fixes.sql`.
- [ ] Update `EditableCertificates.tsx` with file upload form.
- [ ] Update `get-certificate-url` to handle `user-uploads/` path prefix if needed.
- [ ] QA: upload an external cert, confirm it appears in profile with working download.
