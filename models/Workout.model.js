const { Schema, model } = require("mongoose");


const workoutSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    exercises: [{
        type: Schema.Types.ObjectId,
        ref: 'Exercise'
    }],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required."]
    }
  },
  {    
    timestamps: true
  }
);

const Workout = model("Workout", workoutSchema);

module.exports = Workout;
