from extract_features import extract_features
import os
import requests
from annoy import AnnoyIndex
from flask import jsonify

node_server_url = os.getenv('NODE_SERVER_URL')

from connectdb import client
db = client['smart-tech-project']
vector_features_collection = db['vector-features']

def get_data_from_node_server(token):
    try:
        access_token = token
        headers = {"Authorization": "Bearer " + access_token}
        url = node_server_url + '/products/images'
        response = requests.get(url, headers=headers)
        response = response.json()
        
        if response["statusCode"] != 200:
            print("Error: ", response['message'])
            return []
        
        return response['data']
    except Exception as e:
        print("Error: ", e)
        return []

def create_tree_from_node_server(token):
    api_data = get_data_from_node_server(token)
    api_data_len = len(api_data)
    
    if api_data_len == 0:
        return jsonify({
            'statusCode': 404,
            'message': 'No images available in node server',
        }), 404
    
    vector_size = 2048
    t = AnnoyIndex(vector_size, 'euclidean')
    
    vectors = []

    for i, item in enumerate(api_data):
        image_url = item['image_url']
        product_option_id = item['product_option_id']
        
        vector = extract_features(image_url)
        t.add_item(i, vector)
        
        vectors.append({'product_option_id': product_option_id, 'vector': vector.tolist()})

    t.build(20)
    t.save('./annoySearch.ann')

    vector_features_collection.delete_many({})
    vector_features_collection.insert_many(vectors)

    return jsonify({
        'statusCode': 201,
        'message': 'Create annoy tree successfully',
    }), 201

def add_item_to_tree(image_url, product_option_id):
    vector_size = 2048
    file_path = os.path.abspath('./annoySearch.ann')
    
    if os.path.exists(file_path):
        t = AnnoyIndex(vector_size, 'euclidean')
        t.load(file_path)
    else:
        t = AnnoyIndex(vector_size, 'euclidean')
    
    all_vectors = list(vector_features_collection.find())
    
    t = AnnoyIndex(vector_size, 'euclidean')
    
    for i, item in enumerate(all_vectors):
        t.add_item(i, item['vector'])
    
    new_vector = extract_features(image_url)
    new_index = len(all_vectors)
    t.add_item(new_index, new_vector)
    
    t.build(20)
    t.save(file_path)
    
    new_vector_data = {
        'product_option_id': product_option_id,
        'vector': new_vector.tolist()
    }
    vector_features_collection.insert_one(new_vector_data)
