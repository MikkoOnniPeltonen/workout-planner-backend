const { Schema, model } = require("mongoose");

const musclegroupSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      unique: true
    },
    exercises: [{
      type: Schema.Types.ObjectId,
      ref: 'Exercise'
    }]
  }
);

const MuscleGroup = model("Musclegroup", musclegroupSchema);

module.exports = MuscleGroup;
