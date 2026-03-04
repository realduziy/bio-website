#!/bin/bash
echo "🛑 Stopping website..."

# Kill screen session
screen -S website -X quit 2>/dev/null

# Kill anything on port 8000
fuser -k 8000/tcp 2>/dev/null 2>/dev/null

# Double check
pkill -f "python.*app.py" 2>/dev/null

echo "✅ Website stopped!"