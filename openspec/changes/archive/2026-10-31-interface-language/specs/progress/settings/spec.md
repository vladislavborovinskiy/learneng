## MODIFIED Requirements

### Requirement: Settings content

The settings screen SHALL show no explanatory caption; its content area SHALL hold only the
exercise accuracy block when there are answers. At the top of the screen it SHALL show the
interface language switch, a full-width two-segment control «RU» / «EN» labelled «Язык
интерфейса» with the current language selected. In the thumb zone it SHALL offer one row like the
home screen: a round backup icon button (floppy
disk, labelled «Резервная копия»), «Тест заново» and a wide «Готово». The switch SHALL be glass
with the selected segment on stronger glass, without outlines or shadows, and SHALL save the
choice on tap. The progress backup (copy and restore) SHALL be offered in a separate view of the
same screen without a title, left with «Назад» or the Telegram BackButton. The screen SHALL NOT
offer a daily new-word limit.

#### Scenario: Opening settings

- **WHEN** the learner opens settings
- **THEN** they see the «RU» / «EN» switch at the top with the current language selected, and at the bottom the backup icon, «Тест заново» and «Готово» in one row, no caption, no backup field, and no «Новых слов в день»

#### Scenario: Switching the language

- **WHEN** the learner taps «EN»
- **THEN** «EN» becomes selected, the screen switches to English at once and the choice is saved

#### Scenario: Opening the backup view

- **WHEN** the learner taps the backup icon
- **THEN** they see the backup field with «Скопировать», «Восстановить» and «Назад», and BackButton returns to the main settings view
