## ⚙️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API URL

Open `config.js` and set your mockapi base URL:

```js
export const API_BASE_URL = 'https://6a114c4c3e35d0f37ee3232d.mockapi.io/api/v1';
```

### 3. Run the App

```bash
npx expo start
```

Then scan the QR code using the **Expo Go** app on your phone.

### 4. Login Credentials
Email:    admin@library.com
Password: 123456

---
#  Library Manager

A React Native (Expo) mobile application for managing your personal book collection. Users can track books they are reading, have finished, or want to read.

---
## Introduction
 
This project involves developing a mobile application called **Library Manager** using React Native with Expo. The main goal of creating this app was to improve my understanding of mobile app development, including UI design, navigation, state management, and backend API integration.
 
The app helps users manage their personal book collection by allowing them to add, view, edit, and delete books. It is designed to be simple, user-friendly, and responsive, with a clean structure that can be easily improved in the future.

## Objective of the Project
 
The objectives of this project are:
 
- To understand the basic structure of a React Native application
- To develop a mobile app using React Native with Expo
- To implement full CRUD operations (Create, Read, Update, Delete)
- To implement navigation between multiple screens
- To manage and display data using a RESTful API (mockapi.io)
- To use Zustand for global state management across screens
- To persist user session data using AsyncStorage
- To design a clean and user-friendly interface with vector icons
- To handle errors and loading states gracefully
 

##  Main Entities

### Book (Primary Entity)
| Field | Type | Description |
|-------|------|-------------|
| id | String | Auto-generated unique ID |
| title | String | Title of the book |
| author | String | Author of the book |
| categoryId | String | Reference to category |
| status | String | reading / finished / want-to-read |
| description | String | Short description of the book |
| createdAt | Date | Date the record was created |

### Category (Secondary Entity)
| Field | Type | Description |
|-------|------|-------------|
| id | String | Auto-generated unique ID |
| name | String | Category name (e.g. Fiction, Science) |

---

##  State Management

**Library:** Zustand

Zustand was chosen for its simplicity and minimal boilerplate compared to Redux. It provides a clean API for managing global state without the need for Context providers or reducers. The store manages:
- List of books
- List of categories
- Authenticated user and token
- Selected filter (persisted via AsyncStorage)

**Why Zustand?**
- It is simple and easy to understand compared to Redux
- No need for complex providers or reducers
- Works perfectly for small to medium sized apps
- Easy to integrate with AsyncStorage for persistence


---

## 🔧 Backend Details

**Service:** mockapi.io (free mock REST API)

**Base URL:** `https://6a114c4c3e35d0f37ee3232d.mockapi.io/api/v1`

### Endpoints

| Method | URL | Purpose |
|--------|-----|---------|
| GET | /books | Fetch all books |
| GET | /books/:id | Fetch a single book |
| POST | /books | Create a new book |
| PUT | /books/:id | Update an existing book |
| DELETE | /books/:id | Delete a book |
| GET | /categories | Fetch all categories |

---
##  Navigation Flow
 
- **Login Screen** → User logs in with email and password
- **Book List Screen** → Shows all books with search and filter
- **Book Detail Screen** → Shows full details of a selected book
- **Create Book Screen** → Form to add a new book
- **Edit Book Screen** → Pre-filled form to update a book
Navigation is implemented using **React Navigation Stack Navigator** with smooth screen transitions.
 
## Project Structure
 
```
LibraryManager/
│
├── api/                      All code that talks to the backend
│   ├── axiosClient.js        Sets up HTTP connection with interceptors
│   ├── booksApi.js           Book CRUD API calls
│   └── categoriesApi.js      Category API calls
│
├── hooks/                    Reusable custom hooks
│   ├── useFetchBooks.js      Fetches books and categories on load
│   ├── useForm.js            Manages form state and validation
│   └── useAuth.js            Handles authentication logic
│
├── screens/                  All screens of the app
│   ├── LoginScreen.jsx       Login page
│   ├── BookListScreen.jsx    Shows all books
│   ├── BookDetailScreen.jsx  Shows one book in detail
│   ├── CreateBookScreen.jsx  Form to add a new book
│   └── EditBookScreen.jsx    Form to edit an existing book
│
├── store/                    Global state management
│   └── useBookStore.js       Zustand store for books, categories, user
│
├── config.js                 API base URL
├── App.js                    Root navigation setup
└── README.md                 This file
```
 
---
##  Dependencies

| Package | Purpose |
|---------|---------|
| expo | React Native framework |
| @react-navigation/native | Navigation container |
| @react-navigation/stack | Stack navigator |
| zustand | Global state management |
| axios | HTTP client for API calls |
| @react-native-async-storage/async-storage | Persisting auth token and filter |
| @expo/vector-icons | Vector icons (Ionicons) |

---

## Features

- 🔐 Token-based dummy authentication with AsyncStorage persistence
- 📋 List view of all books with search and filter by status
- 📖 Detail view for individual books
- ➕ Create new books with client-side validation
- ✏️ Edit existing books with pre-filled form
- 🗑️ Delete books with confirmation dialog
- 📂 Category selection for books
- 🔄 Loading indicators and retry mechanism
- 📭 Empty state when no books found
- ⚠️ User-friendly error messages

---
## Screenshots
 
| Login Screen | Book List Screen | Add Book Screen | Mockapi.io |
|-------------|-----------------|-----------------|----------------|
| ![alt text](<images /image.png>) | ![alt text](<images /image copy 2.png>) | ![alt text](<images /image copy.png>) |![alt text](<images /Screenshot 2026-05-24 at 12.19.11 PM.png>)| 
 
 
---

##  Known Limitations

- Authentication is dummy/local only (no real auth backend)
- mockapi.io free tier has rate limits
- No image upload support for book covers
- App tested on Android via Expo Go

---

## 13. Challenges Faced
 
During the development of this project, a few challenges were encountered:
 
- Understanding how to set up and connect to a mock REST API using mockapi.io
- Managing global state across multiple screens using Zustand
- Handling type mismatches between string and number IDs from the API
- Implementing form validation with real-time error feedback
- Persisting authentication state using AsyncStorage on app restart
These challenges were overcome through debugging, reading documentation, and testing different approaches, which helped improve overall understanding of React Native development.
 
## Conclusion
 
This project demonstrates a complete mobile CRUD application with a clean UI, proper navigation, global state management using Zustand, and full backend integration using a RESTful API. It helped build practical skills in React Native, API integration, and mobile app architecture that will be useful in future software engineering projects.
 

##  Author

- **Name:** lhundup Dorji
- **Module:** SWE201 
- **Assignment:** Assignment 3 — Single Domain CRUD App