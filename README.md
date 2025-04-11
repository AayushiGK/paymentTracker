## RUN frontend
`npm run dev`

## RUN server
`node index.js`

## steps to install dependencies
`npm i` in both frontend and server folder

## Completed Task So far 
Project: Expense Tracker

Frontend | React
    Features:
    - User authentication (sign up, login, logout)
    - Dashboard to display total expenses, categorized expenses, and recent expenses
    - Form to add new expenses with fields for amount, category, date, and description
    - Responsive design to ensure usability on different devices

Backend | Node.js with Express
    Features:
    - RESTful APIs for user authentication, expense management (CRUD operations)
    - Middleware for authentication and authorization
    - Data validation and error handling

Database | MongoDb
    - Schemas| Users & Expenses

Additional Features:
    Security | Implement JWT (JSON Web Tokens) for secure authentication


## Remaing 
    Frontend | Filter and search functionality to view expenses by category, date range, etc.
    Testing | Write unit and integration tests for both frontend and backend
    Stretch Goals:
        WebSocket for Online Users:
        Implement a WebSocket connection to track the total number of online users in real-time.
        Display the number of online users on the dashboard.
