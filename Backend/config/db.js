const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
<<<<<<< HEAD
  } catch (error) {
    console.error(`Error: ${error.message}`);
=======
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    this.apply.listen(PORT)
>>>>>>> Jatan
    process.exit(1);
  }
};

module.exports = connectDB;
