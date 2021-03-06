import React from "react";
import * as ReactBootstrap from "react-bootstrap";
import Forecasting from "../../assets/images/forecasting-icon.svg";
import UserFriendly from "../../assets/images/user-friendly-icon.svg";
import EasyToUse from "../../assets/images/easy-to-use-icon.svg";
import "./Styles/WhyUsStyle.css";
import "./Styles/LandingStyle.css";

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
            <img src={Forecasting} alt="Forecasting" />
            <h3>Forecasting</h3>
            <p>
              We help your business to analyze the number of items / products
              that must be purchased in the next few days.
            </p>
          </ReactBootstrap.Col>
          <ReactBootstrap.Col lg className="use user">
            <img src={UserFriendly} alt="User Friendly Design" />
            <h3>User Friendly Design</h3>
            <p>
              The UI design of our website has a modern and minimalist theme so
              it doesn&apos;t seem monotonous and looks more elegant.
            </p>
          </ReactBootstrap.Col>
          <ReactBootstrap.Col lg className="use easy">
            <img src={EasyToUse} alt="Easy To Use" />
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
