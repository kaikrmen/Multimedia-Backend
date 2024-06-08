import Role from "../models/Role.js";
import User from "../models/User.js";
import { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD } from "../../config.js";

export const createrole = async () => {
  try {
    // Count Documents
    const count = await Role.estimatedDocumentCount();

    // check for existing role
    if (count > 0) return;

    // Create default role
    const values = await Promise.all([
      new Role({ name: "reader" }).save(),
      new Role({ name: "creator" }).save(),
      new Role({ name: "admin" }).save(),
    ]);

    console.log(values);
  } catch (error) {
    console.error(error);
  }
};

export const createAdmin = async () => {
  // check for an existing admin user
  const userFound = await User.findOne({ email: ADMIN_EMAIL });
  console.log(userFound);
  if (userFound) return;

  // get role _id
  const role = await Role.find({ name: { $in: ["admin"] } });

  // create a new admin user
  const newUser = await User.create({
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: role.map((role) => role._id),
  });

  console.log(`new user created: ${newUser.email}`);
};

createrole();
createAdmin();