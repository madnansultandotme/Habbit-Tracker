# Tech Stack

## Frontend

- React 19 with JavaScript (not TypeScript)
- Create React App with CRACO for configuration overrides
- Tailwind CSS 3 for styling with CSS variables for theming
- shadcn/ui components (New York style, JSX not TSX)
- Radix UI primitives for accessible components
- React Router DOM for routing
- date-fns for date manipulation
- Lucide React for icons
- Sonner for toast notifications
- Zod + React Hook Form for form validation

## Backend

- Python FastAPI
- MongoDB with Motor (async driver)
- Pydantic for data validation
- CORS middleware enabled

## Common Commands

```bash
# Frontend
cd frontend
yarn install          # Install dependencies
yarn start            # Start dev server (uses CRACO)
yarn build            # Production build
yarn test             # Run tests

# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```

## Path Aliases

Frontend uses `@/` alias for `src/` directory (configured in jsconfig.json and craco.config.js).

```javascript
import { Button } from '@/components/ui/button';
```

## Environment Variables

- Frontend: `frontend/.env`
- Backend: `backend/.env` (MONGO_URL, DB_NAME, CORS_ORIGINS)
