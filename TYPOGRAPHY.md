# 🎨 Типографика приложения

## Шрифты

### Основной шрифт: **Inter**
- **Использование**: Основной текст, кнопки, интерфейс
- **Характеристики**: Современный, читаемый, нейтральный
- **Начертания**: 300, 400, 500, 600, 700, 800, 900

### Заголовки: **Poppins**
- **Использование**: Главные заголовки, логотип, акценты
- **Характеристики**: Закругленный, дружелюбный, современный
- **Начертания**: 300, 400, 500, 600, 700, 800, 900

### Подзаголовки: **Quicksand**
- **Использование**: Разделы, подзаголовки, навигация
- **Характеристики**: Легкий, воздушный, закругленный
- **Начертания**: 300, 400, 500, 600, 700

## CSS классы

### `.font-display`
```css
font-family: 'Poppins', sans-serif;
font-weight: 700;
letter-spacing: -0.03em;
```
**Использование**: Главный заголовок "Добро пожаловать!", логотип, крупные числа

### `.font-heading`
```css
font-family: 'Quicksand', sans-serif;
font-weight: 600;
letter-spacing: -0.01em;
```
**Использование**: "Быстрые действия", "Недавние задачи", "Ближайшие дедлайны"

### `.font-accent`
```css
font-family: 'Poppins', sans-serif;
font-weight: 500;
letter-spacing: 0.01em;
```
**Использование**: Названия кнопок, подписи, описания

## Иерархия заголовков

### H1 - Главный заголовок
```jsx
<h1 className="text-5xl font-display mb-4 drop-shadow-lg">
  Добро пожаловать!
</h1>
```
- **Размер**: `text-5xl` (48px)
- **Шрифт**: Poppins Bold (700)
- **Цвет**: `#c0c0c0`

### H2 - Разделы
```jsx
<h2 className="text-3xl font-heading mb-6 drop-shadow-lg">
  Быстрые действия
</h2>
```
- **Размер**: `text-3xl` (30px)
- **Шрифт**: Quicksand SemiBold (600)
- **Цвет**: `#c0c0c0`

### H3 - Подзаголовки
```jsx
<h3 className="text-2xl font-heading drop-shadow-lg">
  Недавние задачи
</h3>
```
- **Размер**: `text-2xl` (24px)
- **Шрифт**: Quicksand SemiBold (600)
- **Цвет**: `#c0c0c0`

### H4 - Элементы
```jsx
<h4 className="font-accent font-medium">
  Название задачи
</h4>
```
- **Размер**: `text-base` (16px)
- **Шрифт**: Poppins Medium (500)
- **Цвет**: `#c0c0c0`

## Цветовая схема текста

### Основные цвета
- **Заголовки**: `#c0c0c0` (светло-серый)
- **Основной текст**: `#b0b0b0` (средний серый)
- **Вторичный текст**: `#a0a0a0` (приглушенный серый)
- **Placeholder**: `#909090` (тусклый серый)
- **Неактивный**: `#808080` (темно-серый)

### Эффекты
- **Тени**: `drop-shadow-lg` для всех заголовков
- **Переходы**: `transition-colors duration-300`
- **Hover**: Изменение цвета при наведении

## Примеры использования

### Главная страница
```jsx
<div className="text-center mb-8">
  <h1 className="text-5xl font-display mb-4 drop-shadow-lg" style={{ color: '#c0c0c0' }}>
    Добро пожаловать!
  </h1>
  <p className="text-lg font-accent drop-shadow-lg" style={{ color: '#a0a0a0' }}>
    Вот обзор ваших задач и проектов
  </p>
</div>
```

### Кнопки быстрых действий
```jsx
<h3 className="font-accent text-sm mb-1 drop-shadow-lg" style={{ color: '#c0c0c0' }}>
  Добавить задачу
</h3>
<p className="text-xs font-accent opacity-80" style={{ color: '#a0a0a0' }}>
  Создать новую задачу
</p>
```

### Статистика
```jsx
<h3 className="text-3xl font-display mb-1 drop-shadow-lg" style={{ color: '#c0c0c0' }}>
  15
</h3>
<p className="text-sm font-accent" style={{ color: '#a0a0a0' }}>
  Всего задач
</p>
```

## Преимущества

✅ **Читаемость** - Inter обеспечивает отличную читаемость
✅ **Современность** - Poppins добавляет современный акцент
✅ **Дружелюбность** - Quicksand делает интерфейс более приветливым
✅ **Иерархия** - Четкое разделение уровней заголовков
✅ **Консистентность** - Единый стиль во всем приложении
✅ **Адаптивность** - Шрифты хорошо работают на всех устройствах

## Технические детали

### Загрузка шрифтов
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=Quicksand:wght@300;400;500;600;700&display=swap');
```

### Fallback шрифты
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Оптимизация
- `font-display: swap` для быстрой загрузки
- `letter-spacing` для улучшения читаемости
- `-webkit-font-smoothing: antialiased` для четкости

## 🎉 Результат

Теперь ваше приложение имеет профессиональную типографику с закругленными, современными шрифтами, которые цепляют взгляд и создают приятное впечатление!
