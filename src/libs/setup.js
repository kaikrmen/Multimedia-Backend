import Role from "../models/Role.js";
import User from "../models/User.js";
import { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD } from "../../config.js";

export const createRoles = async () => {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count > 0) return;

    const values = await Promise.all([
      new Role({ name: "reader" }).save(),
      new Role({ name: "creator" }).save(),
      new Role({ name: "admin" }).save(),
    ]);

    console.log("Roles created:", values);
  } catch (error) {
    console.error("Error creating roles:", error);
  }
};

export const createAdmin = async () => {
  try {
    const userFound = await User.findOne({ email: ADMIN_EMAIL });
    if (userFound) return console.log(userFound)

    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      console.error("Admin role not found");
      return;
    }

    const newUser = new User({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: await User.encryptPassword(ADMIN_PASSWORD),
      roles: [adminRole._id],
    });

    const savedUser = await newUser.save();
    console.log(`New admin user created: ${savedUser.email}`);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

createRoles();
createAdmin();
