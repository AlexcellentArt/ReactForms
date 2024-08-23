import React, { useState, useEffect } from "react";

function SignUpForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const URL = "https://fsa-jwt-practice.herokuapp.com/signup";
  const usernameReqs = {"MAX_LEN":30,"MIN_LEN":1,"SPACES":false}
  const passwordReqs = {"MAX_LEN":30,"MIN_LEN":6,"SPACES":false,"NUMBS":true,"CAPS":true}
  const [Verdict, setVerdict] = useState();

  
  function verifyInput(value, label, requirements) {
    console.log("VERIFYING "+label)
    console.log(requirements)
    console.log("MAX_LEN" in requirements)
    const errorLog = [];
    const split = value.split("");
    switch (requirements) {
      case "MAX_LEN" in requirements === false:
        console.log("CHECKING MAX LENGTG")
        if (split.length > requirements["MAX_LEN"]) {
          errorLog.push(
            formatError(
              label,
              "too long",
              `Remove ${split.length - requirements["MAX_LEN"]} characters.`
            )
          );
        }
      case "MIN_LEN" in requirements === true:
        if (split.length > requirements["MIN_LEN"]) {
          errorLog.push(
            formatError(
              label,
              "too short",
              `Add ${requirements["MIN_LEN"] - split.length} characters.`
            )
          );
        }
        case "NUMBS" in requirements === true:
            // const reg = /[0-9]/;
            if (/[0-9]/.test(value) == requirements["NUMBS"]) {
              errorLog.push(
                formatError(
                  label,
                  "only letters.",
                  `Add one number.`
                )
              );
            }
        case "CAPS" in requirements === true:
            // checks for caps and titles
            if (/[\p{Lu}\p{Lt}]/.test(value) == requirements["CAPS"]) {
                errorLog.push(
                formatError(
                    label,
                    "only letters.",
                    `Add one number.`
                )
                );
            }
        case "SPACES" in requirements === true:
            if (/[" "]/.test(value) == requirements["SPACES"]) {
                errorLog.push(
                formatError(
                    label,
                    "has spaces.",
                    `Remove spaces.`
                )
                );
            }
        default:
            // once fall through is done, return default
            // const verdict = {eval:true,messages:[]}
            if (errorLog.length)
            {
                console.log(errorLog)
                return <ul>{...errorLog}</ul>
                // verdict.eval = false;
                // verdict.messages = errorLog;
            }
            console.log("DEFAUT")
            // return null
    }
  }
//   function testRegex(regex,successMsg,failMsg){
//     const result = regex.exec(regex)
//   }
  function formatError(inputName, problem, solution = "") {
    const errorTemplate = `${inputName} is ${problem}.`;
    if (solution) {
      errorTemplate += `Fix by ${solution}.`;
    }
    return <li className="error">{errorTemplate}</li>;
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
    console.log("HEWWO");
    const verified = { username: username, password: password };
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
    <>
      <h2>Sign Up</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="">
          Username:
          <input
            type="text"
            name = "username"
            value={username}
            onChange={(e) => {
                setUsername(e.target.value)
            }}
          />
          {username && verifyInput(username,"Username",usernameReqs)}
        </label>
        <label htmlFor="">
          Password:
          <input
            type="text"
            name="password"
            value={password}
            onChange={(e) => {setPassword(e.target.value); verifyInput(password,"Password",passwordReqs);}}
          />
          {password && verifyInput(password,"Password",passwordReqs)}
        </label>
        <button>Submit</button>
      </form>
    </>
  );
}

export default SignUpForm;
