# progress/settings Specification

## Purpose

Defines what the learner can configure on the settings screen once lessons replace the daily
new-word limit.

## Requirements

### Requirement: Settings content

The settings screen SHALL show no explanatory caption; its content area SHALL hold only the
exercise accuracy block when there are answers. In the thumb zone it SHALL offer one row like
the home screen: a round backup icon button (floppy disk, labelled «Резервная копия»),
«Тест заново» and a wide «Готово». The progress backup (copy and restore)
SHALL be offered in a separate view of the same screen without a title, left with «Назад» or the
Telegram BackButton. The screen SHALL NOT offer a daily new-word limit.

#### Scenario: Opening settings

- **WHEN** the learner opens settings
- **THEN** they see the backup icon, «Тест заново» and «Готово» in one row, no caption, no backup field, and no «Новых слов в день»

#### Scenario: Opening the backup view

- **WHEN** the learner taps the backup icon
- **THEN** they see the backup field with «Скопировать», «Восстановить» and «Назад», and BackButton returns to the main settings view

### Requirement: Old stored limit is harmless

Progress saved before this change, including a stored daily limit, SHALL load without errors,
and backups made before this change SHALL restore.

#### Scenario: Old backup

- **WHEN** the learner restores a backup that contains a daily limit value
- **THEN** the restore succeeds and the value has no effect

### Requirement: Retaking the level test needs confirmation

The first tap on «Тест заново» SHALL turn the button into «Точно?» and show «Тест не сотрёт
выученные слова, только добавит новые известные. Нажми «Точно?», чтобы начать.»; only the
second tap SHALL start the level test.

#### Scenario: Retake with confirmation

- **WHEN** the learner taps «Тест заново» and then «Точно?»
- **THEN** the level test starts after the second tap, not the first
