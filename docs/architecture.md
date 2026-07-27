# BSCAN Architecture

## Overview
BSCAN is a lightweight security scanning platform designed to analyse repositories and detect vulnerabilities.

## Structure

Landing Page:
/

AI Interface:
/ai

Apply Page:
/apply

Contact Page:
/contact

Guided Enquiry:
/enquire

Cookies Page:
/cookies

Privacy Page:
/privacy

Services Page:
/services

Staffing Page:
/staffing

Terms Page:
/terms

## Assets
/assets
- css
- js
- images

## Deployment
The static corporate site is hosted using GitHub Pages.

The guided enquiry posts to `https://api-bscan.balancewises.io/api/company-leads`.
That API validates Cloudflare Turnstile, applies per-IP rate limits, writes to
PostgreSQL, notifies `info@balancewises.io` and sends the client an automated,
route-specific acknowledgement. Lead records are visible only through the
authenticated admin console at `https://admin-bscan.balancewises.io`.

Required backend secrets:

- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `COMPANY_LEAD_TO` (defaults to `info@balancewises.io`)

The API server, Celery worker and Celery beat service must be restarted after
deployment. Run `alembic upgrade head` before restarting the API.
