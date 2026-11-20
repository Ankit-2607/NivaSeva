import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nivaseva';

  // Check if user forgot to replace Atlas placeholders
  if (uri.includes('<password>') || uri.includes('<username>')) {
    console.warn(`⚠️ [Database Warning] Your MONGODB_URI in Backend/.env contains '<password>' or '<username>' placeholders.`);
    console.warn(`   Please replace them with your actual MongoDB Atlas database credentials.`);
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn(`⚠️ [NivaSeva Database Notice]`);
    console.warn(`   Could not connect to MongoDB at: "${uri}"`);
    console.warn(`   Reason: No MongoDB service is currently running on this address.`);
    console.warn(`   ----------------------------------------------------------------`);
    console.warn(`   👉 To fix this, update your connection string in: Backend/.env`);
    console.warn(`   👉 Free MongoDB Atlas (Cloud): MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/nivaseva?retryWrites=true&w=majority`);
    console.warn(`   👉 Local MongoDB: Install MongoDB Community Server and ensure the service is running.`);
    console.warn(`   ----------------------------------------------------------------`);
  }
};
