import React, {useEffect} from "react";

import Image from "next/image";
import {useDispatch, useSelector} from "react-redux";
import pageSlice, {PageState} from "@/slices/page_slice";
import Authenticated from "@/layouts/authenticated";
import ButtonPlusImage from "@/assets/images/control_button_plus.svg";
import ItemCardImage from "@/assets/images/item_management_card.svg";
import "@/styles/pages/managements/companies/account.scss"
import MessageModal from "@/components/message_modal";
import AccountViewModalComponent from "@/components/managements/companies/account_view_modal";
import AccountUpdateModalComponent from "@/components/managements/companies/account_update_modal";
import AccountInsertModalComponent from "@/components/managements/companies/account_insert_modal";
import {AuthenticationState} from "@/slices/authentication_slice";
import AccountService from "@/services/account_service";
import CompanyService from "@/services/company_service";
import Company from "@/models/entities/company";
import Content from "@/models/value_objects/contracts/content";
import Account from "@/models/entities/account";
import RoleService from "@/services/role_service";
import LocationService from "@/services/location_service";
import Role from "@/models/entities/role";

export default function CompanyAccount() {

    const dispatch = useDispatch();
    const accountService: AccountService = new AccountService();
    const companyService: CompanyService = new CompanyService();
    const roleService: RoleService = new RoleService();
    const locationService: LocationService = new LocationService();
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const pageState: PageState = useSelector((state: any) => state.page);
    const {currentModal, accounts} = pageState.companyAccountManagement;

    useEffect(() => {
        fetchCompanyAccounts()
    }, [])

    const fetchCompanyAccounts = () => {
        companyService.readAllByAccountId({
            accountId: authenticationState.entity?.id
        }).then((result) => {
            const content: Content<Company[]> = result.data;

            accountService.readAllByCompanyId({
                companyId: content.data[0].id
            }).then((response) => {
                const content: Content<Account[]> = response.data;
                dispatch(pageSlice.actions.configureCompanyAccountManagement({
                    ...pageState.companyAccountManagement,
                    accounts: content.data,
                }))
            }).catch((error) => {
                console.log(error);
            })
        })
    }

    const handleClickButtonModalInsert = () => {
        dispatch(pageSlice.actions.configureCompanyAccountManagement({
            ...pageState.companyAccountManagement,
            currentModal: "insertModal",
            isShowModal: true
        }))
    }

    const handleClickButtonDetails = (account: Account) => {
        Promise.all([
            roleService
                .readAllByAccountId({
                    accountId: account.id,
                }),
            locationService
                .readAllByAccountId({
                    accountId: account.id,
                })
        ]).then((response) => {
            const roleContent: Content<Role[]> = response[0].data;
            const locationContent: Content<Location[]> = response[1].data;
            dispatch(pageSlice.actions.configureCompanyAccountManagement({
                ...pageState.companyAccountManagement,
                currentAccount: account,
                currentRole: roleContent.data[0],
                currentLocation: locationContent.data[0],
                currentModal: "viewModal",
                isShowModal: true
            }))
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <Authenticated>
            <div className="page company-account">
                <MessageModal/>
                {currentModal == "insertModal" && <AccountInsertModalComponent/>}
                {currentModal == "viewModal" && <AccountViewModalComponent/>}
                {currentModal == "updateModal" && <AccountUpdateModalComponent/>}
                <div className="header">
                    <div className="left-section">
                        <div className="title">
                            <h1>Company Management</h1>
                        </div>
                        <div className="description">
                            <div className="text">
                                Company Account
                            </div>
                        </div>
                    </div>
                    <div className="right-section">
                        <div className="control">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => handleClickButtonModalInsert()}
                            >
                                <Image src={ButtonPlusImage} alt="plus"/>
                                Add Account
                            </button>
                        </div>
                    </div>
                </div>

                <div className="body">
                    {accounts && accounts.length <= 0 ? (
                        <div className="empty-data">
                            <div className="text">
                                Your company account is empty, try to insert one!
                            </div>
                        </div>
                    ) : null}
                    {accounts && accounts.map((value, index) => (
                        <div key={value.id} className="card">
                            <div className="image">
                                <Image
                                    src={ItemCardImage}
                                    alt="item"
                                    className="image"
                                />
                            </div>
                            <div className="content">
                                <div className="name">
                                    <div className="text">{value.name}</div>
                                </div>
                                <div className="role">
                                    <div className="text">{value.roleId}</div>
                                </div>
                            </div>
                            <div className="control">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handleClickButtonDetails(value)}
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Authenticated>
    );
}
