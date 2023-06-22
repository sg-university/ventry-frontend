import React, {useEffect} from "react";

import Image from "next/image";
import {useDispatch, useSelector} from "react-redux";
import pageSlice, {PageState} from "@/slices/page_slice";
import Authenticated from "@/layouts/authenticated";
import ButtonPlusImage from "@/assets/images/control_button_plus.svg";
import ItemCardImage from "@/assets/images/profile-account.svg";
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
import Location from "@/models/entities/location";

export default function CompanyAccount() {
    const accountService: AccountService = new AccountService();
    const companyService: CompanyService = new CompanyService();
    const roleService: RoleService = new RoleService();
    const locationService: LocationService = new LocationService();
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const {currentAccount} = authenticationState;
    const pageState: PageState = useSelector((state: any) => state.page);
    const {currentModal, companyAccounts, roles} = pageState.companyAccountManagement;
    const accounts = companyAccounts!.map(acc => ({role: roles!.find(role => role?.id === acc?.roleId), ...acc}))
    const dispatch = useDispatch();

    const fetchCompanyAccountsAndCurrentCompany = () => {
        companyService.readAllByAccountId({
            accountId: currentAccount?.id
        }).then((result) => {
            const companyContent: Content<Company[]> = result.data;

            Promise.all([
                roleService
                    .readAll(),
                accountService
                    .readAllByCompanyId({
                        companyId: companyContent.data[0].id
                    })
            ]).then((response) => {
                const roles: Content<Role[]> = response[0].data;
                const accountContent: Content<Account[]> = response[1].data;
                dispatch(pageSlice.actions.configureCompanyAccountManagement({
                    ...pageState.companyAccountManagement,
                    currentCompany: companyContent.data[0],
                    companyAccounts: accountContent.data.sort((a, b) => {
                        return new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
                    }),
                    roles: roles.data
                }))
            }).catch((error) => {
                console.log(error);
            })
        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        fetchCompanyAccountsAndCurrentCompany()
    }, [])

    const handleInsertModal = () => {
        dispatch(pageSlice.actions.configureCompanyAccountManagement({
            ...pageState.companyAccountManagement,
            currentModal: "insertModal",
            isShowModal: true
        }))
    }

    const handleViewModal = (account: Account) => {
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
            const role: Content<Role[]> = response[0].data;
            const location: Content<Location[]> = response[1].data;
            dispatch(pageSlice.actions.configureCompanyAccountManagement({
                ...pageState.companyAccountManagement,
                currentAccount: account,
                currentRole: role.data[0],
                currentLocation: location.data[0],
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
                                onClick={() => handleInsertModal()}
                            >
                                <Image src={ButtonPlusImage} alt="plus"/>
                                Insert
                            </button>
                        </div>
                    </div>
                </div>

                <div className="body">
                    {(accounts!)?.length <= 0 ? (
                        <div className="empty-data">
                            <div className="text">
                                Your company account is empty, try to insert one!
                            </div>
                        </div>
                    ) : null}
                    {accounts?.map((value, index) => (
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
                                    <div className="text">{value?.role?.name}</div>
                                </div>
                            </div>
                            <div className="control">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handleViewModal(value)}
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
