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
        headers = {"Authorization":"Bearer " + access_token}
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
    # Danh sách ảnh sản phẩm cần train
    api_data = get_data_from_node_server(token)
    api_data_len = len(api_data)
    
    if api_data_len == 0:
        return jsonify({
            'statusCode': 404,
            'message': 'No images available in node server',
        }),404
    
    vector_size = 2048
    t = AnnoyIndex(vector_size, 'euclidean')
    
    vectors = [] # Các vectors cần lưu vào database
    
    # Thêm vector đặc trưng vào AnnoyIndex
    for i in range(api_data_len):
        item = api_data[i]
        image_url = item['image_url']
        product_option_id = item['product_option_id']

        vector = extract_features(image_url)  # Vector đặc trưng của một hình ảnh
        t.add_item(i, vector)

        vectors.append({ 'product_option_id': product_option_id, 'vector':  vector.tolist() })
        
    t.build(20)
    t.save('./annoySearch.ann')

    # Lưu vectors vào database
    vector_features_collection.delete_many({})
    vector_features_collection.insert_many(vectors)
    
    return jsonify({
        'statusCode': 201,
        'message': 'Create annoy tree successfully',
    }), 201
