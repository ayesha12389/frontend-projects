# 🩺 Skin Cancer Detection System

This project is a **Skin Cancer Detection Web Application** built with a **React frontend**, **Flask backend**, and **MongoDB database**.  
It uses **deep learning (CNN model trained on the ISIC 2024 dataset)** to classify skin lesions and provide a **risk assessment**.

---

## 🚀 Features

- 🌐 **Frontend (React.js)**
  - Beautiful, responsive UI with modern components
  - Navbar, Carousel, Info Sections, Services, and Learn More Page
  - Authentication (Login/Signup) integrated
  - Displays prediction results from backend API
  - Educational **Learn More** page covering:
    - What is Skin Cancer?
    - Common Symptoms
    - Prevention Tips
    - Treatment Options
    - ISIC 2024 Dataset usage

- 🖥 **Backend (Flask)**
  - Exposes REST APIs for:
    - User authentication (JWT-based)
    - Image upload for prediction
    - ML model inference (CNN trained on ISIC dataset)
  - Risk classification:  
    - Probability > 80% → **High Risk (Malignant)**  
    - Otherwise → **Low/Medium Risk (Benign)**
  - Saves prediction history in MongoDB

- 🗄 **Database (MongoDB)**
  - Stores user data (Login/Signup)
  - Keeps prediction history
  - Links uploaded images with results

---

## 🛠️ Tech Stack

**Frontend:**  
- React.js  
- React Router  
- Bootstrap / TailwindCSS  

**Backend:**  
- Python Flask  
- Flask-RESTful / Flask-JWT-Extended  
- PyTorch (for CNN model)  
- NumPy, Pandas, Scikit-learn  

**Database:**  
- MongoDB (via PyMongo)

---
## Images



![home](https://github.com/user-attachments/assets/787c2c38-7576-4aae-bdd7-a85504fd7f85)
![guide](https://github.com/user-attachments/assets/2c8d5a0f-5141-4166-adcf-cb1cffd6538b)
![dashboard](https://github.com/user-attachments/assets/9a999f36-509c-49ef-bac2-472039e11a23)
![login](https://github.com/user-attachments/assets/052618a5-90ef-4634-9bb3-11416ff19460)
![history](https://github.com/user-attachments/assets/cc105fc9-f00c-41f3-8299-0d51109f6fa8)



---

## Video



https://github.com/user-attachments/assets/e459a7c5-1dd7-4e95-aadf-e0e1751c4e8c








