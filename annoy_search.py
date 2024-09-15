from annoy import AnnoyIndex
from extract_features import extract_features
import os

vector_size = 2048

# Khởi tạo AnnoyIndex với số chiều của vector và phương pháp tính khoảng cách (Euclidean distance = 'euclidean')
t = AnnoyIndex(vector_size, 'euclidean')

def get_closest_items(image):
    try:
        annoy_tree_path = './annoySearch.ann'
        if os.path.exists(annoy_tree_path):
            t.load(annoy_tree_path)
        else:
            return []
            
        # Vector đặc trưng mới từ hình ảnh cần tìm kiếm
        new_image_vector = extract_features(image)    
        
        # Tìm 5 vector gần nhất trong AnnoyIndex
        closest_items = get_nns_by_vector(new_image_vector, 5)
        
        return closest_items
    except:
        return []
        

def get_item_vector(index):
    vector = t.get_item_vector(index)
    return vector

def get_nns_by_vector(vector, n):
    closest_items = t.get_nns_by_vector(vector, n)
    return closest_items
