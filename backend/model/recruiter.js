const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      validate: {
        validator: function (v) {
          // Allow either: +CountryCode + 10 digits OR just 10 digits
          return v !== "" ? /^(\+?\d{1,3})?\d{10}$/.test(v) : true;
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    bio: {
      type: String,
    },
    profile: {
      type: String,
    },
    banner: {
      type: String,
    },
  },
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("RecruiterInfo", schema);
