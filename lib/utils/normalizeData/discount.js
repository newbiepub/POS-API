export const discount_input_data = (variables = {}) => {
    let {
        products = [],
        employeeIds = [],
        name = '',
        description = '',
        value = 0,
        type = '',
        appliedDate = '',
        dueDate = ''
    } = variables;

    return {
        products,
        employeeIds,
        name,
        description,
        value,
        type,
        appliedDate,
        dueDate,
    }
}