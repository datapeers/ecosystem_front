import { MenuItem } from "primeng/api";
import { ValidRoles } from "../auth/valid-roles.enum";

export interface ProtectedMenuItem extends MenuItem {
  roles?: ValidRoles[];
  items?: ProtectedMenuItem[];
}