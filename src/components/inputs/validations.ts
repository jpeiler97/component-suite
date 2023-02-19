const validations = {
	required: {
		rule: () => /\S/,
		formatter(fieldName: string) {
			return `${fieldName} is required.`;
		}
	},
	numeric: {
		rule: () => /^\d+$/,
		formatter(fieldName: string) {
			return `${fieldName} may only contain numbers.`;
		}
	}
};

export default validations;
