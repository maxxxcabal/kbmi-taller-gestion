import sys
import traceback
import os

print(f"Python: {sys.version}")
print(f"CWD: {os.getcwd()}")
print(f"PYTHONPATH: {sys.path}")

try:
    print("Intentando importar app.main...")
    from app.main import app
    print("✅ SUCCESS: app.main importado.")
except Exception:
    print("❌ ERROR en la importación:")
    traceback.print_exc()
