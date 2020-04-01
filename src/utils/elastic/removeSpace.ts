export const removeSpace = (query: string) => {
    while (query.charAt(0) === ' ') {
        query = query.substr(1);
    }
    return query
}
