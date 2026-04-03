export function formatErrors(errorResponse) {
    if (!errorResponse) return ["Unknown error"];

    const messages = [];

    Object.entries(errorResponse).forEach(([field, value]) => {
        if (Array.isArray(value)) {
            value.forEach(msg => {
                messages.push(`${msg}`);
            });
        } else {
            messages.push(`${field}: ${value}`);
        }
    });

    return messages;
}