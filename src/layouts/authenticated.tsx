import SideBar from "@/components/side_bar";
import UpperBar from "@/components/upper_bar";
import "@/styles/layouts/authenticated.scss";

export default function Authenticated(props: any) {

    return (
        <div className="layout authenticated">
            <SideBar/>
            <div className="rightPage">
                <UpperBar/>
                {props.children}
            </div>
        </div>
    )
}
