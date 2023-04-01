import * as ReactBootstrap from "react-bootstrap";
import HeaderImg from "@/assets/images/header.svg";
import "@/styles/pages/index/header.scss";
import Image from "next/image";

function Header() {
    return (
        <div className="header" id="header">
            <ReactBootstrap.Container>
                <ReactBootstrap.Row lg>
                    <ReactBootstrap.Col className="header-title">
                        <h1>Online Inventory Software to Make Your Business Easier</h1>
                        <p>
                            We help your businesses to do management inventory easier and also
                            help you to predict the stock of your product in the next few
                            days!
                        </p>
                        <ReactBootstrap.Button variant="primary" className="button">
                            Get Started!
                        </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col lg>
                        <Image
                            src={HeaderImg}
                            alt="Header Image"
                            className="header-img"
                        />
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
            </ReactBootstrap.Container>
        </div>
    );
}

export default Header;
