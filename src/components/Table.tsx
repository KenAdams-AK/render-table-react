import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { fetchUsers, setUsers } from "../redux/users/usersSlice";
import Modal from "./Modal";
import TableBody from "./TableBody";
import TableHead from "./TableHead";
import UserForm from "./UserForm";

export default function Table() {
	const { error, users } = useAppSelector((state) => state.users);
	const dispatch = useAppDispatch();
	const [usersLS, setUsersLS] = useLocalStorage("users", users);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const onClose = () => setIsOpen(false);

	useEffect(() => {
		if (users.length > 0) return;
		if (usersLS.length > 0) {
			console.log("users from LS >>>>>>", usersLS);
			dispatch(setUsers(usersLS));
			return;
		}
		console.log("fetch users >>>>>>");
		dispatch(fetchUsers());
	}, []);

	useEffect(() => {
		if (users.length === 0 || usersLS.length > 0) return;
		setUsersLS(users);
	}, [users]);

	function handleClick(e: React.MouseEvent<HTMLDivElement>) {
		e.stopPropagation();
		const target = e.target as HTMLDivElement;
		if (target.matches("[data-btn-clear-ls]")) {
			console.log("clear LS >>>>");
			setUsersLS([]);
		}
		if (target.matches("[data-btn-add-user]")) {
			setIsOpen(true);
		}
	}

	return (
		<>
			<h1 className="Table__title title">Users' Table</h1>
			<div className="Table__buttons" onClick={handleClick}>
				<button type="button" data-btn-add-user>
					Add new user
				</button>
				<button type="button" data-btn-clear-ls>
					Clear Local Storage
				</button>
			</div>
			{error && <div className="Table__error error">Error: {error}.</div>}
			<table className="Table__table">
				<colgroup className="TableHead__colgroup">
					<col className="colgroup__column-id" />
					<col className="colgroup__column-name" />
					<col className="colgroup__column-email" />
					<col className="colgroup__column-city" />
					<col className="colgroup__column-street" />
					<col className="colgroup__column-suit" />
					<col className="colgroup__column-company" />
					<col className="colgroup__column-zipcode" />
					<col className="colgroup__column-buttons" />
				</colgroup>
				<TableHead />
				<TableBody />
			</table>
			{isOpen && (
				<Modal isOpen={isOpen} onClose={onClose}>
					<UserForm />
				</Modal>
			)}
		</>
	);
}
