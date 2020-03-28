import { validateSchema } from '../../utils';
import { addToEs } from './addToEs';
import { formatData } from '../../utils';
import { logger } from '../../logger';
import { IPostData, IPostResults } from '../../interfaces/requests';

export const addData = async (obj: IPostData): Promise<IPostResults> => {
    logger.info("Init adding data.")
    try {
        const dataFormatted = await formatData({ dataset: obj.dataset, data: obj.data });
        const dataValidated = await validateSchema({ dataset: obj.dataset, data: dataFormatted });
        return dataValidated.length == 0 ? await addToEs({ dataset: obj.dataset, data: dataFormatted }) : { state: false, data: {} };
    } catch (e) {
        logger.error(`Add data failed : ${e}`)
    }
};