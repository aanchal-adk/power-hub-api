export const parseAndValidateFilter = (value: string, filterName: string) => {

    if (isNaN(Number(value))) {
        throw new Error(`Invalid filter value for ${filterName}`);
    }

    return parseInt(value);
};
