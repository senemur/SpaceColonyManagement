# 🚀 Space Colony Management

A space colony management game built with **ASP.NET Core, EF Core, PostgreSQL and Razor Pages**.

The goal of this project is to build a small but expandable management/strategy game while learning and practicing real-world backend development, database design, business logic, and frontend integration.

The game starts on **Mars**. The player manages a colony, its resources, buildings, colonists, technologies, events, and exploration missions.

---

## 🎮 Game Concept

The player starts with a small colony on Mars.

The initial colony has:

* 10 colonists
* Food
* Water
* Oxygen
* Energy
* Iron
* Several basic buildings

The player must:

* Manage resources
* Build and upgrade buildings
* Assign colonists to buildings
* Research new technologies
* Deal with random events
* Send exploration missions
* Expand and improve the colony

The game also supports **offline progression**.

If the player leaves the game for several hours, the colony continues progressing based on the elapsed time.

---

## 🪐 Current Game Rules

### Starting Colony

| Property          | Value |
| ----------------- | ----: |
| Planet            |  Mars |
| Population        |    10 |
| Food              |   100 |
| Water             |   100 |
| Oxygen            |   100 |
| Energy            |   100 |
| Iron              |    50 |
| Resource Capacity |   500 |

The colony name is chosen by the player.

---

## 📦 Resources

The initial resources are:

* 🍎 Food
* 💧 Water
* 🫁 Oxygen
* ⚡ Energy
* ⛏️ Iron

Basic resource calculation:

```text
New Resource =
Current Resource
+ Production
- Consumption
```

Resources cannot exceed the colony's storage capacity.

---

## 🏗️ Buildings

Initial buildings:

| Building            | Purpose                    |
| ------------------- | -------------------------- |
| ☀️ Solar Panel      | Produces Energy            |
| 🌱 Farm             | Produces Food              |
| 💧 Water Extractor  | Produces Water             |
| 🫁 Oxygen Generator | Produces Oxygen            |
| ⛏️ Iron Mine        | Produces Iron              |
| 📦 Warehouse        | Increases storage capacity |

### Production Model

The game uses a hybrid production system:

```text
Production =
Base Production
+ Worker Bonus
+ Research Bonus
+ Event Bonus
```

For example:

```text
Farm Level 1

Base Production = 8 Food/hour
Worker Bonus = 2 Food/hour per worker

2 workers:

8 + (2 × 2)
= 12 Food/hour
```

---

## 👨‍🚀 Colonists

Each colonist is an individual entity.

Initial properties:

* Name
* Age
* Health
* Happiness
* Assigned Building
* Colony

Example:

```text
Alex
Age: 32
Health: 100
Happiness: 80
Job: Farm
```

A building has a maximum worker capacity.

Colonists can be assigned or removed from buildings.

---

## 🧪 Research

Research allows the colony to become more efficient.

Initial research branches:

```text
Agriculture
Engineering
Life Support
```

Example:

```text
Improved Agriculture
        ↓
Advanced Farming
```

Researches can provide bonuses such as:

* Increased food production
* Increased water production
* Increased oxygen production
* Reduced construction cost
* Increased mining production

Only one research can be active at a time in the initial version.

---

## 🎲 Random Events

The colony can experience random events.

Examples:

* ☄️ Solar Storm
* 🌪️ Dust Storm
* 💎 Rich Iron Deposit
* 💧 Water Discovery
* 🦠 Unknown Illness
* 🌱 Perfect Growing Season

Events can have temporary or immediate effects.

Example:

```text
Solar Storm

Duration: 2 hours

Effect:
Energy production -30%
```

---

## 🚀 Exploration

Players can send exploration missions from Mars.

An exploration mission can have:

* Duration
* Resource cost
* Destination
* Result

Example:

```text
Exploration Mission

Duration: 6 hours
Cost: 100 Energy

Possible Result:
+150 Iron
+50 Water
```

Exploration will be expanded in future versions.

---

## ⏱️ Offline Progression

Offline progression is one of the core features of the game.

When the player returns to the game, elapsed time is calculated:

```text
Elapsed Time =
Current Time - Last Active Time
```

The elapsed time is then used to process:

* Resource production
* Resource consumption
* Building construction
* Research
* Events
* Exploration missions

