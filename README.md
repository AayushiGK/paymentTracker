
## steps to install dependencies
`npm i` in both the frontend and server folders

## RUN frontend + Test cases
`npm run dev`
`npm test`

## RUN server + Test cases
`node index.js`
`npx jest`

## Completed Task So far 
Project: Expense Tracker

Frontend | React
    Features:
    - User authentication (sign up, login, logout)
    - Dashboard to display total expenses, categorised expenses, and recent expenses
    - Form to add new expenses with fields for amount, category, date, and description
    - Filter and search functionality to view expenses by category, date range, etc.
    - Responsive design to ensure usability on different devices

Backend | Node.js with Express
    Features:
    - RESTful APIs for user authentication, expense management (CRUD operations)
    - Middleware for authentication and authorisation
    - Data validation and error handling

Database | MongoDb
    - Schemas| Users & Expenses

Additional Features:
    Security | Implement JWT (JSON Web Tokens) for secure authentication
    Testing | Write unit tests for both the frontend and backend

## Remaing 
    Stretch Goals: WebSocket for Online Users
    (Just an Idea on how to make it work)
        Node
        - Install websocket `npm install ws` and make use of it in the app (Node)
        - We can count the online use as a counter functionality 
            wss.on('connection', (ws) => { onlineUser++: ...........})
            wss.on('close', (ws) => { onlineUser--: ...........})

        frontend
        - Set up the websocket connection `const socketConnect = new websocket('serverLink')`
        - Create a state and update it with the useEffect to display it on the UI using the state.
    
