import React, {
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useRef,
} from "react";
import { enhancedReducer, initialState } from "../helpers/enhancedReducer";
import { updateForm } from "../helpers/updateForm";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { User } from "../models/users.model";
import { addUser } from "../redux/users/usersSlice";

type UserFormPropsT = {
	user?: User;
};

type UserInputPropsT = {
	value: string;
	onChange: (e: React.FormEvent<HTMLInputElement>) => void;
};

export default function UserForm({ user }: UserFormPropsT) {
	const dispatch = useAppDispatch();
	const { users } = useAppSelector((state) => state.users);
	const [_, setUsersLS] = useLocalStorage("users", users);
	const [newUser, updateNewUser] = useReducer(
		enhancedReducer<User>,
		initialState
	);

	console.log(newUser);

	useEffect(() => {
		if (users.length === 0) return;
		setUsersLS(users);
	}, [users]);

	const nextId = useMemo(() => {
		const sortedUsers = [...users].sort((a, b) => +a.id - +b.id);
		const lastId = +sortedUsers[users.length - 1].id;

		return lastId + 1;
	}, [users]);

	const handleChange = useCallback(
		(e: React.FormEvent<HTMLInputElement>) =>
			updateForm(e, nextId, updateNewUser),
		[]
	);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.stopPropagation();
		dispatch(addUser(newUser));
	}

	return (
		<form className="UserForm__form" onSubmit={handleSubmit}>
			<fieldset className="UserForm__fieldset">
				<legend className="UserForm__legend">User' info:</legend>
				<label htmlFor="id">Id:</label>
				<input disabled type="text" value={nextId} name="id" />
				<UserForm.Name value={newUser.name} onChange={handleChange} />
				<UserForm.Email value={newUser.email} onChange={handleChange} />
				<UserForm.City value={newUser.address.city} onChange={handleChange} />
				<UserForm.Street
					value={newUser.address.street}
					onChange={handleChange}
				/>
				<UserForm.Suite value={newUser.address.suite} onChange={handleChange} />
				<UserForm.CompanyName
					value={newUser.company.name}
					onChange={handleChange}
				/>
				<UserForm.Zipcode
					value={newUser.address.zipcode}
					onChange={handleChange}
				/>
				<button type="submit" data-btn-save>
					Save
				</button>
			</fieldset>
		</form>
	);
}

UserForm.Name = function ({ value, onChange }: UserInputPropsT) {
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => inputRef.current?.focus(), []);

	return (
		<>
			<label htmlFor="name">Name:</label>
			<input
				ref={inputRef}
				onChange={onChange}
				required
				type="text"
				value={value}
				name="name"
			/>
		</>
	);
};

UserForm.Email = function ({ value, onChange }: UserInputPropsT) {
	return (
		<>
			<label htmlFor="email">Email:</label>
			<input
				onChange={onChange}
				required
				type="text"
				value={value}
				name="email"
			/>
		</>
	);
};

UserForm.City = function ({ value, onChange }: UserInputPropsT) {
	return (
		<>
			<label htmlFor="address.city">City:</label>
			<input
				onChange={onChange}
				required
				type="text"
				value={value}
				name="address.city"
			/>
		</>
	);
};

UserForm.Street = function ({ value, onChange }: UserInputPropsT) {
	return (
		<>
			<label htmlFor="address.street">Street:</label>
			<input
				onChange={onChange}
				required
				type="text"
				value={value}
				name="address.street"
			/>
		</>
	);
};

UserForm.Suite = function ({ value, onChange }: UserInputPropsT) {
	return (
		<>
			<label htmlFor="address.suite">Suite:</label>
			<input
				onChange={onChange}
				required
				type="text"
				value={value}
				name="address.suite"
			/>
		</>
	);
};

UserForm.CompanyName = function ({ value, onChange }: UserInputPropsT) {
	return (
		<>
			<label htmlFor="company.name">Company Name:</label>
			<input
				onChange={onChange}
				required
				type="text"
				value={value}
				name="company.name"
			/>
		</>
	);
};

UserForm.Zipcode = function ({ value, onChange }: UserInputPropsT) {
	return (
		<>
			<label htmlFor="address.zipcode">Zipcode:</label>
			<input
				onChange={onChange}
				required
				type="text"
				value={value}
				name="address.zipcode"
			/>
		</>
	);
};
