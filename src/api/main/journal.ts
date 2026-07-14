import { components, paths } from 'types/ivy-types';
import * as api from '../config';

type JournalEntryBinding = components['schemas']['JournalEntryBinding'];
type JournalEntryPagedView = components['schemas']['JournalEntryPagedView'];
type GetJournalEntryQuery = paths['/journal/entry']['get']['parameters']['query'];
type PutJournalEntryPath = paths['/journal/entry/{date}']['put']['parameters']['path'];
type DeleteJournalEntryPath = paths['/journal/entry/{date}']['delete']['parameters']['path'];

const get = (filters?: GetJournalEntryQuery): Promise<JournalEntryPagedView> => api.get('journal/entry', filters);

const post = (entry: JournalEntryBinding): Promise<number> => api.post('journal/entry', entry);

const put = (date: PutJournalEntryPath['date'], entry: JournalEntryBinding): Promise<number> => api.put(`journal/entry/${date}`, entry);

const del = (date: DeleteJournalEntryPath['date']): Promise<number> => api.del(`journal/entry/${date}`);

const journal = {
    get,
    post,
    put,
    del,
};

export default journal;
