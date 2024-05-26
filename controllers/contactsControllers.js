import * as contactsServices from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWraper from "../decorators/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
  const contacts = await contactsServices.listContacts({},['-createdAt','-updatedAt']);
  res.json(contacts);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsServices.getContactById(id);
  if (!contact) {
    throw HttpError(404);
  }
  res.json(contact);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const deletedContact = await contactsServices.removeContact(id);
  if (!deletedContact) {
    throw HttpError(404);
  } else {
    res.json(deletedContact);
  }
};

const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const newContact = await contactsServices.addContact(name, email, phone);
  res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const updatedContact = await contactsServices.updateContact(
    id,
    name,
    email,
    phone
  );
  if (!updatedContact) {
    throw HttpError(404);
  } else {
    res.json(updatedContact);
  }
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;
  const updatedContact = await contactsServices.updateStatusContact(id, favorite);
  if (!updatedContact) {
    throw HttpError(404);
  } else {
    res.json(updatedContact);
  }
};


export default {
  getAllContacts: ctrlWraper(getAllContacts),
  getOneContact: ctrlWraper(getOneContact),
  deleteContact: ctrlWraper(deleteContact),
  createContact: ctrlWraper(createContact),
  updateContact: ctrlWraper(updateContact),
  updateStatusContact: ctrlWraper(updateStatusContact),
};
