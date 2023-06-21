import * as ReactBootstrap from "react-bootstrap";
import LogoNavImage from "@/assets/images/logo_nav.svg";
import "@/styles/pages/index/navigation_bar.scss";
import Image from "next/image";

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
                <ReactBootstrap.Navbar.Brand href="#header">
                    <Image src={LogoNavImage} alt="Logo"/>
                </ReactBootstrap.Navbar.Brand>
                <ReactBootstrap.Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <ReactBootstrap.Navbar.Collapse
                    id="responsive-navbar-nav"
                    className="nav-mobile"
                >
                    <ReactBootstrap.Nav className="mr-auto hover-biru">
                        <ReactBootstrap.Nav.Link href="#header" className="kiri link">
                            Home
                        </ReactBootstrap.Nav.Link>
                        <ReactBootstrap.Nav.Link href="#about-us" className="kiri link">
                            About Us
                        </ReactBootstrap.Nav.Link>
                        <ReactBootstrap.Nav.Link href="#why-us" className="kiri link">
                            Why Us
                        </ReactBootstrap.Nav.Link>
                        <ReactBootstrap.Nav.Link href="#our-team" className="kiri link">
                            Our Team
                        </ReactBootstrap.Nav.Link>
                    </ReactBootstrap.Nav>
                    <ReactBootstrap.Nav>
                        <ReactBootstrap.Nav.Link href="/authentications/login" className="login link">
                            Login
                        </ReactBootstrap.Nav.Link>
                        <ReactBootstrap.Nav.Link href="/authentications/register" className="register">
                            Register
                        </ReactBootstrap.Nav.Link>
                    </ReactBootstrap.Nav>
                </ReactBootstrap.Navbar.Collapse>
            </ReactBootstrap.Container>
        </ReactBootstrap.Navbar>
    );
}

export default NavigationBar;
