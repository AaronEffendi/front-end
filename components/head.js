import Head from "next/head";

export default function Header(props) {
	return (
		<Head>
			<title>{props.title}</title>
			<meta name="viewport" content="initial-scale=1, width=device-width" />
			<link
				rel="stylesheet"
				href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
			/>
			<link
				rel="stylesheet"
				href="https://fonts.googleapis.com/icon?family=Material+Icons"
			/>
		</Head>
	);
}
