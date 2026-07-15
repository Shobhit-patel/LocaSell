import User from "../../models/User.js";

export const editProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updateData = {};

        if (req.body.firstName !== undefined) {
            updateData.firstName = req.body.firstName;
        }

        if (req.body.lastName !== undefined) {
            updateData.lastName = req.body.lastName;
        }

        if (req.body.avatar !== undefined) {
            updateData.avatar = req.body.avatar;
        }

        if (
            req.body.latitude !== undefined &&
            req.body.longitude !== undefined
        ) {
            updateData.location = {
                type: "Point",
                coordinates: [
                    Number(req.body.longitude),
                    Number(req.body.latitude),
                ],
            };
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            {
                returnDocument: "after",
                runValidators: true,
            }
        ).select("-password");

        res.status(200).json({
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};