import "./SettingsModal.css";
import { forwardRef } from "react";

export interface Settings {
	rows: number;
	cols: number;
	mines: number;
}

interface SettingsModalProps {
	onApplySettings: (settings: Settings) => void;
	defaults: Settings;
}

const SettingsModal = forwardRef(function SettingsModal(
	{ onApplySettings, defaults }: SettingsModalProps,
	dialogRef: React.ForwardedRef<HTMLDialogElement>
) {
	const settings: Settings = { ...defaults };

	return (
		<dialog className='settings-dialog' ref={dialogRef}>
			<form>
				<div className='settings-row'>
					<label htmlFor='rows'>Rows</label>
					<input
						id='rows'
						type='number'
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
						defaultValue={defaults.mines}
						onChange={(e) => (settings.mines = Number(e.target.value))}
						min={10}
						max={9999}
					/>
				</div>
				<div>
					<button type='button' onClick={() => onApplySettings(settings)}>
						Save
					</button>
				</div>
			</form>
		</dialog>
	);
});

export default SettingsModal;
