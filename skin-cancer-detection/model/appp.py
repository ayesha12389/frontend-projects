from flask import Flask, request, render_template_string
from tensorflow import keras
import numpy as np
from PIL import Image
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'static/uploaded'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load the model
model = keras.models.load_model('best_mode.keras')

# Image preprocessing
def preprocess_image(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize((128, 128))
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img.astype(np.float32)

# Dummy metadata (replace with actual form inputs)
def preprocess_metadata(form):
    return np.zeros((1, 71), dtype=np.float32)

# HTML templates
INDEX_HTML = '''
<!DOCTYPE html>
<html>
<head>
    <title>Skin Cancer Detection</title>
</head>
<body>
    <h1>Upload Skin Lesion Image</h1>
    <form method="post" enctype="multipart/form-data">
        <input type="file" name="image" accept="image/*" required><br><br>
        <button type="submit">Predict</button>
    </form>
</body>
</html>
'''

RESULT_HTML = '''
<!DOCTYPE html>
<html>
<head>
    <title>Prediction Result</title>
</head>
<body>
    <h2>Diagnosis: {{ diagnosis }}</h2>
    <h3>Confidence: {{ confidence }}%</h3>
    {% if thickness is not none %}
        <h3>Thickness: {{ thickness }}</h3>
    {% endif %}
    {% if anatomic_site %}
        <h3>Anatomic Site: {{ anatomic_site }}</h3>
    {% endif %}
    {% if cancer_type %}
        <h3>Cancer Type: {{ cancer_type }}</h3>
    {% endif %}
    <img src="{{ image_path }}" width="300"><br><br>
    <a href="/">Try Another Image</a>
</body>
</html>
'''

# Label mappings
ANATOMIC_LABELS = ['Head/Neck', 'Upper Limb', 'Lower Limb', 'Torso', 'Other']
CANCER_LABELS = ['Melanoma', 'BCC', 'SCC', 'Nevus', 'Other']

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files['image']
        if file:
            filename = file.filename
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            image = preprocess_image(filepath)
            metadata = preprocess_metadata(request.form)

            preds = model.predict({
                "features": metadata,
                "images": image
            })

            # Initialize default values
            diagnosis_confidence = 0.0
            thickness = None
            mitotic_idx = None
            anatomic_idx = None
            cancer_type_idx = None

            # Multi-output model
            if isinstance(preds, list) and len(preds) == 4:
                diagnosis_confidence = float(np.squeeze(preds[0]))
                thickness = float(np.squeeze(preds[1]))
                mitotic_idx = int(np.argmax(preds[2][0]))
                anatomic_idx = int(np.argmax(preds[3][0]))
                cancer_type_idx = mitotic_idx  # Example logic (adjust if needed)
            else:
                # Single-output model
                diagnosis_confidence = float(np.squeeze(preds))

            # Interpret results
            diagnosis = "Malignant" if diagnosis_confidence > 0.5 else "Benign"
            confidence = round(diagnosis_confidence * 100, 2)
            thickness = round(thickness, 2) if thickness is not None else None
            anatomic_site = ANATOMIC_LABELS[anatomic_idx] if anatomic_idx is not None else None
            cancer_type = CANCER_LABELS[cancer_type_idx] if cancer_type_idx is not None else None

            return render_template_string(RESULT_HTML,
                                          diagnosis=diagnosis,
                                          confidence=confidence,
                                          thickness=thickness,
                                          anatomic_site=anatomic_site,
                                          cancer_type=cancer_type,
                                          image_path=filepath)

    return render_template_string(INDEX_HTML)

if __name__ == '__main__':
    app.run(debug=True)
