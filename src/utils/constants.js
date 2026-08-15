export const UserRolesEnum = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
};

export const AvailableUserRole = Object.values(UserRolesEnum); //sending just the array(admin, project_admin, member) not entire object! so we loop through it

export const TaskStatusEnum = {
  //sending the entire object!
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

export const AvailableTaskStatuses = Object.values(TaskStatusEnum); //sending just array!
