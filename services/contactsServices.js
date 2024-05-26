import Contact from "../models/Contact.js";

export async function listContacts(filter = {}, fields = []) {
  return await Contact.find(filter, fields);
}

export async function getContactById(id) {
  return await Contact.findById(id);
}

export async function removeContact(id) {
  const result = await Contact.findByIdAndDelete(id);
  return result;
}

export async function addContact(name, email, phone) {
  const result = await Contact.create({ name, email, phone });
  return result;
}

export async function updateContact(id, name, email, phone) {
  const result = await Contact.findByIdAndUpdate(id, { name, email, phone });
  return result;
}

export async function updateStatusContact(id, favorite) {
  const result = await Contact.findByIdAndUpdate(id, { favorite });
  return result;
}
