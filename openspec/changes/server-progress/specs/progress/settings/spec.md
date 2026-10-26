## MODIFIED Requirements

### Requirement: Settings content

The settings screen SHALL show only the caption «Прогресс хранится на сервере · копия приходит
в чат с ботом каждую ночь» and, in the thumb zone, a quiet «Резервная копия →» action, «Тест
заново» and «Готово». The progress backup (copy and restore) SHALL be offered in a separate
«Резервная копия» view of the same screen, left with «Назад» or the Telegram BackButton. The
screen SHALL NOT offer a daily new-word limit.

#### Scenario: Opening settings

- **WHEN** the learner opens settings
- **THEN** they see the caption, «Резервная копия →», «Тест заново» and «Готово», no backup field, and no «Новых слов в день»

#### Scenario: Opening the backup view

- **WHEN** the learner taps «Резервная копия →»
- **THEN** they see the backup field with «Скопировать», «Восстановить» and «Назад», and BackButton returns to the main settings view

## ADDED Requirements

### Requirement: Retaking the level test needs confirmation

The first tap on «Тест заново» SHALL turn the button into «Точно?» and show «Тест не сотрёт
выученные слова, только добавит новые известные. Нажми «Точно?», чтобы начать.»; only the
second tap SHALL start the level test.

#### Scenario: Retake with confirmation

- **WHEN** the learner taps «Тест заново» and then «Точно?»
- **THEN** the level test starts after the second tap, not the first
