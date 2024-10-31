const { Schema, model } = require("mongoose");

const musclegroupSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      unique: true
    }
  }
);

const MuscleGroup = model("Musclegroup", musclegroupSchema);

module.exports = MuscleGroup;
