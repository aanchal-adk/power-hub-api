import mongoose from "mongoose";

const BatterySchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: [true, "Please add the battery's name."]
    },
    capacity: {
        type: mongoose.Schema.Types.Number,
        required: [true, "Please add the battery's capacity in watts."]
    },
    postalCode: {
        type: mongoose.Schema.Types.Number,
        required: [true, "Please add the battery's capacity in watts."]
    },
}, {
    timestamps: true
});

const Battery = mongoose.model("Battery", BatterySchema);

export default Battery;
