import React, {useEffect} from "react";
import {NavDropdown} from 'react-bootstrap';
import Image from "next/image";
import AccountImage from "@/assets/images/account.svg";

import "@/styles/components/upper_bar.scss";
import {useRouter} from "next/router";
import pageSlice, {PageState} from "@/slices/page_slice";
import {useDispatch, useSelector} from "react-redux";
import messageModalSlice, {MessageModalState} from "@/slices/message_modal_slice";
import authenticationSlice, {AuthenticationState} from "@/slices/authentication_slice";
import AccountService from "@/services/account_service";


export default function UpperBar() {
    const pageState: PageState = useSelector((state: any) => state.page);

    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);

    const router = useRouter();
    const dispatch = useDispatch();

    const getAccount = () => {
        const accountService = new AccountService();
        accountService
            .readOneById({
                id: authenticationState.entity?.id
            })
            .then((response) => {
                const content = response.data;
                dispatch(pageSlice.actions.configureAccountManagement({
                    ...pageState.accountManagement,
                    account: content.data
                }))
            })
            .catch((error) => {
                console.log(error)
                const messageModalState: MessageModalState = {
                    title: "Status",
                    content: error.message,
                    isShow: true
                }
                dispatch(messageModalSlice.actions.configure(messageModalState))
            });
    }

    useEffect(() => {
        getAccount()
    }, [])

    const handleLogout = () => {
        router.push('/')
        dispatch(pageSlice.actions.configureAccountManagement({
            ...pageState.accountManagement,
            account: undefined
        }))
        dispatch(authenticationSlice.actions.logout())
    }

    return (
        <div className="component upper-bar">
            <div className="image-wrapper">
                <Image className="image" src={AccountImage} alt="account"/>
            </div>
            <div className="dropdown-wrapper">
                <NavDropdown title={pageState.accountManagement.account?.name} id="nav-dropdown">
                    <NavDropdown.Item href="/managements/account">Account</NavDropdown.Item>
                    <NavDropdown.Divider/>
                    <NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item>
                </NavDropdown>
            </div>
        </div>
    )
}
