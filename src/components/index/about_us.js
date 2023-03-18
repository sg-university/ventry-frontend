import * as ReactBootstrap from "react-bootstrap";
import AboutImg from "@/assets/images/ventry.svg";
import "@/styles/index/about_us.scss";
import "@/styles/index/landing.scss"

function AboutUs() {
    return (
        <div className="about-us" id="about-us">
            <ReactBootstrap.Container>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col>
                        <h2>
                            About <span>Us</span>
                        </h2>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Row lg>
                    <ReactBootstrap.Col>
                        <ReactBootstrap.Image
                            src={AboutImg}
                            alt="About Ventry"
                            className="about-img"
                        />
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col lg className="about-p mt-3">
                        <p>
                            Ventry is a platform that aims to assist MSMEs in managing product
                            inventory, which is equipped with a forecasting feature based on
                            time analysis series. Ventry&apos;s features include the item and
                            product management, MSME transactions, and forecasting features.
                        </p>
                        <p>
                            The problem we want to solve with this platform is that MSMEs
                            sometimes do not know how many items must be stocked for the next
                            few days and they also take notes of the stock of items manually
                            with pen and paper, therefore Ventry is here to solve the problem.
                            This is in the form of a website that has a user-friendly
                            interface design.
                        </p>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
            </ReactBootstrap.Container>
        </div>
    );
}

export default AboutUs;
