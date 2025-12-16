import mongoose from 'mongoose';
export declare class DatabaseService {
    static findDocuments(collection: string, query: any, limit?: number): Promise<mongoose.mongo.WithId<mongoose.mongo.BSON.Document>[]>;
    static findOneDocument(collection: string, query: any): Promise<mongoose.mongo.WithId<mongoose.mongo.BSON.Document> | null>;
    static insertDocument(collection: string, document: any): Promise<mongoose.mongo.InsertOneResult<mongoose.mongo.BSON.Document>>;
}
//# sourceMappingURL=databaseService.d.ts.map