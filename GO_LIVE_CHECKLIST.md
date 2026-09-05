# Production Go-Live Validation (UAT Checklist)

Before announcing the Darshan platform to the public, the following User Acceptance Testing (UAT) steps must be manually validated in the **Production Environment**.

## 1. Core Discovery (Temples & Locations)
- [ ] **Homepage Load:** Ensure the homepage loads within 2 seconds.
- [ ] **Global Search:** Type "Shiva" into the navbar search and verify Temples, Pilgrimages, and Festivals are returned quickly.
- [ ] **Temple Detail Page:** Navigate to `/temples/kashi-vishwanath` (or any verified temple).
  - [ ] Verify the Hero Image and verified badge render correctly.
  - [ ] Check that "Live Opening Hours" and "Special Darshan" sections populate accurately.
  - [ ] Validate that the Google Maps iframe correctly drops a pin at the temple's coordinates.
- [ ] **Nearby Engine:** Scroll to "Nearby Temples" and ensure distances (e.g., "1.2 km away") calculate correctly based on coordinates.

## 2. Journey & Pilgrimages
- [ ] **Yatra Engine:** Go to `/pilgrimages/ashtavinayak-yatra` (or equivalent).
  - [ ] Verify the total "Temple Count" exactly matches the number of temples listed on the page.
  - [ ] Check the interactive route map for the pilgrimage.

## 3. Festivals & Time
- [ ] **Festival Calendar:** Navigate to `/festivals`.
  - [ ] Verify filtering by Year, Region, and Deity works without crashing.
  - [ ] Click a festival (e.g., "Maha Shivaratri") and ensure the "Associated Temples" grid populates with relevant locations.

## 4. Community & Authentication
- [ ] **Registration:** Create a brand new user account via the registration flow.
- [ ] **Login:** Sign out and log back in to test session persistence.
- [ ] **Community Threads:** Navigate to `/threads`.
  - [ ] Ensure the "Latest", "Trending", and "Popular" filters work.
  - [ ] (If implemented) Create a test post and verify it appears immediately for other users.

## 5. Admin & Ops
- [ ] **Verification Queue:** Login as an Admin and navigate to `/admin/temples?tab=pending`. Verify you can securely approve a temple.
- [ ] **Security Headers:** Inspect network traffic and confirm `Strict-Transport-Security` and `X-Content-Type-Options` are present.
- [ ] **Rate Limiting:** Spam the global search bar rapidly (30+ times) and confirm the server responds with `429 Too Many Requests`.

## 6. AI Features
- [ ] **AI Chat:** Open the AI Assistant modal.
  - [ ] Ask: "Find me Shiva temples near Pune."
  - [ ] Verify the AI *calls the internal tool* rather than hallucinating, and returns verified database results.

---
**Sign-off required before DNS switch:** _______________
