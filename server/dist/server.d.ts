import * as http from 'http';

interface IDatabase {
    init(): void;
}
declare class Database implements IDatabase {
    connectionString: string;
    constructor(connectionString: string);
    init(): void;
}

declare const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
declare const db: Database;

export { db, server as default };
