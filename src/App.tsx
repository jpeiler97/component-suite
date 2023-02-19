import "./App.css";
import Form from "./components/inputs/form";
import Input from "./components/inputs/input";

function App() {
  return (
    <div className="App">
      <Form>
        <Input
          id="username"
          validate="isFoo"
          displayName="jp"
          customRules={{
            isFoo: {
              rule: () => /^\d+$/,
              formatter(fieldName: string) {
                return `Foo. Bar. I am ${fieldName}.`;
              },
            },
          }}
        />
      </Form>
    </div>
  );
}

export default App;
