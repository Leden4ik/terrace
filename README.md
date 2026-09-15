# Terrace, главная страница

Тестовое: вёрстка главной по макету из Figma, только нативный JS.
Собирается Gulp'ом: Pug для разметки, SCSS для стилей, esbuild для скриптов.

## Как запустить

Нужен Node 18+ (версия в `.nvmrc`).

```bash
npm install
npm run dev      # http://localhost:3000, перезагружается сам
npm run build    # сборка в dist/
npm run zip      # TERRACE-landing.zip из dist/
npm run deploy   # dist/ в ветку gh-pages
```

## Где что лежит

Правится всё в `src/`, в `dist/` руками не лезть, он перезаписывается.

```
src/
  tmp/                 Pug
    index.pug            страница
    layout/default.pug   каркас html
    module/              header, hero, services, footer, modal
    _config/helper.pug   миксины ico, logo, modalButton
    _config/data.pug     меню, контакты, услуги, подвал. Контент менять тут
  scss/
    config/              переменные, миксины, брейкпоинты
    main/style.scss      body, .container, .icon, логотип, заголовки
    layout/              header.scss, footer.scss
    module/              button, hero, services, form, modal
    module__base.scss    точка входа
  js/
    scripts.js           подключает модули
    modules/             header.js, slider.js, modal.js, mask.js, form.js
  icons/                 svg, собираются в спрайт
  img/                   hero и фото услуг, webp/avif делаются при сборке
  fonts/                 ttf, при сборке конвертируются в woff2
```

## Что важно знать

- Классы с префиксом `tr__`, схема `tr__блок--элемент`. Состояния `is-open`,
  `is-error`, `is-disabled`. Хуки для js начинаются с `js--`, стили на них не вешаем.
- Размеры в scss пишем в px как в макете, pxtorem переведёт в rem.
- Иконки: svg в `src/icons/`, в pug `+ico('имя')`.
- В макете два шрифта: Fira Sans Condensed (заголовки, меню, кнопки) и Jost
  (подвал, текст модалки, поля). Jost в макете не подписан, определил по глифам.
  Оба урезаны до кириллицы и латиницы через pyftsubset с сохранением фич.
  Штатный `npm run fonts:subset` на fontmin теряет кернинг и капитель, им не резать.
- Слайдер, модалка, маска телефона и валидация написаны руками, без библиотек.
  Отправки формы нет, в `form.js` заглушка с задержкой вместо fetch.
- Фото баннера и карточек из макета лежат в `src/img/`. Логотип и иконки перерисованы в svg.

## Брейкпоинты

- до 576px: телефон, карточки по одной, подвал в колонку
- до 768px: карточки по две, меню в бургере
- до 1023px: подвал в две колонки
- до 1279px: меню в бургере
- от 1024px: стрелки слайдера по бокам в поле контейнера
- от 1628px: раскладка как в макете
- от 1764px: стрелки слайдера снаружи контейнера, как в макете
