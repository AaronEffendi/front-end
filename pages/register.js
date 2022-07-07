import {
	AppRegistration,
	AccountCircle,
	Lock,
	Email,
} from "@mui/icons-material";
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
	Checkbox,
	FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../components/head";
import { config } from "../constant/api_config";

export default function SignUp(props) {
	const cookies = require("cookie-cutter");
	const [checked, setChecked] = useState(true);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");
	const router = useRouter();

	// to set cookies auth to ""
	useEffect(() => {
		cookies.set("auth", "");
	}, []);

	// handler for register
	async function handleOnSubmit(e) {
		e.preventDefault();
		if (password == confirmPassword) {
			const user = { username: username, email: email, password: password };
			try {
				await axios
					.post(`${config.url}/register`, user, {
						headers: {
							"Content-Type": "application/json",
							Authorization: "Bearer ${token}",
						},
						withCredentials: true,
						auth: user,
					})
					.then((res) => {
						// setting cookies auth and redirect to home
						cookies.set("auth", res.config.headers.Authorization);
						new router.push("/", {
							pathname: "/",
						});
					});
			} catch (e) {
				if (e.code == "ERR_BAD_RESPONSE") {
					// to set message if username or email exists
					setMessage("Username or email already exists!");
				} else {
					// to set message if error
					setMessage(e.message);
				}
			}
		} else {
			// to set message if confirm password != password
			setMessage("The password confirmation does not match!");
		}
	}

	return (
		<>
			<div className="bg-signIn">
				<Header title="SIGN UP" />
				<Container>
					<div className="main">
						<Grid container spacing={3}>
							<Grid item xs={1} sm={2} md={2} lg={3} xl={4}></Grid>
							<Grid item xs={10} sm={8} md={8} lg={6} xl={4} align="center">
								<Card className="rounded-card-2">
									<CardContent className="card-style">
										<Avatar className="loginLogo">
											<AppRegistration />
										</Avatar>
										<h2 className="text-purple">Sign Up</h2>
										<p className="text-light-2">Welcome, Join Us!</p>
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
												label="Email"
												type="email"
												placeholder="Enter your email"
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<Email />
														</InputAdornment>
													),
												}}
												onChange={(e) => setEmail(e.target.value)}
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
											<TextField
												className="form-control"
												label="Confirm Password"
												placeholder="Enter your password"
												type="password"
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<Lock />
														</InputAdornment>
													),
												}}
												onChange={(e) => setConfirmPassword(e.target.value)}
												fullWidth
												required
											/>
											<FormControlLabel
												className="checkbox-form"
												control={<Checkbox name="checked" color="primary" />}
												label="I agree with the Privacy Policy"
												onChange={() => setChecked(!checked)}
											/>
											<Typography className="text-red">{message}</Typography>
											<Button
												className="button-style"
												type="submit"
												variant="contained"
												onClick={handleOnSubmit}
												disabled={checked}
												fullWidth
											>
												Sign Up
											</Button>
										</form>
										<Typography className="text-light">
											Already have account?
											<Link className="text-purple" href="/login">
												{" "}
												Sign In!
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
