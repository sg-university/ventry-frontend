import Image from "next/image"
import * as ReactBootstrap from "react-bootstrap";
import Logo from "@/assets/images/footer.svg";
import "@/styles/pages/index/footer.scss";

function Footer() {
    return (
        <div className="footer">
            <ReactBootstrap.Container>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col>
                        <Image src={Logo} alt="Ventry Logo"/>
                        <p className="mt-4">&copy; 2023 Ventry, All Right Reserved</p>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
            </ReactBootstrap.Container>
        </div>
    );
}

export default Footer;
