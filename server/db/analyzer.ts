import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb://user:password@localhost:27017";
const dbName = "test";

(async () => {
  // Connect to MongoDB
  const client = new MongoClient(uri);

  client.connect();
  const db = client.db(dbName);

  try {
    const expensesCollection = db.collection("expenses");

    // before indexing = 39 ms
    // after indexing 1 ms

    await expensesCollection.createIndex({ category: 1 });
    await expensesCollection.createIndex({ creator: 1 });
    // await expensesCollection.createIndex({ creator: 1, category:1 });

    await expensesCollection.createIndex({
      description: "text",
    });

    // // Find documents in the "users" collection
    // const users = await messagesCollection.find().explain();

    const expenses = await expensesCollection
      .find({
        creator: ObjectId.createFromHexString("65b668efc64393b602a99c52"),
      })
      .explain("executionStats");

    console.log(
      "Expenses found:",
      expenses.queryPlanner.winningPlan,
      expenses.executionStats
    );
  } catch (error) {
    console.error("Error finding users:", error);
  } finally {
    // Close the MongoDB connection
    client.close();
  }
})();
