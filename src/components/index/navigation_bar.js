import * as ReactBootstrap from "react-bootstrap";
import LogoNavImage from "@/assets/images/logo_nav.svg";
import "@/styles/index/navigation_bar.scss";
import "@/styles/index/landing.scss";

function NavigationBar() {
    return (
        <ReactBootstrap.Navbar
            collapseOnSelect
            expand="lg"
            bg=""
            className="navbar mt-3"
            variant="light"
            sticky="top"
        >
            <ReactBootstrap.Container>
                <ReactBootstrap.Navbar.Brand href="#">
                    <ReactBootstrap.Image src={LogoNavImage} alt="Logo"/>
                </ReactBootstrap.Navbar.Brand>
                <ReactBootstrap.Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <ReactBootstrap.Navbar.Collapse
                    id="responsive-navbar-nav"
                    className="nav-mobile"
                >
                    <ReactBootstrap.Nav className="mr-auto hover-biru">
                        <ReactBootstrap.Nav.Link href="#" classsName="kiri link">
                            Home
                        </ReactBootstrap.Nav.Link>
                        <ReactBootstrap.Nav.Link href="#about-us" classsName="kiri link">
                            About Us
                        </ReactBootstrap.Nav.Link>
                        <ReactBootstrap.Nav.Link href="#why-us" classsName="kiri link">
                            Why Us
                        </ReactBootstrap.Nav.Link>
                        <ReactBootstrap.Nav.Link href="#our-team" classsName="kiri link">
                            Our Team
                        </ReactBootstrap.Nav.Link>
                    </ReactBootstrap.Nav>
                    <ReactBootstrap.Nav>
                        <ReactBootstrap.Nav.Link href="/auth/login" className="login link">
                            Login
                        </ReactBootstrap.Nav.Link>
                        <ReactBootstrap.Nav.Link href="/auth/register" className="register">
                            Register
                        </ReactBootstrap.Nav.Link>
                    </ReactBootstrap.Nav>
                </ReactBootstrap.Navbar.Collapse>
            </ReactBootstrap.Container>
        </ReactBootstrap.Navbar>
    );
}

export default NavigationBar;
