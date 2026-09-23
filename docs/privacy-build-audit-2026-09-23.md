# Balancewise shared privacy build — 23 September 2026

The canonical policy hub is https://balancewises.io/legal/. This build covers the corporate website, Wisers, BSCAN, API Console, Admin and the Help Centre, together with their shared API. The retired Staff Portal remains a redirect to Admin. It does not reactivate that application or change the separate clothing store. Native app-store releases are outside this web deployment.

This is an implementation and evidence record, not a declaration of complete legal or WCAG compliance. Policies describe the inspected implementation; business records and operational controls still need their own evidence.

| Check | Existing gap and change in this build | Verification or remaining evidence |
| --- | --- | --- |
| 1. Privacy policy | Replaced inaccurate analytics, messaging encryption, AI and location claims. Added purposes, provider categories, rights and shared-account scope. | Matched to source and production analytics flag; provider contracts and transfer assessments require business review. |
| 2. Terms | Retained service terms; linked central terms throughout the apps, corrected messaging and deletion claims, separated terms acceptance from marketing permission. | Registration rejects missing terms; acceptance version and timestamp are stored. |
| 3. Refunds | Added central refunds/cancellation page for subscriptions and professional services, including statutory consumer rights. | Links included at billing/account entry points; no live payment or refund was made. |
| 4. Cookies | Replaced inactive-tracker inventory with essential/requested storage and feature-specific providers. | No optional advertising or analytics loader found in inspected browser sources; production UAA flag is disabled. |
| 5. Cookie notice | Added versioned essential-storage notice, dismiss control and reopenable accessible dialog on all active sites. | Browser tests cover dismissal, reopening, keyboard focus and expired/versioned notice handling. No fictitious tracking consent is collected. |
| 6. Form permission | Enquiry permission is distinct from marketing. Fixed Enter-key signup bypass; added server validation and recorded choices. | Offline endpoint tests and mocked browser signup checks. Existing users are not retroactively marked as consenting. |
| 7. Data minimisation | Enquiry phone and BSCAN profile address/contact fields are optional. DOB is used for age rules; no new identity-document collection was added. | Frontend/server validation reviewed. Business retention schedules and existing verification workflows need continued review. |
| 8. Third-party SDKs | Removed remote font calls and LinkedIn embed; locally hosted fonts and Three.js; documented active providers below. Updated vulnerable Admin development dependencies. | Admin npm audit reports zero vulnerabilities at this build. This is not an audit-zero claim for every repository or provider. |
| 9. Dark patterns | Optional marketing defaults off, preferences can be withdrawn, account deletion explains shared scope, fake ad-personalisation switches removed from Wisers. | UI and server checks; essential account/security emails are explained separately. |
| 10. Hidden fees | Added renewal, total/tax, cancellation and refund information around paid plan choices. | Existing checkout determines the actual total before payment; no paid transaction was exercised. |
| 11. Fake reviews | No static customer-review claims found in the inspected landing content; illustrative Wisers card remains labelled as a sample. | User-generated content and future imported reviews need ongoing moderation and authenticity checks. |
| 12. Unsupported claims | Removed unsupported 100% metrics, placement/certification guarantees, local-Claude and absolute data/security claims. | Source review; existing VAT/ICO references should be maintained against business records. |
| 13. Alternative text | Inspected audited pages for image names and decorative content; maintained image alternatives and accessible icon labels. | Automated page checks passed; content uploaded by users needs ongoing accessibility review. |
| 14. Contrast | Improved corporate themes, BSCAN pricing, Admin muted text, Console navigation and Help active links. | Forty page/theme/viewport audit runs passed without reported axe violations. Coverage is sampled, not every authenticated screen. |
| 15. Keyboard navigation | Added corporate skip links, menu states/Escape, visible focus, native dialogs and reduced-motion support; browser zoom enabled in apps. | Automated and scripted keyboard/dialog checks passed; comprehensive screen-reader and assistive-device testing remains separate. |
| 16. Business details | Added central legal hub, registered office/company number and existing contact channels, reachable from every active app. | Company 16164776 checked against Companies House. |
| 17. Children's data | Server validates calendar DOB and minimum age 13, requires guardian declaration for 13–17, defaults new minors to restricted messages and excludes minors/unknown ages from marketing. | Boundary and validation tests passed. These are self-declarations, not independently verified age or parental authority; children's risk assessment/age assurance remains operational work. |
| 18. Unsubscribe | Signed, purpose-scoped links use the central site and explicit confirmation. Campaigns and weekly digests require recorded adult opt-in and recheck before sending; legacy unconsented lead outreach is disabled. Activity email respects preferences; scheduled-report recipients can pause their report. | Offline tests cover tampering, repeated opt-out, recipient scope, permission checks and paused-report suppression. No customer email was sent in testing. |
| 19. Asset rights | Self-hosted fonts retain OFL notices; Three.js retains MIT notice; central licence page identifies icons and sample content. | Font source/checksum inventory is included. User uploads and any future licensed artwork require ownership/permission evidence. |
| 20. Data deletion | Central rights page links existing export/deletion tools and verified contact channels. All apps describe shared-account scope, 30-day reinstatement and legal/backup exceptions. | Reviewed existing erasure and legal-hold paths without deleting real accounts. Purge completeness, failed jobs, backup expiry and request fulfilment require operational verification. |

