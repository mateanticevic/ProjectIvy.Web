import { createConnection } from './config';

const PROCESS_DAY_PROGRESS = 'ProcessDayProgress';

function processDay(
    from: Date | string,
    to: Date | string,
    reprocess = false,
    onProgress?: (progress: number) => void,
): Promise<void> {
    const connection = createConnection('JobHub');

    if (onProgress) {
        connection.on(PROCESS_DAY_PROGRESS, onProgress);
    }

    return connection.start()
        .then(() => connection.invoke('ProcessDay', from, to, reprocess))
        .finally(() => connection.stop());
}

const job = {
    processDay,
};

export default job;
