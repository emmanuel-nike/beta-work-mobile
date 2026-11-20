# Notifications setup (FCM push + email + live updates)

This app receives **push notifications** (Firebase Cloud Messaging), the backend
sends **emails**, and both the app and backend keep data **near-real-time** via
an SSE stream. This guide covers the one-time credentials and native config you
must add — code is already wired up.

## Overview of what's already implemented

- **Backend** (`beta-work-backend`): `device_tokens` table + `POST/DELETE
  /api/v1/devices`, `firebase-admin` push, notification emails, and an SSE
  channel per user (`@adonisjs/transmit`). Booking events (requested, accepted,
  declined, completed) fan out automatically.
- **Mobile** (`beta-work-mobile`): registers its FCM token after login,
  refreshes data on a received push or SSE event, and unregisters on logout.

Push and SSE **degrade gracefully**: without Firebase credentials the backend
simply logs and skips push, and the app logs and skips registration — nothing
crashes. Email uses the existing SMTP config.

---

## 1. Create the Firebase project

1. Go to <https://console.firebase.google.com> → **Add project**. Name it (e.g.
   `BetaWork`). Analytics is optional.

## 2. Register the apps (gets the client config files)

### Android
1. Firebase console → **Project settings** (gear) → **Your apps** → **Add app**
   → **Android**.
2. **Android package name:** `com.betawork` (must match
   `android/app/build.gradle` `applicationId`).
3. Download **`google-services.json`** and place it at
   **`android/app/google-services.json`**.
   - This file is git-ignored; each developer/CI adds their own.

### iOS
1. **Add app** → **iOS**.
2. **Bundle ID:** `com.betaworkmobile` (matches Xcode
   `PRODUCT_BUNDLE_IDENTIFIER`).
3. Download **`GoogleService-Info.plist`** and add it to the Xcode project:
   open `ios/BetaWork.xcworkspace`, drag the file into the **BetaWork** target
   (check "Copy items if needed"). It lands at
   `ios/BetaWork/GoogleService-Info.plist` (also git-ignored).

## 3. iOS APNs key (required for iOS push)

Push on iOS needs an Apple Push Notification key uploaded to Firebase:
1. <https://developer.apple.com/account> → **Certificates, Identifiers &
   Profiles** → **Keys** → **+** → enable **Apple Push Notifications service
   (APNs)** → download the **`.p8`** file (you can only download it once) and
   note the **Key ID** and your **Team ID**.
2. Firebase console → **Project settings** → **Cloud Messaging** → **Apple app
   configuration** → **APNs Authentication Key** → **Upload** the `.p8`, Key ID,
   and Team ID.
3. In Xcode → **Signing & Capabilities** → add **Push Notifications** and
   **Background Modes** (tick *Remote notifications*). (`UIBackgroundModes` is
   already in `Info.plist`.)

## 4. Backend service-account credentials (sends the push)

1. Firebase console → **Project settings** → **Service accounts** → **Generate
   new private key** → downloads a JSON file. Keep it secret (never commit it).
2. Put these into the backend environment (`.env`), from that JSON:

   ```bash
   FIREBASE_PROJECT_ID=your-project-id              # "project_id"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com  # "client_email"
   # "private_key" — keep on ONE line, newlines escaped as \n, wrapped in quotes:
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
   ```

3. Ensure **Cloud Messaging API (V1)** is enabled: Google Cloud console →
   APIs & Services → Library → "Firebase Cloud Messaging API" → Enable (usually
   on by default for new projects).

> Alternatively set `GOOGLE_APPLICATION_CREDENTIALS` to the JSON path, but the
> three env vars above are preferred so nothing secret is written to disk in
> deploys.

## 5. Install native dependencies (mobile)

From `beta-work-mobile`:

```bash
npm install
cd ios && pod install && cd ..
```

Then rebuild the app (a JS-only reload is not enough — native modules changed):

```bash
npm run android   # or
npm run ios
```

Android Gradle now applies the `com.google.gms.google-services` plugin and will
fail the build until `android/app/google-services.json` exists (step 2).

---

## How the real-time refresh works

Every booking event hits the recipient on three channels:

| Channel | When it helps | Delivery |
| --- | --- | --- |
| **SSE** (`@adonisjs/transmit`) | app open & foreground | instant, reliable |
| **FCM push** | app backgrounded / killed | OS notification + wake |
| **Email** | off-device | always |

The push `data` payload and the SSE message share one contract:

```json
{ "type": "booking.accepted", "bookingId": "123", "status": "accepted" }
```

On receipt the app refetches the affected lists (`loadMyBookings`, and
`loadMyJobs` for artisans), so requests and status changes reflect on the
relevant device within moments.

`type` is one of: `booking.requested`, `booking.accepted`, `booking.declined`,
`booking.completed`.

## Testing without the mobile app

Send a test push from Firebase console → **Messaging** → **New campaign** →
**Notifications**, or verify a device registered by checking the `device_tokens`
table after logging in on a device.
