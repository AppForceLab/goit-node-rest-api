import * as contactsServices from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWraper from "../decorators/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const contacts = await contactsServices.listContacts({ owner }, [
    "-createdAt",
    "-updatedAt",
  ]);
  res.json(contacts);
};

const getOneContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const contact = await contactsServices.getContact({ _id, owner });
  if (!contact) {
    throw HttpError(404);
  }
  res.json(contact);
};

const deleteContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const deletedContact = await contactsServices.removeContact({ _id, owner });
  if (!deletedContact) {
    throw HttpError(404);
  } else {
    res.json(deletedContact);
  }
};

const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const { _id: owner } = req.user;
  const newContact = await contactsServices.addContact(
    name,
    email,
    phone,
    owner
  );

  res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const { name, email, phone } = req.body;
  const updatedContact = await contactsServices.updateContact(
    { _id, owner },
    name,
    email,
    phone,
    owner
  );
  if (!updatedContact) {
    throw HttpError(404);
  } else {
    res.json(updatedContact);
  }
};

const updateStatusContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const { favorite } = req.body;
  const updatedContact = await contactsServices.updateStatusContact(
    { _id, owner },
    favorite
  );
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
