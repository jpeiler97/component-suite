import { useContext, useEffect } from "react";
import { FormContext } from "./form";

type TInputProps = {
  id: string; // make optional and generate random instead?
  value?: string;
  displayName?: string;
  customRules?: Record<
    string,
    {
      rule: () => RegExp;
      formatter: (fieldName: string) => string;
    }
  >;
  validate?: string;
};

const Input = ({ ...props }: TInputProps) => {
  const { id } = props;
  const { fields, setField, addField, errors, validateField } =
    useContext(FormContext);
  const field = fields[id] || {};
  const error = errors[id] || "";
  const { value = "" } = field;

  useEffect(() => {
    addField({
      field: props,
      value: "",
    });
  }, []);

  useEffect(() => {
    if (field.value !== undefined) {
      validateField(id);
    }
  }, [value]);

  if (!field) return <></>;

  return (
    <div>
      <input
        type="text"
        value={field && value}
        onChange={(e) => setField(e, field)}
      />
      <p>{error}</p>
    </div>
  );
};

export default Input;
