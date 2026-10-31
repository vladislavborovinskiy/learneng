import { createContext, use } from 'react'
import type { AnswerResult, ExerciseType } from '@/lib/exercises'

const ru = {
  common: {
    next: 'Дальше',
    forgot: 'Не помню',
    hint: 'Подсказка',
    close: 'Закрыть',
    listen: 'Озвучить',
    gotIt: 'Понятно',
    loadError: (error: string) => `Не удалось загрузить прогресс: ${error}`,
  },
  months: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  formatDay: (date: number, month: string) => `${date} ${month}`,
  home: {
    settings: 'Настройки',
    test: 'Тест',
    lesson: 'Урок',
    ofWords: (total: number) => `из ${total} слов`,
    today: (learned: number) => `сегодня +${learned}`,
    split: (words: number, phrases: number) => `слова ${words} · фразы ${phrases}`,
    accuracyWeek: 'точность за неделю',
    reviewsToday: 'повторений сегодня',
    hardWords: 'Трудные слова',
    newWordsPaused: 'Новые слова на паузе — сначала повторения',
    chartNewWords: 'Новые слова',
  },
  exercises: {
    newWord: 'Новое слово',
    know: 'Знаю',
    whatMeans: 'Как переводится?',
    chooseTranslation: 'Выбери перевод',
    fillBlank: 'Вставь слово',
    typeInEnglish: 'Напиши по-английски',
    buildSentence: 'Собери предложение',
    check: 'Проверить',
    answer: 'Ответ',
  },
  feedback: {
    titles: {
      correct: 'Правильно!',
      hinted: 'Верно, с подсказкой',
      typo: 'Почти! Опечатка',
      wrong: 'Неправильно',
      forgot: 'Запомни',
    } satisfies Record<AnswerResult, string>,
    tilesTypo: 'Почти! Были ошибки',
    answer: 'Ответ:',
  },
  summary: {
    title: 'Урок пройден',
    accuracy: 'точность',
    answers: 'ответов',
    newWords: 'новых слов',
    streak: 'дней подряд',
    correctOf: (correct: number, total: number) => `Верных ответов: ${correct} из ${total}`,
    repeatMistakes: 'Повторить ошибки',
    home: 'На главную',
    nextLesson: 'Ещё урок',
  },
  levelTest: {
    question: 'Знаешь это слово?',
    dontKnow: 'Не знаю',
    know: 'Знаю',
    result: 'Результат теста',
    youKnow: (total: number) => `слов из ${total} самых частых ты знаешь`,
    band: (from: number, to: number) => `Слова ${from}–${to}`,
    adjusted: (falseAlarms: number, pseudo: number) =>
      `Ты отметил несуществующих слов: ${falseAlarms} из ${pseudo}. Оценка скорректирована с учётом этого.`,
    unreliable: (falseAlarms: number, pseudo: number) =>
      `Ты отметил несуществующих слов: ${falseAlarms} из ${pseudo}. Результат ненадёжный, поэтому слова не будут помечены как известные. Попробуй ещё раз и отмечай «Знаю», только если точно помнишь перевод.`,
    save: 'Сохранить',
    later: 'Пройти позже',
  },
  settings: {
    language: 'Язык интерфейса',
    backup: 'Резервная копия',
    retakeTest: 'Тест заново',
    sure: 'Точно?',
    done: 'Готово',
    retakeWarning:
      'Тест не сотрёт выученные слова, только добавит новые известные. Нажми «Точно?», чтобы начать.',
    accuracy30: 'точность за 30 дней',
    exerciseNames: {
      'en-ru': 'С английского',
      'ru-en': 'На английский',
      'cloze': 'Вставь слово',
      'chunks': 'Собери из кусков',
      'tiles': 'Собери из слов',
      'typing': 'Напиши слово',
    } satisfies Record<ExerciseType, string>,
  },
  backup: {
    copy: 'Скопировать',
    copied: 'Скопировано',
    copyFailed: 'Не удалось скопировать',
    restore: 'Восстановить',
    back: 'Назад',
    placeholder: 'Вставь сюда копию из файла от бота',
    restoreWarning: 'Текущий прогресс сотрётся. Нажми «Точно?», чтобы восстановить копию.',
    errors: {
      notBackup: () => 'Это не резервная копия LearnEng',
      unknownKey: (key: string) => `Неизвестный ключ ${key}`,
      badValue: (key: string) => `Повреждённое значение ${key}`,
    },
    saveFailed: 'Прогресс не сохранился',
    saveFailedHint:
      'Проверь интернет. Не закрывай приложение: в настройках можно скопировать резервную копию.',
  },
}