Example:

```text
Player leaves:

23:00

Player returns:

08:00

Elapsed time:

9 hours
```

The colony processes the 9-hour period.

---

## 🖥️ Planned Screens

### Authentication

* Login
* Register

### Main Game

* Dashboard
* Buildings
* Colonists
* Research
* Exploration
* Events

The Dashboard will be the main screen of the game.

---

## 🧱 Architecture

The project will use a layered architecture.

```text
SpaceColony
│
├── src
│   ├── Core
│   ├── Entities
│   ├── Business
│   ├── DataAccess
│   └── Web
│
└── tests
    ├── Business.Tests
    └── DataAccess.Tests
```

### Dependency Direction

```text
Web
 ↓
Business
 ↓
DataAccess
 ↓
Entities
 ↓
Core
```

The goal is to keep responsibilities separated and make the project easier to maintain and test.

---

## 🛠️ Technology Stack

### Backend

* C#
* ASP.NET Core
* Entity Framework Core

### Database

* PostgreSQL
* Supabase

### Frontend

* Razor Pages
* Bootstrap
* HTML
* CSS
* JavaScript where necessary

### Testing

* Unit Tests
* Integration Tests

---

## 🗺️ Development Roadmap

### Sprint 0 — Game Design

* [x] Define game concept
* [x] Define Mars colony
* [x] Define resources
* [x] Define buildings
* [x] Define colonists
* [x] Define research
* [x] Define random events
* [x] Define exploration
* [x] Define offline progression
* [x] Define game rules
* [x] Design initial database model
* [x] Design initial screens

### Sprint 1 — Project Setup

* [ ] Create solution
* [ ] Create project layers
* [ ] Configure PostgreSQL
* [ ] Configure EF Core
* [ ] Create DbContext
* [ ] Create entities
* [ ] Configure relationships
* [ ] Create initial migration
* [ ] Create database
* [ ] Add seed data
* [ ] Configure dependency injection
* [ ] Create initial Razor Pages structure

### Sprint 2 — User & Colony

* [ ] User registration
* [ ] Login
* [ ] Colony creation
* [ ] Initial colonists
* [ ] Initial resources
* [ ] Initial buildings
* [ ] Dashboard

### Sprint 3 — Resource System

* [ ] Resource production
* [ ] Resource consumption
* [ ] Storage capacity
* [ ] Resource calculations
* [ ] Resource validation

### Sprint 4 — Offline Progression

* [ ] Last active time
* [ ] Elapsed time calculation
* [ ] Offline resource processing
* [ ] Construction progression
* [ ] Research progression
* [ ] Event progression
* [ ] Exploration progression

### Sprint 5 — Building System

* [ ] Build
* [ ] Upgrade
* [ ] Construction time
* [ ] Worker assignment
* [ ] Worker capacity
* [ ] Building production

### Sprint 6 — Colonists

* [ ] Colonist management
* [ ] Assign workers
* [ ] Health
* [ ] Happiness
* [ ] Colonist effects

### Sprint 7 — Research

* [ ] Research tree
* [ ] Research prerequisites
* [ ] Research costs
* [ ] Research duration
* [ ] Research bonuses

### Sprint 8 — Random Events

* [ ] Event generation
* [ ] Event duration
* [ ] Positive events
* [ ] Negative events
* [ ] Event history

### Sprint 9 — Exploration

* [ ] Exploration missions
* [ ] Mission duration
* [ ] Mission costs
* [ ] Mission results
* [ ] Exploration history

### Sprint 10 — Polish & Testing

* [ ] Dashboard improvements
* [ ] Validation
* [ ] Error handling
* [ ] Logging
* [ ] Unit tests
* [ ] Integration tests
* [ ] Performance improvements

---

## 📌 Project Philosophy

This project is intentionally being developed step by step.

The goal is not to build everything at once.

Each feature should be:

1. Designed
2. Implemented
3. Tested
4. Connected to the UI
5. Committed to Git
6. Documented

The project should remain understandable while gradually becoming more complex.

---

## 🚧 Current Status

**Sprint 0 — Completed**

The game rules and initial architecture have been designed.

**Next: Sprint 1 — Project Setup**

The next step is to create the .NET solution and establish the project structure.
