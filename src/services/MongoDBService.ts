import mongoose from 'mongoose';
import {color} from "../utils";

const MONGODB_URI = process.env.MONGO_URI;

class DBService {
    private connection: any;

    public connect = async () => {
        mongoose.set('strictQuery', true);

        try {
            this.connection = await mongoose.connect(MONGODB_URI!);
            console.log(color("mongodb", '🍃 MongoDB connected!'));
        } catch (err) {
            console.error(err);
        }
    }
}

export default new DBService();