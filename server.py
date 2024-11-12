import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
import os
import requests
from flask_cors import CORS
import jwt

from dotenv import load_dotenv
load_dotenv()

from annoy_search import get_closest_items, get_closest_items_with_distances, get_item_vector
from create_tree import vector_features_collection, create_tree_from_node_server, add_item_to_tree

allowed_origins = os.getenv('ALLOWED_ORIGINS')
access_token_secret = os.getenv('ACCESS_TOKEN_SECRET')
node_server_url = os.getenv('NODE_SERVER_URL')

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": allowed_origins}},
    methods=['GET', 'POST', 'PUT', 'PATCH','DELETE'])

def unique(list):
    unique_list = pd.Series(list).drop_duplicates().tolist()
    return unique_list

@app.route('/api/v1/products/closest', methods=['POST'])
def getClosest():
    try:
        distance_threshold = 30
        
        if 'image' not in request.files:
            return jsonify({
                "message": "Missing image file",
                "statusCode": 403
            }), 403
    
        image = request.files['image']
        if image.filename == '':
            return jsonify({
                "message": "Image file not found",
                "statusCode": 404
            }), 404
        
        if image:
            closest_items, distances = get_closest_items_with_distances(image)
            
            if len(closest_items) == 0:
                return jsonify({
                    'statusCode': 404,
                    'message': 'Annoy tree does not exist',
                }), 404
            
            results = []
            for index, distance in zip(closest_items, distances):
                if distance > distance_threshold:
                    continue
                
                vector = get_item_vector(index)
                
                product = vector_features_collection.find_one(
                    {"vector": vector},
                    {'product_option_id': 1, '_id': 0}
                )
                
                if product:
                    product_option_id = product.get('product_option_id')
                    results.append(product_option_id)
            
            if not results:
                return jsonify({
                'statusCode': 200,
                'message': 'No related products found for the given image',
                'data': []
            }), 200
            
            unique_product_option_ids = list(set(results))

            url = node_server_url + '/products/get-by-array'
            products = {'product_option_ids': unique_product_option_ids}

            response = requests.post(url, json=products)
            response_data = response.json()
            
            return jsonify({
                'statusCode': response_data.get('statusCode', 200),
                'message': response_data.get('message', 'Success'),
                'data': response_data.get('data', [])
            }), response_data.get('statusCode', 200)

    except Exception as e:
        return jsonify({
            "message": str(e),
            "statusCode": 500
        }), 500
        
@app.route('/api/v1/products/create-tree', methods=['POST'])
def create_annoy_tree():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({
                'statusCode': 401,
                'message': 'Token is missing!',
            }),401
    else:
        token = token.split(' ')[1]
        
    try:
        data = jwt.decode(token, access_token_secret, algorithms=['HS256'])
        
        if data.get('role') != 'ADMIN':
            return jsonify({
                'statusCode': 403,
                'message': 'Permission denied',
            }),403
        
        return create_tree_from_node_server(token)
    except jwt.ExpiredSignatureError:
        return jsonify({
            'statusCode': 401,
            'message': 'Token has expired',
        }),401
    except jwt.InvalidTokenError:
        return jsonify({
            'statusCode': 401,
            'message': 'Invalid token',
        }),401
        
@app.route('/api/v1/products/create-vector', methods=['POST'])
def create_vector():
    if 'image_url' not in request.json:
        return jsonify({
            "message": "Missing image url",
            "statusCode": 403
        }), 403
    
    if 'product_option_id' not in request.json:
        return jsonify({
            "message": "Missing product option id",
            "statusCode": 403
        }), 403
    
    data = request.json
    
    image_url = data['image_url']
    product_option_id = data['product_option_id']
    
    return add_item_to_tree(image_url, product_option_id)

@app.route('/', methods=['GET'])
def hello():
    return jsonify({
        'statusCode': 200,
        'message': 'Hello World',
    }),200

# Chạy server
if __name__ == '__main__':
    app.run(port= 3002, debug=True)
