import "./SettingsModal.css";
import { forwardRef } from "react";
import { useRef } from "react";

export interface Settings {
	rows: number;
	cols: number;
	mines: number;
}

interface SettingsModalProps {
	onApplySettings: (settings: Settings) => void;
	onCancel: (settings: Settings) => void;
	defaults: Settings;
}

const SettingsModal = forwardRef(function SettingsModal(
	{ onApplySettings, onCancel, defaults }: SettingsModalProps,
	dialogRef: React.ForwardedRef<HTMLDialogElement>
) {
	const settings: Settings = { ...defaults };
	const rowsInputRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
	const colsInputRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
	const minesInputRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

	function resetToDefaults() {
		if (rowsInputRef.current) {
			rowsInputRef.current.value = String(settings.rows);
		}
		if (colsInputRef.current) {
			colsInputRef.current.value = String(settings.cols);
		}
		if (minesInputRef.current) {
			minesInputRef.current.value = String(settings.mines);
		}
	}

	return (
		<dialog className='settings-dialog' ref={dialogRef}>
			<form>
				<div className='settings-row'>
					<label htmlFor='rows'>Rows</label>
					<input
						id='rows'
						type='number'
						ref={rowsInputRef}
						defaultValue={defaults.rows}
						onChange={(e) => (settings.rows = Number(e.target.value))}
						min={8}
						max={100}
					/>
				</div>
				<div className='settings-row'>
					<label htmlFor='cols'>Columns</label>
					<input
						id='cols'
						type='number'
						ref={colsInputRef}
						defaultValue={defaults.cols}
						onChange={(e) => (settings.cols = Number(e.target.value))}
						min={8}
						max={100}
					/>
				</div>
				<div className='settings-row'>
					<label htmlFor='mines'>Mines</label>
					<input
						id='mines'
						type='number'
						ref={minesInputRef}
						defaultValue={defaults.mines}
						onChange={(e) => (settings.mines = Number(e.target.value))}
						min={10}
						max={9999}
					/>
				</div>
				<div className='settings-row'>
					<button type='button' onClick={() => onApplySettings(settings)}>
						Save
					</button>
					<button
						type='button'
						onClick={() => {
							onCancel(settings);
							resetToDefaults();
						}}
					>
						Cancel
					</button>
				</div>
			</form>
		</dialog>
	);
});

export default SettingsModal;
