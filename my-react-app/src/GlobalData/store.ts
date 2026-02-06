// basic implementation of a global data store using React's Context API and TypeScript.
// not best practice
// data will be wiped out on page refresh, so it's not suitable for storing persistent data like user authentication tokens or preferences. For such cases, consider using localStorage, sessionStorage, or a state management library like Redux or Zustand.
export const store = {
    loggedInUser: {
        id:0,
        username: '',
        email: '',
        role: '',
    },
    setLoggedInUser: (user: { id: number; username: string; email: string; role: string }) => {
        store.loggedInUser = user;
    },
    clearLoggedInUser: () => {
        store.loggedInUser = {
            id: 0,
            username: '',
            email: '',
            role: '',
        };
    }
}
