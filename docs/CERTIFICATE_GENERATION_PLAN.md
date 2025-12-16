## Certificate Generation Plan

Goal: when a quiz completion flag `certificate_config.generate_certificate` is true, issue an actual certificate PDF (not just a DB row) and surface it through the existing certificates modal.

### 1. Template
- Build a branded HTML template with inline CSS (include logo, signature, colors).
- Dynamic fields: learner name, quiz/track title, issue date, expiry date, certificate ID, issuer.
- Store static assets (logo, signature) in Supabase Storage so the renderer can load them by URL.

### 2. Rendering Service (Vercel)
We cannot run Chromium inside Supabase Deno Edge Functions, so we add a tiny Node service that does the HTML→PDF work.

1. Create a new repo/folder, e.g. `certificate-renderer`.
2. `npm init -y`
3. `npm install puppeteer-core @sparticuz/chromium`
4. Add `vercel.json`:
   ```json
   {
     "functions": {
       "api/render-certificate.ts": {
         "runtime": "nodejs18.x",
         "memory": 1024,
         "maxDuration": 10
       }
     }
   }
   ```
5. Implement `api/render-certificate.ts`:
   - Accept POST JSON payload `{ name, course, issuedBy, issuedOn, expiresOn?, certificateId }`.
   - Use `@sparticuz/chromium` + `puppeteer-core` to load the HTML template, inject data, and render a PDF (`page.pdf({ format: 'A4', landscape: true, printBackground: true })`).
   - Return the PDF bytes with `Content-Type: application/pdf`.
6. Deploy: `vercel`, then `vercel --prod`. Endpoint will look like `https://<project>.vercel.app/api/render-certificate`.
7. Add a shared secret header to prevent public abuse.

### 3. Integrate with Quiz Completion
In `useQuizLogic.ts` after generating `certificateData`:

1. POST to the Vercel endpoint with learner + certificate info.
2. Receive the PDF buffer.
3. Upload to Supabase Storage bucket `certificates`:
   ```ts
   await supabase.storage
     .from('certificates')
     .upload(`/${user.id}/${certificateId}.pdf`, pdfBuffer, {
       contentType: 'application/pdf',
       upsert: true,
     });
   ```
4. Store the resulting (signed or public) URL in `certificateData.certificate_url`.
5. Insert into `certificates` table (existing logic already does this).

### 4. Frontend / UX
- Existing certificates modal already shows a download button if `certificate_url` exists; no extra work once we store the URL.
- Optional: generate and store a thumbnail PNG alongside the PDF for preview.

### 5. Ops / Cost Notes
- Vercel serverless functions have a generous free tier; cold start ~1s with Chromium.
- Keep templates versioned so we can regenerate certificates if branding changes.
- If volume grows, we can swap the renderer to a managed SaaS (Bannerbear, Canva Docs API, etc.) without changing the calling contract.

### Checklist for Implementation
1. [ ] Design final certificate template (HTML/CSS + assets).
2. [ ] Stand up Vercel renderer project with puppeteer.
3. [ ] Add shared secret env vars on both sides (`CERT_RENDER_SECRET`).
4. [ ] Update quiz completion flow to call renderer, upload PDF, and save URL.
5. [ ] Verify Supabase Storage bucket permissions (private + signed URLs).
6. [ ] QA: complete a quiz, confirm certificate row has `certificate_url`, and download works.

