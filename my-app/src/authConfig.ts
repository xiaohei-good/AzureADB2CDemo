export const protectedResources = {
  apiTodoList: {
    endpoint: 'https://localhost:7002/Task', //这里的Task为之前新建的Controller名
    scopes: {
      read: ['https://contosob2cbysally.onmicrosoft.com/task-api/tasks-read'],
      write: ['https://contosob2cbysally.onmicrosoft.com/task-api/tasks.write'],
    },
  },
};
export const loginRequest = {
  scopes: [
    ...protectedResources.apiTodoList.scopes.read,
    ...protectedResources.apiTodoList.scopes.write,
  ],
};
// 以下的<xxx>同之前API配置
export const b2cPolicies = {
  authorities: {
    signUpSignIn: {
      authority:
        'https://contosob2cbysally.b2clogin.com/contosob2cbysally.onmicrosoft.com/B2C_1_signin-signup',
    },
    forgotPassword: {
      authority:
        'https://contosob2cbysally.b2clogin.com/contosob2cbysally.onmicrosoft.com/B2C_1_reset_password',
    },
    editProfile: {
      authority:
        'https://contosob2cbysally.b2clogin.com/contosob2cbysally.onmicrosoft.com/B2C_1_profile-edit',
      scopes: [],
    },
  },
  authorityDomain: 'contosob2cbysally.b2clogin.com',
};
