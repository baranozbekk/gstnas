// Permission types
export type Permission = 'VIEW_POSTS' | 'VIEW_COMMENTS' | 'EDIT_POST' | 'CREATE_POST';

// User type
export interface User {
  name: string;
  permissions: Permission[];
}
