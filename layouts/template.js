import {
	ShoppingCart,
	Home,
	Logout,
	Menu as IconMenu,
} from "@mui/icons-material";
import {
	Container,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Stack,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Box,
	Drawer,
} from "@mui/material";
import { useState } from "react";

function Template(props) {
	const [openMenu, setOpenMenu] = useState(false);
	return (
		<>
			<AppBar className="appbar-style" position="sticky">
				<Toolbar disableGutters>
					<IconButton
						className="menu-icon-button"
						onClick={() => setOpenMenu(!openMenu)}
					>
						<IconMenu />
					</IconButton>
					<Drawer
						className="menu-pop"
						anchor="left"
						open={openMenu}
						onClose={() => setOpenMenu(false)}
					>
						<Box
							className="vh-50"
							role="presentation"
							onClick={() => setOpenMenu(false)}
							onKeyDown={() => setOpenMenu(false)}
						>
							<List>
								<ListItem className="center" href="/" key="logo">
									<IconButton className="side-menu" href="/">
										<ShoppingCart />
										<Typography variant="h6" component="div">
											STOCKAPP
										</Typography>
									</IconButton>
								</ListItem>
								<Divider />
								<ListItem key="Home">
									<ListItemButton href="/">
										<ListItemIcon>
											<Home />
										</ListItemIcon>
										<ListItemText primary="Home" />
									</ListItemButton>
								</ListItem>
							</List>
						</Box>
					</Drawer>
					<IconButton
						className="ml-15 menu-logo"
						href="/"
						size="large"
						edge="start"
						color="inherit"
						aria-label="color"
					>
						<ShoppingCart />
						<Typography variant="h6" component="div">
							STOCKAPP
						</Typography>
					</IconButton>
					<Stack
						className="ml-15 sb"
						direction="row"
						spacing={2}
						divider={
							<Divider
								className="navbar-divider"
								orientation="vertical"
								flexItem
							/>
						}
						justifyContent="flex-start"
					>
						<IconButton
							href="/"
							size="large"
							edge="start"
							color="inherit"
							aria-label="color"
						>
							<Typography variant="h6" component="div" className="icon-label">
								Home
							</Typography>
						</IconButton>
						<IconButton
							href="/login"
							size="large"
							edge="end"
							color="inherit"
							aria-label="color"
						>
							<Logout className="mr-15" />
						</IconButton>
					</Stack>
				</Toolbar>
			</AppBar>
			<Container>
				<main className="main-template">{props.children}</main>
			</Container>
		</>
	);
}

export default Template;