export type Strings = typeof ru

const en: Strings = {
  common: {
    next: 'Next',
    forgot: 'Forgot',
    hint: 'Hint',
    close: 'Close',
    listen: 'Listen',
    gotIt: 'Got it',
    loadError: (error) => `Couldn't load progress: ${error}`,
  },
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  formatDay: (date, month) => `${month} ${date}`,
  home: {
    settings: 'Settings',
    test: 'Test',
    lesson: 'Lesson',
    ofWords: (total) => `of ${total} words`,
    today: (learned) => `today +${learned}`,
    split: (words, phrases) => `words ${words} · phrases ${phrases}`,
    accuracyWeek: 'accuracy this week',
    reviewsToday: 'reviews today',
    hardWords: 'Hard words',
    newWordsPaused: 'New words paused: reviews first',
    chartNewWords: 'New words',
  },
  exercises: {
    newWord: 'New word',
    know: 'I know it',
    whatMeans: 'What does it mean?',
    chooseTranslation: 'Choose the translation',
    fillBlank: 'Fill in the blank',
    typeInEnglish: 'Type in English',
    buildSentence: 'Build the sentence',
    check: 'Check',
    answer: 'Answer',
  },
  feedback: {
    titles: {
      correct: 'Correct!',
      hinted: 'Correct, with a hint',
      typo: 'Almost! Typo',
      wrong: 'Wrong',
      forgot: 'Remember this',
    },
    tilesTypo: 'Almost! A few mistakes',
    answer: 'Answer:',
  },
  summary: {
    title: 'Lesson complete',
    accuracy: 'accuracy',
    answers: 'answers',
    newWords: 'new words',
    streak: 'day streak',
    correctOf: (correct, total) => `Correct answers: ${correct} of ${total}`,
    repeatMistakes: 'Review mistakes',
    home: 'Home',
    nextLesson: 'Next lesson',
  },
  levelTest: {
    question: 'Do you know this word?',
    dontKnow: "Don't know",
    know: 'I know it',
    result: 'Test result',
    youKnow: (total) => `of the ${total} most common words you know`,
    band: (from, to) => `Words ${from}–${to}`,
    adjusted: (falseAlarms, pseudo) =>
      `You marked ${falseAlarms} of ${pseudo} fake words. The score takes this into account.`,
    unreliable: (falseAlarms, pseudo) =>
      `You marked ${falseAlarms} of ${pseudo} fake words. The result is not reliable, so no words are marked as known. Try again and tap «I know it» only if you know the translation.`,
    save: 'Save',
    later: 'Later',
  },
  settings: {
    language: 'Interface language',
    backup: 'Backup',
    retakeTest: 'Retake test',
    sure: 'Sure?',
    done: 'Done',
    retakeWarning:
      "The test won't erase learned words, it only adds known ones. Tap «Sure?» to start.",
    accuracy30: 'accuracy over 30 days',
    exerciseNames: {
      'en-ru': 'From English',
      'ru-en': 'To English',
      'cloze': 'Fill in the blank',
      'chunks': 'Build from chunks',
      'tiles': 'Build from words',
      'typing': 'Type the word',
    },
  },
  backup: {
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: "Couldn't copy",
    restore: 'Restore',
    back: 'Back',
    placeholder: 'Paste the backup file from the bot here',
    restoreWarning: 'Your current progress will be erased. Tap «Sure?» to restore the backup.',
    errors: {
      notBackup: () => 'This is not a LearnEng backup',
      unknownKey: (key) => `Unknown key ${key}`,
      badValue: (key) => `Corrupted value ${key}`,
    },
    saveFailed: 'Progress not saved',
    saveFailedHint:
      "Check your connection. Don't close the app: you can copy a backup in settings.",
  },
}

export const strings = { ru, en }

export type Language = keyof typeof strings

export const StringsContext = createContext<Strings>(ru)

export function useStrings() {
  return use(StringsContext)
}
