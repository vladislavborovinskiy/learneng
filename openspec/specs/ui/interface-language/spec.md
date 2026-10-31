# ui/interface-language Specification

## Purpose

Lets the learner show the whole interface in Russian or in English, defines what is translated,
what always stays Russian and the English wording of every interface string.

## Requirements

### Requirement: Two interface languages

The interface SHALL be shown in one of two languages, Russian or English, chosen by the learner.
The choice SHALL be stored in Meta as `"language": "ru" | "en"`. Meta without the field, or with
any other value, SHALL be treated as Russian, so progress and backups made before this change
load unchanged and show the interface in Russian.

#### Scenario: First launch after the update

- **WHEN** the learner opens the app with progress saved before this change
- **THEN** the interface is in Russian and the progress loads as before

#### Scenario: Choice follows the learner

- **WHEN** the learner switches to English on the phone and later opens the app on another device
- **THEN** the interface is in English there too

#### Scenario: Choice is in the backup

- **WHEN** the learner restores a backup made while English was selected
- **THEN** after the reload the interface is in English

### Requirement: What is translated

With English selected, every interface string SHALL be in English: buttons, screen and exercise
labels, feedback titles, home, summary and settings labels, level test texts, chart dates, the
preloader button, error and toast messages, and accessibility labels. The following SHALL stay
Russian in both languages: word and sentence translations shown in exercises and on home, the
Russian line of preloader facts, and the bot reminder message. Switching SHALL apply at once,
without a reload.

#### Scenario: Exercise in English

- **WHEN** English is selected and «Выбери перевод» would be shown
- **THEN** the label reads «Choose the translation», while the prompted translations stay Russian

#### Scenario: Hard words on home

- **WHEN** English is selected and the hard words block is shown
- **THEN** the English words and their blurred Russian translations are unchanged

#### Scenario: Instant switch

- **WHEN** the learner taps «EN» in settings
- **THEN** settings are immediately shown in English

### Requirement: English wording

The English interface SHALL use the following wording for the Russian strings quoted in the
specs; strings with a number or a word keep the same placeholder.

| Russian | English |
| --- | --- |
| «Урок» | «Lesson» |
| «Тест» | «Test» |
| «Настройки» | «Settings» |
| «из N слов» | «of N words» |
| «сегодня +N» | «today +N» |
| «точность за неделю» | «accuracy this week» |
| «повторений сегодня» | «reviews today» |
| «Трудные слова» | «Hard words» |
| «Новые слова на паузе — сначала повторения» | «New words paused: reviews first» |
| «Новое слово» | «New word» |
| «Знаю» | «I know it» |
| «Дальше» | «Next» |
| «Как переводится?» | «What does it mean?» |
| «Выбери перевод» | «Choose the translation» |
| «Вставь слово» | «Fill in the blank» |
| «Напиши по-английски» | «Type in English» |
| «Собери предложение» | «Build the sentence» |
| «Не помню» | «Forgot» |
| «Проверить» | «Check» |
| «Подсказка» | «Hint» |
| «Ответ» | «Answer» |
| «Озвучить» | «Listen» |
| «Закрыть» | «Close» |
| «Правильно!» | «Correct!» |
| «Верно, с подсказкой» | «Correct, with a hint» |
| «Почти! Опечатка» | «Almost! Typo» |
| «Почти! Были ошибки» | «Almost! A few mistakes» |
| «Неправильно» | «Wrong» |
| «Запомни» | «Remember this» |
| «Ответ: …» | «Answer: …» |
| «Урок пройден» | «Lesson complete» |
| «точность» | «accuracy» |
| «ответов» | «answers» |
| «новых слов» | «new words» |
| «дней подряд» | «day streak» |
| «Верных ответов: X из Y» | «Correct answers: X of Y» |
| «Повторить ошибки» | «Review mistakes» |
| «На главную» | «Home» |
| «Ещё урок» | «Next lesson» |
| «Знаешь это слово?» | «Do you know this word?» |
| «Не знаю» | «Don't know» |
| «Результат теста» | «Test result» |
| «слов из N самых частых ты знаешь» | «of the N most common words you know» |
| «Слова A–B» | «Words A–B» |
| «Ты отметил несуществующих слов: X из Y. Оценка скорректирована с учётом этого.» | «You marked X of Y fake words. The score takes this into account.» |
| «Ты отметил несуществующих слов: X из Y. Результат ненадёжный, поэтому слова не будут помечены как известные. Попробуй ещё раз и отмечай «Знаю», только если точно помнишь перевод.» | «You marked X of Y fake words. The result is not reliable, so no words are marked as known. Try again and tap «I know it» only if you know the translation.» |
| «Сохранить» | «Save» |
| «Пройти позже» | «Later» |
| «Резервная копия» | «Backup» |
| «Тест заново» | «Retake test» |
| «Точно?» | «Sure?» |
| «Готово» | «Done» |
| «Тест не сотрёт выученные слова, только добавит новые известные. Нажми «Точно?», чтобы начать.» | «The test won't erase learned words, it only adds known ones. Tap «Sure?» to start.» |
| «точность за 30 дней» | «accuracy over 30 days» |
| «С английского» | «From English» |
| «На английский» | «To English» |
| «Собери из кусков» | «Build from chunks» |
| «Собери из слов» | «Build from words» |
| «Напиши слово» | «Type the word» |
| «Скопировать» | «Copy» |
| «Скопировано» | «Copied» |
| «Не удалось скопировать» | «Couldn't copy» |
| «Восстановить» | «Restore» |
| «Назад» | «Back» |
| «Вставь сюда копию из файла от бота» | «Paste the backup file from the bot here» |
| «Текущий прогресс сотрётся. Нажми «Точно?», чтобы восстановить копию.» | «Your current progress will be erased. Tap «Sure?» to restore the backup.» |
| «Это не резервная копия LearnEng» | «This is not a LearnEng backup» |
| «Неизвестный ключ K» | «Unknown key K» |
| «Повреждённое значение K» | «Corrupted value K» |
| «Прогресс не сохранился» | «Progress not saved» |
| «Проверь интернет. Не закрывай приложение: в настройках можно скопировать резервную копию.» | «Check your connection. Don't close the app: you can copy a backup in settings.» |
| «Не удалось загрузить прогресс: …» | «Couldn't load progress: …» |
| «Понятно» | «Got it» |
| «Новые слова» (chart) | «New words» |
| «Язык интерфейса» | «Interface language» |
| dates «28 окт» | «Oct 28» |

#### Scenario: Feedback in English

- **WHEN** English is selected and the learner types the word with one typo
- **THEN** the feedback title reads «Almost! Typo» on the sand tint

#### Scenario: Chart dates

- **WHEN** English is selected and the pace chart starts on 25 October
- **THEN** its first date label reads «Oct 25»

#### Scenario: Preloader button

- **WHEN** English is selected and progress has loaded on launch
- **THEN** the preloader button reads «Got it», while the fact still shows its English and Russian lines
