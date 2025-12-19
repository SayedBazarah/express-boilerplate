export declare class HashService {
    private readonly saltRounds;
    hash(data: string): Promise<string>;
    compare(data: string, encrypted: string): Promise<boolean>;
}
