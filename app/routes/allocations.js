const AllocationsDAO = require("../data/allocations-dao").AllocationsDAO;
const {
    environmentalScripts
} = require("../../config/config");

function AllocationsHandler(db) {
    "use strict";

    const allocationsDAO = new AllocationsDAO(db);

this.displayAllocations = (req, res, next) => {
    // Fix for A01 IDOR (CWE-639): identity comes from the session, not the URL
    const { userId } = req.session;
    const requestedId = req.params.id;

    // Block attempts to view another user's data
    if (String(requestedId) !== String(userId)) {
        return res.status(403).send("Forbidden: you can only view your own allocations");
    }

    const {
        threshold
    } = req.query;

        allocationsDAO.getByUserIdAndThreshold(userId, threshold, (err, allocations) => {
            if (err) return next(err);
            return res.render("allocations", {
                userId,
                allocations,
                environmentalScripts
            });
        });
    };
}

module.exports = AllocationsHandler;
