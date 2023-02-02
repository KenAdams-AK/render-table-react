import { ReactNode } from "react";
import ReactDOM from "react-dom";

type ModalPropsT = {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalPropsT) {
	if (!isOpen) return null;

	return ReactDOM.createPortal(
		<div className="Modal__overlay" onClick={onClose}>
			<div className="Modal__body" onClick={(e) => e.stopPropagation()}>
				<button type="button" onClick={onClose}>
					&times;
				</button>
				{children}
			</div>
		</div>,
		document.querySelector("#modal-root") as HTMLDivElement
	);
}
