import React, { useState } from "react";

export const RepoContext = React.createContext();

export const RepoProvider = props => {
  const [repo, setRepo] = useState("");
  return (
    <RepoContext.Provider value={[repo, setRepo]}>
      {props.children}
    </RepoContext.Provider>
  );
};
