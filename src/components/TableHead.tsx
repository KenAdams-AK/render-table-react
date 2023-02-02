import React, { useEffect } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { User } from "../models/users.model";
import { setUsers } from "../redux/users/usersSlice";

export default function TableHead() {
	const dispatch = useAppDispatch();
	const { users } = useAppSelector((state) => state.users);
	const [_, setUsersLS] = useLocalStorage<User[]>("users", users);

	useEffect(() => {
		if (users.length === 0) return;
		setUsersLS(users);
	}, [users]);

	function sortUsers(e: React.MouseEvent<HTMLTableSectionElement>) {
		const target = e.target as HTMLTableCellElement;
		if (target.matches("[data-column = buttons], [colspan]")) return;
		if (target.matches("th")) {
			const { order, column, nested } = target.dataset as {
				column: never;
				nested: string;
				order: string;
			};
			let sortedUsers: User[] = [...users];

			switch (order) {
				case "asc":
					if (nested === undefined) {
						sortedUsers.sort((a, b) => (a[column] > b[column] ? 1 : -1));
					} else {
						sortedUsers.sort((a, b) =>
							a[column][nested] > b[column][nested] ? 1 : -1
						);
					}
					target.setAttribute("data-order", "desc");
					dispatch(setUsers(sortedUsers));
					break;

				case "desc":
					if (nested === undefined) {
						sortedUsers.sort((a, b) => (a[column] < b[column] ? 1 : -1));
					} else {
						sortedUsers.sort((a, b) =>
							a[column][nested] < b[column][nested] ? 1 : -1
						);
					}
					target.setAttribute("data-order", "asc");
					dispatch(setUsers(sortedUsers));
					break;

				default:
					break;
			}
		}
	}

	return (
		<thead className="TableHead" onClick={sortUsers}>
			<tr className="TableHead__row">
				<th rowSpan={2} data-column="id" data-order="desc">
					Id
				</th>
				<th rowSpan={2} data-column="name" data-order="desc">
					User Full Name
				</th>
				<th rowSpan={2} data-column="email" data-order="desc">
					Email
				</th>
				<th colSpan={3} data-column="address">
					Address
				</th>
				<th
					rowSpan={2}
					data-column="company"
					data-nested="name"
					data-order="desc"
				>
					Company Name
				</th>
				<th
					rowSpan={2}
					data-column="address"
					data-nested="zipcode"
					data-order="desc"
				>
					Zipcode
				</th>
				<th rowSpan={2} data-column="buttons">
					Actions
				</th>
			</tr>
			<tr className="TableHead__row">
				<th data-column="address" data-nested="city" data-order="desc">
					City
				</th>
				<th data-column="address" data-nested="street" data-order="desc">
					Street
				</th>
				<th data-column="address" data-nested="suite" data-order="desc">
					Suite
				</th>
			</tr>
		</thead>
	);
}
