import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import List

router = APIRouter(prefix="/uploads", tags=["uploads"])

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("")
async def upload_files(files: List[UploadFile] = File(...)):
    uploaded_filenames = []
    for file in files:
        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        try:
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)
            uploaded_filenames.append(unique_filename)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error subiendo archivo: {str(e)}")
            
    return {"filenames": uploaded_filenames}
