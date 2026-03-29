#!/bin/bash
# ThriveLine startup script — runs backend + frontend in parallel

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🌿 Starting ThriveLine..."
echo ""

# Backend
cd "$SCRIPT_DIR/backend"
source venv/bin/activate
echo "▶ Backend starting at http://localhost:8000"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Give backend 2s to start
sleep 2

# Frontend
cd "$SCRIPT_DIR/frontend"
echo "▶ Frontend starting at http://localhost:5173"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✓ ThriveLine running"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8000"
echo "  API docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers."

# Wait for both
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Stopped.'; exit" SIGINT SIGTERM
wait
