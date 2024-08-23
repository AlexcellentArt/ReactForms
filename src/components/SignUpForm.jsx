import React, { useState, useEffect } from "react";

function SignUpForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [overallValidity, setOverallValidity] = useState("");

//   checkVerdict()? "valid":"invalid"
  const URL = "https://fsa-jwt-practice.herokuapp.com/signup";
  const usernameReqs = { MAX_LEN: 30, MIN_LEN: 1, SPACES: false };
  const passwordReqs = {
    MAX_LEN: 30,
    MIN_LEN: 6,
    SPACES: false,
    NUMBS: true,
    CAPS: true,
  };
  const [verdict, setVerdict] = useState({ Username: false, Password: false });
//   const overallVerdict = false;
  function updateFormValidity(){
    // check if some verdicts are false, if so then overall is false
    return Object.values().some((elem) => elem === false)
  }

  function verifyInput(value, label, requirements) {
    console.log("VERIFYING " + label);
    console.log(requirements);
    console.log("MAX_LEN" in requirements);
    const errorLog = [];
    const split = value.split("");
    switch (true) {
      // first case is checking is value is "" as there is no need to check the others if there is nothing to check
      case value === "":
        errorLog.push(formatError(label, "is empty"));
        break;
      case "MAX_LEN" in requirements:
        console.log("CHECKING MAX LENGTG");
        if (split.length > requirements["MAX_LEN"]) {
          errorLog.push(
            formatError(
              label,
              "too long",
              `Removing ${split.length - requirements["MAX_LEN"]} characters`
            )
          );
        }
      case "MIN_LEN" in requirements:
        if (split.length < requirements["MIN_LEN"]) {
          errorLog.push(
            formatError(
              label,
              "too short",
              `Add ${requirements["MIN_LEN"] - split.length} characters`
            )
          );
        }
      case "NUMBS" in requirements:
        // const reg = /[0-9]/;
        if (!/[0-9]/.test(value) == requirements["NUMBS"]) {
          errorLog.push(
            formatError(label, "only letters", `Adding one number`)
          );
        }
      // case "CAPS" in requirements:
      //     // checks for caps and titles
      //     if (!/[\p{Lu}\p{Lt}]/.test(value) == requirements["CAPS"]) {
      //         errorLog.push(
      //         formatError(
      //             label,
      //             "only lowercase",
      //             `Adding one capital letter`
      //         )
      //         );
      //     }
      case "SPACES" in requirements:
        if (!/[" "]/.test(value) == requirements["SPACES"]) {
          errorLog.push(formatError(label, "has spaces", `Removing spaces`));
        }
    }
    // but first create updated verdict on if overall submission is valid or not
    // const updated = verdict
    // verdict is modified directly to prevent state updates, as that is already happening when the input is getting reloaded
    // const verdict = {eval:true,messages:[]}
    if (errorLog.length) {
      verdict[label] = false;
      // setVerdict(updated)
      console.log(errorLog);
      return <ul>{errorLog.map((msg,id)=>{
       return <li className="error" key={id+"_ERR"}>{msg}</li>
      })}</ul>;
      // verdict.eval = false;
      // verdict.messages = errorLog;
    }
    verdict[label] = true;
    // setVerdict(updated)
    console.log(" is valid!");
    // return null
  }
  //   function testRegex(regex,successMsg,failMsg){
  //     const result = regex.exec(regex)
  //   }
  function formatError(inputName, problem, solution = "") {
    let errorTemplate = `${inputName} is ${problem}.`;
    if (solution) {
      errorTemplate += ` Fix by ${solution}.`;
    }
    return errorTemplate;
  }
  // Checks for falses and creates an error log accordingly
  // base object for arg:  key = type, value = target
  //   function checkRequirement(args,input) {
  //     const split = input.split("");
  //     switch (args) {
  //       case args['LEN']:
  //         if split.length >
  //     }
  //   }
  async function handleSubmit(e) {
    e.preventDefault();
    const verified = { username: username, password: password };
    // update overall validity
    // setOverallValidity(updateFormValidity()? "valid":"invalid")
    try {
      const response = await fetch(URL, {
        method: "POST",
        body: JSON.stringify(verified),
      });
      const result = await response.json();
      console.log(result);
      if (result.success === true) {
        console.log(result.token);
        props.setToken(result.token);
      }
    } catch (error) {
      setError(error.message);
    }
  }
  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="" className={!verdict.Username ? "invalid":""}>
          Username:
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          {username && verifyInput(username, "Username", usernameReqs)}
        </label>
        <label htmlFor="" className={!verdict.Password ? "invalid":""}>
          Password:
          <input
            type="text"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              verifyInput(password, "Password", passwordReqs);
            }}
          />
          {password && verifyInput(password, "Password", passwordReqs)}
        </label>
        <button className={overallValidity}>Submit</button>
      </form>
    </div>
  );
}

export default SignUpForm;
