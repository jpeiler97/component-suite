import "./App.css";
import Form from "./components/inputs/form";
import Input from "./components/inputs/input";
import TextInput from "./components/inputs/textInput";

function App() {
	return (
		<div className="App">
			<Form>
				<TextInput
					id="test"
					placeholder=""
					validate="numeric"
					events={{
						onChange: (data) => console.log(data),
						onFocus: (val) => console.log("focused"),
						onBlur: (val) => console.log("blurred")
					}}
				/>
			</Form>
		</div>
	);
}

export default App;
