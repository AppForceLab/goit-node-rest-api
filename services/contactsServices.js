import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

export const readContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(contacts) || [];
  } catch (err) {
    return [];
  }
};

export const writeContacts = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

export async function listContacts() {
  const contacts = await readContacts();
  return contacts || [];
}

export async function getContactById(id) {
  const contacts = await readContacts();
  return contacts.find((contact) => contact.id === id) || null;
}

export async function removeContact(contactId) {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const deletedContact = contacts[index];
  contacts.splice(index, 1);
  await writeContacts(contacts);
  return deletedContact || null;
}

export async function addContact(name, email, phone) {
  const contacts = await readContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
}

export async function updateContact(id, name, email, phone) {
  const contacts = await readContacts();
  const contact = contacts.find((contact) => contact.id === id);
  if (!contact) {
    return null;
  }
  const index = contacts.findIndex((contact) => contact.id === id);
  const updatedContact = {
    id,
    name: name || contact.name,
    email: email || contact.email,
    phone: phone || contact.phone,
  };
  contacts.splice(index, 1, updatedContact);
  await writeContacts(contacts);
  return updatedContact;
}
