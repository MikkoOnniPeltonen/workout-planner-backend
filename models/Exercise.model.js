const { Schema, model } = require("mongoose");


const exerciseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required.']
    },
    belongsTo: 
      [{
        type: Schema.Types.ObjectId,
        ref: "Musclegroup"
    }],
    usedWith: [{
      type: String
    }]
  }
);

const Exercise = model("Exercise", exerciseSchema);

module.exports = Exercise;
