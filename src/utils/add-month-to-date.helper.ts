export const addMonthsToDate = (date: Date, months: number): Date => {
    const newDate = new Date(date.getTime());
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
};