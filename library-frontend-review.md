# Code Review — library-frontend

## 🔴 Критические проблемы

- [ ] `src/main.tsx` — двойной `BrowserRouter`: `App.tsx` оборачивает в `<Router>`, и `main.tsx` тоже — вложенные роутеры сломают навигацию
- [ ] `src/main.tsx` — импортирует `App` напрямую И как `LazyApp`, но использует только `LazyApp` — прямой импорт лишний и нарушает смысл lazy loading
- [ ] `src/shared/ui/Error Boundary/index.tsx` — `useContext` вызывается внутри метода `render()` класса `ErrorBoundary` — хуки нельзя использовать в class-компонентах, это упадёт в рантайме
- [ ] `tailwind.config.js` + `postcss.config.js` — используют `module.exports` (CommonJS), но в `package.json` указан `"type": "module"` — конфиги будут падать при запуске
- [ ] `vite.config.ts` — не настроен алиас `@/`, но весь код использует импорты вида `@/shared/...` — проект не соберётся

## 🟡 Серьёзные замечания

- [ ] `package.json` — десятки используемых в коде пакетов отсутствуют в зависимостях: `framer-motion`, `@react-spring/web`, `@use-gesture/react`, `date-fns`, `@twa-dev/sdk-react`, `tailwindcss`, `autoprefixer`, `postcss-import`, `eslint` и связанные плагины
- [ ] `src/shared/ui/ThemeToggle/ThemeContext.tsx` — файл пустой, хотя на него ссылается `ErrorBoundary`
- [ ] `src/shared/ui/ThemeToggle/index.ts` — файл пустой, хотя используется во множестве компонентов
- [ ] `src/shared/ui/Select/Select.tsx` — ссылается на иконки `'arrow-up'`, `'arrow-down'`, `'search'`, которых нет в типе `IconName`
- [ ] `src/shared/ui/Modal/SwipeableModal.tsx` — передаёт `variant="tg"` в `<Loader>`, но такого пропа у компонента нет
- [ ] `src/shared/ui/Tag/Tag.tsx` — использует тип `Variants` из framer-motion без его импорта
- [ ] `src/app/styles/global.css` — JS-комментарии `//` внутри CSS-файла — невалидный синтаксис

## 🟢 Замечания по качеству

- [ ] `xtrash/` — папка со старым кодом закоммичена в репозиторий; нужно либо удалить, либо добавить в `.gitignore`
- [ ] `src/shared/ui/Error Boundary/` — пробел в названии папки, должно быть `ErrorBoundary`
- [ ] `README.md` — стандартный шаблон Vite, не заменён на описание реального проекта
- [ ] `index.html` — заголовок страницы `"Vite + React + TS"` не обновлён под проект
- [ ] `package.json` — версия `"0.0.0"` не обновлена
- [ ] `xtrash/Zcomponents/Auth/GoogleLoginButton.tsx` — захардкожен `YOUR_GOOGLE_CLIENT_ID` (хотя файл в xtrash, но это потенциальная утечка при переносе)
- [ ] `src/app/providers/ModalStackProvider/ModalStackContext.tsx` — комментарий в шапке файла указывает на неверный путь (`ModalStackProvider.tsx`)
- [ ] `src/index.css` и `src/app/styles/global.css` — дублируют стили `body`, конфликт неизбежен
- [ ] `eslint.config.js` присутствует, но `eslint` и плагины не указаны в `devDependencies`
