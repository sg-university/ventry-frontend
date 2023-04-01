import Image from "next/image"
import * as ReactBootstrap from "react-bootstrap";
import Forecasting from "@/assets/icons/forecasting.svg";
import UserFriendly from "@/assets/icons/user_friendly.svg";
import EasyToUse from "@/assets/icons/easy_to_use.svg";
import "@/styles/pages/index/why_us.scss";

function WhyUs() {
    return (
        <div className="why-us" id="why-us">
            <ReactBootstrap.Container>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col>
                        <h2>
                            Why use <span>Us</span>?
                        </h2>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Row className="spacing">
                    <ReactBootstrap.Col lg className="use forecasting">
                        <Image src={Forecasting} alt="Forecasting"/>
                        <h3>Forecasting</h3>
                        <p>
                            We help your business to analyze the number of items / products
                            that must be purchased in the next few days.
                        </p>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col lg className="use user">
                        <Image src={UserFriendly} alt="User Friendly Design"/>
                        <h3>User Friendly Design</h3>
                        <p>
                            The UI design of our website has a modern and minimalist theme so
                            it doesn&apos;t seem monotonous and looks more elegant.
                        </p>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col lg className="use easy">
                        <Image src={EasyToUse} alt="Easy To Use"/>
                        <h3>Easy to Use</h3>
                        <p>
                            Our website is easy to use because we provide instructions on how
                            to use each feature, if this is your first time using Ventry.
                        </p>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
            </ReactBootstrap.Container>
        </div>
    );
}

export default WhyUs;
