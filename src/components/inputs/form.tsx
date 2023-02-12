import React, {
  Component,
  createContext,
  ReactNode,
  SyntheticEvent,
} from "react";

type TFormContext = {
  fields: Record<string, any>;
  errors: Record<string, any>;
  setField: (e: any, { id }: { id: string }) => void;
  addField: ({ field }: { field: Record<string, any>; value: any }) => any;
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

  setField = (
    e: SyntheticEvent,
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

  render() {
    const { fields, errors } = this.state;

    const formContext = {
      fields,
      errors,
      setField: this.setField,
      addField: (data: { field: Record<string, any>; value: any }) =>
        this.addField(data),
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