## Provider and SDK inventory

| Component/provider | Inspected use | Control or build change |
| --- | --- | --- |
| GitHub Pages | Corporate HTML, policy and asset hosting | Canonical policy hub on balancewises.io; normal delivery logs still apply. |
| DigitalOcean and shared API | Application hosting, account/service data | Existing authenticated cookie/CSRF or bearer flows retained; no new data store. |
| Cloudflare/Turnstile | DNS/security/delivery and enquiry abuse protection | Necessary feature requests described in policy; not presented as advertising consent. |
| Google Fonts | Previously remote stylesheet/font requests | Removed from active templates/styles; fonts served locally with OFL notices. |
| LinkedIn | Previously embedded badge/script | Removed embed; ordinary destination link retained. |
| Firebase/Google sign-in | Optional sign-in and requested push delivery in Wisers/BSCAN | No Firebase Analytics initialisation found; explicit push permission and server preference checks. Native-device behavior requires device testing. |
| Capacitor | Wisers native device integrations | No store binary published by this web build; existing device-permission flow retained. |
| Stripe | Paid plans and billing portal/checkout | No card data added to Balancewise forms; central refund and renewal disclosures. |
| Resend | Transactional and optional email | Consent filtering, signed unsubscribe and delivery-result handling in reviewed send paths. |
| AI service providers | Prompts/material supplied to requested AI features | Removed claim of entirely local/no-external processing; contracts and feature notices need provider-specific review. |
| Three.js r128 | Corporate decorative 3D background | Existing version hosted locally with its MIT notice. |
| Lucide, Chart.js, Svelte | Interface icons, charts and rendering | Locally bundled; installed licence notices retained. |
| UAA actor resolver | Optional backend analytics feature | Production configuration checked: disabled. Enabling it requires a fresh privacy review. |

## Validation

- Wisers: 147 unit tests; BSCAN: 114; Admin: 55; shared API privacy suite: 25. Console: 3 offline privacy/auth checks. Total: 344 passing tests.
- Type checks and production builds passed for Wisers, BSCAN, Admin and Console. Help static generation passed.
- Corporate HTML references/IDs/main landmarks checked. Forty mocked browser audit runs across six sites found no axe violations or runtime errors in the tested flows.
- Backend tests used mocked databases/mail delivery and bypassed legacy live-login fixtures. No real customer account was changed, deleted or emailed by verification. Console checks also confirm that network failures cannot report a saved preference and sign-out waits for server session clearance.
- Production release health, source revisions and asset checks are recorded separately during deployment. A passing local build alone is not evidence that every domain has updated.

## Sources consulted

- [Companies House — Balancewise Ltd](https://find-and-update.company-information.service.gov.uk/company/16164776)
- [ICO — managing cookie/storage consent](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/how-do-we-manage-consent-in-practice/)
- [ICO — Children's Code](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/introduction-to-the-childrens-code/)
- [ICO — right to erasure](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-erasure/)
- [GOV.UK — online selling](https://www.gov.uk/online-and-distance-selling-for-businesses/online-selling)
- [CMA — consumer reviews](https://www.gov.uk/government/publications/fake-reviews-cma208/short-guide-for-businesses-publishing-consumer-reviews-and-complying-with-consumer-protection-law)
- [W3C — WCAG](https://www.w3.org/TR/wcag/)
