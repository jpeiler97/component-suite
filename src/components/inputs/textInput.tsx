import { ChangeEvent, useContext, useEffect } from "react";
import { FormContext } from "./form";

type TClassObject = {
	contClass?: string;
	fieldClass?: string;
	errorClass?: string;
};
type TInputProps = {
	id: string;
	rows?: number;
	type?: string;
	placeholder?: string;
	validate?: string;
	events?: Record<string, (val: unknown) => any>;
};

/**
 * Generic text input built based on tutorial by Bharat Soni 'Creating a generic text-input component with React'.
 *
 * https://medium.com/javascript-in-plain-english/creating-a-generic-text-input-component-with-react-886e0cf90016
 */
const TextInput = (props: TInputProps) => {
	const { id } = props;
	const { setField, addField, fields, validateField, errors } =
		useContext(FormContext);
	const field = fields[id] || {};
	const {
		name,
		rows,
		value,
		validate,
		placeholder,
		label = "",
		type = "text",
		events = {},
		classes = {}
	} = field;
	const fieldError = errors[id];

	/* spreading restEvents allows to provide other native input events as-is
    to the input (e.g. onBlur, onSelect, onKeyDown, etc.)*/
	const { onChange, ...restEvents } = events;
	const { contClass, fieldClass, errorClass } = classes as TClassObject;

	//sets the field and calls an external onChange if provided on events.
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		try {
			setField(e, field);
		} catch (error) {
			throw error;
		}

		//if onChange is provided externally, call onChange
		if (typeof onChange === "function") {
			onChange({
				...field,
				value: e.target.value
			});
		}
	};

	useEffect(() => {
		if (value !== undefined) {
			validateField(id);
		}
	}, [value, id]);

	//on first render, add a field to the form with its props and value from props
	useEffect(() => {
		addField({
			field: props,
			value
		});
	}, []);

	// defining the props object to be spread onto the input.
	// if the type is textarea, provide a default value instead of value, and a rows prop.
	// otherwise, provide the value and type
	const fieldProps = {
		...restEvents,
		id,
		name,
		value,
		validate,
		placeholder,
		className: fieldClass,
		onChange: handleChange,
		...(type !== "textarea" && { value, type }),
		...(type === "textarea" && {
			defaultValue: value,
			rows: rows || 2
		})
	};

	return field ? (
		<div className={contClass}>
			{label}
			{type === "textarea" ? (
				<textarea {...fieldProps} />
			) : (
				<input {...fieldProps} />
			)}
			<p className={errorClass}>{fieldError}</p>
		</div>
	) : (
		<></>
	);
};

export default TextInput;
