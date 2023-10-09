import { InteractionStatus } from '@azure/msal-browser';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { b2cPolicies, loginRequest, protectedResources } from './authConfig';
import React from 'react';

const TasksPage = (props) => {
  const { instance, inProgress } = useMsal();
  const [displayName, setDisplayName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleEditProfile = async () => {
    if (inProgress === InteractionStatus.None) {
      await instance.acquireTokenRedirect(b2cPolicies.authorities.editProfile);
    }
  };
  const handleForgotPassword = async () => {
    if (inProgress === InteractionStatus.None) {
      await instance.loginRedirect({
        authority: b2cPolicies.authorities.forgotPassword.authority,
        scopes: loginRequest.scopes,
      });
    }
  };
  const handleLogin = () => {
    instance.loginRedirect().catch((e) => {
      console.error(e);
    });
  };
  const handleLogout = () => {
    instance.logoutRedirect().catch((e) => {
      console.error(e);
    });
  };
  const getAuthHeader = async () => {
    const accessTokenResponse = await instance.acquireTokenSilent({
      scopes: loginRequest.scopes,
    });
    return `Bearer ${accessTokenResponse.accessToken}`;
  };
  const getTasks = async () => {
    setLoading(true);
    const authHeader = await getAuthHeader();
    try {
      const getRes = await fetch(protectedResources.apiTodoList.endpoint, {
        method: 'GET',
        headers: { Authorization: authHeader },
      });
      const data = await getRes.json();
      console.log(getRes);
      setTasks(data);
    } catch (error) {
      console.log(error);
      alert('request failed!');
    }
    setLoading(false);
  };
  const handleAddTask = async () => {
    setLoading(true);
    const authHeader = await getAuthHeader();
    try {
      const res = await fetch(protectedResources.apiTodoList.endpoint, {
        method: 'post',
        headers: { Authorization: authHeader },
      });
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.log(error);
      alert('request failed!');
    }
    setLoading(false);
  };
  useEffect(() => {
    if (props.accountState) {
      setDisplayName(props.accountState?.name ?? '[get name failed]');
    }
  }, [props.accountState]);
  return (
    <>
      <AuthenticatedTemplate>
        <h1>{displayName}'s Tasks</h1>
        <ul>
          {tasks.map((task, index) => {
            return (
              <li key={index}>
                {task.title}:{task.description}
              </li>
            );
          })}
        </ul>
        <button onClick={getTasks} disabled={loading}>
          {loading ? 'Loading...' : 'Get Tasks'}
        </button>
        <button onClick={handleAddTask} disabled={loading}>
          {loading ? 'Loading...' : 'Add Task'}
        </button>
        <button onClick={handleEditProfile}>Edit Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <button onClick={handleLogin}>Click to Login</button>
        <button onClick={handleForgotPassword}>Forgot Password</button>
      </UnauthenticatedTemplate>
    </>
  );
};
export default TasksPage;
//interface TasksPageProps {
// accountState: AccountInfo | null;
//}
//interface Todo {
//  name: string;
// description: string;
//}
