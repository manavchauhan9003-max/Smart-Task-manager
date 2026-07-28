# ⚡ Smart Task Manager

A high-performance, distraction-free task management SaaS web application built with **FastAPI**, **SQLAlchemy**, **PostgreSQL**, and a modern **Linear.app / Vercel-inspired** minimal frontend interface.

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/Authentication-JWT-black?logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 Key Features

- **🎨 Minimal SaaS Design**: Production-grade UI inspired by Linear.app, Vercel, and Raycast. Uses crisp borders, high-contrast typography (`Inter`), subtle hover elevations, and zero distracting clutter.
- **🔐 JWT Authentication**: Secure user registration, password hashing using `bcrypt`, and stateless JWT bearer token authentication.
- **📊 Real-time Dashboard Analytics**: Instant metrics overview displaying Total Tasks, Completed, In Progress, and High Priority counts.
- **⚡ Full Task Lifecycle (CRUD)**: Create, view, edit, complete, reopen, and delete tasks with instant UI updates.
- **🔍 Power-User Search & Filters**: Live title and description search, quick filter tabs (*All*, *In Progress*, *Completed*, *High Priority*), and priority dropdown selectors.
- **⌨️ Keyboard Shortcuts**: Global hotkey support (**`⌘K`** or **`/`**) to focus global workspace search instantly.
- **🔔 Toast Notifications & Modals**: Smooth modal dialogs for task creation, editing, and workspace settings—replacing native browser popups with toast notifications.
- **📱 Fully Responsive**: Desktop-first layout with responsive drawer navigation for mobile and tablet devices.

---

## 🛠️ Tech Stack

### **Backend**
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (High-performance Python ASGI web framework)
- **Database ORM**: [SQLAlchemy](https://www.sqlalchemy.org/)
- **Database Engine**: PostgreSQL
- **Security & Auth**: PyJWT (`hs256`), Passlib (`bcrypt`), HTTPBearer
- **Data Validation**: Pydantic v2

### **Frontend**
- **Core**: HTML5, Vanilla JavaScript (ES6+ Fetch API)
- **Styling**: Vanilla CSS3 (CSS Variables, Flexbox, CSS Grid, Inter typography features)
- **Icons**: Lucide SVG Icons
- **Design System**: Linear / Vercel minimal design language (No Bootstrap, No Tailwind CSS, No heavy framework dependencies)

---

## 📁 Project Architecture

```text
smart_task_manager/
│
├── app/                        # FastAPI Backend Application
│   ├── __init__.py
│   ├── database.py             # Database engine & SessionLocal setup
│   ├── main.py                 # FastAPI app, API routes & static file mounting
│   ├── models.py               # SQLAlchemy ORM database models (User, Task)
│   ├── schemas.py              # Pydantic request & response schemas
│   └── security.py             # Password hashing & JWT token creation
│
├── frontend/                   # Frontend Single Page Application
│   ├── assets/                 # Icons & static media assets
│   ├── css/
│   │   └── style.css           # Global design system & component styles
│   ├── js/
│   │   ├── api.js              # Fetch wrapper, JWT auth header & toast system
│   │   ├── dashboard.js        # Dashboard state, filters, shortcuts & DOM logic
│   │   ├── login.js            # Sign in form handling & session storage
│   │   └── register.js         # Sign up form handling
│   ├── index.html              # Entry redirect router
│   ├── login.html              # Minimalist Sign-in interface
│   ├── register.html           # Sign-up interface
│   └── dashboard.html          # Main Task Workspace & Sidebar layout
│
├── requirements.txt            # Python dependencies
├── .gitignore
└── README.md                   # Project documentation
```

---

## 📡 REST API Documentation

### **Authentication & Public Routes**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/` | Serves frontend index application | ❌ |
| `GET` | `/api/health` | API health check status endpoint | ❌ |
| `POST` | `/register` | Register new user account | ❌ |
| `POST` | `/login` | Authenticate user & return JWT Token | ❌ |

### **Task Management Routes**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/tasks` | List user tasks (supports `?priority=high`) | 🔒 Bearer JWT |
| `POST` | `/tasks` | Create a new task | 🔒 Bearer JWT |
| `GET` | `/tasks/{id}` | Get specific task details | 🔒 Bearer JWT |
| `PUT` | `/tasks/{id}` | Replace/Update task title, priority, description | 🔒 Bearer JWT |
| `PATCH` | `/tasks/{id}/complete` | Toggle task completion status | 🔒 Bearer JWT |
| `DELETE` | `/tasks/{id}` | Permanently delete a task | 🔒 Bearer JWT |

---

## 🚀 Getting Started

### **Prerequisites**
- **Python**: Version 3.10 or higher installed.
- **PostgreSQL**: Local or remote PostgreSQL instance running.

### **1. Clone & Set Up Environment**
```bash
# Clone the repository
git clone https://github.com/your-username/smart_task_manager.git
cd smart_task_manager

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows PowerShell:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### **2. Configure Database Connection**
Open `app/database.py` and set your PostgreSQL connection string:
```python
DATABASE_URL = "postgresql://<username>:<password>@localhost:5432/<dbname>"
```
*(Make sure the database specified in `DATABASE_URL` is created in your PostgreSQL instance).*

### **3. Start the Server**
Run the Uvicorn development server:
```bash
uvicorn app.main:app --reload
```

The server will start at **`http://127.0.0.1:8000`**.

### **4. Open the Web Application**
Open your browser and navigate to:
```text
http://127.0.0.1:8000/
```
FastAPI automatically serves the frontend single-page app alongside the REST API. You will be greeted by the **Sign In** screen.

---

## 💡 Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| **`⌘ K`** or **`Ctrl + K`** | Instantly focus the workspace search bar |
| **`/`** | Focus global search bar (when not typing in an input field) |
| **`Esc`** | Close open modals |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
