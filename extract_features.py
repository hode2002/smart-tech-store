import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.preprocessing import image
import numpy as np
import requests
from PIL import Image
from io import BytesIO

# Tải mô hình ResNet50 đã pre-trained
model = ResNet50(weights='imagenet', include_top=False, pooling='avg')

def extract_features(img_input):
    """Trích xuất đặc trưng của hình ảnh từ mô hình ResNet50"""
    try:
        # Kiểm tra xem img_input có phải là một tệp tải lên từ client (FileStorage) hay không
        if hasattr(img_input, 'filename') and img_input.filename != '':
            img = Image.open(img_input.stream)  # Đọc tệp từ client upload
        else:
            # Tải hình ảnh từ URL
            response = requests.get(img_input)
            img = Image.open(BytesIO(response.content))
        
        # Đảm bảo hình ảnh ở dạng RGB
        img = img.convert('RGB')
        
        # Resize hình ảnh về kích thước (224, 224) như yêu cầu của ResNet50
        img = img.resize((224, 224))
        
        # Chuyển đổi hình ảnh thành mảng numpy
        img_array = image.img_to_array(img)
        
        # Thêm chiều batch cho mô hình dự đoán (batch_size, height, width, channels)
        img_array = np.expand_dims(img_array, axis=0)
        
        # Chuẩn hóa hình ảnh (theo yêu cầu của ResNet50)
        img_array = preprocess_input(img_array)
        
        # Trích xuất đặc trưng bằng cách sử dụng mô hình ResNet50
        features = model.predict(img_array)

        # Trả về vector đặc trưng đầu tiên
        return features[0]
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return None
