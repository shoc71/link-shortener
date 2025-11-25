import { Link } from "react-router-dom";
import "./NavBarStyles.css";

export const NavBar = () => {
    return(
        <header className="flex">
            <Link to={'/'}>Home</Link>
            <p className="text-info">I am the header</p>
        </header>
    )
}
