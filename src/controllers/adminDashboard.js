import User from "../models/User.js";
import Incoming from "../models/Incoming.js";
import Outgoing from "../models/Outgoing.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const userCount = await User.count();
    const totalIncoming = await Incoming.count();
    const totalOutgoing = await Outgoing.count();

    const recentInvoices = await Incoming.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [User], // Shows which user handled the incoming stock
    });

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
