import SideBar from "@/components/side_bar";
import UpperBar from "@/components/upper_bar";
import "@/styles/layouts/authenticated.scss";
import {AuthenticationState} from "@/slices/authentication_slice";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import {useRouter} from "next/router";

export default function Authenticated(props: any) {

    const router = useRouter();

    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);

    const {currentAccount} = authenticationState;

    useEffect(() => {
        if (!currentAccount) {
            router.push("/authentications/login")
        }
    }, [])

    return (
        <>
            {currentAccount &&
                <div className="layout authenticated">
                    <SideBar/>
                    <div className="rightPage">
                        <UpperBar/>
                        {props.children}
                    </div>
                </div>
            }
        </>
    )
}
