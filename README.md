# Korean Modern History Starter

Starter app React + JavaScript for a learning website about modern Korean history from 1945 to the present.

## Included

- Learning mode with a data-driven interactive timeline
- Detail panel that updates from selected timeline event
- Quiz mode focused on entering historical years
- Shared dataset so both screens render from the same event source

## Structure

```text
src/
  components/
    learning/
      EraFilterBar.jsx
      EventDetailPanel.jsx
      TimelineRail.jsx
    Header.jsx
    LearningPage.jsx
    QuizPage.jsx
  data/
    timelineEvents.js
  App.jsx
  main.jsx
  styles.css
```

## Run

```bash
npm install
npm run dev
```

## How to extend

Add or edit events in `src/data/timelineEvents.js`.

Each event can control:

- timeline title
- date and year
- tags
- category and importance
- quiz prompt and accepted answer
- accent color per milestone
# history
