import { signup } from '../../utilities/api';
import { emailValidator } from '../../utilities/utilities';
import './Signup.scss';

const Signup = () => {


    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        const firstName = (document.getElementById("firstName") as HTMLInputElement).value;
        const lastName = (document.getElementById("lastName") as HTMLInputElement).value;
        const email = (document.getElementById("email") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;
        const confirmPassword = (document.getElementById("confirm-password") as HTMLInputElement).value;
        if (firstName === "" || lastName === "" || email === "" || password === "" || confirmPassword === "") {
            alert("Please fill in all fields");
            return;
        }
        if (!emailValidator(email)) {
            alert("Please enter a valid email address");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        console.log("Signup data", { name, email, password, confirmPassword });
        signup(firstName, lastName, email, password, confirmPassword).then((res) => {
            window.location.href = "/login";
        }).catch((err) => {
            console.error(err);
            alert("Signup failed. Please check your credentials.");
        });

    }

    return (
        <div className="signup-container">
            <form className="signup-form">
                <h2>Sign Up</h2>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" placeholder="Enter your first name" required />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" id="lastName" placeholder="Enter your last name" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Enter your email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Enter your password" required />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input type="password" id="confirm-password" placeholder="Confirm your password" required />
                </div>
                <button type="submit" onClick={handleSignup} className="signup-button">Sign Up</button>
                <p className="login-link">
                    Already have an account? <a href="/login">Go back to Login</a>
                </p>
            </form>
        </div>
    );
};

export default Signup;
