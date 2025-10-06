#!/bin/bash

echo "🚀 Starting Classroom Dashboard..."
echo "📍 Server running at: http://localhost:8000"
echo "🔗 Open: http://localhost:8000/login.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 -m http.server 8000
