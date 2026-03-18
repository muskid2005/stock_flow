// Modules
import express from "express";
import sequelize from "./src/config/database.js";

// Models
import User from "./src/models/User.js";
import Incoming from "./src/models/Incoming.js";
import Outgoing from "./src/models/Outgoing.js";
import Zone from "./src/models/Zone.js";

// Setup express and other middleware
const app = express();

// Setup server
const PORT = process.env.PORT || 3000;

(async () => { 
    try { 
        // Test connection 
        await sequelize.authenticate();  

        // Define relationships
        User.hasMany(Incoming, { foreignKey: 'userId' });
        Incoming.belongsTo(User, { foreignKey: 'userId' });
        Incoming.hasMany(Outgoing, { foreignKey: 'incomingId' });
        Outgoing.belongsTo(Incoming, { foreignKey: 'incomingId' });

        // Create tables
        await sequelize.sync({ alter: true });

        // Launch (Local)
        app.listen(PORT, () => {
            console.log(`Listening for requests on http://localhost:3000`);
        });
    }

    // Log errors
    catch (error) {  
        console.error("Unable to start the server:", error);
    }
})();