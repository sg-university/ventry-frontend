import * as React from "react";
import { useRouter } from "next/router";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ReceiptLong from "@mui/icons-material/ReceiptLong";
import Inventory from "@mui/icons-material/Inventory";
import History from "@mui/icons-material/Restore";
import Chart from "@mui/icons-material/BarChart";
import Account from "@mui/icons-material/Person";
import Store from "@mui/icons-material/Store";
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Image from "next/image";
import Link from "next/link";
import LogoImage from "@/assets/images/logo_nav.svg";
import "@/styles/components/side_bar.scss";

const drawerWidth = 320;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }),
);

export default function SideBar() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [openCompany, setOpenCompany] = React.useState(false);
  const [openForecasting, setOpenForecasting] = React.useState(false);
  const [openHistory, setOpenHistory] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setOpenCompany(false);
    setOpenForecasting(false);
    setOpenHistory(false)
  };

  const handleCompanyClick = () => {
    setOpenCompany(!openCompany);
  };

  const handleForecastingClick = () => {
    setOpenForecasting(!openForecasting);
  };

  const handleHistroyClick = () => {
    setOpenHistory(!openHistory);
  };

  return (
    <div className="component side-bar">
      <Drawer variant="permanent" open={open}>
        <DrawerHeader className="navbar-header">
          {open &&
            <Link href="/" className="text-decoration-none" style={{color: "inherit"}}>
              <Image src={LogoImage} alt="logo"/>
            </Link>
          }
          <IconButton
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            sx={{
              px: 1,
            }}
          >
            <MenuIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List className="navbar-contain">
          {/* Point of sale */}
          <ListItem>
            <ListItemButton
              sx={{
                justifyContent: "center",
                px: open ? 2 : 4,
              }}  
            >
              <ListItemIcon>
                <ReceiptLong className={router.pathname == "/managements/pos" ? "link active" : "link"}/>
              </ListItemIcon>
              <ListItemText>
                <Link href="/managements/pos" className={router.pathname == "/managements/pos" ? "link active" : "link"}>
                  Point of Sale
                </Link>
              </ListItemText>
            </ListItemButton>
          </ListItem>
          {/* Item Management */}
          <ListItem>
            <ListItemButton
               sx={{
                justifyContent: "center",
                px: open ? 2 : 4,
              }}  
            >
              <ListItemIcon>
                <Inventory className={router.pathname == "/managements/items" ? "active" : ""}/>
              </ListItemIcon>
              <ListItemText>
                <Link href="/managements/items" className={router.pathname == "/managements/items" ? "link active" : "link"}>
                  Item Management
                </Link>
              </ListItemText>
            </ListItemButton>
          </ListItem>
          {/* History */}
          <ListItem>
            <ListItemButton
               sx={{
                justifyContent: "center",
                px: open ? 2 : 5.5,
              }}  
              onClick={handleHistroyClick}
            >
              <ListItemIcon>
                <History className={router.pathname == "/managements/history/transaction" ? "link active" : "link"}/>
              </ListItemIcon>
              <ListItemText>
              <Link href="/managements/history/transaction" className={router.pathname == "/managements/history/transaction" ? "link active" : "link"}>
                  History
                </Link>
              </ListItemText>
              {openHistory ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openHistory} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              <ListItemButton>
                <ListItemText>
                  <Link href="/managements/history/transaction" className={router.pathname == "/managements/history/transaction" ? "link active" : "link"}>
                    Item Transaction History
                  </Link>
                </ListItemText>
              </ListItemButton>
              <ListItemButton >
                <ListItemText>
                  <Link href="/managements/history/stock" className={router.pathname == "/managements/history/stock" ? "link active" : "link"}>
                    Inventory Control History
                  </Link>
                </ListItemText>
              </ListItemButton>
            </List>
          </Collapse>
          {/* Forecasting */}
          <ListItem>
            <ListItemButton
              sx={{
                justifyContent: "center",
                px: open ? 2 : 5.5,
              }}  
              onClick={handleForecastingClick}
            >
              <ListItemIcon>
                <Chart className={router.pathname == "/managements/forecasting/transaction" ? "link active" : "link"}/>
              </ListItemIcon>
              <ListItemText>
                <Link href="/managements/forecasting/transaction" className={router.pathname == "/managements/forecasting/transaction" ? "link active" : "link"}>
                  Forecasting
                </Link>
              </ListItemText>
              {openForecasting ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openForecasting} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              <ListItemButton>
                <ListItemText>
                  <Link href="/managements/forecasting/transaction" className={router.pathname == "/managements/forecasting/transaction" ? "link active" : "link"}>
                    Item Transaction
                  </Link>
                </ListItemText>
              </ListItemButton>
              <ListItemButton >
                <ListItemText>
                  <Link href="/managements/forecasting/stock" className={router.pathname == "/managements/forecasting/stock" ? "link active" : "link"}>
                    Item Stock
                  </Link>
                </ListItemText>
              </ListItemButton>
            </List>
          </Collapse>
          {/* Account Management */}
          <ListItem>
            <ListItemButton
               sx={{
                justifyContent: "center",
                px: open ? 2 : 4,
              }}  
            >
              <ListItemIcon>
                <Account className={router.pathname == "/managements/pos" ? "link active" : "link"}/>
              </ListItemIcon>
              <ListItemText>
                <Link href="/managements/account" className={router.pathname == "/managements/account" ? "link active" : "link"}>
                  Account Management
                </Link>
              </ListItemText>
            </ListItemButton>
          </ListItem>
          {/* Company Management */}
          <ListItem>
            <ListItemButton
               sx={{
                justifyContent: "center",
                px: open ? 2 : 5.5,
              }}  
              onClick={handleCompanyClick}
            >
              <ListItemIcon>
                <Store className={router.pathname == "/managements/forecasting/transaction" ? "link active" : "link"}/>
              </ListItemIcon>
              <ListItemText>
                <Link href="/managements/company" className={router.pathname == "/managements/company" ? "link active" : "link"}>
                  Company Management
                </Link>
              </ListItemText>
              {openCompany ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openCompany} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              <ListItemButton>
                <ListItemText>
                  <Link href="/managements/company" className={router.pathname == "/managements/company" ? "link active" : "link"}>
                    Company Information
                  </Link>
                </ListItemText>
              </ListItemButton>
              <ListItemButton >
                <ListItemText>
                  <Link href="/managements/company/account" className={router.pathname == "/managements/company/account" ? "link active" : "link"}>
                    Company Account
                  </Link>
                </ListItemText>
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>
    </div>
  )
}