## MODIFIED Requirements

### Requirement: Settings content

The settings screen SHALL show no explanatory caption; its content area SHALL hold only the
exercise accuracy block when there are answers. In the thumb zone it SHALL offer a quiet
«Резервная копия →» action, «Тест заново» and «Готово». The progress backup (copy and restore)
SHALL be offered in a separate «Резервная копия» view of the same screen, left with «Назад» or the
Telegram BackButton. The screen SHALL NOT offer a daily new-word limit.

#### Scenario: Opening settings

- **WHEN** the learner opens settings
- **THEN** they see «Резервная копия →», «Тест заново» and «Готово», no caption, no backup field, and no «Новых слов в день»

#### Scenario: Opening the backup view

- **WHEN** the learner taps «Резервная копия →»
- **THEN** they see the backup field with «Скопировать», «Восстановить» and «Назад», and BackButton returns to the main settings view
