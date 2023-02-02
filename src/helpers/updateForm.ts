import { User } from "../models/users.model";

export function updateForm (
		e: React.FormEvent<HTMLInputElement>, userId: number, callback: (value: any) => void
	) {
		const { name, value, type } = e.target as HTMLInputElement;
		const updatePath = name.split(".");

    if(!userId) return
  
    callback((prev: User) => ({
      ...prev,
      id: userId,
    }))
    
    if (updatePath.length === 1) {
      const [key] = updatePath;
      callback({
        [key]: value,
      });
    }
    
    if (updatePath.length === 2) {
      callback({
        _path: updatePath,
        _value: value,
      });
    }

    if (type === "checkbox") {
      callback((prev: never) => ({
        [name]: !prev[name],
      }));
      return;
    }
	}