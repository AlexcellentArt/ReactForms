import React, { useState, useEffect } from "react";

function Authenticate({ token }) {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [data, setData] = useState(null);
  async function handleClick() {
    console.log(token);
    try {
      const response = await fetch(
        "https://fsa-jwt-practice.herokuapp.com/authenticate",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      setData(result.data);
      setSuccessMessage(result.message);
      console.log(result.data);
    } catch (error) {
      setError(error.message);
    }
  }
  function parseData() {
    return Object.keys(data).map((key,id) => {return<>      <div className="data" key={id}>
        <p className="importantText">{key} = </p>
        <p>{data[key]}</p>
        <br />
      </div></>
    });
  }
  return (
    <div>
      <h2>Authenticate</h2> {successMessage && <p>{successMessage}</p>}
      {error && <p>{error}</p>}
      {data && (
        <div key="databox">
          <h3 key ="dataHeader">~~~ Data ~~~</h3>
          {parseData()}
        </div>
      )}
      <button onClick={handleClick}>Authenticate Token</button>
    </div>
  );
}

export default Authenticate;
