import produce from 'immer'
import { set, has } from 'lodash'
import { User } from '../models/users.model';

export const initialState: User = {
	id: "",
	name: "",
	username: "",
	email: "",
	address: {
		city: "",
		street: "",
		suite: "",
		zipcode: "",
	},
	phone: "",
	website: "",
	company: {
		name: "",
	},
};

export function enhancedReducer<T>(state: T, updateArg: any): T {
  if (updateArg.constructor === Function) {
    return {
      ...state,
      ...updateArg(state)
   }
  }
  
  if (updateArg.constructor === Object) {
    if (has(updateArg, '_path') && has(updateArg, '_value')) {
      const { _path, _value } = updateArg
      
      return produce(state, draft => {
        set(draft as {}, _path, _value)
      })
    } else {
      return {
        ...state,
        ...updateArg
      }
    }
  }

  return state;
}