import { Login, AccountCircle, Lock } from "@mui/icons-material";
import {
	Avatar,
	Button,
	Card,
	CardContent,
	Container,
	Grid,
	InputAdornment,
	Link,
	TextField,
	Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/head";
import { config } from "../constant/api_config";

export default function SignIn(props) {
	const cookies = require("cookie-cutter");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState();
	const router = useRouter();

	// set auth cookies to ""
	useEffect(() => {
		cookies.set("auth", "");
	}, []);

	// handler login
	async function handleOnSubmit(e) {
		e.preventDefault();
		const user = { username: username, password: password };
		try {
			await axios
				.post(`${config.url}/login`, user, {
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer ${token}",
					},
					withCredentials: true,
					auth: user,
				})
				.then((res) => {
					if (res.data["1"]) {
						// setting cookies auth and redirect to home
						cookies.set("auth", res.config.headers.Authorization);
						new router.push("/", {
							pathname: "/",
						});
					} else {
						// to set message if username or password wrong
						setMessage("Invalid username or password!");
					}
				});
		} catch (e) {
			// to set message if error
			setMessage(e.message);
		}
	}

	return (
		<>
			<div className="bg-signIn">
				<Header title="SIGN IN" />
				<Container>
					<div className="main">
						<Grid container spacing={3}>
							<Grid item xs={1} sm={2} md={2} lg={3} xl={4}></Grid>
							<Grid item xs={10} sm={8} md={8} lg={6} xl={4} align="center">
								<Card className="rounded-card">
									<CardContent className="card-style">
										<Avatar className="loginLogo">
											<Login />
										</Avatar>
										<h2 className="text-purple">Sign In</h2>
										<p className="text-light-2">
											Enter your credentials to continue
										</p>
										<form>
											<TextField
												className="form-control"
												label="Username"
												placeholder="Enter your username"
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<AccountCircle />
														</InputAdornment>
													),
												}}
												onChange={(e) => setUsername(e.target.value)}
												fullWidth
												required
											/>
											<TextField
												className="form-control"
												label="Password"
												placeholder="Enter your password"
												type="password"
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<Lock />
														</InputAdornment>
													),
												}}
												onChange={(e) => setPassword(e.target.value)}
												fullWidth
												required
											/>
											<Typography className="text-red">{message}</Typography>
											<Button
												className="button-style"
												type="submit"
												variant="contained"
												onClick={handleOnSubmit}
												fullWidth
											>
												Sign In
											</Button>
										</form>
										<Typography className="text-light">
											Do you have an account?
											<Link className="text-purple" href="/register">
												{" "}
												Sign Up!
											</Link>
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</div>
				</Container>
			</div>
		</>
	);
}
