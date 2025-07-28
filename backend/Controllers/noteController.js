import Note from "../modal/Note_model.js";
import User from "../modal/userModal.js";

export const createNote = async (req, res) => {
  const { userid, content } = req.body;
  const user = await User.findOne({ _id: userid });
  if (!user) return res.status(400).json({ message: "User not found" });
  const note = new Note({ userId: user._id, content });
  await note.save();
  res.status(201).json({ message: "Note created" });
};

export const getNotes = async (req, res) => {
  const { userid } = req.params;
  const user = await User.findOne({ _id: userid });
  const notes = await Note.find({ userId: user._id }).sort({ createdAt: -1 });
  res.json(notes);
};

export const deleteNote = async (req, res) => {
  const { userid, Note_id } = req.params;
  const user = await User.findOne({ _id: userid });
  if (!user) return res.status(400).json({ message: "User not found" });
  const note = await Note.findById({ _id: Note_id });
  if (!note) return res.status(404).json({ message: "Note not found" });
  await Note.findByIdAndDelete({ _id: Note_id });
  res.json({ message: "Note deleted" });
};
