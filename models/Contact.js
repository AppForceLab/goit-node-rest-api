import {Schema, model} from "mongoose";
import {handleSaveErrors, handleUpdateSettings} from "./hooks.js";

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
}, {
  versionKey: false,
  timestamps: true,
}
)

contactSchema.pre("findOneAndUpdate", handleUpdateSettings )

contactSchema.post("save", handleSaveErrors)
contactSchema.post("findOneAndUpdate", handleSaveErrors)

const Contact = model("contact", contactSchema);

export default Contact;