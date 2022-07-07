import {
	Add,
	Calculate,
	Category,
	Delete,
	PriceChange,
	Search,
} from "@mui/icons-material";
import {
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Checkbox,
	Modal,
	Box,
	Button,
	Paper,
	TextField,
	InputAdornment,
	Divider,
	Alert,
	Typography,
	TableFooter,
	TablePagination,
	TableSortLabel,
	TableContainer,
	Autocomplete,
	Stack,
	createFilterOptions,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/head";
import Template from "../layouts/template";
import Cookies from "cookies";
import { config } from "../constant/api_config";

// for redirect if user not login
export async function getServerSideProps({ req, res }) {
	// to get cookies from server side
	const cookies = new Cookies(req, res);
	let cookiesAuth = cookies.get("auth");
	if (cookiesAuth == "" || cookiesAuth == undefined) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}
	return {
		props: {},
	};
}

// for comparing the sorting table
function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

// for getting compare
function getComparator(order, orderBy) {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

// for getting the sort
function sortedRowInformation(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

export default function Home(props) {
	const [items, setItems] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);
	const [name, setName] = useState();
	const [quantity, setQuantity] = useState();
	const [price, setPrice] = useState();
	const [openAdd, setOpenAdd] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [selectedID, setSelectedID] = useState();
	const [messageSuccess, setMessageSuccess] = useState("");
	const [messageFailed, setMessageFailed] = useState("");
	const [message, setMessage] = useState("");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [valueToOrderBy, setValueToOrderBy] = useState("id");
	const [orderDirection, setOrderDirection] = useState("asc");
	const [searchName, setSearchName] = useState("");
	const filterOptions = createFilterOptions({
		limit: 5,
	});

	useEffect(() => {
		// to set timer message
		let message1 = setTimeout(() => {
			setMessage("");
		}, 10000);
		let message2 = setTimeout(() => {
			setMessageSuccess("");
		}, 10000);
		let message3 = setTimeout(() => {
			setMessageFailed("");
		}, 10000);

		// for getting items list from API
		try {
			axios.get(`${config.url}/items`).then((res) => setItems(res.data));
		} catch (e) {
			setMessage("Failed to get data, please reload the page!");
		}
	}, [message, messageSuccess, messageFailed]);

	// for checking all checkbox
	const handleSelectAll = () => {
		if (selectedItems.length < items.length) {
			setSelectedItems(items.map(({ id }) => id));
		} else {
			setSelectedItems([]);
		}
	};

	// for one to one checking
	const handleSelectItem = (event) => {
		const itemId = parseInt(event.target.value);

		if (!selectedItems.includes(itemId)) {
			setSelectedItems([...selectedItems, itemId]);
		} else {
			setSelectedItems(
				selectedItems.filter((selectedItemId) => {
					return selectedItemId !== itemId;
				})
			);
		}
	};

	// handler for delete many product
	const handleOnSubmitDeleteMany = async () => {
		const ids = selectedItems;
		try {
			await axios
				.post(`${config.url}/items/delete`, ids, {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then(() => {
					setMessageSuccess(`Product has been successfully deleted!`);
					setOpenDelete(false);
					setSelectedItems([]);
				});
		} catch (e) {
			setMessageFailed(`Failed to delete product some or all product`);
			setOpenDelete(false);
			setSelectedItems([]);
		}
	};

	// handler for delete product
	const handleOnSubmitDelete = async () => {
		const id = selectedID;
		const item = { name: name, quantity: quantity, price: price };
		try {
			await axios
				.delete(`${config.url}/items/${id}`, {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then(() => {
					setMessageSuccess(
						`Product ${item.name} has been successfully deleted!`
					);
					setOpenEdit(false);
					setSelectedID();
				});
		} catch (e) {
			setMessageFailed(`Failed to delete product ${item.name}`);
			setOpenEdit(false);
			setSelectedID();
		}
	};

	// handler for edit product
	const handleOnSubmitEdit = async () => {
		const id = selectedID;
		const item = { name: name, quantity: quantity, price: price };
		try {
			await axios
				.put(`${config.url}/items/${id}`, item, {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then(() => {
					setMessageSuccess(
						`Product ${item.name} has been successfully updated!`
					);
					setOpenEdit(false);
					setSelectedID();
				});
		} catch (e) {
			setMessageFailed(`Failed to update product ${item.name}`);
			setOpenEdit(false);
			setSelectedID();
		}
	};

	// handler for add product
	const handleOnSubmitAdd = async () => {
		const item = { name: name, quantity: quantity, price: price };
		try {
			await axios
				.post(`${config.url}/items/save`, item, {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then((res) => {
					setMessageSuccess(
						`Product ${item.name} has been successfully added!`
					);
					setOpenAdd(false);
				});
		} catch (e) {
			setMessageFailed(`Failed to add new product!`);
			setOpenAdd(false);
		}
	};

	const handleChangePage = (e, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (e) => {
		setRowsPerPage(parseInt(e.target.value, 10));
		setPage(0);
	};

	// handler for sort
	const handleSort = (order) => {
		let orderDir = orderDirection == "asc" ? "desc" : "asc";
		setValueToOrderBy(order);
		setOrderDirection(orderDir);
	};

	// handler for search
	const handleSearch = (value) => {
		let orderDir = orderDirection == "asc" ? "desc" : "asc";
		setValueToOrderBy(order);
		setOrderDirection(orderDir);
	};

	// to change price number to currency
	const formatter = (currency) => {
		var format = new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
		});

		return format.format(currency);
	};

	return (
		<Template>
			<Header title="HOME" />
			{message == "" ? null : <Alert severity="info">{message}</Alert>}
			{messageSuccess == "" ? null : (
				<Alert severity="success">{messageSuccess}</Alert>
			)}
			{messageFailed == "" ? null : (
				<Alert severity="error">{messageFailed}</Alert>
			)}
			<div className="table-menu">
				<Stack spacing={2} className="search-style">
					<Autocomplete
						freeSolo
						options={items.map((item) => item.name)}
						filterOptions={filterOptions}
						onInputChange={(e) => setSearchName(e.target.textContent)}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Search"
								placeholder="Search Product Name"
								InputProps={{
									...params.InputProps,
									type: "search",
									startAdornment: (
										<InputAdornment position="start">
											<Search />
										</InputAdornment>
									),
								}}
								onChange={(e) => setSearchName(e.target.value)}
							/>
						)}
					/>
				</Stack>
				<div className="btn-div">
					<Button
						className="btn-red mr-15"
						variant="contained"
						startIcon={<Delete />}
						onClick={() => {
							setOpenDelete(true);
						}}
					>
						Delete Items
					</Button>
					<Button
						variant="contained"
						color="success"
						startIcon={<Add />}
						onClick={() => {
							setOpenAdd(true);
						}}
					>
						Add Item
					</Button>
				</div>
			</div>
			<TableContainer component={Paper} className="paper-table">
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell>
								<Checkbox
									indeterminate={
										selectedItems.length < items.length &&
										selectedItems.length > 0
									}
									checked={selectedItems.length === items.length}
									onChange={handleSelectAll}
								/>
							</TableCell>
							<TableCell key="id">
								<TableSortLabel
									active={valueToOrderBy === "id"}
									direction={valueToOrderBy == "id" ? orderDirection : "asc"}
									onClick={() => handleSort("id")}
								>
									Product ID
								</TableSortLabel>
							</TableCell>
							<TableCell key="name">
								<TableSortLabel
									active={valueToOrderBy === "name"}
									direction={valueToOrderBy == "name" ? orderDirection : "asc"}
									onClick={() => handleSort("name")}
								>
									Name
								</TableSortLabel>
							</TableCell>
							<TableCell key="quantity">
								<TableSortLabel
									active={valueToOrderBy === "quantity"}
									direction={
										valueToOrderBy == "quantity" ? orderDirection : "asc"
									}
									onClick={() => handleSort("quantity")}
								>
									Quantity
								</TableSortLabel>
							</TableCell>
							<TableCell key="price">
								<TableSortLabel
									active={valueToOrderBy === "price"}
									direction={valueToOrderBy == "price" ? orderDirection : "asc"}
									onClick={() => handleSort("price")}
								>
									Price
								</TableSortLabel>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{(rowsPerPage > 0
							? searchName === ""
								? sortedRowInformation(
										items,
										getComparator(orderDirection, valueToOrderBy)
								  ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								: sortedRowInformation(
										items,
										getComparator(orderDirection, valueToOrderBy)
								  )
										.filter((item) => item.name.includes(searchName))
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							: items
						).map((item, key) => {
							return (
								<TableRow
									key={key}
									onDoubleClick={() => {
										setOpenEdit(true);
										setSelectedID(item.id);
									}}
								>
									<TableCell>
										<Checkbox
											value={item.id}
											checked={selectedItems.includes(item.id)}
											onChange={handleSelectItem}
										/>
									</TableCell>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.quantity}</TableCell>
									<TableCell>{formatter(item.price)}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[5, 10, 25]}
								count={items.length}
								rowsPerPage={rowsPerPage}
								page={page}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</TableRow>
					</TableFooter>
				</Table>
			</TableContainer>
			<Modal open={openDelete} onClose={() => setOpenDelete(false)}>
				<Box className="box-style">
					<Paper elevation={10} className="paper-mini">
						<h3 className="paper-title">Delete Product</h3>
						<Divider orientation="horizontal" className="divider-paper" />
						<form className="form-modal">
							<h4>Are you sure you want to delete all this items?</h4>
							<Button
								className="button-form btn-red"
								type="button"
								name="deleteAll"
								variant="contained"
								onClick={handleOnSubmitDeleteMany}
							>
								Delete
							</Button>
						</form>
					</Paper>
				</Box>
			</Modal>
			<Modal open={openAdd} onClose={() => setOpenAdd(false)}>
				<Box className="box-style">
					<Paper elevation={10} className="paper">
						<h3 className="paper-title">Add New Product Stock</h3>
						<Divider orientation="horizontal" className="divider-paper" />
						<form className="form-modal">
							<TextField
								className="form-control"
								label="Name"
								placeholder="Enter item name"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Category />
										</InputAdornment>
									),
								}}
								onChange={(e) => setName(e.target.value)}
								fullWidth
								required
							/>
							<TextField
								className="form-control"
								label="Quantity"
								type="number"
								placeholder="Enter item quantity"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Calculate />
										</InputAdornment>
									),
								}}
								onChange={(e) => setQuantity(e.target.value)}
								fullWidth
								required
							/>
							<TextField
								className="form-control"
								label="Price"
								type="number"
								placeholder="Enter item price"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<PriceChange />
										</InputAdornment>
									),
								}}
								onChange={(e) => setPrice(e.target.value)}
								fullWidth
								required
							/>
							<Button
								className="button-form btn-green"
								type="button"
								name="edit"
								variant="contained"
								onClick={handleOnSubmitAdd}
							>
								Add
							</Button>
						</form>
					</Paper>
				</Box>
			</Modal>
			<Modal
				open={openEdit}
				onClose={() => {
					setOpenEdit(false);
					setSelectedID();
				}}
			>
				<Box className="box-style">
					<Paper elevation={10} className="paper">
						<h3 className="paper-title">
							Edit Data Product {items.find((e) => e.id == selectedID)?.name}
						</h3>
						<Divider orientation="horizontal" className="divider-paper" />
						<form className="form-modal">
							<TextField
								className="form-control"
								label="Name"
								defaultValue={items.find((e) => e.id == selectedID)?.name}
								placeholder="Enter item name"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Category />
										</InputAdornment>
									),
								}}
								onChange={(e) => setName(e.target.value)}
								fullWidth
								required
							/>
							<TextField
								className="form-control"
								label="Quantity"
								type="number"
								defaultValue={items.find((e) => e.id == selectedID)?.quantity}
								placeholder="Enter item quantity"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Calculate />
										</InputAdornment>
									),
								}}
								onChange={(e) => setQuantity(e.target.value)}
								fullWidth
								required
							/>
							<TextField
								className="form-control"
								label="Price"
								type="number"
								defaultValue={items.find((e) => e.id == selectedID)?.price}
								placeholder="Enter item price"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<PriceChange />
										</InputAdornment>
									),
								}}
								onChange={(e) => setPrice(e.target.value)}
								fullWidth
								required
							/>
							<div className="edit-modal">
								<Button
									className="button-form btn-blue"
									type="button"
									name="edit"
									variant="contained"
									onClick={handleOnSubmitEdit}
								>
									Edit
								</Button>

								<Button
									className="button-form btn-red"
									type="button"
									name="delete"
									variant="contained"
									onClick={handleOnSubmitDelete}
								>
									Delete
								</Button>
							</div>
						</form>
					</Paper>
				</Box>
			</Modal>
		</Template>
	);
}
