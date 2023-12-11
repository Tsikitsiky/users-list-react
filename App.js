/*
We have a list of users, and we separate this list into two lists:
1. Born before 2000.
2. Born after 2000.

We have an initial code that fetches the user list and displays the modified lists.

We want to add a button to edit users in the list. You can use any react in-build functionality to manage the state.

The button actions:

* The Edit button should display an input field for birth date together with Apply and Cancel buttons.
* The Apply button should apply changes to the user and leave the edit mode. After the modification, the user should be in the correct list.
* The Cancel button should leave the edit mode without applying any changes.

Run the code to see the image of functionality needed.

If the user is already in edit mode and clicks on another user’s Edit button, the open Edit mode should be closed, discarding the changes, and the new Edit mode should be opened for the other user.

Note that the UI styles are not required to match the expected styles.

*/


import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const { response, isLoading, hasError } = useFetch("https://dummyjson.com/users?limit=100", "GET");
  const [beforeList, setBeforeList] = useState([]);
  const [afterList, setAfterList] = useState([]);
  const [allUserList, setAllUserList] = useState([]);
  const [idClicked, setIdClicked] = useState();

  useEffect(() => {
    if (response === undefined || isLoading || hasError) {
      return;
    }

    const { users } = response;
    settingStates(users)
  }, [response, isLoading, hasError, allUserList.length]);

  const settingStates = (users) => {
    setAllUserList(users)

    const [before, after] = getBeforeAndAfterLists(allUserList);
    setBeforeList(before);
    setAfterList(after);
  }

  useEffect(() => {
    settingStates(allUserList)
  }, [allUserList])

  const handleToggleEditShow = (userId) => {
    setIdClicked(userId)
  }

  return (
    <div className="list-of-users">
      <div className="before">
        <h3>Users born before 2000</h3>

        <div className="content">
          {beforeList.map(user => (
            <div key={user.name} className="user-item">
              <UserView user={user} show={user.id == idClicked} handleToggleEditShow={handleToggleEditShow} setAllUserList={setAllUserList} allUserList={allUserList} />
            </div>
          ))}
        </div>
      </div>

      <div className="after">
        <h3>Users born after 2000</h3>

        <div className="content">
          {afterList.map(user => (
            <div key={user.name} className="user-item">
              <UserView user={user} show={user.id == idClicked} handleToggleEditShow={handleToggleEditShow} setAllUserList={setAllUserList} allUserList={allUserList} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const UserView = ({ user, handleToggleEditShow, show, setAllUserList, allUserList }) => {
  const [userBirthDate, setUserBirthDate] = useState(user.birthDate)
  const [userInput, setUserInput] = useState(user.birthDate)

  const handleApplyChange = () => {
    setUserBirthDate(userInput)
    const newUsers = allUserList.map((u) => {
      if (u.id == user.id) {
        return { ...u, birthDate: userInput }
      }
      return u
    })

    setAllUserList(newUsers)
    handleToggleEditShow()
  }

  return (
    <div className='container'>
      {show && <div className='edit-container'>
        <input className='user-input' type='text' value={userInput} onChange={(e) => setUserInput(e.target.value)} />
        <div className='btn-container'>
          <button className="apply btn btn-blue" onClick={() => handleApplyChange()} >Apply</button>
          <button className="apply btn btn-red" onClick={() => handleToggleEditShow()}>X</button>
        </div>
      </div>}
      <div className="user-view">
        <div className="user">{user.name} - {userBirthDate}</div>
        <div className="buttons">
          <button onClick={() => handleToggleEditShow(user.id)} className="edit btn btn-blue">Edit</button>
        </div>
      </div>
    </div>
  )
};

const useFetch = (url, method) => {
  const [response, setResponse] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await fetch(url, { method });
      if (!response.ok) {
        setHasError(true);
        setIsLoading(false);
      }
      const data = await response.json();
      setResponse(data);
      setIsLoading(false);

      if (hasError) {
        setHasError(false);
      }
    })();
  }, [url, method]);

  return { response, isLoading, hasError, };
}

const getBeforeAndAfterLists = (users) => {
  const internalUsers = users.map(user => ({ name: user.name || `${user.firstName} ${user.lastName}`, birthDate: user.birthDate, id: user.id }));

  internalUsers.sort((a, b) => birthdayToTime(a.birthDate) > birthdayToTime(b.birthDate) ? 1 : -1);
  const before = internalUsers.filter(user => birthdayToYear(user.birthDate) < 2000);
  const after = internalUsers.filter(user => birthdayToYear(user.birthDate) >= 2000);

  return [before, after];
}

function birthdayToTime(birthDate) {
  return new Date(birthDate).getTime();
}

function birthdayToYear(birthDate) {
  return new Date(birthDate).getFullYear();
}
ReactDOM.render(<App />, document.getElementById('root'));