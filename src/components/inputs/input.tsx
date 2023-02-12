import { useContext, useEffect } from "react";
import { FormContext } from "./form";

const Input = ({ ...props }) => {
  const { id } = props;
  const { fields, setField, addField } = useContext(FormContext);
  const field = fields[id];

  useEffect(() => {
    addField({
      field: props,
      value: "",
    });
  }, []);
  console.log("field: " + field);

  if (!field) return "";

  return (
    <div>
      <input
        type="text"
        value={field && field.value}
        onChange={(e) => setField(e, field)}
      />
    </div>
  );
};

export default Input;
