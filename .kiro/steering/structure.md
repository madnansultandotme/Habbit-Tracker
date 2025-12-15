# Project Structure

```
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/         # Route handlers by domain
│   │   │   │   ├── habits.py   # Habit CRUD endpoints
│   │   │   │   └── status.py   # Health/status endpoints
│   │   │   └── router.py       # Main API router aggregator
│   │   ├── core/
│   │   │   ├── config.py       # Pydantic Settings configuration
│   │   │   └── database.py     # MongoDB connection manager
│   │   ├── models/             # Pydantic schemas
│   │   │   ├── habit.py        # Habit models
│   │   │   └── status.py       # Status models
│   │   └── main.py             # FastAPI app factory
│   ├── tests/                  # Pytest test suite
│   ├── server.py               # Legacy entry point (imports app.main)
│   ├── requirements.txt        # Python dependencies
│   ├── pyproject.toml          # Tool configuration (black, isort, mypy)
│   └── .env                    # Backend environment config
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui primitives (do not edit directly)
│   │   │   └── *.js        # App-specific components
│   │   ├── contexts/       # React Context providers
│   │   │   ├── HabitsContext.js   # Habit state management
│   │   │   └── ThemeContext.js    # Theme state (light/dark)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions (cn helper)
│   │   ├── pages/          # Page components
│   │   ├── App.js          # Root component with providers
│   │   ├── index.js        # Entry point
│   │   └── index.css       # Global styles + Tailwind
│   │
│   ├── plugins/            # CRACO plugins
│   │   ├── health-check/   # Dev server health endpoints
│   │   └── visual-edits/   # Babel metadata plugin
│   │
│   ├── craco.config.js     # CRA config overrides
│   ├── tailwind.config.js  # Tailwind theme config
│   ├── components.json     # shadcn/ui configuration
│   └── package.json
```

## Conventions

- Components use named exports alongside default export
- Context providers follow pattern: `createContext` + `useX` hook + `XProvider`
- UI components in `components/ui/` are shadcn/ui generated - add new ones via CLI, avoid manual edits
- Page components live in `pages/` and compose feature components
- State management via React Context (no Redux)
- Styling via Tailwind utility classes; theme colors use CSS variables
