import os
import uuid
import aiofiles
from fastapi import UploadFile
import logging

logger = logging.getLogger(__name__)

UPLOAD_DIR = "./temp_uploads"

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_upload_file(upload_file: UploadFile) -> str:
    """
    Save uploaded file to temporary directory
    
    Args:
        upload_file: FastAPI UploadFile object
        
    Returns:
        Path to saved file
    """
    try:
        # Generate unique filename
        file_extension = os.path.splitext(upload_file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file asynchronously
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await upload_file.read()
            await out_file.write(content)
        
        logger.info(f"File saved: {file_path}")
        return file_path
        
    except Exception as e:
        logger.error(f"Failed to save file: {str(e)}")
        raise

def cleanup_file(file_path: str):
    """
    Delete temporary file
    
    Args:
        file_path: Path to file to delete
    """
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"File deleted: {file_path}")
    except Exception as e:
        logger.error(f"Failed to delete file {file_path}: {str(e)}")

def format_prediction_result(result: dict) -> dict:
    """
    Format prediction result for API response
    
    Args:
        result: Raw prediction result
        
    Returns:
        Formatted result dictionary
    """
    return {
        "predicted_class": result['predicted_class'],
        "confidence": f"{result['confidence'] * 100:.2f}%",
        "all_predictions": {
            class_name: f"{prob * 100:.2f}%"
            for class_name, prob in result['all_predictions'].items()
        }
    }
