const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://avoline3d:PAYLOop3d@cluster0.uj0ht.mongodb.net/")
  .then(() => console.log("MongoDB Connection Successfull"))
  .catch((error) => console.log("Error Occured" + error));

const Promotion = require("./models/promotion");

const checkTime = async () => {
  try {
    const now = new Date();

    const todayDateTime = new Date(now);
    const formattedEndDate = todayDateTime.toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    // Find active promotions
    const activePromotions = await Promotion.find({
      startDate: { $lt: formattedEndDate }, // Started before now
      endDate: { $gt: formattedEndDate }, // Ends after now (optional)
    });

    if (activePromotions.length > 0) {
      try {
        // Loop through all active promotions and update their status
        for (const promotion of activePromotions) {
          await Promotion.findOneAndUpdate(
            { _id: promotion._id }, // Filter by promotion id
            {
              $set: { isActive: true },
            }, // Update the "isActive" field
            { new: true } // Return the updated document
          );
        } // Then, update the rest of the promotions to isActive: false
        await Promotion.updateMany(
          { _id: { $nin: activePromotions.map((promotion) => promotion._id) } }, // Exclude the active promotions by their ids
          { $set: { isActive: false } } // Set isActive to false for all other promotions
        );
      } catch (error) {
        console.error("Error updating promotions:", error.message);
      }
    } else {
      try {
        // Set all promotions to inactive if none are active
        await Promotion.updateMany(
          {}, // Empty filter to match all documents
          { $set: { isActive: false } } // Set "isActive" to false
        );
      } catch (error) {
        console.error("Error updating promotions:", error.message);
      }
    }
  } catch (error) {
    console.error("Error checking promotions:", error);
  }
};

// Run checkTime() every minute
setInterval(checkTime, 60000);
