# Smart Brain App

<p>
<img src="assets/Smart brain React app.png" alt="Smart Brain App Cover design" width=800px />
</p>

Face recognition app built with Authentication, User Ranking, REST API and SQL transactions for user data
and hashed passwords

---

## Table of content

- [Smart Brain App](#smart-brain-app)
  - [Table of content](#table-of-content)
  - [Demo](#demo)
  - [Screenshots](#screenshots)
    - [Home Page](#home-page)
    - [User Registeration Page](#user-registeration-page)
    - [User Login Page](#user-login-page)
  - [Technologies](#technologies)
  - [What's unique in this Project](#whats-unique-in-this-project)
  - [Contributors](#contributors)
  - [Deployment](#deployment)
  - [Summary of New Changes Made](#summary-of-new-changes-made)

---

## Demo

<p>
  <img src="./assets/Smart brain React app demo-min.gif" alt="Smart Brain App Demo" width=800px />
</p>

---

## Screenshots

### Home Page

<p>
<img src="assets/Smart Brain App Home Page.PNG" alt="Smart Brain App Home Page" width=800px />
</p>

### User Registeration Page

<p>
<img src="assets/Smart Brain App Register Page.PNG" alt="Smart Brain App Register Page" width=800px />
</p>

### User Login Page

<p>
<img src="assets/Smart Brain App Sign In Page.PNG" alt="Smart Brain App Sign In Page" width=800px />
</p>


---

## Technologies

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
&nbsp;
![Express JS](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
&nbsp;
![React JS](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
&nbsp;
![Node JS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
&nbsp;
![Heroku](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)
&nbsp;

---

## What's unique in this Project

- An Image Recognition app which makes an API request to face recognition machine learning model
- The App has built-in Authentication which takes care of the user login credentials securely through hashing
- User Ranking is provided each time the Smart Brain Web App service is triggered for facial detection of images
- The web app employs custom REST API on the backend with SQL transactions for user data and hashed passwords

---

## Contributors

- T Aswin Barath <https://github.com/AswinBarath>

---

## Deployment

- Vercel Deployment (New Link): [https://smart-brain-907r3fisi-aswinbaraths-projects.vercel.app/](https://smart-brain-907r3fisi-aswinbaraths-projects.vercel.app/)
- Github pages README (Docs): [https://aswinbarath.github.io/Smart-brain-app/]((https://aswinbarath.github.io/Smart-brain-app/)
- Old Link (Heroku introduced $5/month pricing plan - no free plan): [https://smart-brain-26.herokuapp.com/](https://smart-brain-26.herokuapp.com/)


---

## Summary of New Changes Made
API Endpoints Updated: All API calls now use the new Vercel-hosted API (https://smart-brain-api-one.vercel.app).
Centralized API Config: Added src/config.js to manage API URLs in one place.
Error Handling & Loading States: Added user feedback for loading and error states in Signin, Register, and image processing.
UI Feedback: The UI now disables buttons and shows messages during loading/error states.
Proxy Added: Added a proxy field in package.json for local development convenience.

---

**[⬆ Back to Top](#Smart-Brain-App)**
