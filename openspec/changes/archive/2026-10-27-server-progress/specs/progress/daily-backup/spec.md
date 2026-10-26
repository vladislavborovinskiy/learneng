## Purpose

Defines the automatic daily backup: the server sends the learner a restorable copy of their
progress as a file in the bot chat, so a safety copy exists without manual effort.

## ADDED Requirements

### Requirement: Daily backup file in the bot chat

Once a day the server SHALL send each allowlisted learner whose progress changed during the
previous 24 hours a document in the bot chat named `learneng-backup-YYYY-MM-DD.json`. Its content
SHALL be a backup in the existing format `{ "p_NN": "<pack json>", …, "meta": "<meta json>" }`
with empty packs omitted. When progress did not change, nothing SHALL be sent.

#### Scenario: Learner studied today

- **WHEN** the daily job runs after a day with at least one lesson
- **THEN** the bot chat receives `learneng-backup-YYYY-MM-DD.json` with the full progress

#### Scenario: Day without study

- **WHEN** the daily job runs and no progress entry changed in the last 24 hours
- **THEN** no file is sent

### Requirement: Backup file restores through settings

The content of a daily backup file SHALL be accepted by «Восстановить» in settings and SHALL
restore exactly the progress it contains.

#### Scenario: Restoring from the bot chat

- **WHEN** the learner copies the text of a daily backup file into the settings backup field and confirms «Точно?»
- **THEN** the app reloads with the progress from that file

### Requirement: Backup failure does not affect learning

A failure of the daily job (Telegram API error, server error) SHALL NOT change stored progress
and SHALL NOT affect the app.

#### Scenario: Telegram API error

- **WHEN** sending the backup document fails
- **THEN** stored progress is unchanged and the next day's job runs normally
