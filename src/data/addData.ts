import { validateSchema } from '../utils';
import { addToEs } from './addToEs';
import { formatData } from '../utils';
import { IPostData, IResults } from '../interfaces';
import { logger } from '../logger';

export const addData = async (obj: IPostData): Promise<IResults> => {
    const dataFormatted = await formatData({ dataset: obj.dataset, data: obj.data });
    const dataValidated = await validateSchema({ dataset: obj.dataset, data: dataFormatted });
    console.log(dataValidated)
    const result = dataValidated.length == 0 ? await addToEs({ dataset: obj.dataset, data: dataFormatted }) : { state: false, data: dataFormatted };
    result.state ? logger.info("data", "ok") : logger.info("data", "nok")
    return result;
};