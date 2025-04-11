const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    const data = await response.json();
    return data;
}
const signup = async (firstName: string, lastName: string, email: string, password: string, confirmPassword: string) => {
    const response = await fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, email, password, confirmPassword })
    });
    console.log("Signup response", response);
    if (!response.ok) {
        throw new Error('Signup failed');
    }

    const data = await response.json();
    return data;
}
const getExpenses = async (email: string, token: string) => {
    if (token === null) {
        throw new Error('Token is null');
    }
    const response = await fetch('http://localhost:3001/api/expenses/view', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch expenses');
    }
    const data = await response.json();
    return data;
}

const addExpense = async (email: string, expense: object) => {
    const response = await fetch('http://localhost:3001/api/expenses/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...expense, email })
    });

    if (!response.ok) {
        throw new Error('Failed to add expense');
    }

    const data = await response.json();
    return data;
}

const deleteExpense = async (_id: number) => {
    const response = await fetch(`http://localhost:3001/api/expenses/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id })
    });

    if (!response.ok) {
        throw new Error('Failed to delete expense');
    }

    const data = await response.json();
    return data;
}

const editExpense = async (_id: number, expense: any) => {
    const response = await fetch(`http://localhost:3001/api/expenses/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id, ...expense })
    });

    if (!response.ok) {
        throw new Error('Failed to update expense');
    }

    const data = await response.json();
    return data;
}

const getExpenseTotalByCategory = async (email: string) => {
    console.log("Email in getExpenseTotalByCategory", email);
    const response = await fetch(`http://localhost:3001/api/expenses/totalByCategory`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    if (!response.ok) {
        throw new Error('Failed to update expense');
    }

    const data = await response.json();
    return data;
}

export { login, signup, getExpenses, addExpense, deleteExpense, editExpense, getExpenseTotalByCategory };