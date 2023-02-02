import { RootState } from './../redux/store';
import { useSelector } from "react-redux";
import { TypedUseSelectorHook } from "react-redux/es/types";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;