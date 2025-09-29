import mongoose from "mongoose"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

async function fixIndexes() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI)// Get the collection
        const collection = mongoose.connection.collection("courses")

        // List all indexes
        const indexes = await collection.indexes())

        // Drop the simple code index if it exists
        const codeIndex = indexes.find(
            (index) => index.key && Object.keys(index.key).length === 1 && index.key.code === 1 && index.unique === true,
        )

        if (codeIndex) {await collection.dropIndex(codeIndex.name)} else {}

        // Create the compound indexawait collection.createIndex(
            { code: 1, lectureType: 1, division: 1, year: 1, branch: 1 },
            { unique: true, background: true },
        )// List updated indexes
        const updatedIndexes = await collection.indexes())} catch (error) {} finally {
        // Close the connection
        await mongoose.connection.close()process.exit(0)
    }
}

// Run the function
fixIndexes()
