from annoy import AnnoyIndex
from extract_features import extract_features
import os

VECTOR_SIZE = 2048

t = AnnoyIndex(VECTOR_SIZE, 'euclidean')

def load_annoy_index(annoy_tree_path='./annoySearch.ann'):
    if os.path.exists(annoy_tree_path):
        t.load(annoy_tree_path)
        return True
    return False

def get_closest_items_with_distances(image, num_neighbors=5):
    try:
        if not load_annoy_index('./annoySearch.ann'):
            return [], []
        
        image_vector = extract_features(image)
        
        closest_items = t.get_nns_by_vector(image_vector, num_neighbors, include_distances=True)
        item_indices, distances = closest_items
        
        return item_indices, distances
    
    except Exception as e:
        print(f"Error in get_closest_items_with_distances: {e}")
        return [], []

def get_closest_items(image):
    try:
        if not load_annoy_index('./annoySearch.ann'):
            return []
            
        new_image_vector = extract_features(image)    
        
        closest_items = t.get_nns_by_vector(new_image_vector, 5)
        
        return closest_items
    
    except Exception as e:
        print(f"Error in get_closest_items: {e}")
        return []

def get_item_vector(index):
    try:
        return t.get_item_vector(index)
    except Exception as e:
        print(f"Error in get_item_vector: {e}")
        return None

