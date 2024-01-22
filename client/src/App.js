import React, { useState, useEffect } from "react";
import ProgressBar from "./resultsBar"
import './index.css';

const App = () => {
  const [vote, setVote] = useState([]);
  const [submitOpacity, setSubmitOpacity] = useState(0)
  const [showResults, setShowResults] = useState(false);
  const [optionsOpacity, setOptionsOpacity] = useState(1);
  const [options, setOptions] = useState([]);
  const [optionPercentages, setOptionPercentages] = useState([]);
  const [messageText, setMessageText] = useState();
  const [selectedOption, setSelectedOption] = useState(null);
  const [messageOpacity, setMessageOpacity] = useState(1);
  const [resultsOpacity, setResultsOpacity] = useState(0)

  const pollid = 1

  const calculateOptionPercentages = (options) => {
    const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
    return options.map((option) => ({
      optionId: option.optionId,
      percentage: ((option.votes / totalVotes) * 100).toFixed(0),
    }));
  };

  useEffect(() => {
    fetch(`http://localhost:3000/api/poll/${pollid}`)
      .then((response) => response.json())
      .then((data) => {
        setOptions(data.data.poll[0].options);
        let question = data.data.poll[0].question;
        const formattedQuestion = formatText(question);
        setMessageText({ __html: formattedQuestion });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const handleVoteChange = (event) => {
    event.preventDefault();
    const value = event.target.value;
    setVote(value);
    setSelectedOption(value);
    setSubmitOpacity(1)
    calculateOptionPercentages(options);
  };

  function formatText(text) {
    const words = text.split(" ");
    words.splice(-2, 2, `<span class="bold">${words[words.length - 2]}</span>`, `<span class="bold">${words[words.length - 1]}</span>`);
    let formattedMessage = words.join(" ");
    return formattedMessage;
  }

  async function handleSubmit(event) {
    event.preventDefault();
 
    if(submitOpacity === 0){
      return 
    } else {
    setSubmitOpacity(0)
    setOptionsOpacity(0);
    setMessageOpacity(0);

    let updatedResults = await submitVote();
    let updatedResultOptions = updatedResults.data.poll.options;

    updatedResultOptions = updatedResultOptions.sort(
      (a, b) => b.votes - a.votes
    );

    setTimeout(() => setOptions(updatedResultOptions), 2000);
    setTimeout(() => responseUI(), 3000);

    function responseUI() {
      const updatedPercentages = calculateOptionPercentages(updatedResultOptions);
      setOptionPercentages(updatedPercentages);
      setSelectedOption(null);

      let response = "Thank you for your response";
      const formattedResponse = formatText(response);

      setMessageText({ __html: formattedResponse });
      setShowResults(true);
      setMessageOpacity(1);
    }
  }
  }

  async function submitVote() {
    const postData = JSON.stringify({ vote });

    try {
      const response = await fetch(`http://localhost:3000/api/poll/${pollid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: postData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return (
    <div>
      <div className="message-container">
        <h1
          className="message"
          dangerouslySetInnerHTML={messageText}
          style={{ opacity: messageOpacity }}
        ></h1>
      </div>

      {!showResults && (
        <form className="buttons-container">
          {options.map((option) => (
            <button
              className="option"
              key={option.optionId}
              value={option.optionId}
              onClick={handleVoteChange}
              style={{
                opacity: optionsOpacity,
                color:
                  String(selectedOption) === String(option.optionId)
                    ? 'orange'
                    : 'white',
              }}
            >
              {option.optionText}
            </button>
          ))}
            <button
              className="submit-button"
              type="button"
              onClick={handleSubmit}
              style={{
                opacity: submitOpacity,
              }}
            >
              Submit
            </button>

        </form>
      )}

      {showResults && (
        <div className="results-container">
          {options.map((option, index) => (
            <ProgressBar
              key={index}
              text={option.optionText}
              bgcolor={'#6a1b9a'}
              completed={optionPercentages[index].percentage}
              resultsOpacity={resultsOpacity}
              setResultsOpacity={setResultsOpacity}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
