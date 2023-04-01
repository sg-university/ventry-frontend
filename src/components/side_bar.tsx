import React from "react";
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
} from "cdbreact";

import LogoImage from "@/assets/images/logo_nav.svg";
import "@/styles/components/side_bar.scss";
import Image from "next/image";
import Link from "next/link";

export default function SideBar() {
    return (
        <div className="component side-bar">
            <CDBSidebar textColor="black" backgroundColor="white" breakpoint={720} className="" maxWidth="720px"
                        minWidth="80px" toggled>
                <CDBSidebarHeader className="top" prefix={<i className="fa fa-bars fa-large"/>}>
                    <Link href="/" className="text-decoration-none" style={{color: "inherit"}}>
                        <Image src={LogoImage} alt="logo"/>
                    </Link>
                </CDBSidebarHeader>

                <CDBSidebarContent className="content">
                    <CDBSidebarMenu>
                        <Link href="/managements/items">
                            <CDBSidebarMenuItem icon="table">
                                Item Management
                            </CDBSidebarMenuItem>
                        </Link>
                        <Link href="/histories/inventory-controls">
                            <CDBSidebarMenuItem icon="history">
                                Inventory Control History
                            </CDBSidebarMenuItem>
                        </Link>
                        <Link href="/forecasts/items/stock">
                            <CDBSidebarMenuItem icon="chart-line">
                                Item Forecast
                            </CDBSidebarMenuItem>
                        </Link>
                        <Link href="/forecasts/items/transaction">
                            <CDBSidebarMenuItem icon="chart-line">
                                Product Forecast
                            </CDBSidebarMenuItem>
                        </Link>

                        <Link href="/management/account">
                            <CDBSidebarMenuItem icon="user">
                                Account
                            </CDBSidebarMenuItem>
                        </Link>
                    </CDBSidebarMenu>
                </CDBSidebarContent>

                <CDBSidebarFooter className="bottom">
                    <div className="btn-wrapper">
                        Ventry © 2021
                    </div>
                </CDBSidebarFooter>
            </CDBSidebar>
        </div>
    );
}

