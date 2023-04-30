import { ValidRoles } from "@auth/models/valid-roles.enum";
import { MenuItem } from "primeng/api";

export interface ProtectedMenuItem extends MenuItem {
  roles?: ValidRoles[];
  items?: ProtectedMenuItem[];
}