import { User } from "../models/users.model";

type UserInfoPropsT = {
	user: User;
};

export default function UserInfo({ user }: UserInfoPropsT) {
	return (
		<div className="UserInfo">
			<h2 className="UserInfo__title">{user.username}</h2>
			<h3 className="UserInfo__subtitle">{user.name}</h3>
			<ul>
				<span>id: {user.id}</span>
				<li>{user.phone}</li>
				<li>{user.email}</li>
				<li>{user.website}</li>
				<hr />
			</ul>
			<ul>
				<span>Address:</span>
				<li>{user.address.city}</li>
				<li>{user.address.geo?.lat}</li>
				<li>{user.address.geo?.lng}</li>
				<li>{user.address.street}</li>
				<li>{user.address.suite}</li>
				<li>{user.address.zipcode}</li>
				<hr />
			</ul>
			<ul>
				<span>Company:</span>
				<li>{user.company.name}</li>
				<li>{user.company.bs}</li>
				<li>{user.company.catchPhrase}</li>
				<hr />
			</ul>
		</div>
	);
}
