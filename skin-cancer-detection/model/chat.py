from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app)  # Allow frontend to call this from different port (e.g., 5500)

# Set your OpenAI API key
openai.api_key = 'your_openai_api_key'

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    user_message = data.get('message', '')

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # or "gpt-4" if you have access
            messages=[
                {"role": "system", "content": "You are a helpful assistant for a skin cancer detection system."},
                {"role": "user", "content": user_message}
            ]
        )

        reply = response['choices'][0]['message']['content'].strip()
        return jsonify({'reply': reply})
    except Exception as e:
        print(e)
        return jsonify({'reply': 'Sorry, something went wrong.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
