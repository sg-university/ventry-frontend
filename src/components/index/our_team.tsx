import Image from "next/image"
import * as ReactBootstrap from "react-bootstrap";
import Kharisma from "@/assets/images/kharisma.png";
import Mario from "@/assets/images/mario.png";
import Kevin from "@/assets/images/kevin.png";
import "@/styles/pages/index/our_team.scss";

function OurTeam() {
    return (
        <div className="our-team" id="our-team">
            <ReactBootstrap.Container>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col>
                        <h2>
                            Our <span>Team</span>
                        </h2>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Row className="member">
                    <ReactBootstrap.Col md>
                        <Image src={Kharisma} alt="Muhammad Kharisma Azhari"/>
                        <h3>Muhammad {`\n`} Kharisma Azhari</h3>
                        <p>2301925564</p>
                        <span>Computer Science</span>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col md>
                        <Image src={Mario} alt="Mario Christanto"/>
                        <h3>Mario Christanto</h3>
                        <p>2301926945</p>
                        <span>Computer Science</span>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col md>
                        <Image src={Kevin} alt="Kevin Siek Widjanarko"/>
                        <h3>Kevin Siek Widjanarko</h3>
                        <p>2301880414</p>
                        <span>Computer Science</span>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
            </ReactBootstrap.Container>
        </div>
    );
}

export default OurTeam;
