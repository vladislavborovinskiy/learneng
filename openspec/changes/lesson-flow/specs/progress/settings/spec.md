## Purpose

Defines what the learner can configure on the settings screen once lessons replace the daily
new-word limit.

## ADDED Requirements

### Requirement: Settings content

The settings screen SHALL offer the progress backup (copy and restore) and retaking the level
test. It SHALL NOT offer a daily new-word limit.

#### Scenario: Opening settings

- **WHEN** the learner opens settings
- **THEN** they see «Резервная копия» and «Тест уровня», and no «Новых слов в день»

### Requirement: Old stored limit is harmless

Progress saved before this change, including a stored daily limit, SHALL load without errors,
and backups made before this change SHALL restore.

#### Scenario: Old backup

- **WHEN** the learner restores a backup that contains a daily limit value
- **THEN** the restore succeeds and the value has no effect
