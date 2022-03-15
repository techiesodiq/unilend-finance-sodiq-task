/** @format */

import {Form, Formik} from "formik";
import {useState} from "react";
import * as Yup from "yup";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";

const Login = (props) => {
	const [isConnecting, setIsConnecting] = useState(false);

	const formikInitialValues = {
		tokenContactAddress: "",
		receiverAddress: "",
		amount: "",
	};

	const formikValidationSchema = Yup.object({
		tokenContactAddress: Yup.string().required(
			"Token Contact Address can't be blank"
		),
		receiverAddress: Yup.string().required("Receiver Address can't be blank"),
		amount: Yup.number().required("Amount can't be blank"),
	});

	const detectProvider = () => {
		let provider;
		if (window.ethereum) {
			provider = window.ethereum;
		} else if (window.web3) {
			provider = window.web3.currentProvider;
		} else {
			window.alert("No Ethereum browser detected! Check out MetaMask");
		}
		return provider;
	};

	const onLoginHandler = async (values, {resetForm}) => {
		const provider = detectProvider();
		if (provider) {
			if (provider !== window.ethereum) {
				console.error(
					"Not window.ethereum provider. Do you have multiple wallet installed ?"
				);
			}
			setIsConnecting(true);
			await provider.request({
				method: "eth_requestAccounts",
			});
			setIsConnecting(false);
		}
		props.onLogin(provider);
		resetForm({values: ""});
	};

	return (
		<Card className={classes.login}>
			<Formik
				initialValues={formikInitialValues}
				validationSchema={formikValidationSchema}
				onSubmit={onLoginHandler}
			>
				{(props) => {
					return (
						<Form className={classes.form}>
							<input
								className={classes.formInput}
								name="tokenContactAddress"
								type="text"
								placeholder="Enter your token contact address"
								id="token_contact_address"
								onBlur={props.handleBlur}
								onChange={props.handleChange}
								value={props.values.tokenContactAddress}
							/>
							{props.touched.tokenContactAddress &&
							props.errors.tokenContactAddress ? (
								<p style={{color: "red", fontSize: "11px"}}>
									{props.errors.tokenContactAddress}
								</p>
							) : null}
							<input
								className={classes.formInput}
								name="receiverAddress"
								type="text"
								placeholder="Enter the receiver address"
								id="receiver_address"
								onBlur={props.handleBlur}
								onChange={props.handleChange}
								value={props.values.receiverAddress}
							/>
							{props.touched.receiverAddress && props.errors.receiverAddress ? (
								<p style={{color: "red", fontSize: "11px"}}>
									{props.errors.receiverAddress}
								</p>
							) : null}
							<input
								className={classes.formInput}
								name="amount"
								type="number"
								placeholder="Enter amount"
								id="amount"
								onBlur={props.handleBlur}
								onChange={props.handleChange}
								value={props.values.amount}
							/>
							{props.touched.amount && props.errors.amount ? (
								<p style={{color: "red", fontSize: "11px"}}>
									{props.errors.amount}
								</p>
							) : null}

							<button className={classes.button} type="submit">
								{!isConnecting && "Send"}
								{isConnecting && "Sending..."}
							</button>
						</Form>
					);
				}}
			</Formik>
		</Card>
	);
};

export default Login;
