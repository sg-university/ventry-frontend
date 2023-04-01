import Image from "next/image"
import * as ReactBootstrap from "react-bootstrap";
import CloudTopLeft from "@/assets/images/cloud_top_left.svg";
import CloudBottomRight from "@/assets/images/cloud_bottom_right.svg";
import "@/styles/pages/index/interested.scss";


function Interested() {
    return (
        <div className="interested">
            <ReactBootstrap.Container>
                <ReactBootstrap.Row className="awan-kiri">
                    <Image src={CloudTopLeft} alt="Awan Kiri Atas"/>
                </ReactBootstrap.Row>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col className="our-product">
                        <h1>Interested to Use Our product?</h1>
                        <p>Try Ventry for free by click the button in the below </p>
                        <ReactBootstrap.Button className="button" variant="light">
                            Get Started!
                        </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Row className="awan-kanan">
                    <Image src={CloudBottomRight} alt="Awan Kanan Bawah"/>
                </ReactBootstrap.Row>
            </ReactBootstrap.Container>
        </div>
    );
}

export default Interested;
