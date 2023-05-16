import React, {useEffect} from "react";
import {NavDropdown} from 'react-bootstrap';
import Image from "next/image";
import AccountImage from "@/assets/images/account.svg";

import "@/styles/components/upper_bar.scss";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import authenticationSlice, {AuthenticationState} from "@/slices/authentication_slice";


export default function UpperBar() {
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const {currentAccount} = authenticationState;
    const router = useRouter();
    const dispatch = useDispatch();


    useEffect(() => {
    }, [])

    const handleLogout = () => {
        router.push('/')
        dispatch(authenticationSlice.actions.logout())
    }

    return (
        <div className="component upper-bar">
            <div className="image-wrapper">
                <Image className="image" src={AccountImage} alt="account"/>
            </div>
            <div className="dropdown-wrapper">
                <NavDropdown title={currentAccount?.name} id="nav-dropdown">
                    <NavDropdown.Item href="/managements/account">Account</NavDropdown.Item>
                    <NavDropdown.Divider/>
                    <NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item>
                </NavDropdown>
            </div>
        </div>
    )
}
