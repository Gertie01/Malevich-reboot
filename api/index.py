from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from rudalle.pipelines import generate_images, show, decode_images
from rudalle import get_rudalle_model, get_tokenizer, get_vae
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)

device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = None
tokenizer = None
vae = None

def load_models():
    global model, tokenizer, vae
    if model is None:
        # Malevich is the XL model (1.3B)
        model = get_rudalle_model('Malevich', pretrained=True, fp16=(device == 'cuda'), device=device)
        tokenizer = get_tokenizer()
        vae = get_vae(dalle_16=True).to(device)

@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.json
    prompt = data.get("prompt", "")
    
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    load_models()
    
    try:
        # No seed control - uses default random
        images, _ = generate_images(prompt, tokenizer, model, vae, top_k=1024, top_p=0.99, nodes=1, bs=1)
        
        buffered = BytesIO()
        images[0].save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        return jsonify({"image": img_str})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)