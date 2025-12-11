# Matematika pro 4. třídu - Design Document

## Overview

Czech elementary math learning website for a 9-year-old 4th grader, focusing on explaining concepts and practicing arithmetic with immediate feedback.

**Primary goals:**
- Address careless mistakes through practice with immediate feedback
- Fill conceptual gaps through animated explanations
- Build confidence through progressive difficulty and positive reinforcement

## Core Features

### Two Learning Modes

1. **Učení (Learning)** - Animated explanations + interactive walkthrough
2. **Procvičování (Practice)** - Exercises with immediate feedback

### Topics at Launch

| Topic | Czech Name | Key Concepts |
|-------|------------|--------------|
| Addition | Sčítání | Carrying (přenos desítky) |
| Subtraction | Odčítání | Borrowing (půjčování) |
| Multiplication | Násobení | Column multiplication, single-digit multiplier |
| Division | Dělení | Division algorithm, remainders |
| Rounding | Zaokrouhlování | Rounding to tens, hundreds, thousands |

### Notation Support

Both notation styles supported throughout:

**Inline notation (řádkový zápis):**
```
1234 + 434 = ____
```

**Column notation (písemné počítání):**
```
  1234
+  434
------
  ____
```

## Learning Mode ("Učení")

### Structure per Topic

1. **Animated explanation**
   - Visual demonstration of the concept
   - Numbers in columns with animated carrying/borrowing
   - Czech text narration explaining each step
   - Example: "Nemůžeme odečíst 7 od 2, proto si půjčíme desítku..."

2. **Interactive walkthrough**
   - Problem appears, student fills in each step
   - Immediate feedback per step ("Správně!" or "Zkus to znovu")
   - Can't proceed until current step is correct
   - 3-5 guided problems per lesson

### Animation Concepts by Topic

| Topic | Animation Focus |
|-------|----------------|
| Sčítání | Carry digit floating up to next column |
| Odčítání | Borrowing - ten moves and becomes 10 ones |
| Násobení | Step-by-step column multiplication |
| Dělení | Division algorithm steps |
| Zaokrouhlování | Number line, highlight rounding digit, rules (0-4 dolů, 5-9 nahoru) |

## Practice Mode ("Procvičování")

### Exercise Flow

1. Select topic
2. Select difficulty (or auto-adjust):
   - **Úroveň 1:** 2-digit numbers, no carrying/borrowing
   - **Úroveň 2:** 3-digit numbers, with carrying/borrowing
   - **Úroveň 3:** 4-digit numbers, multiple carries
3. Problems appear one at a time
4. Enter answer → immediate feedback

### Feedback System

**Correct answer:**
- Green checkmark
- Encouraging message ("Výborně!", "Správně!")
- Progress toward badge updates
- Next problem loads

**Wrong answer:**
- Orange/red highlight on answer
- Hint message highlighting the error type:
  - "Zkontroluj si desítky - nezapomněla jsi na přenos?"
  - "Zkus si znovu projít půjčování"
- "Zkusit znovu" button (try again)
- Hidden "Ukaž řešení" button → expands step-by-step walkthrough
- After viewing solution, similar problem appears (same concept, different numbers)

### Problem Generation

- Randomly generated based on difficulty level
- Tracks error patterns (e.g., forgetting to carry)
- Gradually increases difficulty on success

## Badges & Motivation

### Badge System (Odznaky)

| Badge | Czech Name | Condition |
|-------|------------|-----------|
| First Steps | První kroky | Complete first exercise |
| Addition Master | Sčítací mistr | 20 addition problems correct |
| Subtraction Master | Odčítací mistr | 20 subtraction problems correct |
| Multiplier | Násobitel | 20 multiplication problems correct |
| Divider | Dělitel | 20 division problems correct |
| Rounder | Zaokrouhlovač | 20 rounding problems correct |
| Flawless | Bez chybičky | 10 problems in a row without error |
| Weekly Streak | Týdenní série | Practice 7 days in a row |
| Century | Stovka | 100 total problems solved |

### Motivation Principles

- Progress bar toward next badge visible during practice
- Celebration animation when badge earned
- Badge collection visible on profile
- No punishment for wrong answers
- Focus on improvement: "Už jsi vyřešila 5 příkladů správně v řadě! Ještě 5 do odznaku!"

## User Management

### Family Setup

- Profile selection screen (no passwords)
- Roles: Parent, Child
- Click avatar/name to enter as that user

### Parent Dashboard

1. **Přehled aktivity (Activity overview)**
   - Days practiced this week (calendar view)
   - Total time spent
   - Problems attempted vs. solved correctly

2. **Výsledky podle tématu (Results by topic)**
   - Visual progress bars per topic
   - Percentage correct
   - Warning indicator for topics under 60%

3. **Časté chyby (Common errors)**
   - Pattern recognition: "Zapomíná na přenos při sčítání"
   - Helps parent know what to review together

4. **Poslední aktivita (Recent activity)**
   - List of recent sessions with results

## Technical Architecture

### Tech Stack

- **Frontend:** React (with Framer Motion for animations)
- **Backend:** FastAPI + SQLite
- **Deployment:** Docker container(s) on Dokploy

### Project Structure

```
elementary-math/
├── frontend/           # React app
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/      # Učení, Procvičování, Dashboard
│   │   ├── animations/ # Framer Motion animations
│   │   └── utils/      # Problem generation logic
│   └── Dockerfile
├── backend/            # FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py   # SQLAlchemy models
│   │   ├── routers/    # API endpoints
│   │   └── database.py
│   └── Dockerfile
├── docker-compose.yml
└── data/               # SQLite database volume
```

### Database Schema

**users**
- id (PK)
- name
- role (parent/child)
- created_at

**exercises**
- id (PK)
- user_id (FK)
- topic
- difficulty
- problem (JSON - the problem details)
- answer
- correct (boolean)
- error_type (nullable - for tracking patterns)
- created_at

**badges**
- id (PK)
- user_id (FK)
- badge_type
- earned_at

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | List family members |
| POST | /users | Create new user |
| POST | /exercises | Save exercise result |
| GET | /stats/{user_id} | Get progress stats for dashboard |
| GET | /badges/{user_id} | Get earned badges |
| POST | /badges | Award new badge |

## UI/UX Design

### Visual Style

- Clean, child-friendly but not childish
- Large, readable fonts
- Soft colors - blue/green primary
- Orange for errors (avoid harsh red)
- Plenty of whitespace

### Main Screens

1. **Home / Profile select** - Family member avatars, click to enter
2. **Child home** - Topic cards with Učení/Procvičování buttons, badge progress
3. **Učení** - Animation area, narration, interactive inputs
4. **Procvičování** - Problem display, input fields, progress indicator
5. **Parent dashboard** - Charts, topic breakdown, error patterns

### Responsive Design

- Desktop-first but mobile/tablet friendly
- Touch-friendly buttons for tablet use
