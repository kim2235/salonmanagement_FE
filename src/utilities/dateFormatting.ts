export const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

    const [month, day, year, time] = formattedDate.replace(',', '').split(/[\s/]/);
    return `${month}-${day}-${year} ${time.toLowerCase()}`;
};

