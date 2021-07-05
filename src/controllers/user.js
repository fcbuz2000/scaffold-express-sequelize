import dotenv from 'dotenv';
import models from '../db/models';

const { User } = models;
// dotenv.config();

const userData = {
  name: 'Messi',
  email: 'messi',
  phone: '+998998609988',
  password: '123',
};

export async function create(req, res) {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
    console.log(JSON.stringify(error.name, null, 2));
  }
}

export async function getAll(req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error.message);
    console.log(error);
  }
}
