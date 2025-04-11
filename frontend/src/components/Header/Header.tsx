import './Header.scss';
import { useNavigate } from 'react-router-dom';
import { BsPower } from "react-icons/bs";

interface HeaderProps {
    userName: string;
}

const Header = ({ userName }: HeaderProps) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('email');
        navigate('/login');
    };



    return (
        <header className="header-container">
            <img
                src="http://bloomenergy.com/wp-content/uploads/bloom_logo-full.svg"
                alt="Logo"
                className="header-logo"
            />
            <div className="header-user-section">
                <span className="header-username">{userName}</span>
                <BsPower onClick={handleLogout} />
            </div>
        </header>
    );
};

export default Header;
