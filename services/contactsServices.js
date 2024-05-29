import Contact from "../models/Contact.js";

export async function listContacts(filter = {}, fields = []) {
  return await Contact.find(filter, fields);
}

export async function getContact(filter) {
  return await Contact.findOne(filter);
}

export async function removeContact(filter) {
  const result = await Contact.findOneAndDelete(filter);
  return result;
}

export async function addContact(name, email, phone, owner) {
  const result = await Contact.create({ name, email, phone, owner });
  return result;
}

export async function updateContact(filter, name, email, phone) {
  const result = await Contact.findOneAndUpdate(filter, { name, email, phone });
  return result;
}

export async function updateStatusContact(filter, favorite) {
  const result = await Contact.findOneAndUpdate(filter, { favorite });
  return result;
}
