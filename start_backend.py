import uvicorn
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.server import app

if __name__ == "__main__":
    print("Starting YouTube AI Assistant Backend on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
