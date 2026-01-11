import torch
from transformers import ViTImageProcessor, ViTForImageClassification
from PIL import Image
import os
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger(__name__)

class SkinDiseaseModel:
    """
    Skin Disease Classification Model using Vision Transformer (ViT)
    Model: Anwarkh1/Skin_Cancer-Image_Classification
    """
    
    # Disease class labels
    CLASS_LABELS = {
        'akiec': 'Actinic Keratoses and Intraepithelial Carcinoma',
        'bcc': 'Basal Cell Carcinoma',
        'bkl': 'Benign Keratosis-like Lesions',
        'df': 'Dermatofibroma',
        'mel': 'Melanoma',
        'nv': 'Melanocytic Nevi',
        'vasc': 'Vascular Lesions'
    }
    
    def __init__(self):
        """Initialize the model and processor"""
        self.model_name = os.getenv('MODEL_NAME', 'Anwarkh1/Skin_Cancer-Image_Classification')
        self.cache_dir = os.getenv('MODEL_CACHE_DIR', './models')
        
        # Create cache directory if it doesn't exist
        os.makedirs(self.cache_dir, exist_ok=True)
        
        # Set device
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        logger.info(f"Using device: {self.device}")
        
        # Load model and processor
        self._load_model()
    
    def _load_model(self):
        """Load the Vision Transformer model and processor"""
        try:
            logger.info(f"Loading model: {self.model_name}")
            
            # Load image processor
            self.processor = ViTImageProcessor.from_pretrained(
                self.model_name,
                cache_dir=self.cache_dir
            )
            
            # Load model
            self.model = ViTForImageClassification.from_pretrained(
                self.model_name,
                cache_dir=self.cache_dir
            )
            
            # Move model to device
            self.model.to(self.device)
            self.model.eval()
            
            # Get class names from model config
            self.id2label = self.model.config.id2label
            
            logger.info("Model loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise
    
    def preprocess_image(self, image_path):
        """
        Preprocess image for model input
        
        Args:
            image_path: Path to image file
            
        Returns:
            Preprocessed image tensor
        """
        try:
            # Open and convert image to RGB
            image = Image.open(image_path).convert('RGB')
            
            # Process image
            inputs = self.processor(images=image, return_tensors="pt")
            
            # Move to device
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            return inputs
            
        except Exception as e:
            logger.error(f"Image preprocessing failed: {str(e)}")
            raise
    
    def predict(self, image_path):
        """
        Make prediction on an image
        
        Args:
            image_path: Path to image file
            
        Returns:
            Dictionary containing prediction results
        """
        try:
            # Preprocess image
            inputs = self.preprocess_image(image_path)
            
            # Make prediction
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
            
            # Get probabilities
            probabilities = torch.nn.functional.softmax(logits, dim=-1)
            
            # Get predicted class
            predicted_class_idx = logits.argmax(-1).item()
            predicted_class = self.id2label[predicted_class_idx]
            confidence = probabilities[0][predicted_class_idx].item()
            
            # Get all predictions
            all_predictions = {}
            for idx, prob in enumerate(probabilities[0]):
                class_name = self.id2label[idx]
                all_predictions[class_name] = round(prob.item(), 4)
            
            # Sort predictions by probability
            all_predictions = dict(sorted(
                all_predictions.items(), 
                key=lambda x: x[1], 
                reverse=True
            ))
            
            return {
                'predicted_class': predicted_class,
                'confidence': round(confidence, 4),
                'all_predictions': all_predictions
            }
            
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            raise
    
    def get_class_labels(self):
        """Get all class labels"""
        return self.CLASS_LABELS
