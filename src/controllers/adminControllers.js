import User from "../models/User.js";
import Incoming from "../models/Incoming.js";
import Outgoing from "../models/Outgoing.js";

export const getAdminDashboard = async (req, res) => {
  try {
    // 1. Fetch counts for a "Stats Bar"
    const userCount = await User.count();
    const totalIncoming = await Incoming.count();
    const totalOutgoing = await Outgoing.count();

    // 2. Fetch the 5 most recent activities to show a "Recent History" list
    const recentInvoices = await Incoming.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [User], // Shows which user handled the incoming stock
    });

    // 3. Send everything to the frontend
    res.json({
      message: "Admin Data Retrieved",
      stats: {
        users: userCount,
        incoming: totalIncoming,
        outgoing: totalOutgoing,
      },
      recentActivity: recentInvoices,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
