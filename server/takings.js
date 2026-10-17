// Checks the day asked for is a real date written like 2026-10-17.
// Gives back true or false.
function isValidDate(text) {
    if (typeof text !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        return false;
    }

    // Rules out days that don't exist, like 2026-02-30
    const date = new Date(`${text}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(text);
}

module.exports = { isValidDate };
