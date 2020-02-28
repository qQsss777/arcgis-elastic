const queryEsModel = async (query) => {
    const body = Object.entries(query).length === 0 ? {} : await formatBody(query);
    return body;
};

const formatBody = async (q) => {
    const values = Object.values(q).toString().replace(",", " ");
    const fields = Object.keys(q);
    const queryFormatted = {
        query: {
            multi_match: {
                query: values,
                fields
            }
        }
    };
    return queryFormatted;
};

module.exports = queryEsModel;