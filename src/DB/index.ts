import colors from "colors";
import { User } from "../app/modules/user/user.model";
import config from "../config";
import { USER_ROLES } from "../enums/user";
import { logger } from "../shared/logger";

const superUser = {
  firstName: "Super", // put client first name
  lastName: "Admin", // put client last name
  role: USER_ROLES.SUPER_ADMIN,
  email: config.admin.email,
  password: config.admin.password,
  verified: true,
  isAdminVerified: true,
  deviceToken: "",
  deviceId: "",
  isSubscribe: true,
};



const subAdmin = {
  firstName: "irin",
  lastName: "Admin ",
  role: USER_ROLES.SUB_ADMIN,
  email: config?.subAdmin.email,
  password: config?.subAdmin.password,
  verified: true,
  isAdminVerified: true,
  deviceToken: "",
  deviceId: "",
  isSubscribe: true,
}

const seedSuperAdmin = async () => {
  const isExistSuperAdmin = await User.findOne({
    role: USER_ROLES.SUPER_ADMIN,
  });

  if (!isExistSuperAdmin) {
    await User.create(superUser);
    logger.info(colors.green("✔ Super admin created successfully!"));
  }
};


const seedSubAdmin = async () => {
  const isExistSubAdmin = await User.findOne({
    role: USER_ROLES.SUB_ADMIN,
  });

  if (!isExistSubAdmin) {
    await User.create(subAdmin);
    logger.info(colors.green("✔ Sub admin created successfully!"));
  }
}






export default seedSuperAdmin;
export { seedSubAdmin }
