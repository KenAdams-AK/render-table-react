import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult,
} from "react-beautiful-dnd";
import { enhancedReducer } from "../helpers/enhancedReducer";
import { updateForm } from "../helpers/updateForm";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { User } from "../models/users.model";
import { editUser, removeUser, setUsers } from "../redux/users/usersSlice";
import LoadingFallback from "./LoadingFallback";
import Modal from "./Modal";
import UserForm from "./UserForm";
import UserInfo from "./UserInfo";

export default function TableBody() {
	const dispatch = useAppDispatch();
	const { isLoading, users } = useAppSelector((state) => state.users);
	const [_, setUsersLS] = useLocalStorage<User[]>("users", users);
	const [currentUser, setCurrentUser] = useState<User>();
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const [editedUser, setEditedUser] = useReducer(
		enhancedReducer<User>,
		currentUser!
	);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const onClose = () => setIsOpen(false);

	useEffect(() => {
		if (users.length === 0) return;
		setUsersLS(users);
	}, [users]);

	useEffect(() => {
		if (currentUser === undefined) return;
		setEditedUser(currentUser);
	}, [currentUser]);

	const handleChange = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			if (currentUser) {
				updateForm(e, +currentUser?.id, setEditedUser);
			}
		},
		[currentUser]
	);

	function handleRowClick(e: React.MouseEvent<HTMLTableSectionElement>) {
		if (activeIndex != null) return;
		const target = e.target as HTMLTableCellElement;
		if (target.matches("button")) return;
		const userId = target.closest("tr")?.dataset.userId;
		if (userId) {
			setCurrentUser(users.find((user) => user.id === +userId));
			setIsOpen(true);
		}
	}

	function handleDragEnd(result: DropResult) {
		if (activeIndex != null) return;
		if (!result.destination) return;
		const usersCopy = [...users];
		const [reorderedItem] = usersCopy.splice(result.source.index, 1);
		const destinationIndex = result.destination?.index;
		if (destinationIndex !== undefined) {
			usersCopy.splice(destinationIndex, 0, reorderedItem);
		}
		dispatch(setUsers(usersCopy));
	}

	function handleActions(e: React.MouseEvent<HTMLTableCellElement>) {
		const target = e.target as HTMLTableCellElement;
		const userId = target.closest("tr")?.dataset.userId;

		if (userId) {
			if (target.matches("[data-btn-edit]")) {
				console.log("edit id:", +userId);
				setCurrentUser(users.find((user) => user.id === +userId));
				setActiveIndex(users.findIndex((el) => el.id === +userId));
			}
			if (target.matches("[data-btn-remove]")) {
				console.log("remove id:", +userId);
				dispatch(removeUser(+userId));
			}
			if (target.matches("[data-btn-save]")) {
				console.log("edited >>>>> ", editedUser);
				dispatch(editUser(editedUser));
				setActiveIndex(null);
			}
		}

		if (target.matches("[data-btn-cancel]")) setActiveIndex(null);
	}

	if (isLoading) return <LoadingFallback />;

	return (
		<>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId="table-rows">
					{(provided) => (
						<tbody
							className="TableBoby"
							onClick={handleRowClick}
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							{users.map((user, index) => (
								<Draggable
									key={user.id}
									draggableId={user.id.toString()}
									index={index}
								>
									{(provided) => (
										<tr
											data-user-id={user.id}
											className="TableBody__row"
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											ref={provided.innerRef}
											draggable
										>
											{activeIndex === index ? (
												editedUser && (
													<>
														<th>{editedUser.id}</th>
														<td>
															<UserForm.Name
																value={editedUser.name}
																onChange={handleChange}
															/>
														</td>
														<td>
															<UserForm.Email
																value={editedUser.email}
																onChange={handleChange}
															/>
														</td>
														<td>
															<UserForm.City
																value={editedUser.address.city}
																onChange={handleChange}
															/>
														</td>
														<td>
															<UserForm.Street
																value={editedUser.address.street}
																onChange={handleChange}
															/>
														</td>
														<td>
															<UserForm.Suite
																value={editedUser.address.suite}
																onChange={handleChange}
															/>
														</td>
														<td>
															<UserForm.CompanyName
																value={editedUser.company.name}
																onChange={handleChange}
															/>
														</td>
														<td>
															<UserForm.Zipcode
																value={editedUser.address.zipcode}
																onChange={handleChange}
															/>
														</td>
														<td data-column="buttons" onClick={handleActions}>
															<button type="button" data-btn-cancel>
																Cancel
															</button>
															<button type="button" data-btn-save>
																Save
															</button>
														</td>
													</>
												)
											) : (
												<>
													<th>{user.id}</th>
													<td>{user.name}</td>
													<td>{user.email}</td>
													<td>{user.address.city}</td>
													<td>{user.address.street}</td>
													<td>{user.address.suite}</td>
													<td>{user.company.name}</td>
													<td>{user.address.zipcode}</td>
													<td data-column="buttons" onClick={handleActions}>
														<button type="button" data-btn-edit>
															Edit
														</button>
														<button type="button" data-btn-remove>
															Remove
														</button>
													</td>
												</>
											)}
										</tr>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</tbody>
					)}
				</Droppable>
			</DragDropContext>
			{isOpen && (
				<Modal isOpen={isOpen} onClose={onClose}>
					{currentUser && <UserInfo user={currentUser} />}
				</Modal>
			)}
		</>
	);
}
