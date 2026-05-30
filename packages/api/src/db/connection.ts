import mongoose from 'mongoose';

export const initDb = async (): Promise<any> => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URL, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log('DB Connected');
    return db;
  } catch (error) {
    console.error('DB Connection Failed', error);
    process.exit(1);
  }
};
