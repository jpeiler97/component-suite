import { Component, createContext, ReactNode, SyntheticEvent } from "react";
import validations from "./validations";

type TFormContext = {
  fields: Record<string, any>;
  errors: Record<string, any>;
  setField: (e: any, { id, value }: { id: string; value: unknown }) => void;
  addField: ({ field }: { field: Record<string, any>; value: any }) => any;
  validateField: (id: string) => void;
};

type TFormState = {
  fields: Record<string, any>;
  errors: Record<string, any>;
};

export const FormContext = createContext<TFormContext>({
  fields: {},
  errors: {},
} as TFormContext);

/**
 * Form built based on tutorial by Bharat Soni 'How to Handle Forms and Inputs with React'
 *
 * https://javascript.plainenglish.io/a-better-way-to-handle-forms-and-input-with-react-e01500ac73c
 */
export default class Form extends Component<
  { children: ReactNode },
  TFormState
> {
  state: TFormState = {
    fields: {},
    errors: {},
  };

  /**
   * Adds or updates a field.
   *
   * Takes in an object that has a field property (whose value is an object with an id property)
   * It defines the field to set as an object with a default empty value, and any other props
   * passed into that field (value will be overriden if it exists on the 'field' argument).
   *
   * The fields state is a dictionary of ids, with each id referencing its respective field object.
   * The new 'added' field is set on that dictionary. If an id is not provided for the field, an error
   * will be thrown.
   */
  addField = ({ field }: { field: Record<string, any> }) => {
    const { id } = field;

    field = {
      value: "",
      ...field,
    };

    if (id) {
      this.setState((prevState) => ({
        ...prevState,
        fields: {
          ...prevState.fields,
          [id]: field,
        },
      }));
      return;
    }

    throw new Error(`add id to input: ${field}`);
  };

  /**
   * setField takes in an event object (particularly coming from an input), and field object with
   * the properties id and value. It simply finds the existing field in state, and updates its
   * value (so long as the event object exists.)
   */
  setField = (
    e: SyntheticEvent<HTMLInputElement>,
    { id, value }: { id: string; value: unknown }
  ) => {
    e.persist();

    const { fields } = this.state;
    const field = fields[id];

    this.addField({
      field: {
        ...field,
        ...(e && { value: e.currentTarget.value }),
      },
    });
  };

  /**
   * validateField takes in the id of a field, and attempts to validate it.
   *
   * First it finds the field in state, and destructures it to get its value, the 'validate' list (optional),
   * displayName (optional), and customRules (optional).
   *
   * Next, it attempts to define a list of rules based on the piped 'validate' string
   * (e.g. 'required|numeric' --> ['required', 'numeric'])
   *
   * If rules has a length, it iterates through each rule (string value), and
   * finds that rule as a key in the validations object, or the customRules object if its passed in.
   * The value of the found key should be an object with a 'rule' (likely a regex check), and a formatter
   * (a function that returns a formatted 'error' string, if the rule isn't satisfied.)
   * (caveat - if there is a custom 'required' rule and a 'required' rule in validations, how would default
   * be overriden??)
   *
   * Then, it checks if that rule is satisfied. If it's required and value is empty, it's satisfied by default.
   * Otherwise, if it passes the regex test, it's satisfied. If the rule isn't satisfied, an error will be defined
   * based on the formatter, and will break the loop.
   *
   * Lastly, the errors state is updated for that field's id, either as the formatted error or an empty string.
   */
  validateField = (id: string) => {
    let error = "";

    const {
      value: fieldValue,
      validate,
      displayName,
      customRules = {},
    } = this.state.fields[id];
    const rules = validate?.split("|") || "";

    if (rules.length) {
      //why not iterate through Object.keys(rules) instead?
      for (const rule in rules) {
        const ruleName: keyof typeof validations = rules[rule];
        const validation = validations[ruleName] || customRules[ruleName];

        const isRuleSatisfied =
          ruleName !== "required" && !fieldValue
            ? true
            : validation.rule().test(fieldValue.toString());
        if (!isRuleSatisfied) {
          error = validation.formatter.apply(null, [displayName || id]);
        }

        if (error !== "") {
          break;
        }
      }
    }

    this.setState((prevState) => ({
      ...prevState,
      errors: {
        ...prevState.errors,
        [id]: error,
      },
    }));
  };

  render() {
    const { fields, errors } = this.state;

    const formContext = {
      fields,
      errors,
      setField: this.setField,
      addField: (data: { field: Record<string, any>; value: any }) =>
        this.addField(data),
      validateField: this.validateField,
    };

    return (
      <form action="">
        <FormContext.Provider value={formContext}>
          {this.props.children}
        </FormContext.Provider>
      </form>
    );
  }
}
