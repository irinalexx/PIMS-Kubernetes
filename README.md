# 🌐 Public Issue Management System (PIMS)

A full-stack web application that enables residents to register public issues and track their resolution by relevant departments — now containerized and ready for Kubernetes deployment.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Vite
- **Backend**: Firebase Authentication & Firestore
- **Cloud Functions**: Node.js (for notifications and backend logic)
- **DevOps**: Docker, Kubernetes (Minikube), GitHub
- **Extras**: Firebase Realtime DB, SMS API integration, Firebase Hosting

---

## 🚀 Features

### 👥 Multi-role Authentication
- Resident signup/login with Firebase Authentication
- Department login (KSEB, Water, PWD, Forest, etc.)
- Admin login for complaint management

### 📝 Complaint Workflow
1. Residents raise complaints and select the concerned department.
2. Admin reviews and assigns the complaint.
3. Departments receive and resolve issues, updating status in real-time.
4. SMS notification sent to residents upon status updates.

### 📊 Admin Dashboard
- View and verify complaints
- Track status and reports
- Review feedback and department performance

### 🔒 Secure & Scalable
- Email verification and phone authentication
- Cloud Functions for secure backend logic
- Kubernetes-ready for scalable deployment

---

## 🐳 Docker Support

Build and run locally using Docker:

```bash
docker build -t pims-app .
docker run -p 3000:3000 pims-app

Deploy your application using:
kubectl apply -f pims-deployment.yaml

Folder Structure:
clean-pims/
├── src/                  # Frontend Components
├── functions/            # Firebase Cloud Functions
├── public/               # Static files
├── config/               # Firebase & Auth Configs
├── Dockerfile            # Docker Build Config
├── pims-deployment.yaml  # Kubernetes Deployment File

Made by Irin Alex
For queries, suggestions or collaborations: GitHub : irinalexx
