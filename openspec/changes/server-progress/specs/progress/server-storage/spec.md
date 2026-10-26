## Purpose

Defines where the learner's progress is saved and loaded from inside Telegram: a server as the
source of truth, Telegram CloudStorage as a local mirror and offline fallback, and the one-time
migration of existing progress to the server.

## ADDED Requirements

### Requirement: Stored shape is unchanged

The server SHALL store progress per Telegram user as the same key-value entries the app already
uses: up to 64 pack keys `p_00` … `p_63` (value: JSON object `{ wordId: CompactCard }` as a
string) and the key `meta` (value: Meta JSON as a string). Values written to the server SHALL be
byte-identical to the values written to Telegram CloudStorage.

#### Scenario: Same data in both places

- **WHEN** the learner answers an exercise inside Telegram with the server reachable
- **THEN** the touched pack and `meta` hold the same value on the server and in CloudStorage

### Requirement: Access restricted to allowlisted Telegram users

Every server request SHALL carry the Telegram Mini App launch data (`initData`). The server SHALL
verify its signature with the bot token, SHALL reject launch data older than 24 hours, and SHALL
accept only users whose Telegram id is in the configured allowlist. A rejected request SHALL NOT
read or change any stored data.

#### Scenario: Forged or foreign request

- **WHEN** a request arrives without launch data, with a broken signature, or from a Telegram user not in the allowlist
- **THEN** the server responds with an authorization error and stored progress is unchanged

#### Scenario: Learner opens the app from the bot

- **WHEN** the allowlisted learner opens the Mini App in Telegram
- **THEN** their progress loads without any login screen

### Requirement: Saves go to the server and the local mirror

Inside Telegram (Bot API ≥ 6.9 for CloudStorage) every save SHALL be written to CloudStorage and
to the server. A save SHALL count as failed, with the existing «Прогресс не сохранился» toast,
only when the CloudStorage write fails. When only the server write fails, the app SHALL remember
the key as not yet synced, without showing an error.

#### Scenario: Server down during a lesson

- **WHEN** the server is unreachable and the learner answers exercises
- **THEN** the lesson continues without error toasts, CloudStorage holds the new progress, and the touched keys are remembered as not yet synced

### Requirement: Catch-up of unsynced saves

Keys remembered as not yet synced SHALL be pushed from CloudStorage to the server on the next
launch with the server reachable, before progress is loaded from the server, and after any later
successful server write. A key SHALL be forgotten as unsynced only after the server confirmed it.

#### Scenario: Offline progress survives

- **WHEN** the learner studied while the server was down and then opens the app with the server back up
- **THEN** the progress from the offline lesson is on the server and shown in the app

### Requirement: Load order and fallback

On launch inside Telegram the app SHALL load progress from the server. When the server is
unreachable it SHALL load from CloudStorage silently. When both fail, the existing full-screen
load error SHALL be shown. After loading from the server the app SHALL refresh CloudStorage
with the server values.

#### Scenario: Server unreachable at launch

- **WHEN** the learner opens the app and the server does not respond
- **THEN** the home screen shows the progress stored in CloudStorage and no error

#### Scenario: Second device

- **WHEN** the learner studied on one device and opens the app on another
- **THEN** the second device shows the latest progress from the server

### Requirement: Migration from CloudStorage

When the server holds no entries for the learner and CloudStorage holds progress, the app SHALL
upload all CloudStorage entries to the server in one step before showing the home screen. No
existing progress SHALL be lost or reset by the migration.

#### Scenario: First launch after the change

- **WHEN** the learner, who has progress only in CloudStorage, opens the app for the first time after the change
- **THEN** the home screen shows the same progress as before and the server now holds it

### Requirement: Atomic restore

Restoring a backup in settings SHALL replace all 64 packs and `meta` on the server in one atomic
step: either all entries are replaced or none. The backup format and its validation SHALL stay
as before, including old backups with `p:NN` keys.

#### Scenario: Restore fails midway

- **WHEN** the server rejects or fails the restore
- **THEN** the server progress is unchanged and the learner sees the restore error in settings

### Requirement: Outside Telegram nothing changes

Without Telegram launch data (plain browser, local development) the app SHALL NOT contact the
server and SHALL keep using `localStorage` as before. When no server address is configured at
build time, the app SHALL behave exactly as before this change.

#### Scenario: Local development

- **WHEN** the app runs in a browser outside Telegram
- **THEN** progress is read from and written to `localStorage` only
