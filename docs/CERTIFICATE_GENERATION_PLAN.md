## Certificate Generation Plan

Goal: when a quiz completion flag `certificate_config.generate_certificate` is true, issue an actual certificate PDF (not just a DB row) and surface it through the existing certificates modal with download and print options.

---

### 1. DB Migrations (per tenant instance)

```sql
-- Add PDF URL to certificates table
ALTER TABLE certificates ADD COLUMN certificate_url text;

-- Add org logo to org_profile table
ALTER TABLE org_profile ADD COLUMN logo_url text;
```

---

### 2. Certificate Template

- Build a branded HTML template with inline CSS.
- **Dual-logo layout:** RAYN logo on the left (static asset), organisation logo on the right (from `org_profile.logo_url`).
- Dynamic fields: learner name, quiz/track title, issue date, expiry date, certificate ID, issuer.
- Keep templates versioned so we can regenerate if branding changes.

---

### 3. Org Logo Upload UI

- Add a logo upload field to `OrganisationProfile` in the `organisation` module.
- Use the same `MediaUpload` pattern as `LessonBuilder`.
- Stores the logo URL in `org_profile.logo_url`.

---

### 4. Rendering Service (Vercel)

We cannot run Chromium inside Supabase Deno Edge Functions, so we add a small Node service.

1. Create a new repo/folder: `certificate-renderer`.
2. `npm init -y`
3. `npm install puppeteer-core @sparticuz/chromium`
4. Add `vercel.json`:
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
5. Implement `api/render-certificate.ts`:
   - Accept POST JSON: `{ name, course, issuedBy, issuedOn, expiresOn?, certificateId, raynLogoUrl, orgLogoUrl? }`.
   - Verify `CERT_RENDER_SECRET` header to prevent public abuse.
   - Use `@sparticuz/chromium` + `puppeteer-core` to inject data into the HTML template and render a PDF (`page.pdf({ format: 'A4', landscape: true, printBackground: true })`).
   - Return the PDF bytes with `Content-Type: application/pdf`.
6. Deploy: `vercel --prod`. Endpoint: `https://<project>.vercel.app/api/render-certificate`.

---

### 5. `generate-certificate` Supabase Edge Function

The renderer is called **server-side** (not from the browser) so `CERT_RENDER_SECRET` is never exposed to the client.

Flow:
1. Receive `{ certificate_id, user_id }` from the frontend.
2. Fetch the certificate row + learner profile from the DB.
3. Query `org_profile.logo_url` for the organisation logo.
4. POST to the Vercel renderer with the full payload (including logos + `CERT_RENDER_SECRET` header).
5. Receive the PDF buffer.
6. Upload to Supabase Storage bucket `certificates`:
   ```ts
   await adminClient.storage
     .from('certificates')
     .upload(`${user_id}/${certificate_id}.pdf`, pdfBuffer, {
       contentType: 'application/pdf',
       upsert: true,
     });
   ```
7. Generate a signed URL (1 year) and update `certificates.certificate_url`.
8. Add `verify_jwt = false` in `config.toml` (consistent with other functions) and handle JWT verification internally.

---

### 6. Update Quiz Completion Flow (`useQuizLogic.ts`)

In `generateCertificate`:
- Generate a `credential_id` via `crypto.randomUUID()`.
- Insert the certificate row into the DB with `credential_id` (no `certificate_url` yet).
- Call the `generate-certificate` Edge Function to render and store the PDF.
- Fix the existing shadcn-style `toast({title, description})` — use `toast.success()` / `toast.error()` (sonner API, consistent with the rest of the app).

---

### 7. Frontend / UX (`Certificates.tsx`)

When `certificate_url` is present on a certificate, show two actions:

- **Download button** — opens the signed `certificate_url` in a new tab (PDF download).
- **Print button** — uses `useReactToPrint` on the certificate card, same pattern as `ReportViewer.tsx`:
  ```ts
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: printRef });
  ```

Also update:
- `PersonProfile` type in the `organisation` module to include `certificate_url?: string` on the certificate shape.

---

### 8. Supabase Storage

- Create a private `certificates` bucket (via Supabase Dashboard — same approach as the `documents` bucket).
- RLS policy: only `super_admin` / `client_admin` can upload; signed URLs are generated server-side by the Edge Function.

---

### Implementation Checklist

1. [ ] Run DB migrations on all tenant instances (`certificate_url`, `logo_url`).
2. [ ] Add org logo upload to `OrganisationProfile` (organisation module).
3. [ ] Design certificate HTML template (dual-logo, all dynamic fields).
4. [ ] Stand up `certificate-renderer` Vercel project; set `maxDuration: 30`; add `CERT_RENDER_SECRET` env var.
5. [ ] Create `generate-certificate` Supabase Edge Function; add `verify_jwt = false` to `config.toml`.
6. [ ] Create private `certificates` Storage bucket + admin RLS policy.
7. [ ] Update `generateCertificate` in `useQuizLogic.ts` (call Edge Function, add `credential_id`, fix toast).
8. [ ] Update `Certificates.tsx` — Download + Print buttons when `certificate_url` present.
9. [ ] Update `PersonProfile` type in organisation module to include `certificate_url`.
10. [ ] QA: complete a quiz on dev, confirm `certificate_url` is populated, download and print both work.
