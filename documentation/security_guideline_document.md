# Security Guidelines for `codeguide-starter-fullstack`

This document provides actionable security best practices for the `codeguide-starter-fullstack` starter kit. By following these guidelines, developers will embed security by design, ensure robust defenses, and maintain a secure default posture throughout development and deployment.

---

## 1. Security Principles  
Embed these principles at every stage of development:

- **Security by Design:** Integrate security from the first line of code.  
- **Least Privilege:** Grant the minimum access needed (file system, environment, database).  
- **Defense in Depth:** Layer controls (validation, authentication, headers).  
- **Fail Securely:** On error, do not leak data or leave an operation half-completed.  
- **Keep Security Simple:** Use well-maintained libraries and patterns.  
- **Secure Defaults:** Ensure all new features are locked down until explicitly opened.

---

## 2. Authentication & Access Control

- **Strong Password Policies:**  
  • Enforce minimum length (≥ 8 characters), complexity rules, and blacklists.  
  • Use `bcrypt` or `Argon2` with unique salts for hashing.  

- **Secure Session Management:**  
  • Store session tokens in HTTP-only, Secure, `SameSite=Strict` cookies.  
  • Implement idle and absolute timeouts (e.g., 15 min idle, 24 h absolute).  
  • Regenerate session ID on login to prevent fixation.  

- **JWT Handling (if adopted):**  
  • Use strong signing algorithms (e.g., HS256 or RS256).  
  • Validate `alg`, `iss`, `aud`, and enforce short expirations (`exp`).  
  • Do not store sensitive user data in the token payload.  

- **Multi-Factor Authentication (MFA):**  
  • Provide optional TOTP-based or SMS-based 2FA for sensitive flows.  

- **Role-Based Access Control (RBAC):**  
  • Define roles (e.g., `user`, `admin`) and enforce server-side checks in every API route and page.  
  • Never rely on client-side flags for authorization.

---

## 3. Input Handling & Processing

- **Server-Side Validation:**  
  • Validate every request body, query, and parameter using schemas (e.g., Zod or Joi).  
  • Mirror client-side validation with stricter server rules.

- **Prevent Injection:**  
  • Use parameterized queries or an ORM for any DB access.  
  • Never interpolate user input into command lines or file paths.

- **Cross-Site Scripting (XSS) Mitigation:**  
  • Escape or sanitize all user-supplied content before rendering.  
  • Avoid `dangerouslySetInnerHTML`; if needed, sanitize with a library (e.g., DOMPurify).

- **Redirect and URL Validation:**  
  • Allow-list redirect targets.  
  • Reject or default to a safe path for invalid `next` parameters.

- **Secure File Uploads (Future Scope):**  
  • Validate file size, type (by magic bytes), and reject disallowed extensions.  
  • Store uploads outside the webroot or on a dedicated object store with least privilege.

---

## 4. Data Protection & Privacy

- **Encryption in Transit:**  
  • Enforce TLS 1.2+ on all endpoints (e.g., via Vercel defaults or custom NGINX).  

- **Encryption at Rest:**  
  • For persistent storage (databases, object stores), enable encryption features.  

- **Secrets Management:**  
  • Store secrets (DB credentials, JWT keys) in environment variables or a vault (AWS Secrets Manager, HashiCorp Vault).  
  • Avoid committing `.env` files to source control.

- **Information Leakage:**  
  • In production, disable detailed stack traces.  
  • Return generic error messages (e.g., "An unexpected error occurred.").

- **Protect PII:**  
  • Mask or truncate sensitive fields in logs (emails, user IDs).  
  • Implement a data retention policy that aligns with GDPR/CCPA.

---

## 5. API & Service Security

- **HTTPS Enforcement:**  
  • Redirect HTTP to HTTPS at the edge.  

- **Rate Limiting & Throttling:**  
  • Apply per-IP or per-user rate limits on authentication and write endpoints.  

- **CORS Configuration:**  
  • Restrict `Access-Control-Allow-Origin` to trusted domains.  
  • Enable `Access-Control-Allow-Credentials` only when needed.

- **Authentication & Authorization Checks:**  
  • Protect every API route under `app/api/` with middleware that verifies the session or token.  

- **Minimal Response Surface:**  
  • Only return necessary fields in JSON replies.  
  • Avoid verbosity that could leak internal implementation details.

- **Proper HTTP Methods:**  
  • GET for read, POST for create, PUT/PATCH for update, DELETE for removal.  

- **API Versioning:**  
  • Use route prefixes like `/api/v1/auth` to allow safe iteration.

---

## 6. Web Application Security Hygiene

- **Cross-Site Request Forgery (CSRF):**  
  • Implement CSRF tokens on state-changing requests (e.g., using `next-csrf` or `csurf`).

- **Security Headers:**  
  • Content-Security-Policy: limit sources of scripts, styles, images.  
  • Strict-Transport-Security: `max-age=63072000; includeSubDomains; preload`.  
  • X-Content-Type-Options: `nosniff`.  
  • X-Frame-Options: `DENY`.  
  • Referrer-Policy: `no-referrer-when-downgrade` or stricter.

- **Secure Cookies:**  
  • Set `HttpOnly`, `Secure`, `SameSite=Strict` on all session cookies.

- **Clickjacking Protection:**  
  • Enforce `X-Frame-Options: DENY` or CSP `frame-ancestors 'none'`.

- **Avoid Client-Side Storage of Secrets:**  
  • Never store tokens or passwords in `localStorage` or `sessionStorage`.

- **Subresource Integrity (SRI):**  
  • When including third-party scripts/styles, add integrity hashes.

---

## 7. Infrastructure & Configuration Management

- **Server Hardening:**  
  • Disable unused services and ports.  
  • Regularly apply OS and package updates.

- **Environment Segmentation:**  
  • Separate development, staging, and production configurations.  
  • Use distinct credentials and secrets per environment.

- **TLS Configuration:**  
  • Disable weak ciphers and protocols (SSLv3, TLS 1.0/1.1).  
  • Test with tools like SSL Labs for compliance.

- **File Permissions:**  
  • Restrict filesystem access—only necessary users should read/write code and logs.

- **Disable Debug in Production:**  
  • Ensure `next.config.js` sets `reactStrictMode=false` only in development.
  
---

## 8. Dependency Management

- **Lockfiles:**  
  • Commit `package-lock.json` or `yarn.lock` for reproducible builds.

- **Vulnerability Scanning:**  
  • Integrate SCA tools (e.g., GitHub Dependabot, Snyk) into CI.  

- **Update Regularly:**  
  • Schedule periodic dependency reviews and upgrades.  

- **Limit Footprint:**  
  • Only install essential packages to reduce the attack surface.

---

## 9. Continuous Security Practices

- **Automated CI/CD Checks:**  
  • Linting, type-checking, and vulnerability scanning on every pull request.  

- **Penetration Testing & Audits:**  
  • Conduct periodic security reviews or engage third-party auditors.  

- **Incident Response Plan:**  
  • Define steps for breach detection, containment, and notification.

---

## Conclusion
By adopting these guidelines, the `codeguide-starter-fullstack` repository will maintain strong security hygiene, protect user data, and ensure a resilient foundation for future features. Always treat security as a continuous process and evolve controls as the application grows.
